package channel

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/mkfsn/shyuukan-program/webserver/model"
)

type controller struct {
	db *gorm.DB
}

func newController(db *gorm.DB) *controller {
	return &controller{
		db: db,
	}
}

func (ctrl *controller) findID(id string) ([]model.Channel, error) {
	var channels []model.Channel

	// Get all matched records
	ctrl.db.Where("id = ?", id).Find(&channels)

	return channels, nil
}

func (ctrl *controller) list(c *gin.Context) {
	var channels []model.Channel
	ctrl.db.Find(&channels)
	c.JSON(http.StatusOK, channels)
}

func (ctrl *controller) create(c *gin.Context) {
	channel := model.Channel{
		Name:        c.PostForm("name"),
		Destription: c.PostForm("description"),
	}
	log.Printf("[Channel][Create] %v\n", channel)

	if channel.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid data for creating channel"})
		return
	}

	if ok := ctrl.db.NewRecord(channel); ok {
		ctrl.db.Create(&channel)
		c.JSON(http.StatusOK, gin.H{"message": "Channel create successfully"})
		return
	}

	c.JSON(http.StatusInternalServerError, gin.H{"message": "Oops"})
}

/*
func (ctrl *controller) update(c *gin.Context) {
}
*/

/*
func (ctrl *controller) delete(c *gin.Context) {
	id := c.Param("id")

	if channels, _ := ctrl.findID(id); len(channels) != 0 {
		// channel := model.Channel{ID: id}
		// ctrl.db.Delete(&channel)
		c.JSON(http.StatusOK, gin.H{"message": "Channel delete successfully"})
		return
	}

	c.JSON(http.StatusInternalServerError, gin.H{"message": "Oops"})
}
*/

func Routes(relativePath string, route *gin.Engine, db *gorm.DB) {
	controller := newController(db)
	channels := route.Group(relativePath)
	{
		channels.GET("/", controller.list)
		channels.POST("/", controller.create)
		// channels.PUT("/:id", controller.update)
		// channels.DELETE("/:id", controller.delete)
	}
}
