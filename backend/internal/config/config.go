package config

import "os"

// Config holds runtime settings, all sourced from environment variables.
type Config struct {
	Port           string
	DatabaseURL    string // Postgres connection string; empty → in-memory demo data
	AllowedOrigins string // comma-separated CORS origins; "*" allowed for dev

	// Amazon Bedrock — empty values make AI endpoints fall back to mock text.
	AWSRegion      string
	BedrockModelID string
}

func Load() Config {
	return Config{
		Port:           env("PORT", "8082"),
		DatabaseURL:    env("DATABASE_URL", ""),
		AllowedOrigins: env("ALLOWED_ORIGINS", "*"),
		AWSRegion:      env("AWS_REGION", ""),
		BedrockModelID: env("BEDROCK_MODEL_ID", ""),
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
