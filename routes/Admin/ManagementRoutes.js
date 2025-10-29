const express = require("express");
const router = express.Router();
const ManagementController = require("../../controllers/Admin/ManagementController");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const AuthMiddleware = require("../../middlewares/authMiddleware");

// ===================== TEACHERS =====================
router.post("/addTeacher", adminAuthMiddleware.verifySession, ManagementController.addTeacher);
router.get("/getTeachers", AuthMiddleware.verifySession, ManagementController.getTeachers);
router.patch("/updateTeacher/:id", AuthMiddleware.verifySession, ManagementController.updateTeacher);
router.delete("/deleteTeacher/:id", AuthMiddleware.verifySession, ManagementController.deleteTeacher);

// ===================== SECTIONS =====================
router.post("/addSection", adminAuthMiddleware.verifySession, ManagementController.addSection);
router.get("/getSections", AuthMiddleware.verifySession, ManagementController.getSections);
router.patch("/updateSection/:id", AuthMiddleware.verifySession, ManagementController.updateSection);
router.delete("/deleteSection/:id", AuthMiddleware.verifySession, ManagementController.deleteSection);

// ===================== STUDENTS =====================
router.get("/getStudents", adminAuthMiddleware.verifySession, ManagementController.getStudents);
router.patch("/updateStudent/:id", adminAuthMiddleware.verifySession, ManagementController.updateStudent);
router.delete("/deleteStudent/:id", adminAuthMiddleware.verifySession, ManagementController.deleteStudent);

// ===================== FORMS =====================
router.post("/addForm", adminAuthMiddleware.verifySession, ManagementController.addForm);
router.get("/getForms", AuthMiddleware.verifySession, ManagementController.getForms);
router.patch("/updateForm/:id", adminAuthMiddleware.verifySession, ManagementController.updateForm);
router.delete("/deleteForm/:id", adminAuthMiddleware.verifySession, ManagementController.deleteForm);

// ===================== CATEGORIES =====================
router.post("/addCategory", adminAuthMiddleware.verifySession, ManagementController.addCategory);
router.get("/getCategories", AuthMiddleware.verifySession, ManagementController.getCategories);
router.patch("/updateCategory/:id", adminAuthMiddleware.verifySession, ManagementController.updateCategory);
router.delete("/deleteCategory/:id", adminAuthMiddleware.verifySession, ManagementController.deleteCategory);

// ===================== QUESTIONS =====================
router.post("/addQuestion", adminAuthMiddleware.verifySession, ManagementController.addQuestion);
router.get("/getQuestions", AuthMiddleware.verifySession, ManagementController.getQuestions);
router.patch("/updateQuestion/:id", adminAuthMiddleware.verifySession, ManagementController.updateQuestion);
router.delete("/deleteQuestion/:id", adminAuthMiddleware.verifySession, ManagementController.deleteQuestion);

module.exports = router;
