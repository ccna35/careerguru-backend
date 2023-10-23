const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const usersRoute = require("./routes/users");
const companiesRoute = require("./routes/companies");
const adsRoute = require("./routes/ads");
const reviewsRoute = require("./routes/reviews");
const port = process.env.PORT || 3000;
require("dotenv").config();

// Create an instance of express app
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", usersRoute);
app.use("/api/companies", companiesRoute);
app.use("/api/ads", adsRoute);
app.use("/api/reviews", reviewsRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
