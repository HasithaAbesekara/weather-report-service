Weather Report Service
A Node.js API that stores users' emails and locations, and automatically sends hourly weather reports every 3 hours.
Features

User registration and authentication
Store user locations with coordinates and city names
Fetch weather data from OpenWeatherMap API
Generate AI-enhanced weather descriptions using OpenAI API
Send automated weather reports by email every 3 hours
API to retrieve weather history data
Google Maps Geocoding integration for converting coordinates to city names

Tech Stack

Node.js and Express
MongoDB with Mongoose
JWT Authentication
OpenWeatherMap API for weather data
Google Maps API for geocoding
OpenAI API for generating weather descriptions
Nodemailer for sending emails
Node-cron for scheduling tasks
Vercel for deployment

API Routes
User Routes

POST /api/users/register - Register a new user
POST /api/users/login - Login user
GET /api/users/me - Get current user (protected)
PUT /api/users/location - Update user location (protected)

Weather Routes

GET /api/weather/current - Get current weather for user's location (protected)
GET /api/weather/history - Get weather history for a specific date or date range (protected)
POST /api/weather/report - Manually trigger a weather report (protected)

Getting Started
Prerequisites

Node.js (v18 or later)
MongoDB
API keys for:

OpenWeatherMap
Google Maps
OpenAI or Gemini
