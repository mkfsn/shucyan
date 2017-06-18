package model

import (
	"github.com/jinzhu/gorm"
	_ "github.com/mattn/go-sqlite3"
)

type Database struct {
	db *gorm.DB
}

func NewDatabase(dbfile string) *Database {
	return &Database{
		db: InitDb(dbfile),
	}
}

func InitDb(dbfile string) *gorm.DB {
	// Openning file
	db, err := gorm.Open("sqlite3", dbfile)
	db.LogMode(true)

	// Error
	if err != nil {
		panic(err)
	}

	// Creating the Program table
	if !db.HasTable(&Program{}) {
		db.CreateTable(&Program{})
		db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(&Program{})
	}

	// Creating the Channel table
	if !db.HasTable(&Channel{}) {
		db.CreateTable(&Channel{})
		db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(&Program{})
	}

	return db
}
