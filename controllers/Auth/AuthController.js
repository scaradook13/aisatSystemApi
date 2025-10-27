const AuthService = require('../../services/Auth/AuthService');
const asyncTryCatch = require('../../utils/asyncTryAndCatch');

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
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });

  logout = asyncTryCatch(async (req, res) => {
    req.logout((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: 'Logout successful' });
    });
  });

}

module.exports = new AuthController();
