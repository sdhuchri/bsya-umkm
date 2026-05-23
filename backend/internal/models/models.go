package models

// BusinessProfile is the result of the onboarding flow.
type BusinessProfile struct {
	UserID       string                 `json:"-"`
	Branch       string                 `json:"branch"`
	BusinessName string                 `json:"businessName"`
	Category     string                 `json:"category"`
	Needs        []string               `json:"needs"`
	Answers      map[string]any         `json:"answers"`
	CompletedAt  string                 `json:"completedAt"`
}

type Kpi struct {
	Label string  `json:"label"`
	Value string  `json:"value"`
	Delta string  `json:"delta"`
	Up    *bool   `json:"up"`
	Accent string `json:"accent"`
}

type CashflowPoint struct {
	Month   string `json:"month"`
	Income  int    `json:"income"`
	Expense int    `json:"expense"`
}

type Transaction struct {
	Name     string `json:"name"`
	Category string `json:"category"`
	Amount   string `json:"amount"`
	Time     string `json:"time"`
	Negative bool   `json:"negative"`
}

type DashboardSummary struct {
	Greeting     string          `json:"greeting"`
	Date         string          `json:"date"`
	Kpis         []Kpi           `json:"kpis"`
	Cashflow     []CashflowPoint `json:"cashflow"`
	Transactions []Transaction   `json:"transactions"`
}

type LaporanAccount struct {
	Name     string `json:"name"`
	Value    string `json:"value"`
	Positive bool   `json:"positive"`
}

type Laporan struct {
	Summary  []map[string]string `json:"summary"`  // {key,value,sub}
	Profit   []map[string]any    `json:"profit"`   // {month,value}
	Accounts []LaporanAccount    `json:"accounts"`
}

type TaxHistory struct {
	Month  string `json:"month"`
	Amount string `json:"amount"`
	Status string `json:"status"`
}

type PajakData struct {
	Period   string       `json:"period"`
	Amount   string       `json:"amount"`
	Basis    string       `json:"basis"`
	DueDate  string       `json:"dueDate"`
	History  []TaxHistory `json:"history"`
}

type Supplier struct {
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Location string  `json:"location"`
	Rating   float64 `json:"rating"`
	Last     string  `json:"last"`
	Tag      string  `json:"tag"`
}

type Customer struct {
	Name   string `json:"name"`
	Spend  string `json:"spend"`
	Visits int    `json:"visits"`
}

type SupplierData struct {
	Suppliers []Supplier `json:"suppliers"`
	Customers []Customer `json:"customers"`
}

type Campaign struct {
	Title    string `json:"title"`
	Platform string `json:"platform"`
	Reach    string `json:"reach"`
	Clicks   string `json:"clicks"`
	Spent    string `json:"spent"`
	State    string `json:"state"`
}

type IklanData struct {
	Kpis      []map[string]string `json:"kpis"`
	Campaigns []Campaign          `json:"campaigns"`
}

type ScoreFactor struct {
	Name  string `json:"name"`
	Value int    `json:"value"`
}

type FinancingPackage struct {
	Title   string `json:"title"`
	Amount  string `json:"amount"`
	Tenor   string `json:"tenor"`
	Margin  string `json:"margin"`
	Use     string `json:"use"`
	Popular bool   `json:"popular"`
}

type ModalData struct {
	Plafond  string             `json:"plafond"`
	Terms    string             `json:"terms"`
	Score    int                `json:"score"`
	Factors  []ScoreFactor      `json:"factors"`
	Packages []FinancingPackage `json:"packages"`
}
