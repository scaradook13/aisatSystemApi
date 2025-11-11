const AdminService = require('../../services/Admin/AdminService');
const asyncTryCatch = require('../../utils/asyncTryAndCatch');

class AdminController {
  // Create new admin
  createAdmin = asyncTryCatch(async (req, res) => {
    const result = await AdminService.createAdmin(req.body);
    res.status(result.success ? 201 : 400).json(result);
  });

  // Get all admins or single admin by ID
  getAdmin = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await AdminService.getAdmin(id || null);
    res.status(result.success ? 200 : 400).json(result);
  });

  // Update admin
  updateAdmin = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Admin ID is required." });
    }

    const result = await AdminService.updateAdmin(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  });

  // Delete admin
  deleteAdmin = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Admin ID is required." });
    }

    const result = await AdminService.deleteAdmin(id);
    res.status(result.success ? 200 : 400).json(result);
  });
}

module.exports = new AdminController();
