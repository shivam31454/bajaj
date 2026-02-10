
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Strict JSON parsing (body-parser is built-in in new express, but good to be explicit or use body-parser if needed for strictness methods)

// Custom middleware to handle malformed JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            is_success: false,
            official_email: process.env.OFFICIAL_EMAIL || "user_email_placeholder@chitkara.edu.in",
            error: "Invalid JSON format"
        });
    }
    next();
});

// Routes
app.use('/', routes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        is_success: false,
        official_email: process.env.OFFICIAL_EMAIL || "user_email_placeholder@chitkara.edu.in",
        error: "Route not found"
    });
});

module.exports = app;
