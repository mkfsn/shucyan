package security

import (
	"net/http"

	"github.com/mkfsn/shyuukan-program/channel/config"

	"github.com/gin-gonic/gin"
)

func Middleware(config *config.Config) gin.HandlerFunc {

	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		/* POST, PUT, DELETE need authentication */
		if c.Request.Method == "GET" {
			c.Next()
		}

		for _, secret := range config.Server.Secrets {
			switch secret.Type {
			case "cookie":
				cookie, err := c.Cookie("secret")
				if err != nil {
					// 401
					c.AbortWithStatus(http.StatusUnauthorized)
					return
				}

				if cookie != secret.Value {
					// 403
					c.AbortWithStatus(http.StatusForbidden)
					return
				}
			}
		}
	}
}
