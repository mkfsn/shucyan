package model

import (
	"time"
)

type Channel struct {
	ID          int       `gorm:"primary_key;not null;AUTO_INCREMENT"`
	Name        string    `gorm:"not null"`
	Owner       string    `gorm:"not null"`
	Destription string    `gorm:"not null"`
	CreatedAt   time.Time `gorm:"not null"`
	ModifiedAt  time.Time `gorm:"not null"`
}
