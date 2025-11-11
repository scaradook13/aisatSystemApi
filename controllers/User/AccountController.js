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
  const response = await UserService.createUserRequest(req.body);

  if (!response.success) {
    return res.status(400).json(response);
  }

  req.email = response.email;
  next();
});


  verifyUserAccount = asyncTryCatch(async (req, res) => {
    const response = await UserService.verifyUserAndCreate(req.body);

    if (!response.success) {
      return res.status(400).json(response);
    }

    return res.status(200).json(response);
  });

  // ===================== EVALUATION =====================
addEvaluation = asyncTryCatch(async (req, res) => {
  const newEvaluation = await UserService.addEvaluation(req.body);
  res
    .status(newEvaluation.success ? 201 : 400)
    .json(newEvaluation);
});


getStudentInfo = asyncTryCatch(async (req, res) => { // assuming the user ID is passed via URL
  const studentInfo = await UserService.getStudentInfo(req.user.userId);

  return res
    .status(studentInfo.success ? 200 : 404)
    .json(studentInfo);
});


}

module.exports = new UserController();
