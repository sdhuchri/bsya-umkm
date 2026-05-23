package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"

	"bsya-umkm-backend/internal/ai"
	"bsya-umkm-backend/internal/models"
	"bsya-umkm-backend/internal/store"
)

type Handler struct {
	Store *store.Store
	AI    *ai.Client
}

func New(s *store.Store, a *ai.Client) *Handler { return &Handler{Store: s, AI: a} }

// userID resolves the current user. Auth is mocked, so everyone maps to the
// demo user; a future JWT middleware would set this from the token.
func userID(c *gin.Context) string {
	if uid := c.GetHeader("X-User-Id"); uid != "" {
		return uid
	}
	return store.DemoUserID
}

func (h *Handler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "db": h.Store.HasDB(), "ai": h.AI.Configured()})
}

// Login — mock auth: accept anything, return the demo user.
func (h *Handler) Login(c *gin.Context) {
	var body struct {
		Identifier string `json:"identifier"`
		Name       string `json:"name"`
	}
	_ = c.ShouldBindJSON(&body)
	name := body.Name
	if name == "" {
		name = "Budi Santoso"
	}
	c.JSON(http.StatusOK, gin.H{"userId": store.DemoUserID, "name": name})
}

func (h *Handler) GetProfile(c *gin.Context) {
	p, ok, err := h.Store.GetProfile(c, userID(c))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "profile not found"})
		return
	}
	c.JSON(http.StatusOK, p)
}

func (h *Handler) SaveProfile(c *gin.Context) {
	var p models.BusinessProfile
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	p.UserID = userID(c)
	if err := h.Store.SaveProfile(c, p); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, p)
}

// GetSection returns a dashboard section blob.
func (h *Handler) GetSection(c *gin.Context) {
	blob, err := h.Store.GetSection(c, userID(c), c.Param("section"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.Data(http.StatusOK, "application/json; charset=utf-8", blob)
}

// ─── AI ───────────────────────────────────────────────────────────

func (h *Handler) profile(c *gin.Context) *models.BusinessProfile {
	p, _, _ := h.Store.GetProfile(c, userID(c))
	return p
}

func (h *Handler) AIInsight(c *gin.Context) {
	mock := map[string]string{
		"title": "Pengeluaran sembako naik 18% bulan ini",
		"body":  "Kami menemukan 3 supplier di Bekasi yang bisa hemat sampai Rp 1.4jt/bulan.",
	}
	mockJSON, _ := json.Marshal(mock)
	res := h.AI.Invoke(c,
		"Kamu BSya AI, asisten keuangan UMKM Indonesia. Berikan SATU insight keuangan singkat & actionable. Jawab HANYA JSON valid: {\"title\": string singkat, \"body\": string maks 2 kalimat}.",
		"Konteks bisnis: "+ai.ProfileContext(h.profile(c))+".\nData bulan ini: pemasukan Rp42.85jt (+12.4%), pengeluaran Rp28.14jt (+18.2%), saldo Rp87.42jt.",
		string(mockJSON), 256)

	var parsed map[string]string
	if err := json.Unmarshal([]byte(res.Text), &parsed); err == nil && parsed["title"] != "" && parsed["body"] != "" {
		c.JSON(http.StatusOK, parsed)
		return
	}
	c.JSON(http.StatusOK, mock)
}

func (h *Handler) AIPajak(c *gin.Context) {
	mock := []string{
		"Tahun ini omzet kamu masih di bawah Rp 4.8M — kamu bisa tetap pakai PPh Final 0.5%.",
		"Sebaiknya bayar sebelum 10 Mei agar tidak kena denda 2%.",
		"Lapor SPT Tahunan kamu sudah otomatis terisi 78%.",
	}
	mockJSON, _ := json.Marshal(mock)
	res := h.AI.Invoke(c,
		"Kamu BSya AI, asisten pajak UMKM Indonesia (PPh Final UMKM 0.5%). Berikan 3 tips pajak singkat. Jawab HANYA JSON array of string, maks 3 item, tiap item 1 kalimat.",
		"Konteks bisnis: "+ai.ProfileContext(h.profile(c))+".\nOmzet bulan ini Rp49jt, PPh Final terutang Rp245.000, jatuh tempo 15 Mei 2026.",
		string(mockJSON), 300)

	var parsed []string
	if err := json.Unmarshal([]byte(res.Text), &parsed); err == nil && len(parsed) > 0 {
		if len(parsed) > 3 {
			parsed = parsed[:3]
		}
		c.JSON(http.StatusOK, gin.H{"tips": parsed})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tips": mock})
}

func (h *Handler) AIIklan(c *gin.Context) {
	var body struct {
		Prompt string `json:"prompt"`
	}
	_ = c.ShouldBindJSON(&body)
	p := h.profile(c)
	brief := body.Prompt
	if brief == "" {
		brief = "Promo umum untuk menarik pelanggan baru."
	}
	name := "Warung kamu"
	cat := "Warung"
	if p != nil {
		if p.BusinessName != "" {
			name = p.BusinessName
		}
		if p.Category != "" {
			cat = p.Category
		}
	}
	mock := "📣 Headline: \"" + name + " — Promo Spesial Minggu Ini!\"\n\n" +
		"Caption: Belanja kebutuhan harian makin hemat & praktis. Stok lengkap, harga bersahabat, dekat dari rumah. Yuk mampir sebelum kehabisan! 🛒✨\n\n" +
		"CTA: Pesan sekarang via WhatsApp.\nHashtag: #UMKMNaikKelas #BelanjaHemat #" + cat + "\n\n" +
		"(Konsep visual: foto produk cerah dengan aksen kuning, badge \"PROMO\" di pojok.)"

	res := h.AI.Invoke(c,
		"Kamu BSya AI, copywriter iklan untuk UMKM Indonesia. Buat materi iklan ringkas: headline, caption singkat, CTA, hashtag, dan satu kalimat konsep visual. Gaya ramah & persuasif.",
		"Bisnis: "+ai.ProfileContext(p)+".\nPermintaan: "+brief,
		mock, 500)
	c.JSON(http.StatusOK, res)
}

func (h *Handler) AIChat(c *gin.Context) {
	var body struct {
		Message string `json:"message"`
	}
	_ = c.ShouldBindJSON(&body)
	msg := body.Message
	if msg == "" {
		msg = "Halo"
	}
	res := h.AI.Invoke(c,
		"Kamu BSya AI, asisten umum super-app UMKM dari BCA Syariah. Jawab ringkas, ramah, praktis dalam Bahasa Indonesia.",
		"Konteks bisnis nasabah: "+ai.ProfileContext(h.profile(c))+".\nPertanyaan: "+msg,
		"Halo! Saya BSya AI. Saya bisa bantu soal pencatatan keuangan, pajak PPh Final, cari supplier, bikin iklan, atau ajukan modal. Mau mulai dari mana?",
		400)
	c.JSON(http.StatusOK, res)
}
