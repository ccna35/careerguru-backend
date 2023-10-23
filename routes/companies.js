const express = require("express");
const router = express.Router();
const { verifyToken } = require("../util/token");

const {
  getAllCompanies,
  addNewCompany,
  updateCompany,
  deleteCompany,
  getAllCompaniesByIndustry,
} = require("../controllers/companiesController");

// Get all companies
router.get("/", getAllCompanies);

// Get companies by industry
router.get("/:id", getAllCompaniesByIndustry);

// Middleware
router.use(verifyToken);

// Add new company
router.post("/", addNewCompany);

// Update a company
router.put("/:id", updateCompany);

// Delete company route
router.delete("/:id", deleteCompany);

module.exports = router;
