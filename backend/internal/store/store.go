package store

import (
	"context"
	_ "embed"
	"encoding/json"
	"errors"
	"sync"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"bsya-umkm-backend/internal/data"
	"bsya-umkm-backend/internal/models"
)

//go:embed schema.sql
var schemaSQL string

// DemoUserID is the single user used while auth is mocked.
const DemoUserID = "demo"

// Store persists profiles and dashboard data. When pool is nil it runs in
// in-memory mode (dashboard data comes from the demo dataset; profiles live in a map).
type Store struct {
	pool *pgxpool.Pool

	mu      sync.RWMutex
	memProf map[string]models.BusinessProfile
}

func New(ctx context.Context, databaseURL string) (*Store, error) {
	s := &Store{memProf: map[string]models.BusinessProfile{}}
	if databaseURL == "" {
		return s, nil // memory mode
	}
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(ctx); err != nil {
		return nil, err
	}
	s.pool = pool
	if err := s.migrate(ctx); err != nil {
		return nil, err
	}
	if err := s.seed(ctx); err != nil {
		return nil, err
	}
	return s, nil
}

func (s *Store) HasDB() bool { return s.pool != nil }

func (s *Store) Close() {
	if s.pool != nil {
		s.pool.Close()
	}
}

func (s *Store) migrate(ctx context.Context) error {
	_, err := s.pool.Exec(ctx, schemaSQL)
	return err
}

// seed inserts the demo user + dashboard data once (idempotent).
func (s *Store) seed(ctx context.Context) error {
	if _, err := s.pool.Exec(ctx,
		`INSERT INTO users (id, name, email) VALUES ($1, $2, $3)
		 ON CONFLICT (id) DO NOTHING`,
		DemoUserID, "Budi Santoso", "budi@contoh.id"); err != nil {
		return err
	}
	for _, section := range data.Sections {
		blob, err := json.Marshal(data.Section(section))
		if err != nil {
			return err
		}
		if _, err := s.pool.Exec(ctx,
			`INSERT INTO dashboard_data (user_id, section, data) VALUES ($1, $2, $3)
			 ON CONFLICT (user_id, section) DO NOTHING`,
			DemoUserID, section, blob); err != nil {
			return err
		}
	}
	return nil
}

// ─── Profile ──────────────────────────────────────────────────────

func (s *Store) GetProfile(ctx context.Context, userID string) (*models.BusinessProfile, bool, error) {
	if !s.HasDB() {
		s.mu.RLock()
		defer s.mu.RUnlock()
		if p, ok := s.memProf[userID]; ok {
			return &p, true, nil
		}
		return nil, false, nil
	}
	var p models.BusinessProfile
	var needs, answers []byte
	err := s.pool.QueryRow(ctx,
		`SELECT branch, business_name, category, needs, answers, completed_at
		 FROM business_profiles WHERE user_id = $1`, userID).
		Scan(&p.Branch, &p.BusinessName, &p.Category, &needs, &answers, &p.CompletedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, false, nil
	}
	if err != nil {
		return nil, false, err
	}
	_ = json.Unmarshal(needs, &p.Needs)
	_ = json.Unmarshal(answers, &p.Answers)
	p.UserID = userID
	return &p, true, nil
}

func (s *Store) SaveProfile(ctx context.Context, p models.BusinessProfile) error {
	if !s.HasDB() {
		s.mu.Lock()
		defer s.mu.Unlock()
		s.memProf[p.UserID] = p
		return nil
	}
	needs, _ := json.Marshal(p.Needs)
	answers, _ := json.Marshal(p.Answers)
	if _, err := s.pool.Exec(ctx,
		`INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING`, p.UserID); err != nil {
		return err
	}
	_, err := s.pool.Exec(ctx,
		`INSERT INTO business_profiles (user_id, branch, business_name, category, needs, answers, completed_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 ON CONFLICT (user_id) DO UPDATE SET
		   branch = EXCLUDED.branch, business_name = EXCLUDED.business_name,
		   category = EXCLUDED.category, needs = EXCLUDED.needs,
		   answers = EXCLUDED.answers, completed_at = EXCLUDED.completed_at`,
		p.UserID, p.Branch, p.BusinessName, p.Category, needs, answers, p.CompletedAt)
	return err
}

// ─── Dashboard sections ───────────────────────────────────────────

// GetSection returns a dashboard section as raw JSON. Falls back to demo
// defaults in memory mode or when the row is missing.
func (s *Store) GetSection(ctx context.Context, userID, section string) (json.RawMessage, error) {
	def := data.Section(section)
	if def == nil {
		return nil, errors.New("unknown section")
	}
	if !s.HasDB() {
		return json.Marshal(def)
	}
	var blob []byte
	err := s.pool.QueryRow(ctx,
		`SELECT data FROM dashboard_data WHERE user_id = $1 AND section = $2`, userID, section).
		Scan(&blob)
	if errors.Is(err, pgx.ErrNoRows) {
		return json.Marshal(def)
	}
	if err != nil {
		return nil, err
	}
	return blob, nil
}
