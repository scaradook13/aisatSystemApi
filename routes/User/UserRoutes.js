const express = require("express");
const router = express.Router();
const AccountController = require("../../controllers/User/AccountController");
const authMiddleware = require("../../middlewares/authMiddleware");
const ValidationChecker = require('../../middlewares/ValidationMiddleware')

// Local Account
router.post("/createUser", ValidationChecker.validateRegistration, AccountController.createUser, authMiddleware.sendAndSaveOtp);
router.post("/verifyUser", AccountController.verifyUserAccount);
router.post("/addEvaluation", authMiddleware.verifySession, AccountController.addEvaluation);
router.get("/getStudentInfo", authMiddleware.verifySession, AccountController.getStudentInfo);
module.exports = router;
