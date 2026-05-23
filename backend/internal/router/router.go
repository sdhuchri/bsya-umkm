package router

import (
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"bsya-umkm-backend/internal/handlers"
)

func New(h *handlers.Handler, allowedOrigins string) *gin.Engine {
	r := gin.Default()

	corsCfg := cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-User-Id"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	if allowedOrigins == "*" {
		corsCfg.AllowAllOrigins = true
		corsCfg.AllowCredentials = false
	} else {
		corsCfg.AllowOrigins = strings.Split(allowedOrigins, ",")
	}
	r.Use(cors.New(corsCfg))

	r.GET("/health", h.Health)

	api := r.Group("/api")
	{
		api.POST("/auth/login", h.Login)
		api.GET("/profile", h.GetProfile)
		api.POST("/profile", h.SaveProfile)
		api.GET("/dashboard/:section", h.GetSection)

		ai := api.Group("/ai")
		{
			ai.POST("/insight", h.AIInsight)
			ai.POST("/pajak", h.AIPajak)
			ai.POST("/iklan", h.AIIklan)
			ai.POST("/chat", h.AIChat)
		}
	}

	return r
}
