const User = require('../../models/User.Model');
const Student = require('../../models/Student.Model');
const Form = require('../../models/Form.Model');
const Evaluation = require('../../models/Evaluations.Model')
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

  async addEvaluation(payload) {
    try {
      const { studentId, teacher, section, answers, comment } = payload;
  
      if (!studentId || !teacher || !section || !answers) {
        return { success: false, message: "Missing required fields." };
      }

            const user = await User.findById(studentId).populate("profile");

      if (!user) {
        return { success: false, message: "User not found!" };
      }

      if (!user.profile) {
        return { success: false, message: "Student profile not found for this user." };
      }

      const student = user.profile;
      student.teacherEvaluated = student.teacherEvaluated || [];

      if (student) {

        if (student.teacherEvaluated.includes(teacher)) {
          return { success: false, message: "You already evaluated this teacher." };
        }

        student.teacherEvaluated.push(teacher);

        student.updatedAt = new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        await student.save();
      }
  
      const newEvaluation = new Evaluation({
        studentId: studentId,
        teacher,
        section,
        answers: JSON.parse(JSON.stringify(answers)), // ensure plain object
        comment,
      });
  
      await newEvaluation.save();
  
      const activeForm = await Form.findOne({ status: "active" });
      if (activeForm) {
        activeForm.evaluations.push(newEvaluation._id);
        activeForm.updatedAt = new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        await activeForm.save();
      }
  
      return {
        success: true,
        message: "Evaluation added successfully and linked to form and student.",
        data: newEvaluation,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to add evaluation.", error };
    }
  }

async getStudentInfo(userId) {
  try {
    // Fetch the user and populate their student profile
    const user = await User.findById(userId)
      .populate("profile")

    if (!user) {
      return { success: false, message: "User not found." };
    }

    // Optional: If you want a cleaner object (merged user + student data)
    const studentInfo = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      profile: {
        _id: user.profile?._id,
        fullName: user.profile?.fullName,
        section: user.profile?.section,
        studentNumber: user.profile?.studentNumber,
        teacherEvaluated: user.profile?.teacherEvaluated || [],
        updatedAt: user.profile?.updatedAt,
      },
    };

    return { success: true, data: studentInfo };
  } catch (error) {
    console.error("Error fetching student info:", error);
    return { success: false, message: "Failed to fetch student info.", error };
  }
}


}

module.exports = new UserService();
