// services/AdminService.js
const Admin = require("../../models/Admin.Model");
const User = require("../../models/User.Model");
const bcrypt = require("bcryptjs");

class AdminService {
  // Create Admin
  async createAdmin(payload) {
  try {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return {
        success: false,
        message: "Email is already in use. Please use a different email.",
      };
    }


    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const adminInformation = new Admin({
      fullName: payload.fullName,
    });
    await adminInformation.save();

    const newUser = new User({
      email: payload.email,
      password: hashedPassword,
      role: "Admin",
      status: 1,
      isProfileComplete: true,
      profile: adminInformation._id,
    });
    await newUser.save();

    return {
      success: true,
      message: "Admin created successfully.",
      data: { email: newUser.email },
    };
  } catch (error) {
    console.error("Error creating admin:", error);
    return { success: false, message: "Failed to create admin.", error };
  }
}


  // Get All or Single Admin
  async getAdmin(adminId = null) {
    try {
      let admins;

      if (adminId) {
        // Find single admin and populate related user fields
        admins = await Admin.findById(adminId).lean();

        if (!admins) {
          return { success: true, data: null, message: "Admin not found." };
        }

        // Find matching user by profile reference
        const user = await User.findOne({ profile: adminId }, "email role status").lean();

        if (user) {
          admins = { ...admins, email: user.email, role: user.role, status: user.status };
        }
      } else {
        // Get all admins and attach corresponding user emails
        const adminList = await Admin.find().lean();
        const userList = await User.find({ role: "Admin" }, "email profile status").lean();

        // Merge email + status into admin objects
        admins = adminList.map(admin => {
          const matchingUser = userList.find(u => u.profile?.toString() === admin._id.toString());
          return {
            ...admin,
            email: matchingUser?.email || null,
            status: matchingUser?.status ?? null,
          };
        });
      }

      return { success: true, data: admins, message: "Admin(s) retrieved successfully." };
    } catch (error) {
      console.error("Error retrieving admin(s):", error);
      return { success: false, message: "Failed to retrieve admin(s).", error };
    }
  }


  // Update Admin
async updateAdmin(adminId, payload) {
  try {
    const { email, fullName, ...rest } = payload;

    // 1️⃣ Update Admin info (like fullName or others)
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { fullName, ...rest },
      { new: true }
    ).lean();

    if (!updatedAdmin) {
      return { success: false, data: null, message: "Admin not found." };
    }

    // 2️⃣ If email provided, check if it's already used by another user
    let updatedUser = null;
    if (email) {
      const existingUser = await User.findOne({
        email,
        profile: { $ne: adminId }, // exclude current admin's user record
      });

      if (existingUser) {
        return {
          success: false,
          message: "Email is already in use by another account.",
        };
      }

      // Update email if not duplicate
      updatedUser = await User.findOneAndUpdate(
        { profile: adminId },
        { email },
        { new: true, projection: "email role status" }
      ).lean();
    } else {
      updatedUser = await User.findOne(
        { profile: adminId },
        "email role status"
      ).lean();
    }

    // 3️⃣ Merge both for response
    const mergedData = {
      ...updatedAdmin,
      email: updatedUser?.email || null,
      role: updatedUser?.role || null,
      status: updatedUser?.status ?? null,
    };

    return {
      success: true,
      data: mergedData,
      message: "Admin updated successfully.",
    };
  } catch (error) {
    console.error("Error updating admin:", error);
    return { success: false, message: "Failed to update admin.", error };
  }
}

  // Delete Admin
async deleteAdmin(adminId) {
  try {

    const totalAdmins = await Admin.countDocuments();

    if (totalAdmins <= 1) {
      return {
        success: false,
        message: "Cannot delete the last remaining admin account.",
      };
    }

    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return { success: false, data: null, message: "Admin not found." };
    }

    await User.findOneAndDelete({ profile: adminId, role: "Admin" });

    return { success: true, message: "Admin deleted successfully." };
  } catch (error) {
    console.error("Error deleting admin:", error);
    return { success: false, message: "Failed to delete admin.", error };
  }
}
}

module.exports = new AdminService();
