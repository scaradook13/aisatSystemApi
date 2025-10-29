const Teacher = require('../../models/Teacher.Model');
const Section = require('../../models/Section.Model');
const User = require('../../models/User.Model');
const Student = require('../../models/Student.Model');
const Category = require('../../models/Category.Model');
const Question = require('../../models/Question.Model');
const Form = require('../../models/Form.Model');
const Evaluation = require('../../models/Evaluations.Model')

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

  async addCategory(payload) {
  try {
    const { title, formId } = payload;
    if (!title) return { success: false, message: "Category title is required." };
    if (!formId) return { success: false, message: "Form ID is required to link the category." };

    const newCategory = new Category({ title: title.trim(), questionsIds: [] });
    await newCategory.save();

    // Push category to the specified form
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { $push: { formData: newCategory._id } },
      { new: true }
    );

    if (!updatedForm) return { success: false, message: "Form not found." };

    return { success: true, message: "Category added and linked to the form.", data: newCategory };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add category.", error };
  }
}

async getCategories() {
    try {
      const categories = await Category.find().populate('questionsIds');
      if (!categories.length) return { success: false, message: "No categories found." };
      return { success: true, data: categories };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to retrieve categories.", error };
    }
  }

async updateCategory(id, payload) {
  try {
    if (!id) return { success: false, message: "Category ID is required." };
    if (!payload || !payload.title) return { success: false, message: "Category title is required to update." };

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        title: payload.title.trim(),
        ...(payload.questionsIds && { questionsIds: payload.questionsIds }),
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      },
      { new: true }
    );

    if (!updatedCategory) return { success: false, message: "Category not found." };

    return { success: true, message: "Category updated successfully.", data: updatedCategory };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update category.", error };
  }
}

async deleteCategory(id) {
  try {
    if (!id) return { success: false, message: "Category ID is required." };

    // Find the category first
    const category = await Category.findById(id);
    if (!category) return { success: false, message: "Category not found." };

    // Delete all questions linked to this category
    await Question.deleteMany({ _id: { $in: category.questionsIds } });

    // Delete the category itself
    await Category.findByIdAndDelete(id);

    // Remove category from all forms
    await Form.updateMany({}, { $pull: { formData: id } });

    return { success: true, message: "Category and its questions deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete category.", error };
  }
}

async addQuestion(payload) {
    try {
      const { id, text, categoryId } = payload;
      if (!id || !text || !categoryId) return { success: false, message: "Question ID, text, and category ID are required." };

      const newQuestion = new Question({ id: id.trim(), text: text.trim() });
      await newQuestion.save();

      // Link question to category
      const category = await Category.findById(categoryId);
      if (!category) return { success: false, message: "Category not found." };

      category.questionsIds.push(newQuestion._id);
      category.updatedAt = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      await category.save();

      return { success: true, message: "Question added and linked to category.", data: newQuestion };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to add question.", error };
    }
  }

  async getQuestions() {
    try {
      const questions = await Question.find();
      if (!questions.length) return { success: false, message: "No questions found." };
      return { success: true, data: questions };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to retrieve questions.", error };
    }
  }

  async updateQuestion(id, payload) {
    try {
      if (!id) return { success: false, message: "Question ID is required." };
      if (!payload?.text) return { success: false, message: "Question text is required." };

      const updatedQuestion = await Question.findByIdAndUpdate(
        id,
        { text: payload.text.trim(), updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
        { new: true }
      );
      if (!updatedQuestion) return { success: false, message: "Question not found." };
      return { success: true, message: "Question updated successfully.", data: updatedQuestion };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to update question.", error };
    }
  }

  async deleteQuestion(id) {
    try {
      if (!id) return { success: false, message: "Question ID is required." };
      const deletedQuestion = await Question.findByIdAndDelete(id);
      if (!deletedQuestion) return { success: false, message: "Question not found." };

      // Remove question from all categories
      await Category.updateMany({}, { $pull: { questionsIds: id } });

      return { success: true, message: "Question deleted successfully." };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to delete question.", error };
    }
  }

async addForm(payload) {
  try {
    const { formDate } = payload;
    if (!formDate) {
      return { success: false, message: "Form date is required." };
    }

    // Archive all existing active forms
    await Form.updateMany(
      { status: "active" },
      { $set: { status: "archive", updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) } }
    );

    // Create new active form
    const newForm = new Form({ formDate, formData: [], status: "active" });
    await newForm.save();

    return { success: true, message: "Form added successfully. Previous forms archived.", data: newForm };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add form.", error };
  }
}

async getActiveForm() {
  try {
    const activeForm = await Form.findOne({ status: "active" })
      .populate({ path: 'formData', populate: { path: 'questionsIds' } });

    if (!activeForm) {
      return { success: false, message: "No active form found." };
    }

    return { success: true, data: activeForm };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to retrieve active form.", error };
  }
}

  async updateForm(id, payload) {
    try {
      if (!id) return { success: false, message: "Form ID is required." };
      const updatedForm = await Form.findByIdAndUpdate(
        id,
        { ...payload, updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
        { new: true }
      );
      if (!updatedForm) return { success: false, message: "Form not found." };
      return { success: true, message: "Form updated successfully.", data: updatedForm };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to update form.", error };
    }
  }

  async deleteForm(id) {
  try {
    if (!id) return { success: false, message: "Form ID is required." };

    // Find the form
    const form = await Form.findById(id).populate('formData');
    if (!form) return { success: false, message: "Form not found." };

    // Delete all questions under each category
    for (const category of form.formData) {
      await Question.deleteMany({ _id: { $in: category.questionsIds } });
    }

    // Delete all categories under the form
    await Category.deleteMany({ _id: { $in: form.formData.map(c => c._id) } });

    // Delete the form itself
    await Form.findByIdAndDelete(id);

    return { success: true, message: "Form, its categories, and all associated questions deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete form.", error };
  }
}


}



module.exports = new ManagementService();