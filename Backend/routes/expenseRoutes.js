import express from "express";
import { addExpense, getAllExpense, deleteExpense } from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
});

// Route for adding a new employee
router.post("/add-expense", addExpense);
router.get("/get-all-expense", getAllExpense);
router.delete("/delete-expense/:id", deleteExpense);

export default router;
