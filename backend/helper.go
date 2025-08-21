package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type ConfigData struct {
	ChapaAPIKey string
	ServerPort  string
	BaseUrl     string
}

func setupConfig() *ConfigData {
	if err := godotenv.Load("../.env"); err != nil {
		fmt.Println("Error loading .env file")
	}
	chapaAPIKey := os.Getenv("CHAPA_API_TOKEN")
	serverPort := os.Getenv("PORT")
	baseUrl := os.Getenv("BASE_URL")
	fmt.Println("Chapa API Key:", chapaAPIKey)
	return &ConfigData{
		ChapaAPIKey: chapaAPIKey,
		ServerPort:  serverPort, // Default port
		BaseUrl:     baseUrl,
	}
}
