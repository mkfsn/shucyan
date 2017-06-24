package controller

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/mkfsn/shyuukan-program/channel/model"
)

type ChannelController struct {
	db *gorm.DB
}

func NewChannelController(db *gorm.DB) Controller {
	return &ChannelController{
		db: db,
	}
}

func (ctrl *ChannelController) findID(id string) ([]model.Channel, error) {
	var channels []model.Channel

	// Get all matched records
	ctrl.db.Where("id = ?", id).Find(&channels)

	return channels, nil
}

func (ctrl *ChannelController) list(c *gin.Context) {
	var channels []model.Channel
	ctrl.db.Find(&channels)
	c.JSON(http.StatusOK, channels)
}

func (ctrl *ChannelController) create(c *gin.Context) {
	now := time.Now()
	channel := model.Channel{
		Name:        c.PostForm("name"),
		Description: c.PostForm("description"),
		Owner:       "",
		CreatedAt:   now,
		ModifiedAt:  now,
	}
	log.Printf("[Channel][Create] %v\n", channel)

	if channel.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid data for creating channel"})
		return
	}

	if ok := ctrl.db.NewRecord(channel); !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Oops"})
		return
	}

	res := ctrl.db.Create(&channel)
	if res.RowsAffected == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Oops"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Channel has been created successfully"})
}

func (ctrl *ChannelController) update(c *gin.Context) {
	var id int
	var err error
	var channel model.Channel

	id, err = strconv.Atoi(c.Param("id"))
	if err != nil || id < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid channel id"})
		return
	}

	if res := ctrl.db.First(&channel, id); res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Channel id not found"})
		return
	}

	channel.Name = c.PostForm("name")
	channel.Description = c.PostForm("description")
	channel.ModifiedAt = time.Now()

	if res := ctrl.db.Save(&channel); res.RowsAffected == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Oops"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Channel has been updated successfully"})
}

func (ctrl *ChannelController) delete(c *gin.Context) {
	var id int
	var err error
	var channel model.Channel

	id, err = strconv.Atoi(c.Param("id"))
	if err != nil || id < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid channel id"})
		return
	}

	res := ctrl.db.First(&channel, id)
	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Channel id not found"})
		return
	}

	ctrl.db.Delete(&channel)
	c.JSON(http.StatusOK, gin.H{"message": "Channel has been deleted successfully"})
}

func (ctrl *ChannelController) AddRoutes(relativePath string, route *gin.Engine) {
	channels := route.Group(relativePath)
	{
		channels.GET("/", ctrl.list)
		channels.POST("/", ctrl.create)
		channels.PUT("/:id", ctrl.update)
		channels.DELETE("/:id", ctrl.delete)
	}
}
