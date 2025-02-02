import mongoose from "mongoose";

// Define the schema for the Attendance model
const AttendanceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  checkoutTime: {
    type: String, // Store time as a string (HH:MM)
    required: true
  }, 
  checkinTime: {
    type: String, // Store time as a string (HH:MM)
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Attendance model
export const Attendance = mongoose.model("Attendance", AttendanceSchema);

