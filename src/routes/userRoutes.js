const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateLocation,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const {
  validateUserRegistration,
  validateUserLogin,
  validateLocationUpdate,
} = require("../middleware/validate");

const router = express.Router();

// Public routes
router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.put("/location", protect, validateLocationUpdate, updateLocation);

module.exports = router;
