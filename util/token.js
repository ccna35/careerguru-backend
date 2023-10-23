const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = async function (user) {
  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return token;
};

// Verify JWT token
const verifyToken = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
};

module.exports = { generateToken, verifyToken };
