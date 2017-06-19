package model

type Channel struct {
	ID          int    `gorm:"AUTO_INCREMENT"`
	Name        string `gorm:"not null"`
	Destription string `gorm:"not null"`
}
