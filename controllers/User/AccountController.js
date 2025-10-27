const UserService = require('../../services/User/AccountService');
const AuthService = require('../../services/Auth/AuthService');
const asyncTryCatch = require('../../utils/asyncTryAndCatch');

class UserController {
  getCurrentUser = asyncTryCatch(async (req, res) => {
    if (req.user) {
      return res.status(200).json(req.user);
    }
  });

  createUser = asyncTryCatch(async (req, res, next) => {
    const response = await UserService.createUser(req.body);
    req.email = response.email; // pass data to next middleware
    next();
  });

  verifyUserAccount = asyncTryCatch(async (req, res) => {
    const response = await UserService.verifyUser(req.body);
    if (response === 'Account verified!') return res.status(200).json(response);
    if (response === 'Invalid OTP') return res.status(409).json(response);
    if (response === 'You enter expired OTP') return res.status(409).json(response);
  });

  completeProfile = asyncTryCatch(async (req, res) => {
    const newProfile = await UserService.completeProfile(req.user.userId, req.body);
    res.status(201).json({
      message: "newProfile added",
      content: newProfile,
    });
  });
}

module.exports = new UserController();
