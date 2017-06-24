package model

import (
	"time"
)

type Channel struct {
	ID          uint      `gorm:"primary_key;not null;AUTO_INCREMENT"`
	Name        string    `gorm:"not null"`
	Owner       string    `gorm:"not null"`
	Programs    []Program `gorm:"not null;ForeignKey:ID"`
	Description string    `gorm:"not null"`
	CreatedAt   time.Time `gorm:"not null"`
	ModifiedAt  time.Time `gorm:"not null"`
}
