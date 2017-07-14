package model

import (
	"time"

	"github.com/jinzhu/gorm"
)

type Program struct {
	ID        uint       `gorm:"primary_key"  json:"id" yaml:"id"`
	CreatedAt time.Time  `                    json:"-"  yaml:"-"`
	UpdatedAt time.Time  `                    json:"-"  yaml:"-"`
	DeletedAt *time.Time `                    json:"-"  yaml:"-"`

	Day       uint32    `gorm:"not null"                json:"day"       yaml:"day"`
	Title     string    `gorm:"not null"                json:"title"     yaml:"title"`
	Content   string    `gorm:"not null"                json:"content"   yaml:"content"`
	Link      string    `gorm:"not null"                json:"link"      yaml:"link"`
	StartedAt time.Time `gorm:"not null"                json:"startedAt" yaml:"startedAt"`
	EndedAt   time.Time `gorm:"not null"                json:"endedAt"   yaml:"endedAt"`
	Tags      []Tag     `gorm:"many2many:program_tags;" json:"tags"      yaml:"tags"`

	// ChannelID is used for getting channel UUID in HTTP request body, and
	// we don't want it to be stored into database
	ChannelID string `gorm:"-"  sql:"-"  json:"channelId" yaml:"channelId"`
}

type Tag struct {
	gorm.Model

	Name string `gorm:"not null" json:"name" yaml:"name"`
}
