const User = require("../models/User");
const { geocodeCity } = require("../services/geocodingService");
const logger = require("../utils/logger");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { email, password, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Get city name from coordinates if not provided
    let userLocation = { ...location };
    if (!userLocation.city && userLocation.coordinates) {
      try {
        const cityName = await geocodeCity(
          userLocation.coordinates.lat,
          userLocation.coordinates.lon
        );
        userLocation.city = cityName;
      } catch (error) {
        logger.error(`Error geocoding city: ${error.message}`);
        // Continue with empty city if geocoding fails
        userLocation.city = "Unknown";
      }
    }

    // Create user
    const user = await User.create({
      email,
      password,
      location: userLocation,
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        location: user.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        location: user.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        location: user.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user location
// @route   PUT /api/users/location
// @access  Private
exports.updateLocation = async (req, res, next) => {
  try {
    const { coordinates, city } = req.body;

    // Validate coordinates
    if (!coordinates || !coordinates.lat || !coordinates.lon) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid coordinates (lat, lon)",
      });
    }

    let locationUpdate = {
      coordinates: {
        lat: coordinates.lat,
        lon: coordinates.lon,
      },
    };

    // Get city name if not provided
    if (!city) {
      try {
        const cityName = await geocodeCity(coordinates.lat, coordinates.lon);
        locationUpdate.city = cityName;
      } catch (error) {
        logger.error(`Error geocoding city: ${error.message}`);
        // Continue with empty city if geocoding fails
        locationUpdate.city = "Unknown";
      }
    } else {
      locationUpdate.city = city;
    }

    // Update user location
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { location: locationUpdate },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location: user.location,
    });
  } catch (error) {
    next(error);
  }
};
