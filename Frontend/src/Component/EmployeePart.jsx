import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Attendance from "../Attendance";
import Payment from "../Payment";
import Status from './status';

const EmployeePart = () => {
  const [isAddAttendanceOpen, setIsAttendanceFormOpen] = useState(false);
  const [isAddPaymentOpen, setIsPaymentFormOpen] = useState(false);
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook

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
            "Failed to fetch data:",
            response.data?.message || "Invalid response structure"
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4 sm:py-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6 sm:text-3xl">
          Employee Management
        </h1>

        {/* Buttons to open forms */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => navigate("/attendance")} // Navigate to AddAttendance page
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 w-full sm:w-auto"
          >
            Attendance
          </button>
          <button
            onClick={() => navigate("/payment")}
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200 w-full sm:w-auto"
          >
            Payment
          </button>
          <button
            onClick={() => navigate("/status")}
            className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all duration-200 w-full sm:w-auto"
          >
            Status
          </button>
        </div>

        {/* Render Attendance Form */}
        {isAddAttendanceOpen && <Attendance employees={employees} />}

        {/* Render Payment Form */}
        {isAddPaymentOpen && <Payment employees={employees} />}

        {/* Render Status Form */}
        {isStatusFormOpen && <Status />}
      </div>
    </div>
  );
};

export default EmployeePart;


