package database

type Database struct {
	db *gorm.DB
}

// openDB returns a gorm DB
func openDB(dbfile string) *gorm.DB {
	db, err := gorm.Open("sqlite3", dbfile)
	if err != nil {
		panic(err)
	}
	return db
}
