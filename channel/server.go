package main

import (
	"github.com/mkfsn/shyuukan-program/channel/command/server"

	"github.com/urfave/cli"
)

var (
	serverCommand cli.Command
)

func init() {
	serverCommand = cli.Command{
		Name:  "runserver",
		Usage: "run the channel restful server",
		Flags: []cli.Flag{
			cli.IntFlag{
				Name:  "port",
				Value: 7071,
			},
			cli.StringFlag{
				Name:  "host",
				Value: "localhost",
			},
			cli.StringFlag{
				Name:  "config, c",
				Usage: "Load yaml configuration from `FILE`",
				Value: "./config.yaml",
			},
		},
		Action: func(c *cli.Context) error {
			config := c.String("config")
			host := c.String("host")
			port := c.Int("port")

			server.Run(host, port, config)

			return nil
		},
	}
}
