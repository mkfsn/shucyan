package controller

import (
	"log"
	"net/http"

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

func methodNotAllowed(context *gin.Context) {
	context.AbortWithStatus(http.StatusMethodNotAllowed)
}

func (ctrl *ProgramController) getChannelByChannelID(channelID string) (model.Channel, int, interface{}) {
	var channel model.Channel
	var programs []model.Program

	if channelID == "" {
		log.Println("Invalid channel id")
		return channel, http.StatusBadRequest, gin.H{"message": "Invalid channel id"}
	}

	res := ctrl.db.Where("UUID = ?", channelID).Find(&channel)
	if res.RecordNotFound() {
		return channel, http.StatusNotFound, gin.H{"message": "Channel id not found"}
	}

	ctrl.db.Model(&channel).Related(&programs, "Programs")
	channel.Programs = programs
	return channel, http.StatusOK, nil
}

func programBelongsToChannel(program model.Program, channel model.Channel) bool {
	// FIXME: maybe this can be done by ORM (a SQL way)?
	for _, p := range channel.Programs {
		if p.ID == program.ID {
			return true
		}
	}
	return false
}

func (ctrl *ProgramController) info(context *gin.Context) {
	var clientProgram model.Program
	var program model.Program

	err := context.BindJSON(&clientProgram)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid data for getting program"})
		log.Println(err)
		return
	}

	channel, code, obj := ctrl.getChannelByChannelID(clientProgram.ChannelID)
	if code != http.StatusOK {
		context.JSON(code, obj)
		return
	}

	if !programBelongsToChannel(clientProgram, channel) {
		context.JSON(http.StatusNotAcceptable, nil)
		return
	}

	ctrl.db.First(&program, clientProgram.ID)
	context.JSON(http.StatusOK, program)
}

func (ctrl *ProgramController) create(context *gin.Context) {
	var clientProgram model.Program

	err := context.BindJSON(&clientProgram)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid data for getting program"})
		log.Println(err)
		return
	}

	channel, code, obj := ctrl.getChannelByChannelID(clientProgram.ChannelID)
	if code != http.StatusOK {
		context.JSON(code, obj)
		return
	}

	ctrl.db.Set("gorm:save_associations", false).Create(&clientProgram)
	ctrl.db.Model(&clientProgram).Association("Tags").Append(clientProgram.Tags)
	ctrl.db.Model(&channel).Association("Programs").Append(clientProgram)

	context.JSON(http.StatusOK, nil)
}

func (ctrl *ProgramController) AddRoutes(relativePath string, route *gin.Engine) {
	programs := route.Group(relativePath)
	{
		programs.GET("/:id", ctrl.info)
		programs.POST("/", ctrl.create)
		programs.DELETE("/:id", methodNotAllowed)
	}
}
