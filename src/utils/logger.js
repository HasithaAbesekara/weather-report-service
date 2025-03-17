/**
 * Simple logging utility
 * In a production environment, this would be replaced with a more robust solution
 * like Winston or Pino
 */

// Define log levels
const LogLevels = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

// Set current log level based on environment
const currentLogLevel =
  process.env.NODE_ENV === "production" ? LogLevels.INFO : LogLevels.DEBUG;

// Log level hierarchy
const logLevelHierarchy = {
  [LogLevels.ERROR]: 0,
  [LogLevels.WARN]: 1,
  [LogLevels.INFO]: 2,
  [LogLevels.DEBUG]: 3,
};

// Logger implementation
const logger = {
  /**
   * Log an error message
   * @param {String} message - Error message
   */
  error: (message) => {
    if (
      logLevelHierarchy[currentLogLevel] >= logLevelHierarchy[LogLevels.ERROR]
    ) {
      console.error(
        `[${new Date().toISOString()}] ${LogLevels.ERROR}: ${message}`
      );
    }
  },

  /**
   * Log a warning message
   * @param {String} message - Warning message
   */
  warn: (message) => {
    if (
      logLevelHierarchy[currentLogLevel] >= logLevelHierarchy[LogLevels.WARN]
    ) {
      console.warn(
        `[${new Date().toISOString()}] ${LogLevels.WARN}: ${message}`
      );
    }
  },

  /**
   * Log an info message
   * @param {String} message - Info message
   */
  info: (message) => {
    if (
      logLevelHierarchy[currentLogLevel] >= logLevelHierarchy[LogLevels.INFO]
    ) {
      console.info(
        `[${new Date().toISOString()}] ${LogLevels.INFO}: ${message}`
      );
    }
  },

  /**
   * Log a debug message
   * @param {String} message - Debug message
   */
  debug: (message) => {
    if (
      logLevelHierarchy[currentLogLevel] >= logLevelHierarchy[LogLevels.DEBUG]
    ) {
      console.debug(
        `[${new Date().toISOString()}] ${LogLevels.DEBUG}: ${message}`
      );
    }
  },
};

module.exports = logger;
