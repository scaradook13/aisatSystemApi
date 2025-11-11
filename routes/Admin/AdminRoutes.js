const express = require("express");
const router = express.Router();
const AdminController = require("../../controllers/Admin/AdminController");

// Local Account
router.post("/createAdmin", AdminController.createAdmin);
module.exports = router;