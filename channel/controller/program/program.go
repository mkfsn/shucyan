package program

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/mkfsn/shyuukan-program/channel/model"
)

type controller struct {
	db *gorm.DB
}

func newController(db *gorm.DB) *controller {
	return &controller{
		db: db,
	}
}

func (ctrl *controller) getChannel(c *gin.Context) (model.Channel, error) {
	var channel model.Channel

	// FIXME: Is this ChannelID?
	id, err := strconv.Atoi(c.PostForm("channelId"))
	if err != nil || id < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid channel id"})
		return channel, fmt.Errorf("Invalid channel id")
	}

	if res := ctrl.db.First(&channel, id); res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Channel id not found"})
		return channel, fmt.Errorf("Channel id not found")
	}

	return channel, nil
}

func (ctrl *controller) list(c *gin.Context) {
	var programs []model.Program

	channel, err := ctrl.getChannel(c)
	if err != nil {
		return
	}

	ctrl.db.Model(&channel).Related(&programs)
	c.JSON(http.StatusOK, programs)
}

func (ctrl *controller) delete(c *gin.Context) {
	var program model.Program

	cid, err := strconv.ParseUint(c.PostForm("channelId"), 10, 64)
	if err != nil || cid < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid channel id"})
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid program id"})
		return
	}

	ctrl.db.Where(&model.Program{ID: id, ChannelID: cid}).First(&program)

	c.JSON(http.StatusOK, program)
}

func Routes(relativePath string, route *gin.Engine, db *gorm.DB) {
	controller := newController(db)
	programs := route.Group(relativePath)
	{
		programs.GET("/", controller.list)
		programs.DELETE("/:id", controller.delete)
	}
}
