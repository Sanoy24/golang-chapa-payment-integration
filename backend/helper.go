package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type ConfigData struct {
	ChapaAPIKey string
	ServerPort  string
}

func setupConfig() *ConfigData {
	if err := godotenv.Load("../.env"); err != nil {
		fmt.Println("Error loading .env file")
	}
	chapaAPIKey := os.Getenv("CHAPA_API_TOKEN")
	serverPort := os.Getenv("PORT")
	return &ConfigData{
		ChapaAPIKey: chapaAPIKey,
		ServerPort:  serverPort, // Default port
	}
}
