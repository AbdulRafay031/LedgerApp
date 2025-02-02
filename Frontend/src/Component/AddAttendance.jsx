import React, { useState, useEffect } from "react";
import { addAttendance } from "../services/attendanceService";
import axios from "axios";

const AddAttendance = ({ onAddAttendance, closeForm }) => {
  const [attendanceData, setAttendanceData] = useState({
    name: "",
    date: "",
    status: "",
    checkinTime: "",
    checkoutTime: "",
  });
  const [employees, setEmployees] = useState([]);
  const [checkinTimeDisplay, setCheckinTimeDisplay] = useState("");
  const [checkoutTimeDisplay, setCheckoutTimeDisplay] = useState("");

  const handleAttendanceChange = (e) => {
    const { name, value } = e.target;
    setAttendanceData({ ...attendanceData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAttendance = await addAttendance(attendanceData);
      onAddAttendance(newAttendance); // Update attendance list in the home page
      setAttendanceData({
        name: "",
        date: "",
        status: "",
        checkinTime: "",
        checkoutTime: "",
      });
      closeForm();
    } catch (error) {
      console.error("Error adding attendance:", error.message);
    }
  };

  const handleCheckin = () => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setAttendanceData({ ...attendanceData, checkinTime: currentTime });
    setCheckinTimeDisplay(currentTime);
  };

  const handleCheckout = () => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setAttendanceData({ ...attendanceData, checkoutTime: currentTime });
    setCheckoutTimeDisplay(currentTime);
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
          console.error("Failed to fetch data:", response.data?.message || "Invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []); // Empty array ensures this effect runs only once (on mount)

  return (
    <div className="bg-white p-6 rounded-md shadow-lg mb-6 max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-red-600 mb-6">Attendance Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">Employee Name</label>
          <select
            name="name"
            value={attendanceData.name}
            onChange={handleAttendanceChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
          >
            <option value="" disabled>Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id || employee.name} value={employee.name}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-600">Date</label>
          <input
            type="date"
            name="date"
            value={attendanceData.date}
            onChange={handleAttendanceChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-600">Attendance Status</label>
          <select
            name="status"
            value={attendanceData.status}
            onChange={handleAttendanceChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
          >
            <option value="" disabled>Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        {attendanceData.status === "Present" && (
          <>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCheckin}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Check-in
              </button>
              {checkinTimeDisplay && (
                <p className="text-sm text-gray-600 mb-4">Check-in Time: {checkinTimeDisplay}</p>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Check-out
              </button>
              {checkoutTimeDisplay && (
                <p className="text-sm text-gray-600 mb-4">Check-out Time: {checkoutTimeDisplay}</p>
              )}
            </div>
          </>
        )}

        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Submit Attendance
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAttendance;


