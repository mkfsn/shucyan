package config

import (
	"io/ioutil"

	"github.com/mkfsn/shyuukan-program/channel/model"

	"gopkg.in/yaml.v2"
)

var (
	DefaultConfig *Config
)

func init() {
	DefaultConfig = &Config{
		Server: Server{
			Debug:    true,
			Database: "./model/database.sqlite3",
		},
		Channels: []model.Channel{},
	}
}

type Config struct {
	Server   Server          `yaml:"server"`
	Channels []model.Channel `yaml:"channels"`
}

func ReadConfig(filename string) (*Config, error) {
	var config Config

	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	err = yaml.Unmarshal([]byte(data), &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}
