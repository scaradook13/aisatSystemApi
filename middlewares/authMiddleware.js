const jwtUtils = require("../utils/jwtUtils");
const generateOtp = require("../utils/email/generateOtp");
const User = require("../models/User.Model")
const Otp = require("../models/OTP.Model");
const emailQueue = require("../utils/email/emailQueue");
const bcrypt = require("bcryptjs");

class AuthMiddleware {
  // ✅ Verify Bearer or Cookie Token
  async verifyToken(req, res, next) {
    try {
      let token = req.cookies.jwt || req.headers.authorization;

      if (!token)
        return res.status(401).json({ message: "No token provided" });

      // If using Bearer token format
      if (token.startsWith("Bearer ")) token = token.split(" ")[1];

      const decoded = jwtUtils.verifyToken(token);
      req.user = decoded; // ✅ attach decoded user data for later use
      next(); // ✅ move on to next middleware
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  }

  // ✅ Verify Session (for both Passport sessions or manual JWT)
 async verifySession(req, res, next) {
  try {
    const token = req.cookies?.jwt;

    // 🔹 1. No token at all
    if (!token) {
      return res.status(401).json({ message: "Not authenticated — no session token found" });
    }

    // 🔹 2. Optional: for Passport sessions
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }

    // 🔹 3. Verify token if present
    const decoded = jwtUtils.verifyToken(token);
    req.user = decoded;

    // ✅ Proceed if token is valid
    return next();

  } catch (err) {
    // 🔹 4. Handle invalid or expired token
    console.error("Session verification error:", err.message);
    return res.status(403).json({ message: "Invalid or expired session token" });
  }
}


  // ✅ Generate OTP and send email
  async sendAndSaveOtp(req, res) {
    try {
      const generatedOTP = generateOtp(6);

      const newOTP = new Otp({
        userEmail: req.email,
        otp: generatedOTP,
        createdAt: Date.now(),
      });

      // Save OTP and queue email simultaneously
      await Promise.all([
        newOTP.save(),
        emailQueue.add("sendEmail", {
          email: req.email,
          subject: "Account Verification",
          templatePath: "OTP", // points to utils/email/template/OTP.handlebars
          templateData: {
            email: req.email,
            otp: generatedOTP,
          },
        }),
      ]);

      return res
        .status(201)
        .json({ message: "A 6-digit OTP has been sent to your email" });
    } catch (error) {
      console.error("Error in sendAndSaveOtp:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async resendVerificationCode({ email }) {
    try {
      if (!email) {
        return { success: false, message: "Email is required." };
      }

      await Otp.deleteMany({ userEmail: email });

      const generatedOTP = generateOtp(6);

      const newOTP = new Otp({
        userEmail: email,
        otp: generatedOTP,
        createdAt: Date.now(),
      });

      await Promise.all([
        newOTP.save(),
        emailQueue.add("sendEmail", {
          email,
          subject: "Account Verification (Resend)",
          templatePath: "OTP",
          templateData: { email, otp: generatedOTP },
        }),
      ]);

      return {
        success: true,
        message: "A new 6-digit verification code has been sent to your email.",
      };
    } catch (error) {
      console.error("Error in resendVerificationCode:", error);
      return {
        success: false,
        message: "Failed to resend verification code.",
        error: error.message,
      };
    }
  }

  async requestForgotPassword(payload) {
  const { email } = payload;

  if (!email) {
    return { success: false, message: "Email is required." };
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return { success: false, message: "No account found with this email." };
  }

  // Delete any existing OTPs for this email
  await Otp.deleteMany({ userEmail: email });

  // Generate new OTP
  const generatedOTP = generateOtp(6);

  const newOTP = new Otp({
    userEmail: email,
    otp: generatedOTP,
    createdAt: Date.now(),
  });

  // Save and queue email
  await Promise.all([
    newOTP.save(),
    emailQueue.add("sendEmail", {
      email,
      subject: "Password Reset Request",
      templatePath: "OTP",
      templateData: {
        email,
        otp: generatedOTP,
      },
    }),
  ]);

  return {
    success: true,
    message: "A password reset code has been sent to your email.",
  };
}

async verifyForgotPassword(payload) {
  const { email, otp, newPassword, confirmPassword } = payload;

  if (!email || !otp || !newPassword || !confirmPassword) {
    return { success: false, message: "All fields are required." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Passwords do not match." };
  }

  // Find OTP
  const foundOTP = await Otp.findOne({ userEmail: email });
  if (!foundOTP) {
    return { success: false, message: "OTP expired or not found." };
  }

  // Check OTP match
  if (foundOTP.otp !== otp) {
    return { success: false, message: "Invalid OTP." };
  }

  // Find user and update password
  const user = await User.findOne({ email });
  if (!user) {
    return { success: false, message: "User not found." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  // Delete OTP after success
  await Otp.deleteOne({ userEmail: email });

  return { success: true, message: "Password has been reset successfully." };
}

}

module.exports = new AuthMiddleware();
