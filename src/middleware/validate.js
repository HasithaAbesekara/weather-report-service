const { body, query, validationResult } = require("express-validator");

// Validation middleware for user registration
exports.validateUserRegistration = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("location.coordinates.lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  body("location.coordinates.lon")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

// Validation middleware for user login
exports.validateUserLogin = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").exists().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

// Validation middleware for location update
exports.validateLocationUpdate = [
  body("coordinates.lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  body("coordinates.lon")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

// Validation middleware for weather history request
exports.validateWeatherHistoryRequest = [
  query("date")
    .optional()
    .isDate()
    .withMessage("Please provide a valid date in YYYY-MM-DD format"),
  query("startDate")
    .optional()
    .isDate()
    .withMessage("Please provide a valid start date in YYYY-MM-DD format"),
  query("endDate")
    .optional()
    .isDate()
    .withMessage("Please provide a valid end date in YYYY-MM-DD format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Check if at least one date parameter is provided
    if (!req.query.date && !(req.query.startDate && req.query.endDate)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide either a specific date or a date range (startDate and endDate)",
      });
    }

    next();
  },
];
