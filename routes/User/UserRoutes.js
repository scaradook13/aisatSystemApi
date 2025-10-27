const express = require("express");
const router = express.Router();
const AccountController = require("../../controllers/User/AccountController");
const authMiddleware = require("../../middlewares/authMiddleware");
const ValidationChecker = require('../../middlewares/ValidationMiddleware')

// Local Account
router.post("/createUser", ValidationChecker.validateRegistration, AccountController.createUser, authMiddleware.sendAndSaveOtp);
router.post("/verifyUser", AccountController.verifyUserAccount);
router.post(
  "/completeProfile",
  authMiddleware.verifySession,
  AccountController.completeProfile
);

module.exports = router;
