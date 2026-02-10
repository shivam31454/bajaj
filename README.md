# Chitkara Qualifier API

A REST API service built with Node.js and Express for the Chitkara University qualifier. Provides computational operations and AI integration via Google Gemini.

## Features

- **POST /bfhl** - Handles multiple computational tasks:
  - `fibonacci` - Generate Fibonacci sequence
  - `prime` - Filter prime numbers from array
  - `lcm` - Calculate Least Common Multiple
  - `hcf` - Calculate Highest Common Factor (GCD)
  - `AI` - Get single-word answers using Google Gemini

- **GET /health** - Health check endpoint

## Tech Stack

- Node.js 18+
- Express.js
- Google Generative AI (Gemini)
- Helmet (security)
- CORS
- dotenv

## Project Structure

```
chitkara-api/
├── src/
│   ├── config/           # Configuration
│   │   └── index.js      # Environment config
│   ├── controllers/      # Route controllers
│   │   ├── bfhlController.js
│   │   └── healthController.js
│   ├── middleware/       # Express middleware
│   │   └── errorHandler.js
│   ├── routes/           # API routes
│   │   ├── bfhlRoutes.js
│   │   └── healthRoutes.js
│   ├── utils/            # Utility functions
│   │   ├── mathUtils.js      # Math operations
│   │   ├── aiService.js      # Gemini integration
│   │   ├── validators.js     # Input validation
│   │   └── responseHelper.js # Response formatting
│   └── server.js         # Entry point
├── .env.example          # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Setup Instructions

### 1. Clone and Install

```bash
cd chitkara-api
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=3000
NODE_ENV=development
OFFICIAL_EMAIL=your.email@chitkara.edu.in
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get Gemini API Key:** Visit [Google AI Studio](https://aistudio.google.com) to get a free API key.

### 3. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check

```bash
GET /health
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "your.email@chitkara.edu.in"
}
```

### BFHL Operations

```bash
POST /bfhl
Content-Type: application/json
```

#### Fibonacci

**Request:**
```json
{
  "fibonacci": 7
}
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "your.email@chitkara.edu.in",
  "data": [0, 1, 1, 2, 3, 5, 8]
}
```

#### Prime Filter

**Request:**
```json
{
  "prime": [2, 4, 7, 9, 11]
}
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "your.email@chitkara.edu.in",
  "data": [2, 7, 11]
}
```

#### LCM

**Request:**
```json
{
  "lcm": [12, 18, 24]
}
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "your.email@chitkara.edu.in",
  "data": 72
}
```

#### HCF/GCD

**Request:**
```json
{
  "hcf": [24, 36, 60]
}
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "your.email@chitkara.edu.in",
  "data": 12
}
```

#### AI Question

**Request:**
```json
{
  "AI": "What is the capital city of Maharashtra?"
}
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "your.email@chitkara.edu.in",
  "data": "mumbai"
}
```

## Error Responses

All errors follow this format:

```json
{
  "is_success": false,
  "official_email": "your.email@chitkara.edu.in",
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Route not found
- `500` - Internal Server Error
- `502` - AI Service Error
- `503` - AI Service Not Configured

## Input Validation

The API includes comprehensive validation:

- **fibonacci**: Must be a non-negative integer (max 10000)
- **prime/lcm/hcf**: Must be non-empty arrays of integers (max 1000 elements)
- **AI**: Must be a non-empty string (max 500 characters)

## Testing

Run the test suite:

```bash
npm test
```

## Deployment

### Environment Variables for Production

Make sure to set these in your production environment:

```env
NODE_ENV=production
PORT=3000
OFFICIAL_EMAIL=your.email@chitkara.edu.in
GEMINI_API_KEY=your_gemini_api_key_here
```

### Platform-Specific Deployment

**Railway/Render/Heroku:**
1. Push code to GitHub
2. Connect repository to platform
3. Add environment variables in dashboard
4. Deploy

**VPS/Dedicated Server:**
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name chitkara-api

# Save PM2 config
pm2 save
pm2 startup
```

## License

MIT
