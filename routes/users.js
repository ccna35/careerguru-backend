const express = require("express");
const {
  getAllUsers,
  signup,
  login,
  updateUser,
  addUserSkill,
  logout,
  deleteUserSkill,
  getOneUser,
} = require("../controllers/usersController");
const { verifyToken } = require("../util/token");
const router = express.Router();

// Get a single user
router.get("/:id", getOneUser);

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Logout route
router.get("/logout", logout);

// Middleware
router.use(verifyToken);

// Get all users
router.get("/", getAllUsers);

// Update user route
router.put("/:id", updateUser);

// Route to handle user skills
router.post("/skills", addUserSkill);

// Route to delete a user's skill
router.delete("/skills", deleteUserSkill);

module.exports = router;
