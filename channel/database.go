package main

import (
	"fmt"

	"github.com/urfave/cli"
)

var (
	commandDatabaseInit    cli.Command
	commandDatabaseMigrate cli.Command
	commandDatabaseClean   cli.Command
)

func init() {

	commandDatabaseInit = cli.Command{
		Name:     "init",
		Usage:    "Initialize database with channels",
		Category: "database",
		Action: func(c *cli.Context) error {
			config := c.String("config")
			fmt.Fprintln(c.App.Writer, "config:", config)
			return nil
		},
	}

	commandDatabaseMigrate = cli.Command{
		Name:     "migrate",
		Usage:    "Migrate Database",
		Category: "database",
		Action: func(c *cli.Context) error {
			config := c.String("config")
			fmt.Fprintln(c.App.Writer, "config:", config)
			return nil
		},
	}

	commandDatabaseClean = cli.Command{
		Name:     "clean",
		Usage:    "Clean up Database",
		Category: "database",
		Action: func(c *cli.Context) error {
			config := c.String("config")
			fmt.Fprintln(c.App.Writer, "config:", config)
			return nil
		},
	}
}
