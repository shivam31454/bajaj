
# BFHL REST API

This is a REST API built with Node.js and Express for the "Qualifier 1" challenge.

## Features
- **Public Endpoints**: `/health`, `/bfhl`
- **Operations**:
    - `fibonacci`: Generate Fibonacci sequence.
    - `prime`: Filter prime numbers from an array.
    - `lcm`: Calculate LCM of an array.
    - `hcf`: Calculate HCF of an array.
    - `AI`: Answer a question using Google Gemini AI.
- **Robustness**: Handles edge cases, invalid JSON, and enforces strict input rules.

## Tech Stack
- Node.js
- Express.js
- Google Generative AI SDK

## Setup & Run Locally

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd bajaj
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    OFFICIAL_EMAIL=your_email@chitkara.edu.in
    GEMINI_API_KEY=your_gemini_api_key
    ```
    *Note: Replace placeholders with your actual details.*

4.  **Start the server:**
    ```bash
    npm start
    ```
    Server runs on `http://localhost:3000`.

## API Documentation

### 1. GET /health
Returns the health status of the API.
- **Response:**
  ```json
  {
    "is_success": true,
    "official_email": "..."
  }
  ```

### 2. POST /bfhl
Main endpoint for processing data.
- **Request Body**: Must contain **exactly one** key (`fibonacci`, `prime`, `lcm`, `hcf`, `AI`).

#### Examples

**Fibonacci**
```json
{ "fibonacci": 7 }
```
Response:
```json
{ "is_success": true, "official_email": "...", "data": [0, 1, 1, 2, 3, 5, 8] }
```

**Prime**
```json
{ "prime": [2, 4, 7, 9, 11] }
```
Response:
```json
{ "is_success": true, "official_email": "...", "data": [2, 7, 11] }
```

**LCM**
```json
{ "lcm": [12, 18, 24] }
```
Response:
```json
{ "is_success": true, "official_email": "...", "data": 72 }
```

**HCF**
```json
{ "hcf": [24, 36, 60] }
```
Response:
```json
{ "is_success": true, "official_email": "...", "data": 12 }
```

**AI**
```json
{ "AI": "What is the capital city of Maharashtra?" }
```
Response:
```json
{ "is_success": true, "official_email": "...", "data": "Mumbai" }
```

## Deployment

### Vercel
1.  Push code to GitHub.
2.  Import project in Vercel.
3.  Add Environment Variables (`OFFICIAL_EMAIL`, `GEMINI_API_KEY`) in Vercel Settings.
4.  Deploy.

### Render
1.  Create a Web Service connected to your GitHub repo.
2.  Set Build Command: `npm install`
3.  Set Start Command: `npm start`
4.  Add Environment Variables.
5.  Deploy.
