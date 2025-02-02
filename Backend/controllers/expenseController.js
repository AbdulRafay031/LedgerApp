import { Expense } from "../models/Expense.js";


const addExpense = async (req, res) => {
  try {
    const { totalSell, date, expenses } = req.body;

    // Validate input
    if (!totalSell || !date || !Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    // Create a new Expense entry
    const expense = new Expense({ totalSell, date, expenses });

    // Save the entry to the database
    await expense.save();

    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding expense", error: error.message });
  }
};

const getAllExpense = async (req, res) => {
  try {
    // Fetch all expenses from the database
    const expenses = await Expense.find();
    return res.status(200).json({
      success: true,
      message: "Get all expenses successfully",
      data: expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
      error: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure ID is provided
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Expense ID is required" });
    }

    // Find and delete the expense
    const deletedExpense = await Expense.findByIdAndDelete(id);

    // Handle case where the expense does not exist
    if (!deletedExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error.message); // Log the error for debugging
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting expense",
        error: error.message,
      });
  }
};





export { addExpense,getAllExpense,deleteExpense };
