const AdminService = require('../../services/Admin/AdminService');
const asyncTryCatch = require('../../utils/asyncTryAndCatch');

class AdminController {
  createAdmin = asyncTryCatch(async (req, res) => {
    const token = await AdminService.createAdmin(req.body);
    return res.status(200).json('Create Admin Successful!');
  });

}

module.exports = new AdminController();
