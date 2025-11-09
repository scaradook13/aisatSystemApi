const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
require("./config/database_connections");
require("./utils/email/emailQueue");

const authRoutes = require("./routes/Auth/AuthRoute");
const userRoutes = require("./routes/User/UserRoutes");
const adminRoutes = require("./routes/Admin/AdminRoutes");
const managementRoutes = require("./routes/Admin/ManagementRoutes");

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://aisat-system-client.vercel.app"
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", userRoutes);
app.use("/api/v1/", managementRoutes);
app.use("/api/v1/admin", adminRoutes);

// ✅ Export only the app itself
module.exports = app;
