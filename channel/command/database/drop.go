package database

import (
	"github.com/mkfsn/shyuukan-program/channel/model"
)

func DropTable(dbfile string, table string) {
	db := openDB(dbfile)
	switch table {
	case "program":
		db.DropTableIfExists(&model.Program{}, &model.Tag{})
	case "channel":
		db.DropTableIfExists(&model.Program{}, &model.Channel{}, &model.Tag{})
	case "all":
		fallthrough
	default:
		db.DropTableIfExists(&model.Program{}, &model.Channel{}, &model.Tag{})
	}
}
