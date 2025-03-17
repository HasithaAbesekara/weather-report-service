const express = require("express");
const {
  getCurrentWeather,
  getWeatherHistory,
  triggerWeatherReport,
} = require("../controllers/weatherController");
const { protect } = require("../middleware/auth");
const { validateWeatherHistoryRequest } = require("../middleware/validate");

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/current", getCurrentWeather);
router.get("/history", validateWeatherHistoryRequest, getWeatherHistory);
router.post("/report", triggerWeatherReport);

module.exports = router;
