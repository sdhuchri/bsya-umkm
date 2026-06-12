// Package data holds the canonical demo dataset for the BSya Grow prototype.
// It is used to seed Postgres and as the in-memory fallback when no DB is configured.
package data

import "bsya-umkm-backend/internal/models"

func b(v bool) *bool { return &v }

func DashboardSummary() models.DashboardSummary {
	up := true
	down := false
	return models.DashboardSummary{
		Greeting: "Hai, Budi 👋 Yuk kelola bisnismu hari ini",
		Date:     "Senin · 27 April 2026",
		Kpis: []models.Kpi{
			{Label: "Pemasukan Bulan Ini", Value: "Rp 42.850.000", Delta: "+12.4%", Up: &up, Accent: "#29B5E8"},
			{Label: "Pengeluaran", Value: "Rp 28.140.000", Delta: "+18.2%", Up: &down, Accent: "#E97373"},
			{Label: "Saldo Rekening", Value: "Rp 87.420.500", Delta: "tersinkron", Up: nil, Accent: "#0B2740"},
			{Label: "Estimasi Pajak", Value: "Rp 245.000", Delta: "PPh Final 0.5%", Up: nil, Accent: "#F5B800"},
		},
		Cashflow: []models.CashflowPoint{
			{Month: "Nov", Income: 28, Expense: 22},
			{Month: "Des", Income: 32, Expense: 25},
			{Month: "Jan", Income: 35, Expense: 23},
			{Month: "Feb", Income: 30, Expense: 26},
			{Month: "Mar", Income: 38, Expense: 24},
			{Month: "Apr", Income: 43, Expense: 28},
		},
		Transactions: []models.Transaction{
			{Name: "Toko Beras Pak Karim", Category: "Supplier · Sembako", Amount: "-Rp 2.450.000", Time: "Hari ini, 09:21", Negative: true},
			{Name: "GoFood — Pesanan #4821", Category: "Pemasukan online", Amount: "+Rp 184.000", Time: "Hari ini, 08:14", Negative: false},
			{Name: "Setor Tunai", Category: "Setoran kasir", Amount: "+Rp 1.200.000", Time: "Kemarin, 17:05", Negative: false},
			{Name: "PLN — Token Listrik", Category: "Operasional", Amount: "-Rp 200.000", Time: "Kemarin, 11:32", Negative: true},
		},
	}
}

func Laporan() models.Laporan {
	return models.Laporan{
		Summary: []map[string]string{
			{"key": "Total Pendapatan", "value": "Rp 142.8jt", "sub": "Q1 2026", "accent": "#29B5E8"},
			{"key": "Total Beban", "value": "Rp 89.4jt", "sub": "HPP + Operasional", "accent": "#E97373"},
			{"key": "Laba Bersih", "value": "Rp 53.4jt", "sub": "Margin 37.4%", "accent": "#22B57A"},
		},
		Profit: []map[string]any{
			{"month": "Jan", "value": 8},
			{"month": "Feb", "value": 11},
			{"month": "Mar", "value": 14},
			{"month": "Apr", "value": 18},
		},
		Accounts: []models.LaporanAccount{
			{Name: "Penjualan barang dagangan", Value: "Rp 138.2jt", Positive: true},
			{Name: "Pendapatan jasa", Value: "Rp 4.6jt", Positive: true},
			{Name: "Harga Pokok Penjualan", Value: "Rp 71.3jt", Positive: false},
			{Name: "Beban gaji karyawan", Value: "Rp 12.0jt", Positive: false},
			{Name: "Beban listrik & air", Value: "Rp 3.8jt", Positive: false},
			{Name: "Beban operasional lain", Value: "Rp 2.3jt", Positive: false},
		},
	}
}

func Pajak() models.PajakData {
	return models.PajakData{
		Period:  "April 2026",
		Amount:  "Rp 245.000",
		Basis:   "Omzet Rp 49jt × 0.5% PPh Final",
		DueDate: "15 Mei 2026",
		History: []models.TaxHistory{
			{Month: "Jan", Amount: "Rp 176.000", Status: "Lunas"},
			{Month: "Feb", Amount: "Rp 198.500", Status: "Lunas"},
			{Month: "Mar", Amount: "Rp 214.000", Status: "Lunas"},
			{Month: "Apr", Amount: "Rp 245.000", Status: "Belum bayar"},
		},
	}
}

func Supplier() models.SupplierData {
	return models.SupplierData{
		Suppliers: []models.Supplier{
			{Name: "Toko Beras Pak Karim", Category: "Beras & Sembako", Location: "Bekasi", Rating: 4.8, Last: "Rp 2.4jt", Tag: "sering"},
			{Name: "CV Mitra Sejahtera", Category: "Minuman kemasan", Location: "Jakarta Timur", Rating: 4.6, Last: "Rp 1.8jt", Tag: "baru"},
			{Name: "Grosir Sumber Rejeki", Category: "Mi instan & snack", Location: "Bogor", Rating: 4.9, Last: "Rp 3.1jt", Tag: "favorit"},
			{Name: "PD Anugerah", Category: "Rokok & tembakau", Location: "Bekasi", Rating: 4.4, Last: "Rp 1.2jt", Tag: ""},
		},
		Customers: []models.Customer{
			{Name: "Ibu Yanti", Spend: "Rp 4.2jt", Visits: 47},
			{Name: "Pak Surya", Spend: "Rp 2.8jt", Visits: 31},
			{Name: "Ibu Lastri", Spend: "Rp 2.1jt", Visits: 28},
		},
	}
}

func Iklan() models.IklanData {
	return models.IklanData{
		Kpis: []map[string]string{
			{"key": "Total reach", "value": "21.7K", "sub": "+34% MoM"},
			{"key": "Total clicks", "value": "1.4K", "sub": "CTR 6.4%"},
			{"key": "Pengeluaran", "value": "Rp 450rb", "sub": "dari budget Rp 600rb"},
			{"key": "ROAS", "value": "4.2×", "sub": "di atas target"},
		},
		Campaigns: []models.Campaign{
			{Title: "Promo Lebaran Sembako Murah", Platform: "Instagram + TikTok", Reach: "12.4K", Clicks: "847", Spent: "Rp 250rb", State: "Aktif"},
			{Title: "Diskon 10% Pelanggan Baru", Platform: "Facebook Ads", Reach: "6.2K", Clicks: "412", Spent: "Rp 120rb", State: "Aktif"},
			{Title: "Buka Cabang Baru Bekasi", Platform: "Google Maps", Reach: "3.1K", Clicks: "198", Spent: "Rp 80rb", State: "Selesai"},
		},
	}
}

func Modal() models.ModalData {
	return models.ModalData{
		Plafond: "Rp 50.000.000",
		Terms:   "Margin 1.2%/bulan · tenor sampai 24 bulan · akad murabahah",
		Score:   84,
		Factors: []models.ScoreFactor{
			{Name: "Konsistensi pendapatan", Value: 92},
			{Name: "Riwayat pembayaran pajak", Value: 88},
			{Name: "Pertumbuhan omzet", Value: 76},
			{Name: "Diversifikasi supplier", Value: 68},
		},
		Packages: []models.FinancingPackage{
			{Title: "Modal Cepat", Amount: "Rp 5–25jt", Tenor: "6 bulan", Margin: "1.0%/bln", Use: "Restock barang dagangan", Popular: false},
			{Title: "Modal Tumbuh", Amount: "Rp 25–50jt", Tenor: "12 bulan", Margin: "1.2%/bln", Use: "Buka cabang / renovasi", Popular: true},
			{Title: "Modal Investasi", Amount: "Rp 50–200jt", Tenor: "24 bulan", Margin: "1.4%/bln", Use: "Aset & ekspansi besar", Popular: false},
		},
	}
}
