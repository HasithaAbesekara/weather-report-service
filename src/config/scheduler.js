const cron = require("node-cron");
const { sendWeatherReports } = require("../services/weatherService");
const logger = require("../utils/logger");

// Initialize scheduler
const startScheduler = () => {
  // Run every 3 hours (0:00, 3:00, 6:00, etc.)
  const weatherReportJob = cron.schedule("0 */3 * * *", async () => {
    logger.info("Running scheduled weather report job");
    try {
      await sendWeatherReports();
      logger.info("Weather reports sent successfully");
    } catch (error) {
      logger.error(`Error sending weather reports: ${error.message}`);
    }
  });

  // Start the job
  weatherReportJob.start();
  logger.info("Weather report scheduler started");

  return {
    weatherReportJob,
  };
};

module.exports = {
  startScheduler,
};
