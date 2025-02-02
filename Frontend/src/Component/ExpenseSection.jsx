import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

const ExpenseSection = () => {
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [netProfitData, setNetProfitData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  
  // Fetching data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenseResponse = await axios.get(
          "http://localhost:8000/api/user/get-all-expense"
        );
        const employeeResponse = await axios.get(
          "http://localhost:8000/api/user/get-all-employee"
        );
        if (expenseResponse.data.success) {
          setExpenses(expenseResponse.data.data);
        }
        if (employeeResponse.data.success) {
          setEmployeeData(employeeResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique years from expenses data
  const getUniqueYears = () => {
    const years = [...new Set(expenses.map(expense => new Date(expense.date).getFullYear()))];
    setAvailableYears(years);
  };

  useEffect(() => {
    if (expenses.length) {
      getUniqueYears();
    }
  }, [expenses]);

  // Handle year change
  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    const filteredMonths = getMonthsForYear(year);
    setAvailableMonths(filteredMonths);
  };

  // Get months available for a specific year
  const getMonthsForYear = (year) => {
    const months = expenses
      .filter(expense => new Date(expense.date).getFullYear() === parseInt(year))
      .map(expense => new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' }));
    return [...new Set(months)];
  };

  // Handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    calculateNetProfit(e.target.value);
  };

  // Calculate net profit based on selected month
  const calculateNetProfit = (month) => {
    const filteredExpenses = expenses.filter((expense) => {
      const expenseMonth = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      return expenseMonth === month;
    });

    const totalSell20Percent = filteredExpenses.reduce(
      (acc, expense) => acc + expense.totalSell * 0.2,
      0
    );
    const totalExpenses = filteredExpenses.reduce(
      (acc, expense) =>
        acc + expense.expenses.reduce((sum, item) => sum + item.price, 0),
      0
    );
    const totalSalaries = employeeData.reduce(
      (acc, employee) => acc + employee.salary,
      0
    );
    const netProfit = totalSell20Percent - totalExpenses - totalSalaries;

    setNetProfitData({ netProfit, totalExpenses, totalSalaries });
  };

  const handleCardClick = (expense) => {
    setSelectedExpense(expense);
  };

  const handleGoBack = () => {
    setSelectedExpense(null);
  };

  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/delete/delete-expense/${expenseId}`
      );
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
    } catch (error) {
      console.error("Error deleting expense:", error.message);
    }
  };

  const handleDownload = () => {
    const filteredExpenses = expenses.filter((expense) => {
      const expenseMonth = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      return expenseMonth === selectedMonth;
    });

    const totalSell = filteredExpenses.reduce(
      (acc, expense) => acc + expense.totalSell,
      0
    );
    const totalProfit = totalSell * 0.2;

    const doc = new jsPDF();
    doc.text("FATIMAZ FASHION", 10, 10);
    doc.text(`Total Sell: RS${totalSell}`, 10, 20);
    doc.text(`Total Profit: RS${totalProfit}`, 10, 30);
    doc.text(`Total Expenses: RS${netProfitData?.totalExpenses}`, 10, 50);
    doc.text(`Total Salaries: RS${netProfitData?.totalSalaries}`, 10, 60);
    doc.text(`Net Profit: RS${netProfitData?.netProfit}`, 10, 40);
    doc.save("net_profit_data.pdf");
  };

  // Filter expenses based on the selected month
  const filteredExpenses = expenses.filter((expense) => {
    const expenseMonth = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    return expenseMonth === selectedMonth;
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black to-red-600 px-4 sm:px-6 md:px-10 mt-10">
      <div className="w-full md:w-4/5 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-6">EXPENSE SECTION</h2>

        {/* Year Dropdown */}
        {availableYears.length > 0 && selectedYear === "" && (
          <div className="mb-4">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="p-4 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Year</option>
              {availableYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Month Dropdown */}
        {selectedYear && (
          <div className="mb-4">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="p-4 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Month</option>
              {getMonthsForYear(selectedYear).map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="p-4">
              {selectedExpense ? (
                <div className="p-4 border rounded-lg shadow-lg bg-white">
                  <h2 className="text-xl font-bold mb-2">Expense Details</h2>
                  <p>
                    <strong>Total Sell:</strong> RS:{selectedExpense.totalSell}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedExpense.date).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={handleGoBack}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    >
                      Go Back
                    </button>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Expenses:</h3>
                    <ul className="list-disc list-inside">
                      {selectedExpense.expenses.map((item, index) => (
                        <li key={index}>
                          {item.expenseType}: RS:{item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredExpenses.map((expense, index) => (
                    <div
                      key={expense._id}
                      className="border rounded-lg shadow-lg p-6 bg-gradient-to-br from-gray-800 to-gray-600 hover:shadow-xl hover:scale-105 transform transition"
                      onClick={() => handleCardClick(expense)}
                    >
                      <h3 className="text-lg font-bold text-white">
                        Day {index + 1}: RS:{expense.totalSell}
                      </h3>
                      <p className="mt-2 text-sm text-white">
                        Date: {new Date(expense.date).toLocaleDateString()}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(expense._id);
                        }}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center">No expenses available for this month.</p>
        )}

        {/* Net Profit Calculation */}
        {netProfitData && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow">
            <h3 className="text-xl font-bold">Net Profit for {selectedMonth}</h3>
            <p>
              <strong>Net Profit:</strong> RS:{netProfitData.netProfit}
            </p>
            <p>
              <strong>Total Expenses:</strong> RS:{netProfitData.totalExpenses}
            </p>
            <p>
              <strong>Total Salaries:</strong> RS:{netProfitData.totalSalaries}
            </p>
            
            
            <button
              onClick={handleDownload}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseSection;


