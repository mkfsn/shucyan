package controller

import (
	"log"
	"net/http"

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

func (ctrl *ChannelController) getChannelByID(id string) (model.Channel, int, interface{}) {
	var channel model.Channel

	if id == "" {
		log.Println("Invalid channel id")
		return channel, http.StatusBadRequest, gin.H{"message": "Invalid channel id"}
	}

	res := ctrl.db.Where("UUID = ?", id).First(&channel)
	if res.RecordNotFound() {
		return channel, http.StatusNotFound, gin.H{"message": "Channel id not found"}
	}

	return channel, http.StatusOK, nil
}

func (ctrl *ChannelController) list(c *gin.Context) {
	var channels []model.Channel
	ctrl.db.Find(&channels)
	c.JSON(http.StatusOK, channels)
}

func (ctrl *ChannelController) info(c *gin.Context) {
	var programs []model.Program

	channel, code, obj := ctrl.getChannelByID(c.Param("id"))
	if code != http.StatusOK {
		c.JSON(code, obj)
		return
	}

	ctrl.db.Model(&channel).Related(&programs, "Programs")
	for i, _ := range programs {
		var tags []model.Tag
		ctrl.db.Model(&programs[i]).Related(&tags, "Tags")
		programs[i].Tags = tags
	}
	channel.Programs = programs

	c.JSON(http.StatusOK, channel)
}

func (ctrl *ChannelController) create(c *gin.Context) {
	var channel model.Channel
	err := c.BindJSON(&channel)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid data for creating channel"})
		log.Println(err)
		return
	}

	if channel.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid data for creating channel"})
		return
	}

	if ok := ctrl.db.NewRecord(channel); !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Oops"})
		return
	}

	res := ctrl.db.Create(&channel)
	log.Printf("[Channel][Create] %v\n", channel)

	if res.RowsAffected == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Oops"})
		log.Println(res)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Channel has been created successfully"})
}

func (ctrl *ChannelController) update(c *gin.Context) {
	channel, code, obj := ctrl.getChannelByID(c.Param("id"))
	if code != http.StatusOK {
		c.JSON(code, obj)
		return
	}

	channel.Title = c.PostForm("title")
	channel.Description = c.PostForm("description")

	if res := ctrl.db.Save(&channel); res.RowsAffected == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Oops"})
		log.Println(res)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Channel has been updated successfully"})
}

func (ctrl *ChannelController) delete(c *gin.Context) {
	channel, code, obj := ctrl.getChannelByID(c.Param("id"))
	if code != http.StatusOK {
		c.JSON(code, obj)
		return
	}

	// TODO: Clean up all programs, and maybe tags? (or maybe not)

	ctrl.db.Delete(&channel)
	c.JSON(http.StatusOK, gin.H{"message": "Channel has been deleted successfully"})
}

func (ctrl *ChannelController) AddRoutes(relativePath string, route *gin.Engine) {
	channels := route.Group(relativePath)
	{
		channels.GET("/", ctrl.list)
		channels.GET("/:id", ctrl.info)
		channels.POST("/", ctrl.create)
		channels.PUT("/:id", ctrl.update)
		channels.DELETE("/:id", ctrl.delete)
	}
}
