# Golang Chapa Payment Integration

This project demonstrates a full-stack payment integration using [Chapa](https://chapa.co/) with a Go backend and a React + TypeScript frontend.

## Features

-   **Backend (Go):**

    -   REST API for initializing Chapa payments
    -   Callback endpoint for verifying transactions
    -   CORS support for frontend integration
    -   Environment-based configuration

-   **Frontend (React + Vite):**
    -   Payment form for collecting user details
    -   Redirects to Chapa checkout on payment initialization
    -   Success and failure pages for payment status

## Project Structure

```
.
├── backend/
│   ├── main.go
│   ├── helper.go
│   ├── go.mod
│   └── go.sum
├── chapa-frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Success.tsx
│   │   │   └── Failure.tsx
│   │   └── componenet/
│   │       └── PaymentForm.tsx
│   ├── package.json
│   └── ...
├── .env
└── README.md
```

## Getting Started

### Prerequisites

-   Go 1.24+
-   Node.js 18+
-   npm

### Setup

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Sanoy24/golang-chapa-payment-integration.git
    cd golang-chapa-payment-integration
    ```

2. **Configure environment variables:**

    Edit the `.env` file with your Chapa API token and server settings:

    ```
    CHAPA_API_TOKEN=your_chapa_api_token
    BASE_URL=http://localhost:8080
    PORT=8080
    ```

3. **Install backend dependencies:**

    ```sh
    cd backend
    go mod tidy
    ```

4. **Install frontend dependencies:**

    ```sh
    cd ../chapa-frontend
    npm install
    ```

## Running the Project

### Start the Backend

```sh
cd backend
go run main.go
```

### Start the Frontend

```sh
cd chapa-frontend
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173) and the backend at [http://localhost:8080](http://localhost:8080).

## Usage

1. Open the frontend in your browser.
2. Fill out the payment form and submit.
3. You will be redirected to Chapa's checkout page.
4. After payment, you will be redirected to the success or failure page.

## API Endpoints

-   `POST /initialize-payment`  
    Initializes a payment with Chapa.

-   `GET /chapa-callback`  
    Handles Chapa's callback for transaction verification.

-   `GET /ping`  
    Health check endpoint.

##
