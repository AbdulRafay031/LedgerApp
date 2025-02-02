// src/components/PaymentForm.js
import React, { useState, useEffect } from 'react';
import { addPayment } from "../services/paymentService";
import axios from "axios";
import { toast } from 'react-toastify'; 

const AddPayment = () => {
  const [paymentData, setPaymentData] = useState({
    name: '',
    date: '',
    amount: '',
  });
  const [employees, setEmployees] = useState([]);
  
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submission
    try {
      // Assuming `addPayment` is the API call to save payment data.
      const newPayment = await addPayment(paymentData);
      
      // Call the onAddPayment callback function to pass the new payment data
      // onAddPayment(newPayment);
      
      // Reset the form fields after successful submission
      setPaymentData({ name: "", date: "", amount: "" });
      
      // Show a success toast notification
      toast.success("Payment successfully submitted!");

    } catch (error) {
      // If there's an error, show an error toast
      toast.error("Error submitting payment: " + error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/get-all-employee"
        );
        if (response.data && response.data.success) {
          setEmployees(response.data.data);
        } else {
          console.error(
            "Failed to fetch data: ",
            response.data?.message || "Invalid response structure"
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 p-6 rounded-md shadow-lg mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Form</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="name"
          value={paymentData.name}
          onChange={handlePaymentChange}
          className="w-full px-4 py-2 border rounded-md mb-4"
          required
        >
          <option value="" disabled>Select Employee</option>
          {employees.map((employee, index) => (
            <option key={employee.id ? employee.id : `${employee.name}-${index}`} value={employee.name}>
              {employee.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={paymentData.date}
          onChange={handlePaymentChange}
          className="w-full px-4 py-2 border rounded-md mb-4"
          required
        />
        
        <input
          type="number"
          name="amount"
          value={paymentData.amount}
          onChange={handlePaymentChange}
          placeholder="Amount"
          className="w-full px-4 py-2 border rounded-md mb-4"
          required
        />
        
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default AddPayment;


