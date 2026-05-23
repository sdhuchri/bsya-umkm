package main

import (
	"context"
	"log"

	"bsya-umkm-backend/internal/ai"
	"bsya-umkm-backend/internal/config"
	"bsya-umkm-backend/internal/handlers"
	"bsya-umkm-backend/internal/router"
	"bsya-umkm-backend/internal/store"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()

	st, err := store.New(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("store init failed: %v", err)
	}
	defer st.Close()
	if st.HasDB() {
		log.Println("✓ connected to PostgreSQL")
	} else {
		log.Println("⚠ no DATABASE_URL — running with in-memory demo data")
	}

	aiClient := ai.New(ctx, cfg.AWSRegion, cfg.BedrockModelID)
	if aiClient.Configured() {
		log.Println("✓ Amazon Bedrock configured")
	} else {
		log.Println("⚠ Bedrock not configured — AI endpoints return mock responses")
	}

	h := handlers.New(st, aiClient)
	r := router.New(h, cfg.AllowedOrigins)

	log.Printf("BSya UMKM+ backend listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
