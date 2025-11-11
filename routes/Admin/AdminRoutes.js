const express = require("express");
const router = express.Router();
const AdminController = require("../../controllers/Admin/AdminController");

// Create Admin
router.post("/createAdmin", AdminController.createAdmin);

// Get all or single Admin
router.get("/getAllAdmin", AdminController.getAdmin); // get all
router.get("/getAllAdmin/:adminId", AdminController.getAdmin); // get by ID

// Update Admin (use PATCH, not PUT)
router.patch("/updateAdmin/:id", AdminController.updateAdmin);

// Delete Admin
router.delete("/deleteAdmin/:id", AdminController.deleteAdmin);

module.exports = router;
