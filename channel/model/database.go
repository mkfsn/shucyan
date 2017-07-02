package model

import (
	"encoding/json"
	"io/ioutil"
	"log"

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
	// Open database
	db, err := gorm.Open("sqlite3", dbfile)
	db.LogMode(true)

	// Error
	if err != nil {
		panic(err)
	}

	file, err := ioutil.ReadFile(configFile)
	if err != nil {
		log.Println(err)
		return nil
	}

	var channels []Channel
	err = json.Unmarshal(file, &channels)
	if err != nil {
		log.Println(err)
		return nil
	}

	db.DropTableIfExists(&Program{}, &Channel{}, &Tag{})
	db.AutoMigrate(&Program{}, &Channel{}, &Tag{})

	for _, channel := range channels {
		for i, _ := range channel.Programs {
			db.Set("gorm:save_associations", false).Create(&channel.Programs[i])
			db.Model(&channel.Programs[i]).Association("Tags").Append(channel.Programs[i].Tags)
		}
		db.Set("gorm:save_associations", false).Create(&channel)
		db.Model(&channel).Association("Programs").Append(channel.Programs)
	}

	return db
}
