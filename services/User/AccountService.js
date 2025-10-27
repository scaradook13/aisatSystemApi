const User = require("../../models/User.Model");
const Student = require("../../models/Student.Model");
const Otp = require("../../models/OTP.Model");
const bcrypt = require("bcryptjs");

class UserService {
  async createUser(payload) {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = new User({
      email: payload.email,
      password: hashedPassword,
      role: 'Student',
    });

    const studentInformation = new Student({
      studentNumber: payload.studentNumber
    });

   
    await Promise.all([newUser.save(), studentInformation.save()]);

    // Update the user profile with the customer information
    newUser.profile = studentInformation._id;
    await newUser.save();
    return { email: newUser.email };
  }

  async verifyUser(payload) {
    const foundUser = await Otp.findOne({ userEmail: payload.email });
    if (!foundUser) return 'You enter expired OTP'
    if (foundUser?.otp === payload.otp) {
      const result = await User.updateOne({
        email: payload.email
      }, { $set: { status: 1 } })
      if (result.matchedCount > 0 && result.modifiedCount) return 'Account verified!'
    } return 'Invalid OTP'

  }

  async completeProfile(id, payload) {
    const userInfo = await User.findOne({ _id: id }).exec();

    await Student.updateOne({ _id: userInfo.profile },
      {
        $set: {
          fullName: payload.fullName,
          section: payload.section,
        },
      }
    );

    userInfo.isProfileComplete = true;

    await userInfo.save();
  }


}

module.exports = new UserService();
