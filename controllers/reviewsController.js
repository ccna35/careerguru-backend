const connection = require("../db/db");

const addNewReview = (req, res) => {
  const { user_id, company_id, rating, review_title, review_body } = req.body;
  connection.query(
    `INSERT INTO reviews(user_id, company_id, rating, review_title, review_body) VALUES(?, ?, ?, ?, ?);`,
    [user_id, company_id, rating, review_title, review_body],
    function (err, results, fields) {
      res.send(results);
    }
  );
};

const getAllReviews = (req, res) => {
  connection.query("SELECT * FROM `reviews`", function (err, results, fields) {
    res.send(results);
  });
};

module.exports = { addNewReview, getAllReviews };
