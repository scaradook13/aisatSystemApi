const User = require("../models/User.Model");
const jwtUtils = require("../utils/jwtUtils");

class AdminAuthMiddleware {
  async verifyToken(req, res, next) {
    try {
      let token = req.cookies.jwt || req.headers.authorization;

      if (!token)
        return res.status(401).json({ message: "No token provided" });

      // If using Bearer token format
      if (token.startsWith("Bearer ")) token = token.split(" ")[1];

      const decoded = jwtUtils.verifyToken(token);
      req.user = decoded;

      next();
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
        return res
          .status(401)
          .json({ message: "Not authenticated — no session token found" });
      }

      // 🔹 2. Optional: for Passport sessions
      if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
      }

      // 🔹 3. Verify token if present
      const decoded = jwtUtils.verifyToken(token);

      // 🔹 4. Find user in the database using the ID from token
      const user = await User.findById(decoded.userId).populate("profile");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user; // attach full user data for later use

      // 🔹 5. Role-based check
      if (user.role !== "Admin") {
        return res
          .status(403)
          .json({ message: "Access denied — for Admin only." });
      }

      // ✅ Proceed if token and role are valid
      return next();
    } catch (err) {
      console.error("Session verification error:", err.message);
      return res
        .status(403)
        .json({ message: "Invalid or expired session token" });
    }
  }
}

module.exports = new AdminAuthMiddleware();