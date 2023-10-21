const express = require("express");
const { getAllNotes, addNewNote } = require("../controllers/notesController");
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

// define the home page route
router.get("/", getAllNotes);

// define the about route
router.post("/", addNewNote);

module.exports = router;
