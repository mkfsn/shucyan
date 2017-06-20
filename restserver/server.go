package main

import (
	"github.com/gin-gonic/gin"
	ChannelController "github.com/mkfsn/shyuukan-program/restserver/controller/channel"
	"github.com/mkfsn/shyuukan-program/restserver/model"
)

var secret = ""

func middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")

		/* POST, PUT, DELETE need authentication */
		if c.Request.Method != "GET" {
			if cookie, err := c.Cookie("secret"); err != nil || cookie != secret {
				// c.AbortWithStatus(403)
				// return
			}
		}

		c.Next()
	}
}

func main() {
	db := model.InitDb("./model/database.sqlite3")
	router := gin.New()

	router.Use(middleware())

	ChannelController.Routes("/api/channels", router, db)

	router.Run(":7070")
}
