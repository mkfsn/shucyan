package main

import (
	"fmt"

	"github.com/urfave/cli"
)

var (
	databaseCommand cli.Command
)

func init() {
	databaseCommand = cli.Command{
		Name:  "database",
		Usage: "migrate, clean",
		Flags: []cli.Flag{
			cli.StringFlag{
				Name:  "config, c",
				Usage: "Load configuration from `FILE`",
				Value: "./config.yaml",
			},
		},
		Subcommands: cli.Commands{
			cli.Command{
				Name:   "migrate",
				Action: migrate,
			},
			cli.Command{
				Name:   "clean",
				Action: clean,
			},
		},
	}
}

func migrate(c *cli.Context) error {
	fmt.Fprintf(c.App.Writer, "[migrate] :wave: over here, eh\n")
	return nil
}

func clean(c *cli.Context) error {
	fmt.Fprintf(c.App.Writer, "[clean] :wave: over here, eh\n")
	return nil
}
