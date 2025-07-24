const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const path = require('path');
const logger = require('./config/logger');
const connectDB = require('./config/db');

// Load env vars only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  require('dotenv').config();
  connectDB();
}

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cors());
app.use(helmet());

// Skip morgan in test environment
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Rate limiting (disabled in test environment)
if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  app.use(limiter);
}

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));

// Error handling
const { errorConverter, errorHandler } = require('./middlewares/error');
app.use(errorConverter);
app.use(errorHandler);

// Serve static files in production only
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
  });
}

// Only start server if not in test environment
let server;
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  process.on('unhandledRejection', (err, promise) => {
    logger.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

module.exports = app;