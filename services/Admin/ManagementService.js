const Teacher = require('../../models/Teacher.Model');
const Section = require('../../models/Section.Model');
const User = require('../../models/User.Model');
const Student = require('../../models/Student.Model');

class ManagementService {

  async addTeacher(payload) {
    try {
      if (!payload || !payload.fullName || !payload.handleSections) {
        return { success: false, message: 'Please fill up all required fields.' };
      }

      const handleSections = Array.isArray(payload.handleSections)
        ? payload.handleSections
        : [payload.handleSections];

      const newTeacher = new Teacher({
        fullName: payload.fullName.trim(),
        handleSections,
      });

      await newTeacher.save();
      return { success: true, message: 'Teacher added successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to add teacher.', error };
    }
  }

  async addSection(payload) {
    try {
      if (!payload || !payload.section) {
        return { success: false, message: 'Please fill up all required fields.' };
      }

      const newSection = new Section({
        section: payload.section.trim(),
      });

      await newSection.save();
      return { success: true, message: 'Section added successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to add section.', error };
    }
  }

  async getTeachers() {
    try {
      const teachers = await Teacher.find();
      if (!teachers.length) {
        return { success: false, message: 'No teachers found.' };
      }
      return { success: true, data: teachers };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to retrieve teachers.', error };
    }
  }

  async getSections() {
    try {
      const sections = await Section.find();
      if (!sections.length) {
        return { success: false, message: 'No sections found.' };
      }
      return { success: true, data: sections };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to retrieve sections.', error };
    }
  }

  async getStudents() {
    try {
      const students = await Student.find();

      if (!students.length) {
        return { success: false, message: 'No students found.' };
      }

      return { success: true, data: students };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to retrieve students.', error };
    }
  }

  async updateTeacher(id, payload) {
    try {
      if (!id) return { success: false, message: 'Teacher ID is required.' };
      if (!payload || (!payload.fullName && !payload.handleSections)) {
        return { success: false, message: 'Please provide data to update.' };
      }

      const updatedTeacher = await Teacher.findByIdAndUpdate(
        id,
        {
          ...(payload.fullName && { fullName: payload.fullName.trim() }),
          ...(payload.handleSections && { handleSections: payload.handleSections }),
          updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        },
        { new: true }
      );

      if (!updatedTeacher) {
        return { success: false, message: 'Teacher not found.' };
      }

      return { success: true, message: 'Teacher updated successfully.', data: updatedTeacher };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to update teacher.', error };
    }
  }

  async updateSection(id, payload) {
    try {
      if (!id) return { success: false, message: 'Section ID is required.' };
      if (!payload || !payload.section) {
        return { success: false, message: 'Section name is required.' };
      }

      const updatedSection = await Section.findByIdAndUpdate(
        id,
        { section: payload.section.trim() },
        { new: true }
      );

      if (!updatedSection) {
        return { success: false, message: 'Section not found.' };
      }

      return { success: true, message: 'Section updated successfully.', data: updatedSection };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to update section.', error };
    }
  }

  async deleteTeacher(id) {
    try {
      if (!id) return { success: false, message: 'Teacher ID is required.' };

      const deletedTeacher = await Teacher.findByIdAndDelete(id);
      if (!deletedTeacher) {
        return { success: false, message: 'Teacher not found.' };
      }

      return { success: true, message: 'Teacher deleted successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to delete teacher.', error };
    }
  }

  async deleteSection(id) {
    try {
      if (!id) return { success: false, message: 'Section ID is required.' };

      const deletedSection = await Section.findByIdAndDelete(id);
      if (!deletedSection) {
        return { success: false, message: 'Section not found.' };
      }

      return { success: true, message: 'Section deleted successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to delete section.', error };
    }
  }

  async updateStudent(id, payload) {
    try {
      if (!id) return { success: false, message: 'Student ID is required.' };
      if (!payload) return { success: false, message: 'No data provided to update.' };

      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        {
          ...(payload.fullName && { fullName: payload.fullName.trim() }),
          ...(payload.studentNumber && { studentNumber: payload.studentNumber }),
          ...(payload.section && { section: payload.section }),
          ...(payload.teacherEvaluated && { teacherEvaluated: payload.teacherEvaluated }),
          updatedAt: new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
        },
        { new: true }
      );

      if (!updatedStudent) {
        return { success: false, message: 'Student not found.' };
      }

      return { success: true, message: 'Student updated successfully.', data: updatedStudent };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to update student.', error };
    }
  }

  async deleteStudent(id) {
    try {
      if (!id) return { success: false, message: 'Student ID is required.' };

      const deletedStudent = await Student.findByIdAndDelete(id);
      if (!deletedStudent) {
        return { success: false, message: 'Student not found.' };
      }

      // 🧩 Delete the associated user account
      await User.findOneAndDelete({ profile: id });

      return { success: true, message: 'Student and associated user account deleted successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to delete student.', error };
    }
  }
}

module.exports = new ManagementService();