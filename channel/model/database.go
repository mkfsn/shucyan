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
	return db
}
