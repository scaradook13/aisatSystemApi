const express = require('express');
const AuthController = require('../../controllers/Auth/AuthController');
const AuthMiddleware = require('../../middlewares/authMiddleware');
const ValidationChecker = require('../../middlewares/ValidationMiddleware');
const AccountController = require('../../controllers/User/AccountController');
const admin = require("../../utils/firebase");

const router = express.Router();

// ==============================
// Local Account Auth Routes
// ==============================
router.post("/login", ValidationChecker.validateLogin, AuthController.login);
router.post("/resendVerification", AuthController.resendVerificationCode);
router.post("/requestForgotPassword", AuthController.requestForgotPassword);
router.post("/verifyForgotPassword", AuthController.verifyForgotPassword);

// Get current user - test route
router.get('/auth/user', AuthMiddleware.verifySession, AuthController.getCurrentUser);

// Logout
router.get('/auth/logout', AuthController.logout);

// Simple ping test
router.get("/ping", (req, res) => {
  res.status(200).json({ success: true, message: "API connected" });
});

// routes/auth.js
router.post("/google", AuthController.googleLogin);


module.exports = router;
