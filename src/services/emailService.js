const { transporter } = require("../config/email");
const logger = require("../utils/logger");

const sendWeatherReportEmail = async (options) => {
  try {
    const { to, subject, city, weatherData, aiDescription } = options;

    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Weather Report</h1>
        <p style="text-align: center; color: #666;">For ${city} - ${date}</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #0066cc; margin-top: 0;">${weatherData.main} (${
      weatherData.description
    })</h2>
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div style="min-width: 150px;">
              <p><strong>Temperature:</strong> ${weatherData.temperature}°C</p>
              <p><strong>Feels Like:</strong> ${weatherData.feelsLike}°C</p>
            </div>
            <div style="min-width: 150px;">
              <p><strong>Humidity:</strong> ${weatherData.humidity}%</p>
              <p><strong>Wind Speed:</strong> ${weatherData.windSpeed} m/s</p>
            </div>
          </div>
        </div>
        
        ${
          aiDescription
            ? `<div style="background-color: #eef6ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #0066cc; margin-top: 0;">AI Weather Analysis</h3>
                <p style="line-height: 1.5;">${aiDescription}</p>
              </div>`
            : ""
        }
        
        <p style="color: #888; text-align: center; margin-top: 30px; font-size: 12px;">
          This is an automated weather report sent every 3 hours. 
          To update your location or preferences, please log in to your account.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Weather Report Service" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    logger.info(`Weather report email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Error sending weather report email: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sendWeatherReportEmail,
};
