package model

import (
	"time"
)

type Program struct {
	ID         int       `gorm:"primary_key;not null;AUTO_INCREMENT"`
	Day        int       `gorm:"not null"`
	Title      string    `gorm:"not null"`
	Content    string    `gorm:"not null"`
	Link       string    `gorm:"not null"`
	Tags       string    `gorm:"not null"`
	StartedAt  time.Time `gorm:"not null"`
	EndedAt    time.Time `gorm:"not null"`
	CreatedAt  time.Time `gorm:"not null"`
	ModifiedAt time.Time `gorm:"not null"`
}
