# BSya Grow — Requirements (Prototype, Full-Stack)

> Dokumen kebutuhan untuk **BSya Grow** (Super App UMKM dari BCA Syariah). Disusun dari dua mockup desain (`BSya Onboarding (standalone).html`, `BSya UMKM (standalone).html`). Versi ini memakai arsitektur **full-stack**: frontend **Next.js** + backend **Go (Gin)** + **PostgreSQL**, dideploy ke **Railway**.

---

## 1. Ringkasan Produk

BSya Grow adalah "super app" untuk pelaku UMKM yang menggabungkan pencatatan keuangan, perpajakan, manajemen supplier/customer, periklanan, dan permodalan dalam satu tempat — dibantu AI.

Alur utama prototype: **login → (jika pertama kali) onboarding AI → dashboard yang terisi berdasarkan jawaban onboarding.**

### 1.1 Tujuan Prototype
- Membuktikan alur: **login → onboarding → dashboard personalisasi**.
- Backend Go (Gin) + PostgreSQL menyimpan profil onboarding **dan** data dashboard.
- Mengintegrasikan **LLM via Amazon Bedrock** (server-side, di backend Go) untuk fitur AI.
- Bisa dijalankan lokal via `docker compose`, dan dideploy ke **Railway** (frontend, backend, Postgres terpisah).

### 1.2 Di Luar Cakupan (Non-Goals) Fase Ini
- **Autentikasi sungguhan** — login disimulasikan (input apa pun bisa masuk; backend memetakan ke satu user demo). JWT/OAuth menyusul.
- Integrasi pembayaran, mutasi rekening real, atau API pihak ketiga (Instagram/TikTok/DJP).
- Multi-tenant penuh (skema sudah `user_id`-aware, tapi auth belum membedakan user).
- Tampilan **mobile app** (bottom-tab) — fokus fase ini **web app**; mobile menyusul.

---

## 2. Arsitektur & Tech Stack

```
                    ┌────────────────────┐       ┌─────────────────────┐       ┌──────────────┐
  Browser  ───────► │  Frontend (Next.js) │ ────► │  Backend (Go + Gin)  │ ────► │  PostgreSQL  │
                    │  web app / UI       │  HTTP │  REST API + LLM proxy│  SQL  │  (Railway)   │
                    └────────────────────┘       └─────────┬───────────┘       └──────────────┘
                                                            │ AWS SDK
                                                            ▼
                                                   ┌──────────────────┐
                                                   │  Amazon Bedrock  │
                                                   └──────────────────┘
```

| Lapisan | Pilihan | Catatan |
|---|---|---|
| Frontend | **Next.js 16** (App Router, Turbopack), React 19, TypeScript | UI inline-style sesuai mockup, font Nunito |
| Backend | **Go 1.26 + Gin** | REST API, CORS, proxy LLM ke Bedrock |
| Database | **PostgreSQL 16** | Profil onboarding + semua data dashboard (JSONB per section) |
| DB driver | `jackc/pgx/v5` (+ pgxpool) | Migrasi & seed dijalankan saat startup |
| LLM | **Amazon Bedrock** (`aws-sdk-go-v2/service/bedrockruntime`) | Dipanggil **dari backend Go** (bukan frontend) |
| Deploy | **Railway** | 3 service: frontend, backend, Postgres (plugin) |
| Containerization | **Docker** (multi-stage) + `docker-compose.yml` | Untuk dev lokal & Railway (Dockerfile builder) |

### 2.1 Prinsip "graceful fallback"
- **Tanpa `DATABASE_URL`** → backend jalan dengan **data demo in-memory** (profil di map, dashboard dari dataset bawaan). Memudahkan dev tanpa Postgres.
- **Tanpa kredensial Bedrock** (`AWS_REGION`/`BEDROCK_MODEL_ID` kosong) → endpoint AI mengembalikan **respons mock**. App tetap jalan tanpa AWS.

---

## 3. Struktur Repo

```
bsya-umkm/
├── docker-compose.yml          # db + backend + frontend (dev lokal)
├── docs/                       # requirements + mockup HTML
├── frontend/                   # Next.js web app
│   ├── app/
│   │   ├── page.tsx            # redirect: login / onboarding / dashboard
│   │   ├── login/page.tsx
│   │   ├── onboarding/page.tsx
│   │   └── dashboard/{layout,page, laporan,pajak,supplier,iklan,modal}
│   ├── components/             # Mark, Deco, Chip, ProgressBar, PageHeader, icons
│   ├── context/ProfileContext.tsx
│   ├── data/questions.ts       # Q_BRANCH_A/B/C + BRANCH_MAP
│   ├── lib/{theme,profile,api}.ts   # api.ts = client ke backend Go
│   ├── types/index.ts
│   ├── Dockerfile · railway.json · .env.example
│   └── next.config.ts (output: standalone)
└── backend/                    # Go + Gin
    ├── cmd/server/main.go
    ├── internal/
    │   ├── config/             # env loader
    │   ├── models/             # struct domain
    │   ├── data/               # dataset demo (seed + fallback)
    │   ├── store/              # pgx store + schema.sql + seed (in-memory fallback)
    │   ├── ai/                 # Bedrock client + mock fallback
    │   ├── handlers/           # gin handlers
    │   └── router/             # routing + CORS
    ├── Dockerfile · railway.json · .env.example
    └── go.mod
```

---

## 4. Alur Aplikasi (User Flow)

```
[Login] ──► sudah pernah onboarding?
                 │
        ┌────────┴────────┐
       Tidak             Ya
        ▼                 ▼
  [Onboarding AI]   [Dashboard]
        │
        ▼
  [Dashboard terisi data onboarding]
```

1. **Login** — disimulasikan (tekan "Masuk"). Status login disimpan di `localStorage` (`bsya_auth`).
2. **Cek status onboarding** — cek profil. Belum ada → onboarding; sudah ada → dashboard.
3. **Onboarding AI** — multi-step; jawaban → `BusinessProfile`, disimpan ke `localStorage` (cache guard) **dan** ke backend (POST `/api/profile` → Postgres).
4. **Dashboard** — menampilkan data dari backend (`GET /api/dashboard/:section`) + identitas dari profil.

---

## 5. Modul Onboarding (`BSya Onboarding`)

Multi-step form dipandu "BSya AI". **3 cabang**, konten verbatim dari mockup di `frontend/data/questions.ts`.

| Step | Layar |
|---|---|
| Welcome | "Halo! Saya BSya AI 👋" · "2 menit · 8 pertanyaan" · *Mulai kenalan* |
| Branch Select | "Posisi bisnismu saat ini?" (A: sudah jalan · C: baru mulai · B: masih ide) |
| Questions | per cabang, progress bar. Tipe: `single`, `multi`, `text`, `text-chips` |
| Summary | kartu Profil + CTA rekomendasi (maks 3, dari jawaban kebutuhan) · *Buka Dashboard* |

Jumlah pertanyaan: **A=10, B=10, C=8**. CTA mapping: modal→Permodalan, pajak→Pajak AI, supplier→Supplier, promosi/iklan→Iklan AI, catat/keuangan→Laporan.

---

## 6. Modul Dashboard (`BSya Grow`) — Web

Sidebar: Dashboard, Laporan Keuangan, Pajak AI (badge 1), Supplier & Customer, Iklan AI, Permodalan. Topbar: search, *Tanya AI*, notifikasi, avatar + nama (dari profil).

| Halaman | Isi | Sumber data |
|---|---|---|
| Dashboard | greeting, 4 KPI, arus kas 6 bln (chart), AI Insight, quick actions, transaksi | `/api/dashboard/summary` + `/api/ai/insight` |
| Laporan Keuangan | tab (Laba Rugi/Neraca/Arus Kas/SAK EMKM), 3 ringkasan, bar chart, rincian akun | `/api/dashboard/laporan` |
| Pajak AI | tagihan PPh Final 0.5%, **Asisten Pajak (LLM)**, riwayat | `/api/dashboard/pajak` + `/api/ai/pajak` |
| Supplier & Customer | daftar supplier, AI Match card, top customer | `/api/dashboard/supplier` |
| Iklan AI | generator iklan (LLM), KPI, kampanye | `/api/dashboard/iklan` + `/api/ai/iklan` |
| Permodalan | plafon, skor kelayakan (gauge + breakdown), 3 paket | `/api/dashboard/modal` |

---

## 7. API Backend (Go + Gin)

Prefix `/api`. Auth mock → semua request memakai user `demo` (override via header `X-User-Id`).

| Method | Path | Fungsi |
|---|---|---|
| GET | `/health` | status (db & ai configured) |
| POST | `/api/auth/login` | mock login, balas `{userId, name}` |
| GET | `/api/profile` | ambil profil (404 jika belum ada) |
| POST | `/api/profile` | simpan/upsert `BusinessProfile` |
| GET | `/api/dashboard/:section` | section: summary·laporan·pajak·supplier·iklan·modal |
| POST | `/api/ai/insight` | insight keuangan (JSON `{title, body}`) |
| POST | `/api/ai/pajak` | 3 tips pajak (`{tips: string[]}`) |
| POST | `/api/ai/iklan` | generate materi iklan (`{text, source}`) |
| POST | `/api/ai/chat` | asisten umum (`{text, source}`) |

---

## 8. Model Data (PostgreSQL)

- **users** `(id, name, email, created_at)`
- **business_profiles** `(user_id PK→users, branch, business_name, category, needs JSONB, answers JSONB, completed_at)`
- **dashboard_data** `(user_id, section, data JSONB, PK(user_id, section))` — tiap section dashboard disimpan sebagai blob JSONB; di-seed dari dataset demo.

Migrasi (`internal/store/schema.sql`) + seed (user `demo` "Budi Santoso" + 6 section) dijalankan otomatis saat backend connect ke Postgres (idempotent).

```ts
// BusinessProfile (frontend & backend sepakat)
type BusinessProfile = {
  branch: "A" | "B" | "C";
  businessName: string;
  category: string;
  needs: string[];
  answers: Record<string, any>;
  completedAt: string;
};
```

---

## 9. Integrasi LLM (Amazon Bedrock) — di Backend Go

`internal/ai/bedrock.go` memakai `aws-sdk-go-v2`. Memanggil Anthropic Messages API di Bedrock (`anthropic_version: bedrock-2023-05-31`). Konteks prompt diisi dari `BusinessProfile`. Jika kredensial kosong/err → **mock**.

Env: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BEDROCK_MODEL_ID`.

---

## 10. Theming (dari mockup)

- Font **Nunito**. Palet "Sunny": sky `#29B5E8`, skyDeep `#0E92C2`, skySoft `#E8F7FD`, yellow `#FFD93D`, yellowDeep `#F5B800`; teks ink `#0B2740`, ink2 `#36506B`, muted `#7A8FA3`, line `#E4EEF5`, bg `#F4FAFD`, ok `#22B57A`.
- Logo "smiley" kotak, kartu rounded, gradient sky/yellow, dekorasi segitiga kuning (vibe Playful).
- Tema alternatif (Mint/Coral/Royal) & vibe (Balanced/Corporate) dari mockup **diabaikan** untuk prototype.

---

## 11. Menjalankan & Deploy

### 11.1 Lokal (Docker Compose)
```bash
docker compose up --build
# frontend → http://localhost:3002, backend → http://localhost:8082, db → :5432
```

### 11.2 Lokal (tanpa Docker)
```bash
# backend (in-memory, tanpa Postgres)
cd backend && go run ./cmd/server          # :8082
# frontend
cd frontend && npm install && npm run dev   # :3002 (set NEXT_PUBLIC_API_URL=http://localhost:8082)
```

### 11.3 Railway
- **Service Postgres** (plugin) → menyediakan `DATABASE_URL`.
- **Service backend**: root `backend/`, Dockerfile builder. Env: `DATABASE_URL` (reference Postgres), `ALLOWED_ORIGINS` (URL frontend), opsional kredensial Bedrock. Healthcheck `/health`.
- **Service frontend**: root `frontend/`, Dockerfile builder. Env: `NEXT_PUBLIC_API_URL` = URL publik backend.
- Catatan: Railway meng-inject `PORT`; backend & frontend sudah membacanya.

---

## 12. Kriteria Selesai (Acceptance Criteria)

1. `docker compose up` menjalankan frontend (3002), backend (8082), Postgres.
2. User belum onboarding → diarahkan ke onboarding; sudah → ke dashboard.
3. Onboarding 3 cabang dengan jumlah & tipe pertanyaan sesuai spesifikasi; summary menampilkan profil + CTA.
4. Profil onboarding tersimpan ke Postgres lewat backend; dashboard membaca data dari backend.
5. Keenam halaman dashboard tampil sesuai mockup.
6. Minimal satu fitur AI memanggil Bedrock dari backend (dengan fallback mock bila kredensial belum ada).
7. Tema mengikuti palet Sunny + Nunito + kartu rounded.
8. Backend `go build ./...` sukses; frontend `npm run build` sukses.

---

## 13. Pertanyaan Terbuka / Langkah Berikutnya

- **Auth sungguhan** (JWT + tabel users/password) menggantikan mock.
- **Dashboard pages → fetch penuh dari backend**: endpoint `/api/dashboard/:section` sudah ada & berisi data demo, tapi halaman web saat ini masih render data yang ter-hardcode di komponen. Migrasi bertahap ke `getSection()` di `lib/api.ts`.
- **Tampilan mobile** (bottom-tab) sesuai mockup.
- Normalisasi data dashboard dari JSONB blob menjadi tabel granular bila perlu query/agregasi.
- `BEDROCK_MODEL_ID` final (Claude di Bedrock direkomendasikan).
