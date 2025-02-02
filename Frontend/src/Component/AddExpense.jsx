import { useState } from "react";
import { addExpense } from "../services/expenseService";
import { toast, ToastContainer } from 'react-toastify'; // Import toast methods
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const AddExpense = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState({
    totalSell: "",
    date: "",
    expenseType: "",
    price: "",
  });

  const expenseOptions = [
    "Tea Expense",
    "Maintenance Expense",
    "Utility Expense",
    "Food Expense",
    "Water Expense",
    "Rent Expense",
    "Other Expense",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExpense({ ...currentExpense, [name]: value });
  };

  const handleAddExpense = () => {
    if (currentExpense.expenseType && currentExpense.price) {
      setExpenses([...expenses, currentExpense]);
      setCurrentExpense({ totalSell: currentExpense.totalSell, date: currentExpense.date, expenseType: "", price: "" });

      // Show a toast when an expense is added to the list
      toast.success("Expense added to the list!");
    }
  };

  const handleSubmit = async () => {
    try {
      const expenseData = {
        totalSell: currentExpense.totalSell,
        date: currentExpense.date,
        expenses, // This should be the array of all added expenses
      };

      const response = await addExpense(expenseData); // Call the API service
      console.log("Expense added successfully:", response);

      // Show success toast when the expenses are submitted
      toast.success("All expenses submitted successfully!");

      // Reset form and state
      setCurrentExpense({ totalSell: "", date: "", expenseType: "", price: "" });
      setExpenses([]); // Clear all added expenses
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error.message);

      // Show error toast if there is an issue with the API request
      toast.error("Error adding expense. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-black to-red-600">
      {!isFormOpen ? (
        <div
          className="w-60 h-20 mt-10 flex items-center justify-center border border-white rounded-md cursor-pointer hover:shadow-lg transition-all duration-300 text-white"
          onClick={() => setIsFormOpen(true)}
        >
          ADD EXPENSE
          <span className="text-6xl text-white font-bold">+</span>
        </div>
      ) : (
        <div className="w-full max-w-sm bg-gradient-to-r from-black to-red-200 p-8 rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105">
          <h2 className="text-3xl font-semibold mb-6 text-center text-red-600">
            Add Expense
          </h2>

          <input
            type="number"
            name="totalSell"
            placeholder="Total Sell"
            value={currentExpense.totalSell}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          />

          <input
            type="date"
            name="date"
            value={currentExpense.date}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          />

          <select
            name="expenseType"
            value={currentExpense.expenseType}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          >
            <option value="">Select Expense Type</option>
            {expenseOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          {currentExpense.expenseType && (
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={currentExpense.price}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
            />
          )}

          <button
            onClick={handleAddExpense}
            className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 rounded-md hover:bg-gradient-to-l transition-all duration-300 mb-4"
          >
            Add Expense
          </button>

          <div className="mb-4">
            {expenses.map((expense, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-md mb-2 bg-white">
                <p><strong>Type:</strong> {expense.expenseType}</p>
                <p><strong>Price:</strong> {expense.price}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-md hover:bg-gradient-to-l transition-all duration-300"
          >
            Submit All Expenses
          </button>
        </div>
      )}
      {/* ToastContainer to display toasts */}
      <ToastContainer />
    </div>
  );
};

export default AddExpense;

