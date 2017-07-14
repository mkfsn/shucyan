package model

import (
	"github.com/jinzhu/gorm"
	_ "github.com/mattn/go-sqlite3"
)

type Database struct {
	db *gorm.DB
}

func OpenDB(dbfile string, debug bool, defaultChannels []Channel) *gorm.DB {
	// Open database
	db, err := gorm.Open("sqlite3", dbfile)
	if err != nil {
		panic(err)
	}

	db.LogMode(debug)

	if debug {
		initTables(db, defaultChannels)
	}

	return db
}

func initTables(db *gorm.DB, channels []Channel) {
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
}
