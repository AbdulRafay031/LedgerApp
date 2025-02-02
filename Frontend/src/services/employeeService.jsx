import axios from "axios";

const API_URL = "http://localhost:8000/api/employees";

// Add a new employee
export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${API_URL}/add-employee`, employeeData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add employee: " + error.message);
  }
};