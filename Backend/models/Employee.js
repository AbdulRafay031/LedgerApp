import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
  contactNumber: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
});

export const Employee = mongoose.model("Employee", EmployeeSchema);
