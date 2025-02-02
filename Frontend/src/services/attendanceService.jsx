import axios from "axios";

const API_URL = "http://localhost:8000/api/attendances";

// Add a new employee
export const addAttendance = async (attendanceData) => {
  try {
    const response = await axios.post(`${API_URL}/add-attendance`, attendanceData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add attendance: " + error.message);
  }
};