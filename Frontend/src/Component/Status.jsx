import React, { useState, useEffect } from "react";
import axios from "axios";

const Status = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [months, setMonths] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");

  // Group attendance data by months
  const groupByMonth = (data) => {
    return data.reduce((acc, item) => {
      const month = new Date(item.date).toLocaleString("default", { month: "long", year: "numeric" });
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  };

  // Fetch all employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/get-all-employee");
        if (response.data?.success) {
          setEmployees(Array.isArray(response.data.data) ? response.data.data : []);
        } else {
          console.error("Failed to fetch employees:", response.data?.message);
        }
      } catch (error) {
        console.error("Error fetching employees:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch attendance data for the selected employee
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedEmployee) return; // Don't fetch if no employee is selected

      try {
        const response = await axios.get(`http://localhost:8000/api/user/get-all-attendance`, {
          params: { employeeName: selectedEmployee },  // Pass employeeName as query param
        });

        const employeeAttendance = response.data.data || [];

        // Group the attendance by months
        const groupedMonths = groupByMonth(employeeAttendance);
        setMonths(Object.keys(groupedMonths));
        setFilteredData(groupedMonths);
        setAttendanceData(employeeAttendance);
      } catch (error) {
        console.error("Error fetching attendance data:", error.message);
      }
    };

    fetchAttendance();
  }, [selectedEmployee]);

  // Fetch payment data when both employee and month are selected
  useEffect(() => {
    const fetchPayments = async () => {
      if (!selectedEmployee || !selectedMonth) return; // Don't fetch if no employee or month is selected
  
  
      try {
        const response = await axios.get(`http://localhost:8000/api/user/get-all-payment`, {
          params: { employeeName: selectedEmployee },
        });
  
  
        if (response.data?.success) {
          const filteredPayments = response.data.data.filter((payment) => {
            const paymentMonth = new Date(payment.date).toLocaleString("default", { month: "long", year: "numeric" });
            return paymentMonth === selectedMonth;
          });
  
          setPaymentData(filteredPayments); // Set filtered payment data
        } else {
          console.error("No payment data available for this employee.");
          setPaymentData([]); // Set to empty array in case no data is available
        }
      } catch (error) {
        console.error("Error fetching payment data:", error.message);
        setPaymentData([]); // Ensure empty array is set in case of error
      }
    };
  
    fetchPayments();
  }, [selectedEmployee, selectedMonth]);
  

  const handleEmployeeSelect = (e) => {
    setSelectedEmployee(e.target.value);
    setSelectedMonth(""); // Reset month selection when changing employee
  };

  const renderAttendanceTableRows = () => {
    if (!selectedMonth) return null;
  
    const rows = filteredData[selectedMonth] || [];
    return rows.map((record, index) => (
      <tr key={index} className="border-b">
        <td className="px-4 py-2">{index + 1}</td>
        <td className="px-4 py-2">{record.name}</td>
        <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
        <td className="px-4 py-2">{record.status}</td>
        <td className="px-4 py-2">{record.checkinTime}</td>
        <td className="px-4 py-2">{record.checkoutTime}</td>
      </tr>
    ));
  };
  
  const renderPaymentTableRows = () => {
    if (paymentData.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
            No payment data available for this employee.
          </td>
        </tr>
      );
    }
  
    return paymentData.map((payment, index) => (
      <tr key={index} className="border-b">
        <td className="px-4 py-2">{index + 1}</td>
        <td className="px-4 py-2">{payment.name}</td>
        <td className="px-4 py-2">{payment.amount}</td>
        <td className="px-4 py-2">{new Date(payment.date).toLocaleDateString()}</td>
      </tr>
    ));
  };
  
  
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-3xl font-extrabold text-center text-red-600 mb-6">Fatimaz Fashion Employee Status</h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Employee:</label>
        <select
          value={selectedEmployee}
          onChange={handleEmployeeSelect}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="" disabled>Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id || employee.name} value={employee.name}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      {months.length > 0 && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="" disabled>Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      )}

      {/* Attendance Table */}
      {selectedMonth && (
        <div className="overflow-x-auto mb-6">
          <h2 className="text-3xl font-extrabold text-center text-red-600 mb-6">Attendance Data</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2">S.No</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Check-in Time</th>
                <th className="px-4 py-2">Check-out Time</th>
              </tr>
            </thead>
            <tbody>{renderAttendanceTableRows()}</tbody>
          </table>
        </div>
      )}

      {/* Payment Table */}
      {selectedEmployee && selectedMonth && (
        <div className="overflow-x-auto">
          <h2 className="text-3xl font-extrabold text-center text-red-600 mb-6">Payment Data</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2">S.No</th>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>{renderPaymentTableRows()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Status;


