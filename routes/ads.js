const express = require("express");
const {
  getAllAds,
  addNewAd,
  getAllAdsByUser,
  getSingleAd,
} = require("../controllers/adsController");
const { verifyToken } = require("../util/token");
const router = express.Router();

// Middleware
router.use(verifyToken);

// Get all ads
router.get("/", getAllAds);

// Get all ads by a single user
router.get("/user", getAllAdsByUser);

// Get a single ad
router.get("/:id", getSingleAd);

// Add new user
router.post("/", addNewAd);

module.exports = router;
