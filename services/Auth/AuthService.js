const jwtUtils = require("../../utils/jwtUtils");
const User = require('../../models/User.Model')
const admin = require("firebase-admin");
const Student = require('../../models/Student.Model');
const EnrolledStudent  = require('../../models/EnrolledStudent.Model')
class AuthService {
    async loginLocal(userId) {
        return jwtUtils.generateToken(userId)
    }

    async googleLogin({ idToken }) {
    try {
      if (!idToken) {
        return { success: false, message: "Missing Google ID token." };
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { email } = decodedToken;

      if (!email) {
        return { success: false, message: "Google account has no email." };
      }

      let user = await User.findOne({ email });


      if (user) {
        const token = jwtUtils.generateToken(user._id);

        return {
          success: true,
          message: "Google login successful",
          token,
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            authProvider: user.authProvider,
          },
        };
      }

      const enrolledRecord = await EnrolledStudent.findOne({ studentEmail: email });

      if (!enrolledRecord) {
        return {
          success: false,
          message:
            "Your email is not found in the enrolled student list. Please use your school email or contact admin.",
          status: 403,
        };
      }

      const newUser = new User({
        email,
        role: "Student",
        authProvider: "firebase",
        isProfileComplete: true,
      });

      await newUser.save();

      const fullName = `${enrolledRecord.firstName} ${enrolledRecord.middleName} ${enrolledRecord.lastName}`.trim();

      const newStudent = new Student({
        fullName,
        studentNumber: enrolledRecord.studentNumber,
        section: enrolledRecord.section,
      });

      await newStudent.save();

      newUser.profile = newStudent._id;
      await newUser.save();

      const token = jwtUtils.generateToken(newUser._id);

      return {
        success: true,
        message: "Google login successful",
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          authProvider: newUser.authProvider,
        },
      };
    } catch (error) {
      console.error("Google login failed:", error);
      return { success: false, message: "Invalid or expired Google token", status: 401 };
    }
  }
}

module.exports = new AuthService();
