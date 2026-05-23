package data

// Sections enumerates the dashboard data blobs persisted per user.
var Sections = []string{"summary", "laporan", "pajak", "supplier", "iklan", "modal"}

// Section returns the default demo payload for a named dashboard section.
func Section(name string) any {
	switch name {
	case "summary":
		return DashboardSummary()
	case "laporan":
		return Laporan()
	case "pajak":
		return Pajak()
	case "supplier":
		return Supplier()
	case "iklan":
		return Iklan()
	case "modal":
		return Modal()
	default:
		return nil
	}
}
