require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const constants = require('./utils/constants');
const bfhlRoutes = require('./routes/bfhlRoutes');
const healthRoutes = require('./routes/healthRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRoutes);

app.use('/bfhl', bfhlRoutes);

// Error handling middleware
app.use(errorHandler.notFoundHandler);
app.use(errorHandler.globalErrorHandler);

// Start server
if (require.main === module) {
  app.listen(constants.port, () => {
    console.log(`Server running on port: ${constants.port}`);
  });
}

module.exports = app;
