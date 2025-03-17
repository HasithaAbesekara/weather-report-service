const logger = require("./logger");

/**
 * Custom error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack);

  // Set default error status and message
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Server Error";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join(", ");
  }

  // Handle Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Not authorized to access this route";
  }

  // Handle JWT expired error
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired, please log in again";
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

/**
 * Async handler to avoid try-catch blocks in route handlers
 * @param {Function} fn - Route handler function
 * @returns {Function} - Express middleware function
 */
exports.asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
