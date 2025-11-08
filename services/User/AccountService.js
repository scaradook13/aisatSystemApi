const User = require('../../models/User.Model');
const Student = require('../../models/Student.Model');
const Form = require('../../models/Form.Model');
const Evaluation = require('../../models/Evaluations.Model')
const Otp = require("../../models/OTP.Model");
const EnrolledStudent = require("../../models/EnrolledStudent.Model")
const bcrypt = require("bcryptjs");

class UserService {

  async createUserRequest(payload) {
  const { email, studentNumber, firstName, lastName, middleName } = payload;

  const enrolled = await EnrolledStudent.findOne({
    studentNumber,
    firstName: { $regex: new RegExp(`^${firstName}$`, "i") },
    lastName: { $regex: new RegExp(`^${lastName}$`, "i") },
    middleName: { $regex: new RegExp(`^${middleName || ""}$`, "i") },
  });

  if (!enrolled) {
    return { success: false, message: "Invalid credentials. Student not found in records." };
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { success: false, message: "Email already registered" };
  }

  const usedStudent = await Student.findOne({ studentNumber });
  if (usedStudent) {
    return {
      success: false,
      message: "Student account already created. Student number is already used."
    };
  }

  return {
    success: true,
    email,
    message: "Student found. Proceed to OTP verification."
  };
}


async verifyUserAndCreate(payload) {
  const { otp, email, password, studentNumber, firstName, lastName, middleName } = payload;

  const foundUser = await Otp.findOne({ userEmail: email });
  if (!foundUser) {
    return { success: false, message: "OTP expired or not found" };
  }

  if (foundUser.otp !== otp) {
    return { success: false, message: "Invalid OTP" };
  }

  const enrolled = await EnrolledStudent.findOne({
    studentNumber,
    firstName: { $regex: new RegExp(`^${firstName}$`, "i") },
    lastName: { $regex: new RegExp(`^${lastName}$`, "i") },
    middleName: { $regex: new RegExp(`^${middleName || ""}$`, "i") },
  });

  if (!enrolled) {
    return { success: false, message: "Student record mismatch" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = new Student({
    fullName: `${enrolled.firstName} ${enrolled.middleName || ""} ${enrolled.lastName}`.trim(),
    studentNumber: enrolled.studentNumber,
    section: enrolled.section,
  });

  const user = new User({
    email,
    password: hashedPassword,
    role: "Student",
    profile: student._id,
  });

  await student.save();
  await user.save();

  await Otp.deleteOne({ userEmail: email });

  return { success: true, message: "Account created successfully!" };
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
