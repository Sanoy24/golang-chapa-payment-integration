package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"resty.dev/v3"
)

type RequestBody struct {
	Amount                   string `json:"amount"`
	Currency                 string `json:"currency"`
	Email                    string `json:"email"`
	FirstName                string `json:"first_name"`
	LastName                 string `json:"last_name"`
	PhoneNumber              string `json:"phone_number"`
	TransactionReference     string `json:"tx_ref"`
	CallBackUrl              string `json:"callback_url"`
	ReturnUrl                string `json:"return_url"`
	CustomizationTitle       string `json:"customization[title]"`
	CustomizationDescription string `json:"customization[description]"`
	MetaHideReceipt          string `json:"meta[hide_receipt]"`
}

func main() {
	router := gin.Default()
	client := resty.New()
	defer client.Close()

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.Run(":8080") // Run on port 8080
	fmt.Println("Server is running on http://localhost:8080")
}
