const connection = require("../db/db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../util/token");
require("dotenv").config();

const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    country,
    city,
    state,
    zip_code,
    current_company,
    phone_number,
    job_title,
    profile_photo,
    cover_photo,
  } = req.body;

  const checkQuery = "SELECT * FROM users WHERE email = ? OR username = ?";
  connection.query(checkQuery, [email, username], (checkErr, checkResult) => {
    if (checkErr) {
      res.status(500).send("Internal Server Error");
    } else if (checkResult.length > 0) {
      console.log("User with this email or username already exists");
      res.status(400).send("User with this email or username already exists");
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = [
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
        country,
        city,
        state,
        zip_code,
        current_company,
        phone_number,
        job_title,
        profile_photo,
        cover_photo,
      ];
      const query = `INSERT INTO users(firstName,
      lastName,
      email,
      username,
      user_password,
      country,
      city,
      state,
      zip_code,
      current_company,
      phone_number,
      job_title,
      profile_photo,
      cover_photo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      connection.query(query, user, async (insertErr, insertResult) => {
        if (insertErr) {
          console.log(insertErr);
          res.status(500).send("Internal Server Error");
        } else {
          console.log(insertResult);

          const token = await generateToken(user);

          res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
            sameSite: "none", // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          res.status(200).send("User signed up successfully");
        }
      });
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], (err, result) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    }
    if (result.length === 0) {
      res.status(401).send("User not found");
    } else {
      const user = result[0];
      bcrypt.compare(password, user.user_password, async (err, isMatch) => {
        if (err) {
          throw err;
        }
        if (isMatch) {
          const token = await generateToken(user);

          res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          res.status(200).send("Login Successful");
        } else {
          res.status(401).send("Invalid credentials");
        }
      });
    }
  });
};

const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).send("User logged out successfully");
};

const updateUser = (req, res) => {
  const userId = req.params.id;
  const {
    firstName,
    lastName,
    country,
    city,
    state,
    zip_code,
    current_company,
    phone_number,
    job_title,
    profile_photo,
    cover_photo,
  } = req.body;

  const query =
    "UPDATE users SET firstName = ?, lastName = ?, country = ?, city = ?, state = ?, zip_code = ?, current_company = ?, phone_number = ?, job_title = ?, profile_photo = ?, cover_photo = ? WHERE id = ?";

  const newData = [
    firstName,
    lastName,
    country,
    city,
    state,
    zip_code,
    current_company,
    phone_number,
    job_title,
    profile_photo,
    cover_photo,
    userId,
  ];

  connection.query(query, newData, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else if (result.affectedRows === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User updated successfully");
    }
  });
};

const getAllUsers = (req, res) => {
  connection.query(
    "SELECT id, firstName, lastName, email, username, join_date FROM `users`",
    (err, results) => {
      if (err) {
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).json(results);
      }
    }
  );
};

const getOneUser = (req, res) => {
  const { id: userId } = req.params;

  const query =
    "SELECT id, firstName, lastName, email, username, join_date FROM `users` WHERE id = ?";

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(results);
    }
  });
};

const addUserSkill = (req, res) => {
  const userId = req.user.userId;
  const { skill } = req.body;

  const insertQuery = "INSERT INTO user_skill (user_id, skill_id) VALUES ?";
  const values = [[userId, skill]];

  connection.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send("Skill added successfully");
    }
  });
};

const deleteUserSkill = (req, res) => {
  const userId = req.user.userId;
  const { skill_id } = req.body;

  const deleteQuery =
    "DELETE FROM user_skill WHERE user_id = ? AND skill_id = ?";
  connection.query(deleteQuery, [userId, skill_id], (err, result) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else if (result.affectedRows === 0) {
      res.status(404).send("User skill not found");
    } else {
      res.status(200).send("User skill deleted successfully");
    }
  });
};

module.exports = {
  login,
  signup,
  logout,
  updateUser,
  getAllUsers,
  getOneUser,
  addUserSkill,
  deleteUserSkill,
};
