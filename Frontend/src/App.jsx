import React, { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Component/Navbar";
import AddParty from "./Component/AddParty";
import Home from "./Component/Home";
import PartyAccount from "./Component/PartyAccount";
import AddEmployee from "./Component/AddEmployee";
import AddExpense from "./Component/AddExpense";
import Status from "./Component/Status";
import Attendance from "./Attendance";
import Payment from "./Payment";
import Loading from "./Component/Loading";
import { ToastContainer } from "react-toastify";
import Employee from "./Employee"
import Expense from "./Expense"

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParty, setSelectedParty] = useState(null);
  const [parties, setParties] = useState([]);

  // Assuming you have these functions defined
  const handleAddParty = (newParty) => {
    setParties([...parties, newParty]);
  };

  const handleDeleteParty = (partyIndex) => {
    const updatedParties = parties.filter((_, index) => index !== partyIndex);
    setParties(updatedParties);
  };

  const handleUpdateParty = (updatedParty) => {
    const updatedParties = parties.map((party) =>
      party.id === updatedParty.id ? updatedParty : party
    );
    setParties(updatedParties);
  };

  // Simulating loading state (for example, from an API)
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-black to-red-600">
        {/* Conditionally render Loading component or the app content */}
        {isLoading ? (
          <Loading onComplete={() => setIsLoading(false)} /> // Call onComplete after 3 seconds to hide the loading
        ) : (
          <>
          <ToastContainer />
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  !selectedParty ? (
                    <>
                      <AddParty onAddParty={handleAddParty} />
                      <AddEmployee />
                      <AddExpense />
                      <Home
                        parties={parties}
                        onSelectParty={(index) => setSelectedParty(parties[index])}
                        onDeleteParty={handleDeleteParty}
                      />
                      {/* Only show EmployeeSection and ExpenseSection on the Home page */}
                    </>
                  ) : (
                    <PartyAccount
                      party={selectedParty}
                      onUpdateParty={(updatedParty) => {
                        handleUpdateParty(updatedParty);
                        setSelectedParty(null);
                      }}
                    />
                  )
                }
              />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/status" element={<Status />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/expense" element={<Expense />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;





