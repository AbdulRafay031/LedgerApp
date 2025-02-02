import React, { useState } from 'react';
import { addEmployee } from "../services/employeeService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const AddEmployee = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    name: '',
    department: '',
    salary: '',
    contactNumber: '',
    dateOfJoining: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const newEmployee = await addEmployee(employeeData);
      // Reset form and close it
      setEmployeeData({ name: '', department: '', salary: '', contactNumber: '', dateOfJoining: '' });
      setIsFormOpen(false);

      // Show success toast
      toast.success('Employee added successfully!');
    } catch (error) {
      // Show error toast
      console.error("Error adding employee:", error.message);
      toast.error('Error adding employee. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-black to-red-600">
      {!isFormOpen ? (
        <div
          className="w-60 h-20 mt-10 flex items-center justify-center border border-white rounded-md cursor-pointer hover:shadow-lg transition-all duration-300 text-white"
          onClick={() => setIsFormOpen(true)}
        >
          ADD EMPLOYEE
          <span className="text-6xl text-white font-bold">+</span>
        </div>
      ) : (
        <div className="w-full max-w-sm bg-gradient-to-r from-black to-red-200 p-8 rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105">
          <h2 className="text-3xl font-semibold mb-6 text-center text-red-600">
            Add Employee
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={employeeData.name}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={employeeData.department}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          />

          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={employeeData.salary}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={employeeData.contactNumber}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          />

          <input
            type="date"
            name="dateOfJoining"
            placeholder="Date of Joining"
            value={employeeData.dateOfJoining}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 rounded-md hover:bg-gradient-to-l transition-all duration-300"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddEmployee;

