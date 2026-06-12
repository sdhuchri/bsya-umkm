# BSya Grow

Super app UMKM dari BCA Syariah — keuangan, pajak, supplier, iklan & permodalan dibantu AI.

Monorepo full-stack:

| Folder | Stack | Port |
|---|---|---|
| [`frontend/`](frontend) | Next.js 16 + React 19 + TypeScript | 3002 |
| [`backend/`](backend) | Go 1.26 + Gin + pgx | 8082 |
| (Postgres) | PostgreSQL 16 | 5432 |

Spesifikasi lengkap: [`docs/requirements.md`](docs/requirements.md).

## Jalankan lokal (Docker Compose)

```bash
docker compose up --build
# frontend http://localhost:3002 · backend http://localhost:8082 · db :5432
```

## Jalankan lokal (tanpa Docker)

```bash
# Backend — tanpa DATABASE_URL ia pakai data demo in-memory
cd backend && go run ./cmd/server

# Frontend — set base URL backend
cd frontend && npm install && \
  NEXT_PUBLIC_API_URL=http://localhost:8082 npm run dev
```

Tanpa kredensial Amazon Bedrock, endpoint AI otomatis memakai respons mock — app tetap jalan.

## Deploy (Railway)

Tiga service: Postgres (plugin), `backend/`, dan `frontend/` — masing-masing pakai Dockerfile + `railway.json`. Lihat §11.3 di requirements.
