import type { Branch, Question } from "@/types";

export const Q_BRANCH_A: Question[] = [
  {
    id: "a1",
    q: "Apa nama usahamu?",
    sub: "Beri nama yang mudah diingat — bisa diubah nanti.",
    ai: "Nama usaha akan jadi identitasmu di BSya.",
    type: "text-chips",
    textHint: "mis. Warung Sembako Berkah",
    chipsLabel: "Jenis usahanya apa?",
    options: ["🏪 Warung/Kelontong", "🍱 F&B / Kuliner", "🛒 Online Seller", "👗 Fashion", "💇 Jasa", "🏭 Manufaktur kecil", "📦 Lainnya"],
  },
  { id: "a2", q: "Sudah jalan berapa lama?", ai: "Usia bisnis bantu kami nilai konsistensi pendapatan.", type: "single", options: ["< 1 tahun", "1–3 tahun", "3–5 tahun", "> 5 tahun"] },
  {
    id: "a3",
    q: "Lokasi usahamu di kota mana?",
    sub: "Untuk mencari supplier & rekomendasi iklan terdekat.",
    ai: "Saya akan cari supplier yang dekat dengan kamu.",
    type: "text",
    textHint: "mis. Bekasi, Jakarta Timur",
  },
  { id: "a4", q: "Rata-rata omzet sebulan?", sub: "Kira-kira saja — gak harus pas.", ai: "Omzet menentukan batas PPh Final & plafon modal.", type: "single", options: ["< Rp 5jt", "Rp 5–20jt", "Rp 20–50jt", "Rp 50–200jt", "> Rp 200jt"] },
  { id: "a5", q: "Ada yang bantu kerja?", ai: "Buat estimasi beban gaji di laporan keuangan nanti.", type: "single", options: ["Sendiri saja", "1–3 orang", "4–10 orang", "> 10 orang"] },
  { id: "a6", q: "Sudah punya NPWP?", ai: "Kalau sudah, saya bisa langsung aktifkan Pajak AI.", type: "single", options: ["Sudah punya", "Belum punya", "Mau dibantu daftarkan"] },
  { id: "a7", q: "Catat keuangan pakai apa sekarang?", ai: "Saya bantu pindahkan datanya, gak perlu mulai dari nol.", type: "single", options: ["📓 Buku tulis manual", "📊 Spreadsheet / Excel", "📱 Aplikasi lain", "😅 Belum pernah catat"] },
  { id: "a8", q: "Belanja stok di mana biasanya?", ai: "Daftar suppliermu akan otomatis muncul di menu Supplier.", type: "single", options: ["Satu supplier tetap", "Beberapa supplier", "Pasar / grosir", "Marketplace online", "Campuran"] },
  { id: "a9", q: "Jualan paling laris lewat mana?", ai: "Saya sesuaikan modul Iklan dengan channel utamamu.", type: "single", options: ["🏪 Toko fisik", "🛍️ Marketplace", "📱 Sosmed / WA", "🛵 Ojek online", "🔀 Gabungan"] },
  { id: "a10", q: "Apa yang paling kamu butuhkan dari BSya?", sub: "Pilih semua yang relevan.", ai: "Saya susun ulang dashboardmu sesuai prioritas ini.", type: "multi", options: ["📊 Catat keuangan lebih rapi", "💰 Tambah modal usaha", "🤝 Hemat belanja supplier", "📣 Bantuan promosi/iklan", "🧾 Bayar pajak teratur"] },
];

export const Q_BRANCH_B: Question[] = [
  {
    id: "b1",
    q: "Idemu bisnis apa?",
    ai: "Saya bantu petakan kebutuhan modal & supplier dari sini.",
    type: "text-chips",
    textHint: "mis. Kedai kopi takeaway",
    chipsLabel: "Kategori paling dekat?",
    options: ["🏪 Warung/Kelontong", "🍱 F&B / Kuliner", "🛒 Online Seller", "👗 Fashion", "💇 Jasa", "📦 Lainnya"],
  },
  { id: "b2", q: "Kapan rencananya mulai jualan?", ai: "Saya siapkan timeline persiapan yang cocok.", type: "single", options: ["Minggu ini", "Bulan ini", "3 bulan lagi", "Masih riset"] },
  { id: "b3", q: "Mau buka di mana?", sub: "Kota & tipe lokasi.", ai: "Untuk estimasi biaya sewa & target pasar.", type: "single", options: ["🏠 Dari rumah", "🏬 Sewa tempat fisik", "🌐 Online saja", "🚚 Keliling / pop-up"] },
  { id: "b4", q: "Kira-kira butuh modal awal berapa?", ai: "Saya cek paket Permodalan yang pas.", type: "single", options: ["< Rp 5jt", "Rp 5–25jt", "Rp 25–100jt", "> Rp 100jt", "Belum tahu"] },
  { id: "b5", q: "Modal awalnya dari mana?", ai: "Kalau butuh dari bank, saya siapkan pre-approval.", type: "single", options: ["💰 Tabungan pribadi", "👨‍👩‍👧 Pinjam keluarga", "🏦 Butuh modal dari bank", "🔀 Gabungan"] },
  { id: "b6", q: "Sudah ada bayangan supplier?", ai: "Kalau belum, saya bantu cari sekarang juga.", type: "single", options: ["Sudah ada kontak", "Masih cari-cari", "Belum mulai pikirkan"] },
  { id: "b7", q: "Target pelanggan utamamu siapa?", ai: "Untuk persiapan materi promosi nanti.", type: "single", options: ["👨‍👩‍👧 Warga sekitar", "🧑 Anak muda", "👩 Ibu rumah tangga", "💼 Profesional / menengah", "🏢 B2B / toko lain"] },
  { id: "b8", q: "Pernah jualan sebelumnya (sampingan/online)?", ai: "Pengalaman jadi nilai plus untuk skor kelayakan.", type: "single", options: ["Pernah, online", "Pernah, sampingan offline", "Belum pernah"] },
  { id: "b9", q: "Harapan balik modal berapa lama?", ai: "Saya cek apakah realistis dengan margin industrimu.", type: "single", options: ["3 bulan", "6 bulan", "1 tahun", "> 1 tahun", "Belum tahu"] },
  { id: "b10", q: "Bantuan paling penting dari BSya?", sub: "Boleh pilih lebih dari satu.", ai: "Saya prioritaskan menu sesuai pilihanmu.", type: "multi", options: ["💰 Modal usaha", "🤝 Riset supplier", "📣 Buat materi promosi", "📊 Cara catat keuangan", "🧾 Konsultasi pajak"] },
];

export const Q_BRANCH_C: Question[] = [
  {
    id: "c1",
    q: "Apa nama usahamu?",
    ai: "Catat dulu identitas bisnismu.",
    type: "text-chips",
    textHint: "mis. Kopi Kang Asep",
    chipsLabel: "Kategori usaha?",
    options: ["🏪 Warung/Kelontong", "🍱 F&B / Kuliner", "🛒 Online Seller", "👗 Fashion", "💇 Jasa", "📦 Lainnya"],
  },
  { id: "c2", q: "Sejak kapan mulai jualan?", ai: "Untuk hitung baseline omzetmu.", type: "single", options: ["Minggu ini", "< 1 bulan lalu", "1–2 bulan lalu", "2–3 bulan lalu"] },
  { id: "c3", q: "Lokasi & cara jualan?", ai: "Saya sesuaikan menu kasir & QRIS-mu.", type: "single", options: ["🏠 Dari rumah", "🏬 Tempat fisik", "🌐 Online saja", "🛵 Keliling / pop-up"] },
  { id: "c4", q: "Omzet kira-kira bulan pertama?", sub: "Estimasi kasar saja.", ai: "Saya pakai untuk forecast 3 bulan ke depan.", type: "single", options: ["< Rp 1jt", "Rp 1–5jt", "Rp 5–15jt", "> Rp 15jt", "Belum nutup modal"] },
  { id: "c5", q: "Modal awal dari mana?", ai: "Untuk catat sebagai modal awal di pembukuan.", type: "single", options: ["💰 Tabungan pribadi", "👨‍👩‍👧 Pinjam keluarga", "🏦 Pinjaman bank", "🔀 Gabungan"] },
  { id: "c6", q: "Tantangan terbesar saat ini?", ai: "Saya bantu fokuskan rekomendasi ke masalah ini.", type: "single", options: ["📉 Sepi pembeli", "💸 Belum balik modal", "📦 Stok susah diatur", "🧾 Bingung catat keuangan", "🤔 Belum tahu"] },
  { id: "c7", q: "Sudah ada pelanggan tetap?", ai: "Pelanggan tetap = sinyal bisnis sehat.", type: "single", options: ["Sudah, ada yang rutin", "Beberapa", "Belum"] },
  { id: "c8", q: "Apa yang paling kamu butuhkan dari BSya?", sub: "Boleh > 1.", ai: "Saya susun dashboardmu sesuai prioritas ini.", type: "multi", options: ["📊 Catat keuangan dari awal", "💰 Tambah modal", "📣 Promosi produk", "🤝 Cari supplier", "🧾 Belajar soal pajak"] },
];

export const BRANCH_MAP: Record<Branch, { id: Branch; label: string; questions: Question[]; emoji: string }> = {
  A: { id: "A", label: "Sudah jalan", questions: Q_BRANCH_A, emoji: "🏪" },
  B: { id: "B", label: "Masih ide", questions: Q_BRANCH_B, emoji: "💡" },
  C: { id: "C", label: "Baru mulai (< 3 bln)", questions: Q_BRANCH_C, emoji: "🌱" },
};
