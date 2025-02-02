import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import EmployeePart from "./EmployeePart";

const EmployeeSection = () => {
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

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

  const handleCardClick = (employee) => {
    if (employee) {
      setSelectedEmployee(employee);
    } else {
      console.error("employee object is invalid:", employee);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete/delete-employee/${id}`
      );
      if (response.data.success) {
        alert("Employee deleted successfully");
        setEmployees((prev) => prev.filter((employee) => employee._id !== id));
        setSelectedEmployee(null);
      } else {
        alert("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error.message);
      alert("An error occurred while deleting the employee.");
    }
  };

  const generatePayslipPDF = async (employee) => {
    const doc = new jsPDF();
  
    try {
      // Log employee details to check if data is available
      // console.log('Generating payslip for employee:', employee);
  
      // Fetch Payment Data for deductions (advance payments or withdrawals)
      const paymentResponse = await axios.get(`http://localhost:8000/api/user/get-all-payment`);
      const payments = paymentResponse.data?.data || []; // Ensure payments is an array
      // console.log('Payments data:', payments);  // Log payment data
  
      // Fetch Attendance Data for calculating absences
      const attendanceResponse = await axios.get(`http://localhost:8000/api/user/get-all-attendance/`);
      let attendanceData = attendanceResponse.data?.data || [];  // Ensure attendanceData is an array
      // console.log('Attendance data:', attendanceData);  // Log attendance data
  
      // Calculate Daily Salary (assuming salary is for 30 days in a month)
      const totalSalary = parseFloat(employee.salary);
      const dailySalary = totalSalary / 30;
  
      // Calculate Absent Days (count the days the employee was absent)
      const absentDays = attendanceData.filter(attendance => attendance.status === 'Absent').length;
  
      // Calculate total deductions (Payment Data)
      let totalDeducted = 0;
      payments.forEach(payment => {
        totalDeducted += parseFloat(payment.amount);
      });
  
      // Calculate Total Absent Amount (absent days * daily salary)
      const absentAmount = absentDays * dailySalary;
  
      // Calculate Net Salary (total salary - deductions - absent amount)
      const netSalary = totalSalary - totalDeducted - absentAmount;
  
      // Add Fatimaz Fashion Header
      doc.setFontSize(20);
      doc.text("Fatimaz Fashion", 105, 20, { align: "center" });
  
      // Employee Details
      doc.setFontSize(12);
      doc.text(`Name: ${employee.name}`, 20, 40);
      doc.text(`Department: ${employee.department}`, 20, 50);
      doc.text(`Total Salary: ${totalSalary}`, 20, 60);
  
      // Payment Details (Advance Payments or Early Withdrawals)
      let yPosition = 80;
      doc.setFontSize(16);
      doc.text("Payment Details (Advance Payments)", 20, yPosition);
      yPosition += 10;
  
      payments.forEach((payment, index) => {
        doc.setFontSize(12);
        doc.text(`Date: ${payment.date}`, 20, yPosition);
        doc.text(`Amount: ${payment.amount}`, 120, yPosition);
        yPosition += 10;
      });
  
      // Total Payment Deducted
      doc.setFontSize(12);
      doc.text(`Total Deducted from Salary: ${totalDeducted}`, 20, yPosition);
      yPosition += 10;
  
      // Attendance Details (Absent Days)
      doc.setFontSize(16);
      doc.text("Absent Days Details", 20, yPosition);
      yPosition += 10;
  
      doc.setFontSize(12);
      doc.text(`Absent Days: ${absentDays}`, 20, yPosition);
      yPosition += 10;
  
      // Absent Amount Deducted
      doc.text(`Absent Deduction : ${absentAmount}`, 20, yPosition);
      yPosition += 10;
  
      // Net Salary
      doc.setFontSize(16);
      doc.text("Net Salary", 20, yPosition);
      yPosition += 10;
  
      doc.setFontSize(12);
      doc.text(`Net Salary: ${netSalary}`, 20, yPosition);
  
      // Download the PDF with the employee's name
      doc.save(`${employee.name}_payslip.pdf`);
      console.log('Payslip generated successfully!');
    } catch (error) {
      console.error("Error generating payslip:", error.message);
      alert('Error generating payslip. Please try again later.');
    }
  };
  
  
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black to-red-600 px-4 sm:px-6 md:px-10 mt-10">
      <div className="w-full md:w-4/5 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-6">
          EMPLOYEE SECTION
        </h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : employees.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="p-4">
              {selectedEmployee ? (
                <div className="p-6 border rounded-lg shadow-lg bg-white">
                  <h2 className="text-2xl font-bold mb-4 text-red-600">
                    {selectedEmployee.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <strong>Department:</strong> {selectedEmployee.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Contact Number:</strong>{" "}
                    {selectedEmployee.contactNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Total Salary:</strong> {selectedEmployee.salary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={() => handleDelete(selectedEmployee._id)}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 w-full sm:w-auto"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedEmployee(null)}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 w-full sm:w-auto"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={() => generatePayslipPDF(selectedEmployee)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 w-full sm:w-auto"
                    >
                      Generate Payslip
                    </button>
                  </div>

                  <EmployeePart />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {employees.map((employee) => (
                    <div
                      key={employee._id || employee.name}
                      className="bg-gradient-to-br from-gray-800 to-gray-600 hover:shadow-xl hover:scale-105 transform transition text-white p-4 rounded-lg shadow-md cursor-pointer"
                      onClick={() => handleCardClick(employee)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{employee.name}</h3>
                        <p className="text-sm">{employee.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No employees available.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeSection;
