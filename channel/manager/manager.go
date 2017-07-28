package manager

import (
	"time"

	"github.com/urfave/cli"
)

func NewApp() *cli.App {
	app := cli.NewApp()

	app.Name = "channel"
	app.Usage = "A simple manager for webserver and database"
	app.Version = "1.0.0"
	app.Compiled = time.Now()
	app.Authors = []cli.Author{
		cli.Author{
			Name:  "mkfsn",
			Email: "mkfsn@glasnostic.com",
		},
	}
	app.Copyright = "(c) mkx.tw"

	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:  "config, c",
			Usage: "Load yaml configuration from `FILE`",
			Value: "./config.yaml",
		},
	}

	app.Commands = []cli.Command{
		commandRunServer,
		commandDatabaseInit,
		commandDatabaseMigrate,
		commandDatabaseClean,
	}

	return app
}
