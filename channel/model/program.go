package model

import (
	"time"

	"github.com/jinzhu/gorm"
)

type Program struct {
	ID         uint      `gorm:"primary_key;not null;AUTO_INCREMENT"`
	ChannelID  uint      `gorm:"uniq_key;not null"`
	Day        uint      `gorm:"not null"`
	Title      string    `gorm:"not null"`
	Content    string    `gorm:"not null"`
	Link       string    `gorm:"not null"`
	Tags       []Tag     `gorm:"many2many:program_tags;"`
	StartedAt  time.Time `gorm:"not null"`
	EndedAt    time.Time `gorm:"not null"`
	CreatedAt  time.Time `gorm:"not null"`
	ModifiedAt time.Time `gorm:"not null"`
}

type Tag struct {
	gorm.Model
	Name string
}
