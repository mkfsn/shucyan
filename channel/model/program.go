package model

import (
	"time"

	"github.com/jinzhu/gorm"
)

type Program struct {
	gorm.Model

	Day       uint32    `gorm:"not null"                json:"day"`
	Title     string    `gorm:"not null"                json:"title"`
	Content   string    `gorm:"not null"                json:"content"`
	Link      string    `gorm:"not null"                json:"link"`
	StartedAt time.Time `gorm:"not null"                json:"startedAt"`
	EndedAt   time.Time `gorm:"not null"                json:"endedAt"`
	Tags      []Tag     `gorm:"many2many:program_tags;" json:"tags"`

	// ChannelID is used for getting channel UUID in HTTP request body, and
	// we don't want it to be stored into database
	ChannelID string `gorm:"-"  sql:"-"  json:"channelId"`
}

type Tag struct {
	gorm.Model

	Name string `gorm:"not null" json:"name"`
}
