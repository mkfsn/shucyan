package model

import (
	"encoding/json"
	"io/ioutil"

	"github.com/jinzhu/gorm"
	_ "github.com/mattn/go-sqlite3"
)

type Database struct {
	db *gorm.DB
}

func NewDatabase(dbfile string, configFile string) *Database {
	return &Database{
		db: InitDB(dbfile, configFile),
	}
}

func InitDB(dbfile string, configFile string) *gorm.DB {
	// Openning file
	db, err := gorm.Open("sqlite3", dbfile)
	db.LogMode(true)

	// Error
	if err != nil {
		panic(err)
	}

	if !db.HasTable(&Program{}) {
		db.CreateTable(&Program{})
		// db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(&Program{})
	}

	// Creating the Channel table
	if !db.HasTable(&Channel{}) {
		db.CreateTable(&Channel{})
		// db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(&Program{})
	}

	db.DropTableIfExists(&Program{}, &Channel{})
	db.AutoMigrate(&Program{}, &Channel{})

	file, e := ioutil.ReadFile(configFile)
	if e != nil {
		return nil
	}

	var channels []Channel
	json.Unmarshal(file, &channels)

	for _, channel := range channels {
		db.Set("gorm:save_associations", false).Create(&channel)
		db.Model(&channel).Association("Programs").Append(channel.Programs)
	}

	return db
}
