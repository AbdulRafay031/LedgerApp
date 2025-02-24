import express from "express";
import { addEmployee,getAllEmployees,deleteEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: "Error fetching check employee", error });
    }
  });

// Route for adding a new employee
router.post("/add-employee", addEmployee);
router.get("/get-all-employee", getAllEmployees);
router.delete("/delete-employee/:id", deleteEmployee);

export default router;
