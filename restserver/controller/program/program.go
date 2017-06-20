package program

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/mkfsn/shyuukan-program/restserver/model"
)

type controller struct {
	db *gorm.DB
}

func newController(db *gorm.DB) *controller {
	return &controller{
		db: db,
	}
}

func (ctrl *controller) list(c *gin.Context) {
	var programs []model.Program
	ctrl.db.Find(&programs)
	c.JSON(http.StatusOK, programs)
}

func Routes(relativePath string, route *gin.Engine, db *gorm.DB) {
	controller := newController(db)
	programs := route.Group(relativePath)
	{
		programs.GET("/", controller.list)
	}
}
