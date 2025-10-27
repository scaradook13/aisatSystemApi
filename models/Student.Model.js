const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: null
  },
  studentNumber: {
    type: Number,
    default: null
  },
  section: {
    type: String,
    default: null,

  },
  teacherEvaluated: {
    type: String,
    default: null
  },
  createdAt: {
    type: String,
    default: getDateValue(),
  },
  updatedAt: {
    type: String,
    default: getDateValue(),
  },
});

function getDateValue() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  let finaldate;

  return (finaldate = `${month} ${day}, ${year}`);
}

const Customer = mongoose.model("Student", studentSchema);
module.exports = Customer;