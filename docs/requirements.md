# BSya UMKM+ — Requirements (Prototype)

> Dokumen kebutuhan untuk membangun ulang prototype **BSya UMKM+** (Super App UMKM dari BCA Syariah) menggunakan Next.js. Dokumen ini disusun berdasarkan dua mockup HTML referensi: `BSya_Onboarding__standalone_.html` dan `BSya_UMKM__standalone_.html`.

---

## 1. Ringkasan Produk

BSya UMKM+ adalah aplikasi "super app" untuk pelaku UMKM yang menggabungkan pencatatan keuangan, perpajakan, manajemen supplier/customer, periklanan, dan permodalan dalam satu tempat — dibantu AI.

Aplikasi punya dua wajah:
- **Web Dashboard** (tampilan laptop/desktop) — untuk pemilik usaha mengelola bisnis secara lengkap.
- **Mobile App** (tampilan ponsel) — versi ringkas untuk akses cepat di lapangan.

Untuk fase prototype ini, fokusnya adalah **satu alur utuh**: nasabah login → (jika pertama kali) onboarding AI → dashboard yang terisi berdasarkan jawaban onboarding.

### 1.1 Tujuan Prototype
- Membuktikan alur pengalaman: **login → onboarding → dashboard personalisasi**.
- Tanpa database & backend sungguhan dulu — gunakan data mock / in-memory.
- Mengintegrasikan **LLM via Amazon Bedrock** untuk fitur-fitur AI.

### 1.2 Di Luar Cakupan (Non-Goals) Fase Ini
- Tidak ada database persisten (PostgreSQL, dll).
- Tidak ada autentikasi sungguhan (OAuth, JWT server-side, dll) — login disimulasikan.
- Tidak ada integrasi pembayaran, mutasi rekening real, atau API pihak ketiga (Instagram/TikTok/DJP).
- Tidak ada multi-user / multi-tenant.

---

## 2. Tech Stack

| Komponen | Pilihan | Catatan |
|---|---|---|
| Framework | **Next.js 16.2+** (terbaru 16.2.6) | App Router + Turbopack (default) |
| Runtime | **Node.js 20.9+** | Wajib minimum untuk Next.js 16 |
| UI Library | React 19.2 | Sudah include di Next.js 16 |
| Bahasa | TypeScript | Default `create-next-app` |
| Styling | Inline style / CSS sesuai mockup; opsional Tailwind | Mockup memakai inline style + font Nunito |
| State | React state + Context (`useState`, `useContext`) | Cukup untuk prototype |
| Penyimpanan data | **In-memory / mock + `localStorage`** | Pengganti DB untuk simpan profil onboarding |
| LLM | **Amazon Bedrock** | Diakses lewat Next.js Route Handler (server-side) |
| Containerization | **Docker** | Lihat bagian Docker di bawah |

### 2.1 Catatan "Tanpa Backend & Database"
Karena prototype, kita tidak memakai database atau server backend terpisah. Namun:
- Panggilan ke **Amazon Bedrock harus tetap dijalankan server-side** (lewat Next.js Route Handler / `app/api/.../route.ts`), supaya AWS credential tidak bocor ke browser. Ini bukan "backend penuh", hanya thin proxy bawaan Next.js.
- Data profil hasil onboarding disimpan di **`localStorage`** + state Context, sehingga setelah onboarding selesai dashboard bisa membaca data tersebut. Saat user clear storage / pertama kali buka, status dianggap "first login".

---

## 3. Alur Aplikasi (User Flow)

```
[Login] ──► sudah pernah onboarding? 
                 │
        ┌────────┴────────┐
       Tidak             Ya
        │                 │
        ▼                 ▼
  [Onboarding AI]   [Dashboard]
        │
        ▼
  [Dashboard terisi data onboarding]
```

1. **Login** — nasabah masuk (disimulasikan; cukup tombol/form sederhana, tanpa verifikasi server).
2. **Cek status onboarding** — aplikasi cek apakah profil bisnis sudah ada (`localStorage`).
   - Belum ada → arahkan ke **Onboarding**.
   - Sudah ada → langsung ke **Dashboard**.
3. **Onboarding AI** — serangkaian pertanyaan; jawaban disimpan ke profil.
4. **Dashboard** — menampilkan data & modul yang dikonfigurasi berdasarkan jawaban onboarding.

---

## 4. Modul Onboarding (dari `BSya_Onboarding`)

Onboarding adalah multi-step form yang dipandu "BSya AI". Ada **3 cabang (branch)** sesuai posisi bisnis nasabah.

### 4.1 Tahapan Layar
| Step | Layar | Keterangan |
|---|---|---|
| Welcome | Sapaan "Halo! Saya BSya AI 👋" | Estimasi "2 menit · 8 pertanyaan", tombol *Mulai kenalan* |
| Branch Select | "Posisi bisnismu saat ini?" | Pilih salah satu dari 3 cabang |
| Questions | Pertanyaan per cabang | 8–10 pertanyaan, ada progress bar |
| Summary | "Selesai! Profilmu sudah siap." | Kartu profil + CTA rekomendasi → tombol *Buka Dashboard* |

### 4.2 Tiga Cabang
| Kode | Label | Sub-keterangan | Jumlah Pertanyaan |
|---|---|---|---|
| **A** | Bisnis sudah jalan | Sudah > 3 bulan dengan pelanggan rutin | 10 |
| **C** | Baru mulai banget | Kurang dari 3 bulan, masih cari ritme | 8 |
| **B** | Masih sebatas ide | Belum jualan, baru riset & rencana | 10 |

### 4.3 Tipe Pertanyaan
Setiap pertanyaan punya: `id`, teks pertanyaan (`q`), sub-teks opsional (`sub`), pesan AI (`ai`), dan `type`:
- `single` — pilih satu opsi (radio).
- `multi` — pilih banyak opsi (checkbox).
- `text` — input teks bebas.
- `text-chips` — input teks + pilih satu chip kategori.

### 4.4 Daftar Pertanyaan (data konten)

**Cabang A — Sudah jalan (10 pertanyaan):**
1. `a1` Apa nama usahamu? *(text-chips: Warung/Kelontong, F&B/Kuliner, Online Seller, Fashion, Jasa, Manufaktur kecil, Lainnya)*
2. `a2` Sudah jalan berapa lama? *(single: <1th, 1–3th, 3–5th, >5th)*
3. `a3` Lokasi usahamu di kota mana? *(text)*
4. `a4` Rata-rata omzet sebulan? *(single: <Rp5jt, Rp5–20jt, Rp20–50jt, Rp50–200jt, >Rp200jt)*
5. `a5` Ada yang bantu kerja? *(single: Sendiri, 1–3 org, 4–10 org, >10 org)*
6. `a6` Sudah punya NPWP? *(single: Sudah, Belum, Mau dibantu daftarkan)*
7. `a7` Catat keuangan pakai apa? *(single: Buku tulis, Spreadsheet, Aplikasi lain, Belum pernah)*
8. `a8` Belanja stok di mana? *(single: 1 supplier tetap, Beberapa, Pasar/grosir, Marketplace, Campuran)*
9. `a9` Jualan paling laris lewat mana? *(single: Toko fisik, Marketplace, Sosmed/WA, Ojek online, Gabungan)*
10. `a10` Apa yang paling kamu butuhkan dari BSya? *(multi: Catat keuangan, Tambah modal, Hemat supplier, Promosi/iklan, Bayar pajak)*

**Cabang B — Masih ide (10 pertanyaan):** `b1`–`b10` (ide bisnis, kapan mulai, lokasi, modal awal, sumber modal, supplier, target pelanggan, pengalaman jualan, harapan balik modal, bantuan paling penting).

**Cabang C — Baru mulai <3 bulan (8 pertanyaan):** `c1`–`c8` (nama usaha, sejak kapan, lokasi & cara jualan, omzet bulan pertama, sumber modal awal, tantangan terbesar, pelanggan tetap, kebutuhan dari BSya).

> Konten lengkap tiap opsi pertanyaan dapat diambil verbatim dari mockup `BSya_Onboarding` (objek `Q_BRANCH_A`, `Q_BRANCH_B`, `Q_BRANCH_C`).

### 4.5 Layar Summary
- Tampilkan kartu **Profil Bisnismu**: nama usaha, jenis (chip), label cabang.
- Hitung **CTA rekomendasi (maks 3)** dari jawaban pertanyaan terakhir (multi-select kebutuhan):
  - butuh "modal" → "Cek plafon modal" (Permodalan)
  - butuh "pajak" → "Lihat estimasi pajak" (Pajak AI)
  - butuh "supplier" → "Cari supplier hemat" (Supplier)
  - butuh "promosi/iklan" → "Bikin iklan AI" (Iklan AI)
  - butuh "catat/keuangan" → "Mulai catat keuangan" (Laporan)
- Tombol **Buka Dashboard** → simpan profil → redirect ke dashboard.

---

## 5. Modul Dashboard (dari `BSya_UMKM`)

### 5.1 Navigasi Web (Sidebar)
| ID | Label | Badge |
|---|---|---|
| `dashboard` | Dashboard | — |
| `laporan` | Laporan Keuangan | — |
| `pajak` | Pajak AI | 1 |
| `supplier` | Supplier & Customer | — |
| `iklan` | Iklan AI | — |
| `modal` | Permodalan | — |

**Topbar:** search bar ("Cari transaksi, supplier, faktur…"), tombol *Tanya AI*, lonceng notifikasi, avatar + nama user ("Budi Santoso" / "Warung Sembako Berkah").

### 5.2 Halaman: Dashboard (Home)
- **Greeting banner** — sapaan personal + tanggal + ringkasan AI ("AI BSya sudah merangkum 47 transaksi…").
- **KPI Row (4 kartu)** — Pemasukan bulan ini, Pengeluaran, Saldo Rekening, Estimasi Pajak (dengan delta %).
- **Cashflow Card** — grafik garis arus kas 6 bulan (Pemasukan vs Pengeluaran).
- **AI Insight Card** — insight dari AI (mis. "Pengeluaran sembako naik 18%…") + CTA.
- **Quick Actions** — Catat Transaksi, Hitung Pajak, Cari Supplier, Buat Iklan.
- **Recent Transactions** — daftar transaksi terbaru (nama, kategori, nominal, waktu).

### 5.3 Halaman: Laporan Keuangan
- Tab segmented: Laba Rugi, Neraca, Arus Kas, SAK EMKM + tombol *Unduh PDF*.
- 3 kartu ringkasan: Total Pendapatan, Total Beban, Laba Bersih (+ margin).
- Bar chart Laba Bersih per bulan.
- Rincian akun (penjualan, HPP, beban gaji, listrik, dll).

### 5.4 Halaman: Pajak AI *(melibatkan LLM)*
- Kartu tagihan pajak bulan berjalan (PPh Final 0.5%, omzet, jatuh tempo) + tombol Bayar/Unduh SSP.
- **Asisten Pajak** — daftar tips/insight yang **digenerate LLM** berdasarkan profil & omzet.
- Riwayat pajak per bulan (Lunas / Belum bayar).

### 5.5 Halaman: Supplier & Customer *(melibatkan LLM)*
- Daftar supplier aktif (nama, kategori, lokasi, rating, order terakhir, tag).
- **AI Match card** — rekomendasi supplier baru hasil LLM ("3 supplier baru di Bekasi cocok untukmu…").
- Top customer bulan ini.

### 5.6 Halaman: Iklan AI *(melibatkan LLM)*
- Hero "Buat Iklan dengan AI" — input deskripsi produk → **LLM generate teks & konsep visual iklan**.
- KPI: Total reach, clicks, pengeluaran, ROAS.
- Daftar kampanye aktif.

### 5.7 Halaman: Permodalan
- Kartu plafon pre-approved (nominal, margin, tenor, akad murabahah).
- **Skor Kelayakan Bisnis** (gauge + breakdown: konsistensi pendapatan, riwayat pajak, pertumbuhan omzet, diversifikasi supplier).
- 3 paket: Modal Cepat, Modal Tumbuh (popular), Modal Investasi.

### 5.8 Tampilan Mobile (bottom-tab)
Tab: **Home, Keuangan, Pajak, Iklan, Profil**. Konten ringkas dari modul web masing-masing. Halaman Profil berisi data usaha, rekening terhubung, pengaturan, dan logout.

---

## 6. Integrasi LLM (Amazon Bedrock)

LLM diakses **server-side** lewat Next.js Route Handler (`app/api/ai/.../route.ts`) menggunakan AWS SDK for JavaScript v3 (`@aws-sdk/client-bedrock-runtime`).

### 6.1 Use Case LLM
| Fitur | Lokasi | Fungsi LLM |
|---|---|---|
| Onboarding AI | Onboarding | Pesan AI kontekstual + ringkasan profil & rekomendasi modul |
| AI Insight | Dashboard Home | Insight keuangan dari data mock |
| Asisten Pajak | Pajak AI | Tips/penjelasan pajak berdasarkan profil & omzet |
| AI Supplier Match | Supplier | Rekomendasi supplier hemat |
| Generate Iklan | Iklan AI | Generate teks & konsep materi iklan dari deskripsi produk |
| Tanya AI | Topbar (global) | Chat asisten umum |

### 6.2 Konfigurasi (Environment Variables)
```
AWS_REGION=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
BEDROCK_MODEL_ID=...        # mis. anthropic.claude-3-5-sonnet-... atau model Bedrock lain
```
> Semua kredensial AWS **hanya di server** (`.env.local`), tidak pernah dikirim ke client. Sediakan `.env.example`.

### 6.3 Catatan Implementasi
- Route handler menerima prompt + konteks (profil onboarding, data mock), memanggil Bedrock, mengembalikan teks.
- Untuk fitur UX yang lebih baik, dukung **streaming** respons bila memungkinkan.
- Sediakan fallback (mock response) bila kredensial Bedrock belum di-set, agar prototype tetap jalan tanpa AWS.

---

## 7. Model Data (Mock / In-Memory)

### 7.1 Profil Bisnis (hasil onboarding)
```ts
type BusinessProfile = {
  branch: "A" | "B" | "C";
  businessName: string;        // dari pertanyaan nama (a1/b1/c1)
  category: string;            // chip jenis usaha
  location?: string;
  monthlyRevenueRange?: string;
  employees?: string;
  hasNpwp?: string;
  needs: string[];             // multi-select kebutuhan
  answers: Record<string, any>; // semua jawaban mentah per id pertanyaan
  completedAt: string;
};
```

### 7.2 Data Dashboard (mock)
Sediakan dataset mock untuk: KPI, arus kas 6 bulan, transaksi, laporan keuangan, riwayat pajak, supplier, customer, kampanye iklan, paket modal, skor kelayakan. Nilai default bisa mengikuti angka dari mockup (mis. nasabah contoh "Budi Santoso — Warung Sembako Berkah"). Saat memungkinkan, sebagian field (nama usaha, kategori, lokasi) **diisi dari `BusinessProfile`**.

---

## 8. Theming (dari mockup)

- Font utama: **Nunito** (Google Fonts).
- Palet "Sunny" (default): sky `#29B5E8`, skyDeep `#0E92C2`, skySoft `#E8F7FD`, yellow `#FFD93D`, yellowDeep `#F5B800`.
- Warna teks: ink `#0B2740`, ink2 `#36506B`, muted `#7A8FA3`, line `#E4EEF5`, bg `#F4FAFD`, ok `#22B57A`.
- Logo: kotak "smiley" (mata kotak + senyum) warna sky dengan aksen kuning.
- Gaya: rounded corner besar, kartu putih, gradient sky/yellow, dekorasi segitiga kuning.

> Mockup juga punya beberapa tema alternatif (Mint, Coral, Royal) & vibe (Playful/Balanced/Corporate) — ini **opsional**, boleh diabaikan untuk prototype.

---

## 9. Struktur Proyek (Usulan)

```
bsya-umkm/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # redirect: login / dashboard
│   ├── login/page.tsx
│   ├── onboarding/page.tsx      # alur onboarding (welcome→branch→Q→summary)
│   ├── dashboard/
│   │   ├── layout.tsx           # sidebar + topbar
│   │   ├── page.tsx             # Dashboard Home
│   │   ├── laporan/page.tsx
│   │   ├── pajak/page.tsx
│   │   ├── supplier/page.tsx
│   │   ├── iklan/page.tsx
│   │   └── modal/page.tsx
│   └── api/
│       └── ai/
│           ├── insight/route.ts
│           ├── pajak/route.ts
│           ├── supplier/route.ts
│           ├── iklan/route.ts
│           └── chat/route.ts
├── components/                  # Mark, Deco, Chip, ProgressBar, KPI cards, dll
├── lib/
│   ├── bedrock.ts               # client Amazon Bedrock
│   ├── profile.ts               # baca/tulis BusinessProfile (localStorage)
│   └── mock-data.ts             # dataset dashboard
├── data/questions.ts            # Q_BRANCH_A/B/C
├── public/
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
└── package.json
```

> Catatan: prototype ini menampilkan web dashboard sebagai aplikasi utama. Tampilan mobile bisa dibuat sebagai layout responsif atau route terpisah, sesuai kebutuhan.

---

## 10. Docker

### 10.1 Ketersediaan Port
- Next.js default berjalan di **port `3000`**.
- Hasil pengecekan port pada lingkungan kerja: **3000, 3001, 8080, 8000, 5173, 4000, 9000 — semuanya bebas**.
- Rencana: map `host:3000 → container:3000`. **Sebelum `docker compose up`, cek di mesin host** apakah 3000 sudah dipakai:
  - Linux/macOS: `lsof -i :3000` atau `ss -tlnp | grep 3000`
  - Windows: `netstat -ano | findstr :3000`
  - Jika terpakai, ganti ke 3001 (`3001:3000`).

### 10.2 Dockerfile (garis besar)
- Base image: `node:20-alpine` (memenuhi Node 20.9+).
- Multi-stage: `deps` → `builder` (`next build`) → `runner` (`next start`).
- Disarankan `output: "standalone"` di `next.config.ts` agar image runner ramping.
- Expose port 3000.

### 10.3 docker-compose.yml (garis besar)
- 1 service: `web` (Next.js).
- `ports: ["3000:3000"]`.
- `env_file: .env.local` untuk kredensial Bedrock.
- Untuk dev: mount volume + `next dev` (Turbopack); untuk demo: build production.
- Tidak ada service database (sesuai keputusan tanpa DB).

---

## 11. Kriteria Selesai (Acceptance Criteria)

1. `docker compose up` menjalankan aplikasi di `http://localhost:3000`.
2. User belum onboarding → diarahkan ke onboarding; sudah → ke dashboard.
3. Onboarding mendukung 3 cabang dengan jumlah & tipe pertanyaan sesuai spesifikasi.
4. Layar summary menampilkan profil + CTA rekomendasi berdasarkan jawaban.
5. Setelah onboarding, dashboard menampilkan nama usaha/kategori/lokasi dari profil.
6. Keenam halaman dashboard tampil sesuai mockup dengan data mock.
7. Minimal satu fitur AI memanggil Amazon Bedrock server-side dan menampilkan hasilnya (dengan fallback mock bila kredensial belum ada).
8. Tampilan mengikuti theming (warna sky/yellow, font Nunito, gaya kartu rounded).

---

## 12. Pertanyaan Terbuka / Asumsi

- **Login**: diasumsikan disimulasikan (tanpa server auth). Perlu dikonfirmasi apakah cukup tombol "Masuk" dummy.
- **Reset onboarding**: sediakan cara reset (clear `localStorage`) untuk demo first-login berulang.
- **Model Bedrock**: `BEDROCK_MODEL_ID` final menunggu keputusan (Claude di Bedrock direkomendasikan).
- **Mobile vs Web**: untuk fase ini, prioritas pada web dashboard; mobile bisa menyusul.
