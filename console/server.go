package main

import (
	"fmt"
	"gopkg.in/gin-gonic/gin.v1"
)

func index(c *gin.Context) {
	c.File("index.html")
}

func setBasicPath(e *gin.Engine) {
	e.GET("/", index)
	e.GET("/home", index)
	e.GET("/latest", index)
	e.GET("/register", index)
	e.GET("/login", index)
	e.GET("/about", index)
	e.GET("/channel", index)
	e.GET("/channel/:id", index)
	e.GET("/channel/:id/edit", index)
}

func main() {
	host := "0.0.0.0"
	port := 7000

	route := gin.New()

	route.Static("/dist", "./dist")
	// router.StaticFS("/more_static", http.Dir("my_file_system"))
	// router.StaticFile("/favicon.ico", "./resources/favicon.ico")

	setBasicPath(route)

	route.Run(fmt.Sprintf("%s:%d", host, port)) // listen and serve on 0.0.0.0:8080
}
