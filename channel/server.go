package main

import (
	"github.com/mkfsn/shyuukan-program/channel/controller"

	"github.com/gin-gonic/gin"
	"github.com/mkfsn/shyuukan-program/channel/model"
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
	var rest controller.Controller

	db := model.InitDB("./model/database.sqlite3", "./default.json")
	router := gin.New()

	router.Use(middleware())

	rest = controller.NewChannelController(db)
	rest.AddRoutes("/api/channels", router)

	rest = controller.NewProgramController(db)
	rest.AddRoutes("/api/programs", router)

	router.Run(":7071")
}
