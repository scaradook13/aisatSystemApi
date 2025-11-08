const ManagementService = require('../../services/Admin/ManagementService');
const asyncTryCatch = require('../../utils/asyncTryAndCatch');

class ManagementController {

  addTeacher = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.addTeacher(req.body);
    res.status(result.success ? 201 : 400).json(result);
  });

  addSection = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.addSection(req.body);
    res.status(result.success ? 201 : 400).json(result);
  });

  getTeachers = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.getTeachers();
    res.status(result.success ? 200 : 404).json(result);
  });

  getSections = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.getSections();
    res.status(result.success ? 200 : 404).json(result);
  });

  getStudents = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.getStudents();
    res.status(result.success ? 200 : 404).json(result);
  });

  updateTeacher = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.updateTeacher(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  });

  updateSection = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.updateSection(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  });

  deleteTeacher = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.deleteTeacher(id);
    res.status(result.success ? 200 : 404).json(result);
  });

  deleteSection = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.deleteSection(id);
    res.status(result.success ? 200 : 404).json(result);
  });

  updateStudent = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.updateStudent(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  });

  deleteStudent = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.deleteStudent(id);
    res.status(result.success ? 200 : 404).json(result);
  });

  // ===================== FORM =====================
  addForm = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.addForm(req.body);
    res.status(result.success ? 201 : 400).json(result);
  });

  getForms = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.getActiveForm();
    res.status(result.success ? 200 : 404).json(result);
  });

  updateForm = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.updateForm(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  });

  deleteForm = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.deleteForm(id);
    res.status(result.success ? 200 : 404).json(result);
  });

  // ===================== CATEGORY =====================
  addCategory = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.addCategory(req.body);
    res.status(result.success ? 201 : 400).json(result);
  });

  getCategories = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.getCategories();
    res.status(result.success ? 200 : 404).json(result);
  });

  updateCategory = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.updateCategory(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  });

  deleteCategory = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.deleteCategory(id);
    res.status(result.success ? 200 : 404).json(result);
  });

  // ===================== QUESTION =====================
  addQuestion = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.addQuestion(req.body);
    res.status(result.success ? 201 : 400).json(result);
  });

  getQuestions = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.getQuestions();
    res.status(result.success ? 200 : 404).json(result);
  });

  updateQuestion = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.updateQuestion(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  });

  deleteQuestion = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.deleteQuestion(id);
    res.status(result.success ? 200 : 404).json(result);
  });

  addEnrolledStudent = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.addEnrolledStudent(req.body);
    res.status(result.success ? 201 : 400).json(result);
  });

  getAllEnrolledStudents = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.getAllEnrolledStudents();
    res.status(result.success ? 200 : 404).json(result);
  });

  addEnrolledStudentExcel = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.addEnrolledStudentExcel(req.body);
    res.status(result.success ? 201 : 400).json(result);
  });  

  getAllEvaluationsFromActiveForm = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.getAllEvaluationsFromActiveForm();
    res.status(result.success ? 200 : 404).json(result);
  });

  updateEnrolledStudent = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.updateEnrolledStudent(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  });

  deleteEnrolledStudent = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const result = await ManagementService.deleteEnrolledStudent(id);
    res.status(result.success ? 200 : 404).json(result);
  });

  addFormCopy = asyncTryCatch(async (req, res) => {
    const result = await ManagementService.addFormCopy(req.body);
    res.status(result.success ? 201 : 400).json(result);
  });
}

module.exports = new ManagementController();
