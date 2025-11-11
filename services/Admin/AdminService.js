// services/AdminService.js
const Admin = require("../../models/Admin.Model");
const User = require("../../models/User.Model");
const bcrypt = require("bcryptjs");

class AdminService {
  async createAdmin(payload) {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = new User({
      email: payload.email,
      password: hashedPassword,
      role: 'Admin',
      status: 1,
      isProfileComplete: true,
    });

    const adminInformation = new Admin({
      fullName: payload.fullName
    });

   
    await Promise.all([newUser.save(), adminInformation.save()]);

    // Update the user profile with the customer information
    newUser.profile = adminInformation._id;
    await newUser.save();
    return { email: newUser.email };
  }

}

module.exports = new AdminService();