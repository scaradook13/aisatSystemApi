const express = require('express');;
const AuthController = require('../../controllers/Auth/AuthController');
const AuthMiddleware = require('../../middlewares/authMiddleware')
const ValidationChecker = require('../../middlewares/ValidationMiddleware')
const AccountController = require('../../controllers/User/AccountController')
const router = express.Router();

// Local account auth routes
router.post("/login", ValidationChecker.validateLogin, AuthController.login);



// Get current user- test route
router.get('/auth/user', AuthMiddleware.verifySession, AccountController.getCurrentUser);

// Logout
router.get('/auth/logout', AuthController.logout);

module.exports = router;
