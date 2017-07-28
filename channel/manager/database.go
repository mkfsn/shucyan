package manager

import (
	"fmt"

	"github.com/mkfsn/shyuukan-program/channel/config"
	"github.com/mkfsn/shyuukan-program/channel/manager/command/database"

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
		Action:   databaseInit,
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
		Action:   databaseClean,
	}
}

func readConfig(c *cli.Context) (*config.Config, error) {
	configFile := c.GlobalString("config")
	fmt.Fprintf(c.App.Writer, "Read config from [%s]\n", configFile)

	config, err := config.ReadConfig(configFile)
	if err != nil {
		fmt.Fprintf(c.App.Writer, "[Error] %s\n", err)
		return nil, err
	}

	return config, nil
}

func databaseInit(c *cli.Context) error {
	config, err := readConfig(c)
	if err != nil {
		return err
	}

	database.InitTable(config.Server.Database, config.Channels)
	fmt.Fprintf(c.App.Writer, "Initialize channel successfully\n")
	return nil
}

func databaseClean(c *cli.Context) error {
	config, err := readConfig(c)
	if err != nil {
		return err
	}

	database.DropTable(config.Server.Database, "")
	fmt.Fprintf(c.App.Writer, "Drop all tables successfully\n")
	return nil
}
