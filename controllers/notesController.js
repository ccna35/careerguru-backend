const connection = require("../db/db");

const getAllNotes = (req, res) => {
  // simple query
  connection.query("SELECT * FROM `notes`", function (err, results, fields) {
    res.send(results);
  });
};

const addNewNote = (req, res) => {
  const { user_id, note_title, note_body } = req.body;
  // simple query
  connection.query(
    `INSERT INTO notes(user_id, note_title, note_body) VALUES(?, ?, ?);`,
    [user_id, note_title, note_body],
    function (err, results, fields) {
      res.send(results);
    }
  );
};

module.exports = { getAllNotes, addNewNote };
