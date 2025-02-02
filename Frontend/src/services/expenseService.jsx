import axios from "axios";

const API_URL = "http://localhost:8000/api/expenses";

// Add a new party
export const addExpense = async (expenseData) => {
  try {
    const response = await axios.post(`${API_URL}/add-expense`, expenseData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add expense: " + error.message);
  }
};


