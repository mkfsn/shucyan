package model

import (
	"time"
)

type Channel struct {
	ID uint64 `gorm:"primary_key;not null;AUTO_INCREMENT" json:"-" yaml:"-"`

	UUID        string    `gorm:"not null"                    json:"id"          yaml:"id"`
	CreatedAt   time.Time `gorm:"not null"                    json:"createdAt"   yaml:"createdAt"`
	UpdatedAt   time.Time `gorm:"not null"                    json:"updatedAt"   yaml:"updateAt"`
	Title       string    `gorm:"not null"                    json:"title"       yaml:"title"`
	Owner       string    `gorm:"not null"                    json:"owner"       yaml:"owner"`
	Description string    `gorm:"not null"                    json:"description" yaml:"description"`
	Programs    []Program `gorm:"many2many:channel_programs;" json:"programs"    yaml:"programs"`
}
