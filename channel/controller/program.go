package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
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

func (ctrl *ProgramController) AddRoutes(relativePath string, route *gin.Engine) {
	programs := route.Group(relativePath)
	{
		programs.GET("/", methodNotAllowed)
		programs.GET("/:id", methodNotAllowed)
		programs.DELETE("/:id", methodNotAllowed)
	}
}
