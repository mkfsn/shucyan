package main

import (
	"os"
	"time"

	"github.com/urfave/cli"
)

func main() {
	app := cli.NewApp()

	app.Name = "shyuukan-program"
	app.Usage = "channel manager"
	app.Version = "1.0.0"
	app.Compiled = time.Now()
	app.Authors = []cli.Author{
		cli.Author{
			Name:  "mkfsn",
			Email: "mkfsn@glasnostic.com",
		},
	}
	app.Copyright = "(c) mkx.tw"

	app.Commands = []cli.Command{
		serverCommand,
		databaseCommand,
	}

	app.Run(os.Args)
}
