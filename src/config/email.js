const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use app password for Gmail
  },
});

// Verify transporter
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    logger.info("Email transporter is ready to send messages");
    return true;
  } catch (error) {
    logger.error(`Email transporter error: ${error.message}`);
    return false;
  }
};

module.exports = {
  transporter,
  verifyTransporter,
};
