const axios = require("axios");
const logger = require("../utils/logger");

/**
 * Get city name from coordinates using Google Maps Geocoding API
 * @param {Number} lat - Latitude
 * @param {Number} lon - Longitude
 * @returns {String} - City name
 */
const geocodeCity = async (lat, lon) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${lat},${lon}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
          result_type: "locality",
        },
      }
    );

    const data = response.data;

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      throw new Error(`Geocoding API error: ${data.status}`);
    }

    // Parse results to find city name
    let cityName = "Unknown";

    // Try to get locality (city) from address components
    for (const result of data.results) {
      for (const component of result.address_components) {
        if (component.types.includes("locality")) {
          cityName = component.long_name;
          break;
        }
      }

      if (cityName !== "Unknown") break;

      // Fall back to administrative_area_level_1 (state/province) if city not found
      for (const component of result.address_components) {
        if (component.types.includes("administrative_area_level_1")) {
          cityName = component.long_name;
          break;
        }
      }
    }

    logger.info(`Geocoded coordinates (${lat}, ${lon}) to city: ${cityName}`);
    return cityName;
  } catch (error) {
    logger.error(`Error geocoding coordinates: ${error.message}`);
    throw new Error("Failed to geocode coordinates");
  }
};

module.exports = {
  geocodeCity,
};
