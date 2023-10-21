const connection = require("../db/db");
const bcrypt = require("bcrypt");

const getAllUsers = (req, res) => {
  // simple query
  connection.query(
    "SELECT id, firstName, lastName, email, username, createdAt FROM `users`",
    function (err, results, fields) {
      res.send(results);
    }
  );
};

const addNewUser = async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  // simple query
  connection.query(
    `INSERT INTO users(firstName, lastName, email, username, password) VALUES(?, ?, ?, ?, ?);`,
    [firstName, lastName, email, username, hashedPassword],
    function (err, results, fields) {
      res.send(results);
    }
  );
};

module.exports = { getAllUsers, addNewUser };
