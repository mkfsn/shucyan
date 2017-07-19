package main

import (
	"github.com/mkfsn/shyuukan-program/channel/command/server"

	"github.com/urfave/cli"
)

var (
	commandRunServer cli.Command
)

func init() {
	commandRunServer = cli.Command{
		Name:     "run",
		Usage:    "Run the channel restful web server",
		Category: "web server",
		Flags: []cli.Flag{
			cli.IntFlag{
				Name:  "port",
				Value: 7071,
			},
			cli.StringFlag{
				Name:  "host",
				Value: "localhost",
			},
		},
		Action: func(c *cli.Context) error {
			config := c.GlobalString("config")
			host := c.String("host")
			port := c.Int("port")

			server.Run(host, port, config)

			return nil
		},
	}
}
