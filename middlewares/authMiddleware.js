const jwtUtils = require("../utils/jwtUtils");
const generateOtp = require("../utils/email/generateOtp");
const Otp = require("../models/OTP.Model");
const emailQueue = require("../utils/email/emailQueue");

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
}

module.exports = new AuthMiddleware();
