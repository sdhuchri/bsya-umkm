// Package ai wraps Amazon Bedrock with a mock fallback so the prototype always runs.
package ai

import (
	"context"
	"encoding/json"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime"

	"bsya-umkm-backend/internal/models"
)

type Client struct {
	modelID string
	region  string
	bedrock *bedrockruntime.Client
}

// New builds a client. If region/modelID are empty, AI calls return mock text.
func New(ctx context.Context, region, modelID string) *Client {
	c := &Client{modelID: modelID, region: region}
	if region == "" || modelID == "" {
		return c
	}
	cfg, err := awsconfig.LoadDefaultConfig(ctx, awsconfig.WithRegion(region))
	if err != nil {
		log.Printf("[ai] AWS config load failed, using mock: %v", err)
		return c
	}
	c.bedrock = bedrockruntime.NewFromConfig(cfg)
	return c
}

func (c *Client) Configured() bool { return c.bedrock != nil }

type Result struct {
	Text   string `json:"text"`
	Source string `json:"source"` // "bedrock" | "mock"
}

// Invoke runs a system+prompt against Bedrock (Anthropic Messages API), or
// returns the supplied mock when not configured / on error.
func (c *Client) Invoke(ctx context.Context, system, prompt, mock string, maxTokens int) Result {
	if !c.Configured() {
		return Result{Text: mock, Source: "mock"}
	}
	if maxTokens == 0 {
		maxTokens = 512
	}
	body, _ := json.Marshal(map[string]any{
		"anthropic_version": "bedrock-2023-05-31",
		"max_tokens":        maxTokens,
		"system":            system,
		"messages": []map[string]any{
			{"role": "user", "content": []map[string]any{{"type": "text", "text": prompt}}},
		},
	})
	out, err := c.bedrock.InvokeModel(ctx, &bedrockruntime.InvokeModelInput{
		ModelId:     aws.String(c.modelID),
		ContentType: aws.String("application/json"),
		Accept:      aws.String("application/json"),
		Body:        body,
	})
	if err != nil {
		log.Printf("[ai] invoke failed, using mock: %v", err)
		return Result{Text: mock, Source: "mock"}
	}
	var decoded struct {
		Content []struct {
			Text string `json:"text"`
		} `json:"content"`
	}
	if err := json.Unmarshal(out.Body, &decoded); err != nil || len(decoded.Content) == 0 {
		return Result{Text: mock, Source: "mock"}
	}
	return Result{Text: decoded.Content[0].Text, Source: "bedrock"}
}

// ProfileContext renders a short business context string for prompts.
func ProfileContext(p *models.BusinessProfile) string {
	if p == nil || p.BusinessName == "" {
		return "Nasabah belum mengisi profil onboarding."
	}
	out := "Nama usaha: " + p.BusinessName
	if p.Category != "" {
		out += " · Kategori: " + p.Category
	}
	if p.Branch != "" {
		out += " · Posisi bisnis: cabang " + p.Branch
	}
	if len(p.Needs) > 0 {
		out += " · Kebutuhan utama: "
		for i, n := range p.Needs {
			if i > 0 {
				out += ", "
			}
			out += n
		}
	}
	return out
}
