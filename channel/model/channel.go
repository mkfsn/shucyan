package model

import (
	"time"
)

type Channel struct {
	ID uint64 `gorm:"primary_key;not null;AUTO_INCREMENT" json:"-"`

	UUID        string    `gorm:"not null"                    json:"id"`
	CreatedAt   time.Time `gorm:"not null" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"not null" json:"updatedAt"`
	Title       string    `gorm:"not null"                    json:"title"`
	Owner       string    `gorm:"not null"                    json:"owner"`
	Description string    `gorm:"not null"                    json:"description"`
	Programs    []Program `gorm:"many2many:channel_programs;" json:"programs"`
}
