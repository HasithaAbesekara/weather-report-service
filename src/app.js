const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./utils/errorHandler");
const userRoutes = require("./routes/userRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/weather", weatherRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Cron job endpoint for Vercel
app.get("/api/cron/weather-reports", async (req, res) => {
  try {
    // This endpoint will be called by Vercel cron
    const { sendWeatherReports } = require("./services/weatherService");
    await sendWeatherReports();
    res
      .status(200)
      .json({ success: true, message: "Weather reports sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
