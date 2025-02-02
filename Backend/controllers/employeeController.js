import { Employee } from "../models/Employee.js";

const addEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding employee", error: error.message });
  }
};


const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(); 
    return res.status(200).json({
      success: true,
      message: "Get all employees successfully",
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure ID is valid
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });
    }

    // Delete the party
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    // Handle case when the party does not exist
    if (!deletedEmployee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting Employee:", error.message); // Log the error for debugging
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting Employee",
        error: error.message,
      });
  }
};





export { addEmployee,getAllEmployees,deleteEmployee };