const mongoose = require("mongoose");

const WeatherDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  location: {
    city: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },
  },
  weather: {
    temperature: {
      type: Number,
      required: true,
    },
    feelsLike: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    pressure: {
      type: Number,
      required: true,
    },
    windSpeed: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    main: {
      type: String,
      required: true,
    },
  },
  aiDescription: {
    type: String,
    default: "",
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
  emailSentAt: {
    type: Date,
  },
});

// Create compound index for user and date to query efficiently
WeatherDataSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("WeatherData", WeatherDataSchema);
