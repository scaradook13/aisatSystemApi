const ManagementService = require('../../services/Admin/ManagementService');
const asyncTryCatch = require('../../utils/asyncTryAndCatch');

class ManagementController {

  // 🧑‍🏫 Add Teacher
  addTeacher = asyncTryCatch(async (req, res) => {
    const newTeacher = await ManagementService.addTeacher(req.body);
    res.status(newTeacher.success ? 201 : 400).json({
      content: newTeacher,
    });
  });

  // 🏫 Add Section
  addSection = asyncTryCatch(async (req, res) => {
    const newSection = await ManagementService.addSection(req.body);
    res.status(newSection.success ? 201 : 400).json({
      content: newSection,
    });
  });

  // 📋 Get All Teachers
  getTeachers = asyncTryCatch(async (req, res) => {
    const teachers = await ManagementService.getTeachers();
    res.status(teachers.success ? 200 : 404).json({
      content: teachers,
    });
  });

  // 🗂️ Get All Sections
  getSections = asyncTryCatch(async (req, res) => {
    const sections = await ManagementService.getSections();
    res.status(sections.success ? 200 : 404).json({
      content: sections,
    });
  });

  // 👨‍🎓 Get All Students
  getStudents = asyncTryCatch(async (req, res) => {
    const students = await ManagementService.getStudents();
    res.status(students.success ? 200 : 404).json({
      content: students,
    });
  });

  // ✏️ Update Teacher
  updateTeacher = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const updatedTeacher = await ManagementService.updateTeacher(id, req.body);
    res.status(updatedTeacher.success ? 200 : 400).json({
      content: updatedTeacher,
    });
  });

  // ✏️ Update Section
  updateSection = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const updatedSection = await ManagementService.updateSection(id, req.body);
    res.status(updatedSection.success ? 200 : 400).json({
      content: updatedSection,
    });
  });

  // 🗑️ Delete Teacher
  deleteTeacher = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const deletedTeacher = await ManagementService.deleteTeacher(id);
    res.status(deletedTeacher.success ? 200 : 404).json({
      content: deletedTeacher,
    });
  });

  // 🗑️ Delete Section
  deleteSection = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const deletedSection = await ManagementService.deleteSection(id);
    res.status(deletedSection.success ? 200 : 404).json({
      content: deletedSection,
    });
  });

  // ✅ NEW: Update Student
  updateStudent = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const updatedStudent = await ManagementService.updateStudent(id, req.body);
    res.status(updatedStudent.success ? 200 : 400).json({
      content: updatedStudent,
    });
  });

  // ✅ NEW: Delete Student
  deleteStudent = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const deletedStudent = await ManagementService.deleteStudent(id);
    res.status(deletedStudent.success ? 200 : 404).json({
      content: deletedStudent,
    });
  });

  addForm = asyncTryCatch(async (req, res) => {
    const newForm = await ManagementService.addForm(req.body);
    res.status(newForm.success ? 201 : 400).json({ content: newForm });
  });

  getForms = asyncTryCatch(async (req, res) => {
    const forms = await ManagementService.getActiveForm();
    res.status(forms.success ? 200 : 404).json({ content: forms });
  });

  updateForm = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const updatedForm = await ManagementService.updateForm(id, req.body);
    res.status(updatedForm.success ? 200 : 400).json({ content: updatedForm });
  });

  deleteForm = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const deletedForm = await ManagementService.deleteForm(id);
    res.status(deletedForm.success ? 200 : 404).json({ content: deletedForm });
  });

  // ===================== CATEGORY =====================
  addCategory = asyncTryCatch(async (req, res) => {
    const newCategory = await ManagementService.addCategory(req.body);
    res.status(newCategory.success ? 201 : 400).json({ content: newCategory });
  });

  getCategories = asyncTryCatch(async (req, res) => {
    const categories = await ManagementService.getCategories();
    res.status(categories.success ? 200 : 404).json({ content: categories });
  });

  updateCategory = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const updatedCategory = await ManagementService.updateCategory(id, req.body);
    res.status(updatedCategory.success ? 200 : 400).json({ content: updatedCategory });
  });

  deleteCategory = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const deletedCategory = await ManagementService.deleteCategory(id);
    res.status(deletedCategory.success ? 200 : 404).json({ content: deletedCategory });
  });

  // ===================== QUESTION =====================
  addQuestion = asyncTryCatch(async (req, res) => {
    const newQuestion = await ManagementService.addQuestion(req.body);
    res.status(newQuestion.success ? 201 : 400).json({ content: newQuestion });
  });

  getQuestions = asyncTryCatch(async (req, res) => {
    const questions = await ManagementService.getQuestions();
    res.status(questions.success ? 200 : 404).json({ content: questions });
  });

  updateQuestion = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const updatedQuestion = await ManagementService.updateQuestion(id, req.body);
    res.status(updatedQuestion.success ? 200 : 400).json({ content: updatedQuestion });
  });

  deleteQuestion = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const deletedQuestion = await ManagementService.deleteQuestion(id);
    res.status(deletedQuestion.success ? 200 : 404).json({ content: deletedQuestion });
  });
}

module.exports = new ManagementController();