package main

import (
	"github.com/gin-gonic/gin"
	ChannelController "github.com/mkfsn/shyuukan-program/webserver/controller/channel"
	"github.com/mkfsn/shyuukan-program/webserver/model"
)

func main() {
	db := model.InitDb("./model/database.sqlite3")
	router := gin.Default()

	ChannelController.Routes("/api/channels", router, db)

	router.Run(":7070")
}
