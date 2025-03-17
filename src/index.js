require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const scheduler = require("./config/scheduler");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

connectDB();

scheduler.startScheduler();

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Error: ${err.message}`);

  process.exit(1);
});
