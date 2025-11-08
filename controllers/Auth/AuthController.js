const User = require('../../models/User.Model');
const AuthService = require('../../services/Auth/AuthService');
const asyncTryCatch = require('../../utils/asyncTryAndCatch');
const authMiddleware = require('../../middlewares/authMiddleware')

class AuthController {
  login = asyncTryCatch(async (req, res) => {
    const token = await AuthService.loginLocal(req.id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json('Login Successful!');
  });

  getCurrentUser = asyncTryCatch(async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const userFound = await User.findById(req.user.userId)
    .populate("profile")
    .lean();

  if (!userFound) {
    return res.status(404).json({ message: "User not found" });
  }

  delete userFound.password;
  return res.status(200).json(userFound);
});



  logout = asyncTryCatch(async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.status(200).json({ message: "Logout successful" });
});

resendVerificationCode = asyncTryCatch(async (req, res) => {
    const { email } = req.body;
    const result = await authMiddleware.resendVerificationCode({ email });
    return res.status(result.success ? 200 : 400).json(result);
  });

requestForgotPassword = asyncTryCatch(async (req, res) => {
  const result = await authMiddleware.requestForgotPassword(req.body);
  return res.status(result.success ? 200 : 400).json(result);
});

verifyForgotPassword = asyncTryCatch(async (req, res) => {
  const result = await authMiddleware.verifyForgotPassword(req.body);
  return res.status(result.success ? 200 : 400).json(result);
});

}

module.exports = new AuthController();
