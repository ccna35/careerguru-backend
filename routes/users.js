const express = require("express");
const { getAllUsers, addNewUser } = require("../controllers/usersController");
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

// Get all users
router.get("/", getAllUsers);

// Add new user
router.post("/", addNewUser);

module.exports = router;
