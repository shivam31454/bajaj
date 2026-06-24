# BFHL Hierarchy Analyzer

A production-ready Full Stack application with an Express backend API and a premium dark-themed Glassmorphism frontend for parsing directed graphs, detecting cycles, constructing tree hierarchies, and displaying them with visually highlighted connections.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   USER_ID=your_name_ddmmyyyy
   EMAIL_ID=your_email@domain.com
   COLLEGE_ROLL_NUMBER=your_roll_number
   NODE_ENV=development
   ```

3. Start the application:
   ```bash
   npm start
   ```

The application will run at **`http://localhost:5000`**.

## API Documentation

**POST** `/bfhl`

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

Returns structured hierarchy analysis with tree construction, cycle detection, and depth calculation.

**GET** `/bfhl`

Returns `{ "operation_code": 1 }`

## Tech Stack

* **Backend**: Node.js, Express, CORS, Dotenv
* **Frontend**: Modern Vanilla HTML5, Premium CSS3 (Glassmorphism layout, custom animations), Vanilla ES6 JavaScript

