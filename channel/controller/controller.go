package controller

import (
	"github.com/gin-gonic/gin"
)

type Controller interface {
	AddRoutes(relativePath string, route *gin.Engine)
}
