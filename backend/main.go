package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
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

type ResponseBody struct{}

type ChapaErrorResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Data    string `json:"data"`
}

type ChapaResponseData struct {
	CheckoutURL string `json:"checkout_url"`
}

type ChapaSuccessResponse struct {
	Message string            `json:"message"`
	Status  string            `json:"status"`
	Data    ChapaResponseData `json:"data"`
}

func main() {

	router := gin.Default()
	client := resty.New()
	defer client.Close()
	configData := setupConfig()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.POST("/initialize-paymnet", func(ctx *gin.Context) {
		var requestBody RequestBody
		if err := ctx.ShouldBindJSON(&requestBody); err != nil {
			ctx.JSON(400, gin.H{"error": "Invalid request body"})
			return
		}

		var chapaSuccessResponse ChapaSuccessResponse
		var errorResponse ChapaErrorResponse
		response, err := client.R().
			SetHeader("Content-Type", "application/json").
			SetBody(requestBody).
			SetResult(&chapaSuccessResponse).
			SetError(&errorResponse).
			SetAuthToken(configData.ChapaAPIKey).
			SetHeader("Content-Type", "application/json").
			Post("https://api.chapa.co/v1/transaction/initialize")

		if err != nil {
			ctx.JSON(500, gin.H{"error": "Failed to make request to Chapa API"})
			fmt.Println("Error making request to Chapa API:", err)
			return
		}

		fmt.Println("Response from Chapa API:", response.String())

		if response.StatusCode() != http.StatusOK {
			ctx.JSON(response.StatusCode(), gin.H{
				"status":  errorResponse.Status,
				"message": errorResponse.Message,
				"data":    errorResponse.Data,
			})
			return
		}
		ctx.JSON(response.StatusCode(), gin.H{
			"status":  chapaSuccessResponse.Status,
			"message": chapaSuccessResponse.Message,
			"data":    chapaSuccessResponse.Data,
		})
	})

	router.POST("/chapa-callback", func(ctx *gin.Context) {
		var callbackData map[string]interface{}
		if err := ctx.ShouldBindJSON(&callbackData); err != nil {
			ctx.JSON(400, gin.H{"error": "invalid callback data"})
			return
		}

		// Example: extract tx_ref
		txRef, _ := callbackData["tx_ref"].(string)

		// 🔍 Verify with Chapa API
		var verifyResp map[string]interface{}
		response, err := client.R().
			SetHeader("Authorization", "Bearer "+configData.ChapaAPIKey).
			SetResult(&verifyResp).
			Get("https://api.chapa.co/v1/transaction/verify/" + txRef)

		if err != nil || response.StatusCode() != 200 {
			ctx.JSON(500, gin.H{"error": "failed to verify payment"})
			return
		}

		// ✅ Save to DB (pseudo code, you can replace with real DB code)
		fmt.Println("Saving to DB:", verifyResp)

		ctx.JSON(200, gin.H{"message": "payment verified", "data": verifyResp})
	})

	router.GET("/payment-success", func(ctx *gin.Context) {
		ctx.HTML(200, "success.html", gin.H{
			"message": "Payment successful! Thank you 🎉",
		})
	})

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%v", configData.ServerPort),
		Handler: router,
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGHUP, syscall.SIGTERM)

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			fmt.Println("Server failed:", err)
		}
	}()
	<-quit
	fmt.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		fmt.Println("Server forced to shutdown:", err)
	} else {
		fmt.Println("Server gracefully stopped")

	}

}
