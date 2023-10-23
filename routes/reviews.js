const express = require("express");
const {
  getAllReviews,
  addNewReview,
} = require("../controllers/reviewsController");
const router = express.Router();

// Get all users
router.get("/", getAllReviews);

// Add new user
router.post("/", addNewReview);

module.exports = router;
