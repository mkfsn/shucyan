package database

import (
	"github.com/mkfsn/shyuukan-program/channel/model"
)

func InitTable(dbfile string, channels []model.Channel) {
	db := openDB(dbfile)

	if !db.HasTable(&model.Channel{}) {
		db.CreateTable(&model.Channel{})
	} else {
		db.DropTable(&model.Channel{})
	}

	if !db.HasTable(&model.Program{}) {
		db.CreateTable(&model.Program{})
	} else {
		db.DropTable(&model.Program{})
	}

	if !db.HasTable(&model.Tag{}) {
		db.CreateTable(&model.Tag{})
	} else {
		db.DropTable(&model.Tag{})
	}

	for _, channel := range channels {
		for i, _ := range channel.Programs {
			db.Set("gorm:save_associations", false).Create(&channel.Programs[i])
			db.Model(&channel.Programs[i]).Association("Tags").Append(channel.Programs[i].Tags)
		}
		db.Set("gorm:save_associations", false).Create(&channel)
		db.Model(&channel).Association("Programs").Append(channel.Programs)
	}
}
