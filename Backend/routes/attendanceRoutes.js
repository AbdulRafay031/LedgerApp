import express from 'express';
import { addAttendance,getAllAttendance } from '../controllers/attendanceController.js';
import { Attendance } from '../models/Attendance.js';

const router = express.Router();

// Get all attendances
router.get('/AddAttendance', async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error });
  }
});

// Route for adding attendance
router.post('/add-attendance', addAttendance);
router.get("/get-all-attendance", getAllAttendance);

export default router;
