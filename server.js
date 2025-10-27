const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./config/database_connections");
require("./utils/email/emailQueue");

const authRoutes = require("./routes/Auth/AuthRoute");
const userRoutes = require("./routes/User/UserRoutes");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(morgan("dev"));

// ✅ Routes
app.use("/api/v1/", authRoutes);
app.use("/api/v1/", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
