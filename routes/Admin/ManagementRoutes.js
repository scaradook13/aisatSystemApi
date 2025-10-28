const express = require("express");
const router = express.Router();
const ManagementController = require("../../controllers/Admin/ManagementController");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const AuthMiddleware = require("../../middlewares/authMiddleware");

// 🧑‍🏫 TEACHERS
router.post("/addTeacher", adminAuthMiddleware.verifySession, ManagementController.addTeacher);
router.get("/getTeachers", AuthMiddleware.verifySession, ManagementController.getTeachers);
router.patch("/updateTeacher/:id", AuthMiddleware.verifySession, ManagementController.updateTeacher);
router.delete("/deleteTeacher/:id", AuthMiddleware.verifySession, ManagementController.deleteTeacher);

// 🏫 SECTIONS
router.post("/addSection", adminAuthMiddleware.verifySession, ManagementController.addSection);
router.get("/getSections", AuthMiddleware.verifySession, ManagementController.getSections);
router.patch("/updateSection/:id", AuthMiddleware.verifySession, ManagementController.updateSection);
router.delete("/deleteSection/:id", AuthMiddleware.verifySession, ManagementController.deleteSection);

// 👨‍🎓 STUDENTS
router.get("/getStudents", adminAuthMiddleware.verifySession, ManagementController.getStudents);
router.patch("/updateStudent/:id", adminAuthMiddleware.verifySession, ManagementController.updateStudent);
router.delete("/deleteStudent/:id", adminAuthMiddleware.verifySession, ManagementController.deleteStudent);

module.exports = router;
