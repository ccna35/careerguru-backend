const connection = require("../db/db");

const addNewAd = (req, res) => {
  const {
    company_id,
    salary,
    job_type,
    job_location,
    skills,
    job_summary,
    responsibilities,
    requirements,
    job_title,
  } = req.body;

  const { userId } = req.user;

  console.log(userId);

  const ad_details = [
    userId,
    company_id,
    salary,
    job_type,
    job_location,
    job_summary,
    responsibilities,
    requirements,
    job_title,
  ];

  const query = `INSERT INTO ads(user_id, company_id,
    salary,
    job_type,
    job_location,
    job_summary,
    responsibilities,
    requirements,
    job_title) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  connection.query(query, ad_details, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("results", results);

      const ad_id = results.insertId;

      const ad_skills = skills.map((skill) => [ad_id, skill]);

      const query = "INSERT INTO ad_skill(ad_id, skill_id) VALUES ?";

      connection.query(query, [ad_skills], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("results", results);
          res.status(200).send("Ad was created successfully");
        }
      });
    }
  });
};

const getAllAds = (req, res) => {
  const query = `SELECT a.id, c.company_name, a.salary, a.post_date, a.job_summary, a.responsibilities, a.requirements, a.job_title, a.user_id, GROUP_CONCAT(ss.skill_name SEPARATOR ', ') AS ad_skills, jt.job_type, jl.job_location
FROM ads AS a
JOIN ad_skill AS s ON a.id = s.ad_id
JOIN skills AS ss ON s.skill_id = ss.id
JOIN job_type AS jt ON a.job_type = jt.id
JOIN job_location AS jl ON a.job_location = jl.id
JOIN companies AS c ON a.company_id = c.id
GROUP BY a.id;`;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(results);
    }
  });
};

const getAllAdsByUser = (req, res) => {
  const { userId } = req.user;

  const query = `SELECT a.id, c.company_name, a.salary, a.post_date, a.job_summary, a.responsibilities, a.requirements, a.job_title, a.user_id, GROUP_CONCAT(ss.skill_name SEPARATOR ', ') AS ad_skills, jt.job_type, jl.job_location
FROM ads AS a
JOIN ad_skill AS s ON a.id = s.ad_id
JOIN skills AS ss ON s.skill_id = ss.id
JOIN job_type AS jt ON a.job_type = jt.id
JOIN job_location AS jl ON a.job_location = jl.id
JOIN companies AS c ON a.company_id = c.id
WHERE a.user_id = ?
GROUP BY a.id;`;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(results);
    }
  });
};

const getSingleAd = (req, res) => {
  const { id } = req.params;

  const query = `SELECT a.id, c.company_name, a.salary, a.post_date, a.job_summary, a.responsibilities, a.requirements, a.job_title, a.user_id, GROUP_CONCAT(ss.skill_name SEPARATOR ', ') AS ad_skills, jt.job_type, jl.job_location
FROM ads AS a
JOIN ad_skill AS s ON a.id = s.ad_id
JOIN skills AS ss ON s.skill_id = ss.id
JOIN job_type AS jt ON a.job_type = jt.id
JOIN job_location AS jl ON a.job_location = jl.id
JOIN companies AS c ON a.company_id = c.id
WHERE a.id = ?
GROUP BY a.id;`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(results);
    }
  });
};

module.exports = { addNewAd, getAllAds, getAllAdsByUser, getSingleAd };
