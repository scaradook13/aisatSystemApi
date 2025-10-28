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
}

module.exports = new ManagementController();