const WeatherData = require("../models/WeatherData");
const { fetchWeatherData } = require("../services/weatherService");
const { generateAIWeatherDescription } = require("../services/aiService");
const logger = require("../utils/logger");

// @desc    Get weather data for current user location
// @route   GET /api/weather/current
// @access  Private
exports.getCurrentWeather = async (req, res, next) => {
  try {
    const { id: userId, location } = req.user;

    // Fetch current weather data from OpenWeatherMap
    const weatherData = await fetchWeatherData(
      location.coordinates.lat,
      location.coordinates.lon
    );

    // Generate AI description for the weather
    let aiDescription = "";
    try {
      aiDescription = await generateAIWeatherDescription(
        weatherData,
        location.city
      );
    } catch (error) {
      logger.error(`Error generating AI weather description: ${error.message}`);
      // Continue without AI description
    }

    // Create new weather data record
    const weatherRecord = await WeatherData.create({
      user: userId,
      date: new Date(),
      location: {
        city: location.city,
        coordinates: location.coordinates,
      },
      weather: weatherData,
      aiDescription,
    });

    res.status(200).json({
      success: true,
      data: weatherRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weather data history for a specific date range
// @route   GET /api/weather/history
// @access  Private
exports.getWeatherHistory = async (req, res, next) => {
  try {
    const { date, startDate, endDate } = req.query;
    const userId = req.user.id;

    let query = { user: userId };

    // Handle date range or single date
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (date) {
      // Convert date string to Date object
      const targetDate = new Date(date);

      // Set time to beginning of day
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      // Set time to end of day
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // Get weather data records
    const weatherRecords = await WeatherData.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: weatherRecords.length,
      data: weatherRecords,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually trigger weather report for current user
// @route   POST /api/weather/report
// @access  Private
exports.triggerWeatherReport = async (req, res, next) => {
  try {
    const { sendWeatherReportToUser } = require("../services/weatherService");

    await sendWeatherReportToUser(req.user.id);

    res.status(200).json({
      success: true,
      message: "Weather report sent successfully",
    });
  } catch (error) {
    next(error);
  }
};
