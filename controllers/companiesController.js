const connection = require("../db/db");

const addNewCompany = (req, res) => {
  const {
    company_name,
    company_logo,
    company_cover_photo,
    overview,
    industry,
    country,
    city,
    state,
    zip_code,
    website,
    founded_year,
    company_size,
    contact_email,
    contact_phone,
    revenue,
  } = req.body;

  const company_details = [
    [req.user.userId],
    company_name,
    company_logo,
    company_cover_photo,
    overview,
    industry,
    country,
    city,
    state,
    zip_code,
    website,
    founded_year,
    company_size,
    contact_email,
    contact_phone,
    revenue,
  ];

  const checkQuery = "SELECT * FROM companies WHERE company_name = ?";
  connection.query(checkQuery, [company_name], (checkErr, checkResult) => {
    if (checkErr) {
      console.log("checkErr: ", checkErr);
      res.status(500).send("Internal Server Error");
    } else if (checkResult.length > 0) {
      console.log("checkResult: ", checkResult);
      res.status(400).send("Sorry, this company already exists!");
    } else {
      const query =
        "INSERT INTO companies(ceo, company_name, company_logo, company_cover_photo, overview, industry, country, city, state, zip_code, website, founded_year, company_size, contact_email, contact_phone, revenue) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

      connection.query(query, company_details, (err, results, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("results", results);
          console.log("fields", fields);
          res.status(200).send("Company was created successfully");
        }
      });
    }
  });

  return;
};

const updateCompany = (req, res) => {
  const companyId = req.params.id;
  const {
    company_name,
    company_logo,
    company_cover_photo,
    overview,
    industry,
    country,
    city,
    state,
    zip_code,
    website,
    founded_year,
    company_size,
    contact_email,
    contact_phone,
    revenue,
  } = req.body;

  const query =
    "UPDATE companies SET company_name = ?, company_logo = ?, company_cover_photo = ?, overview = ?, industry = ?, country = ?, city = ?, state = ?, zip_code = ?, website = ?, founded_year = ?, company_size = ?, contact_email = ?, contact_phone = ?, revenue = ? WHERE id = ?";

  const newData = [
    company_name,
    company_logo,
    company_cover_photo,
    overview,
    industry,
    country,
    city,
    state,
    zip_code,
    website,
    founded_year,
    company_size,
    contact_email,
    contact_phone,
    revenue,
    companyId,
  ];

  connection.query(query, newData, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Company not found");
    } else {
      res.status(200).send("Company updated successfully");
    }
  });
};

const deleteCompany = (req, res) => {
  const companyId = req.params.id;

  const query = "DELETE FROM companies WHERE id = ?";
  connection.query(query, companyId, (err, result) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Company not found");
    } else {
      res.status(200).send("Company deleted successfully");
    }
  });
};

const getAllCompanies = (req, res) => {
  connection.query(
    "SELECT * FROM `companies`",
    function (err, results, fields) {
      res.send(results);
    }
  );
};

const getAllCompaniesByIndustry = (req, res) => {
  const { id: industryId } = req.params;
  console.log("industryId", industryId);
  connection.query(
    `SELECT c.company_name, i.industry_name FROM companies AS c JOIN industries AS i ON c.industry = i.id WHERE c.industry = ${industryId};`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).json(results);
      }
    }
  );
};

module.exports = {
  addNewCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  getAllCompaniesByIndustry,
};
