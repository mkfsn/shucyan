package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/mkfsn/shyuukan-program/channel/model"
)

type ProgramController struct {
	db *gorm.DB
}

func NewProgramController(db *gorm.DB) Controller {
	return &ProgramController{
		db: db,
	}
}

func (ctrl *ProgramController) getChannel(c *gin.Context) (model.Channel, error) {
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

func (ctrl *ProgramController) getProgramsByChannelID(c *gin.Context) {
	var programs []model.Program

	channel, err := ctrl.getChannel(c)
	if err != nil {
		return
	}

	ctrl.db.Model(&channel).Related(&programs)
	c.JSON(http.StatusOK, programs)
}

func (ctrl *ProgramController) getProgramByID(c *gin.Context) {
	var program model.Program

	channel, err := ctrl.getChannel(c)
	if err != nil {
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid program id"})
		return
	}

	ctrl.db.Where(&model.Program{ID: id, ChannelID: channel.ID}).First(&program)
	c.JSON(http.StatusOK, program)
}

func (ctrl *ProgramController) delete(c *gin.Context) {
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

func (ctrl *ProgramController) AddRoutes(relativePath string, route *gin.Engine) {
	programs := route.Group(relativePath)
	{
		programs.GET("/", ctrl.getProgramsByChannelID)
		programs.GET("/:id", ctrl.getProgramByID)
		programs.DELETE("/:id", ctrl.delete)
	}
}
