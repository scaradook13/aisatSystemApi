const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./config/database_connections");
require("./utils/email/emailQueue");

const authRoutes = require("./routes/Auth/AuthRoute");
const userRoutes = require("./routes/User/UserRoutes");
const adminRoutes = require("./routes/Admin/AdminRoutes");
const managementRoutes = require("./routes/Admin/ManagementRoutes");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173",
      "https://aisatsystemapi.onrender.com"
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", userRoutes);
app.use("/api/v1/", managementRoutes);
app.use("/api/v1/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
