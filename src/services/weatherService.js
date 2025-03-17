const axios = require("axios");
const User = require("../models/User");
const WeatherData = require("../models/WeatherData");
const { sendWeatherReportEmail } = require("./emailService");
const { generateAIWeatherDescription } = require("./aiService");
const logger = require("../utils/logger");

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {Number} lat - Latitude
 * @param {Number} lon - Longitude
 * @returns {Object} - Weather data
 */
const fetchWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat,
          lon,
          appid: process.env.OPEN_WEATHER_MAP_API_KEY,
          units: "metric", // Use metric units (celsius)
        },
      }
    );

    const data = response.data;

    // Format the weather data
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
    };
  } catch (error) {
    logger.error(`Error fetching weather data: ${error.message}`);
    throw new Error("Failed to fetch weather data from OpenWeatherMap API");
  }
};

/**
 * Send weather report to a specific user
 * @param {String} userId - User ID
 * @returns {Promise} - Result of sending the weather report
 */
const sendWeatherReportToUser = async (userId) => {
  try {
    // Get user details
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      logger.warn(`User ${userId} not found or inactive`);
      return false;
    }

    // Fetch weather data
    const weatherData = await fetchWeatherData(
      user.location.coordinates.lat,
      user.location.coordinates.lon
    );

    // Generate AI description
    let aiDescription = "";
    try {
      aiDescription = await generateAIWeatherDescription(
        weatherData,
        user.location.city
      );
    } catch (error) {
      logger.error(`Error generating AI weather description: ${error.message}`);
      // Continue without AI description
    }

    // Save weather data to database
    const weatherRecord = await WeatherData.create({
      user: userId,
      date: new Date(),
      location: {
        city: user.location.city,
        coordinates: user.location.coordinates,
      },
      weather: weatherData,
      aiDescription,
      emailSent: false,
    });

    // Send email
    await sendWeatherReportEmail({
      to: user.email,
      subject: `Weather Report for ${user.location.city}`,
      city: user.location.city,
      weatherData,
      aiDescription,
    });

    // Update weather record to mark email as sent
    await WeatherData.findByIdAndUpdate(weatherRecord._id, {
      emailSent: true,
      emailSentAt: new Date(),
    });

    logger.info(`Weather report sent to user ${userId}`);
    return true;
  } catch (error) {
    logger.error(
      `Error sending weather report to user ${userId}: ${error.message}`
    );
    throw error;
  }
};

/**
 * Send weather reports to all active users
 * @returns {Promise} - Result of sending the weather reports
 */
const sendWeatherReports = async () => {
  try {
    logger.info("Starting to send weather reports to all active users");

    // Get all active users
    const users = await User.find({ isActive: true });

    if (users.length === 0) {
      logger.info("No active users found");
      return { success: true, count: 0 };
    }

    // Send weather reports to each user
    const results = await Promise.allSettled(
      users.map((user) => sendWeatherReportToUser(user._id))
    );

    // Count successful reports
    const successCount = results.filter(
      (result) => result.status === "fulfilled" && result.value === true
    ).length;

    logger.info(
      `Weather reports sent to ${successCount} out of ${users.length} users`
    );

    return {
      success: true,
      total: users.length,
      successful: successCount,
    };
  } catch (error) {
    logger.error(`Error sending weather reports: ${error.message}`);
    throw error;
  }
};

module.exports = {
  fetchWeatherData,
  sendWeatherReportToUser,
  sendWeatherReports,
};
