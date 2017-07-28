package main

import (
	"os"

	"github.com/mkfsn/shyuukan-program/channel/manager"
)

func main() {
	app := manager.NewApp()
	app.Run(os.Args)
}
