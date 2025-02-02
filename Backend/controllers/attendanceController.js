import { Attendance } from "../models/Attendance.js";

// const addAttendance = async (req, res) => {
//   try {
//     const attendance = new Attendance(req.body);
//     await attendance.save();
//     res.status(201).json({ message: "Attendance added successfully", attendance });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "attendance", error: error.message });
//   }
// };
const addAttendance = async (req, res) => {
  try {
    const { checkinTime, checkoutTime, status } = req.body;

    // If status is "Absent", set check-in and check-out times to "N/A"
    if (status === "Absent") {
      req.body.checkinTime = "N/A";
      req.body.checkoutTime = "N/A";
    } else {
      // If check-in or check-out is not provided, set defaults
      req.body.checkinTime = checkinTime || "N/A";
      req.body.checkoutTime = checkoutTime || "N/A";
    }

    const attendance = new Attendance(req.body);
    await attendance.save();

    res.status(201).json({
      message: "Attendance added successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding attendance",
      error: error.message,
    });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const { employeeName } = req.query;  // Get the employee name from query params

    // If employeeName is provided, filter by it
    const attendance = employeeName
      ? await Attendance.find({ name: employeeName })  // Filter by name
      : await Attendance.find();  // Fetch all if no name is provided

    return res.status(200).json({
      success: true,
      message: "Get all attendance successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};



export { addAttendance,getAllAttendance };