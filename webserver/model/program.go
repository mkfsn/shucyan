package model

import (
	"time"
)

type Program struct {
	//      CREATE TABLE IF NOT EXISTS `programtemplate` (
	ID      int       `gorm:"primary_key;not null;AUTO_INCREMENT" form:"id"`
	Day     int       `gorm:"not null" form:"day"`
	Title   string    `gorm:"not null" form:"title"`
	Content string    `gorm:"not null" form:"content"`
	Link    string    `gorm:"not null" form:"link"`
	Flag    int       `gorm:"not null" form:"flag"`
	Start   time.Time `gorm:"not null" form:"start"`
	End     time.Time `gorm:"not null" form:"end"`
	Create  time.Time `gorm:"not null" form:"create"`
	// `modify` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	Modify time.Time `gorm:"not null" form:"modify"`

	// ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
}
