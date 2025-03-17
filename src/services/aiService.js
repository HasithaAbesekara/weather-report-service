const OpenAI = require("openai");
const logger = require("../utils/logger");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateAIWeatherDescription = async (weatherData, city) => {
  try {
    const prompt = `
      Generate a brief, informative, and engaging weather report for ${city}. 
      Current conditions:
      - Weather: ${weatherData.main} (${weatherData.description})
      - Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
      - Humidity: ${weatherData.humidity}%
      - Wind Speed: ${weatherData.windSpeed} m/s
      
      Please provide insights on how this weather might affect daily activities, 
      what to expect in the coming hours, and any relevant recommendations. 
      Keep it under 150 words and make it sound natural and helpful.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const description = response.choices[0].message.content.trim();

    logger.info(`AI weather description generated for ${city}`);
    return description;
  } catch (error) {
    logger.error(`Error generating AI weather description: ${error.message}`);

    return `Current weather in ${city}: ${weatherData.main} (${weatherData.description}) with a temperature of ${weatherData.temperature}°C, feeling like ${weatherData.feelsLike}°C. Humidity is at ${weatherData.humidity}% with wind speeds of ${weatherData.windSpeed} m/s.`;
  }
};

module.exports = {
  generateAIWeatherDescription,
};
