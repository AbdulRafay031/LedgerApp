import React, { useState, useEffect } from "react";
import axios from "axios";
import PartyAccount from "./PartyAccount";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Home = () => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParty, setSelectedParty] = useState(null);

  const handleCardClick = (party) => {
    if (party) {
      setSelectedParty(party);
    } else {
      console.error("Party object is invalid:", party);
    }
  };

  const handleUpdateParty = (updatedParty) => {
    const updatedParties = parties.map((party) =>
      party.name === updatedParty.name ? updatedParty : party
    );
    setParties(updatedParties);
    localStorage.setItem("parties", JSON.stringify(updatedParties));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/get-all-party"
        );
        if (response.data && response.data.success) {
          setParties(response.data.data);
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

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete/delete-party/${id}`
      );
      if (response.data.success) {
        alert("Party deleted successfully");
        setParties((prev) => prev.filter((party) => party._id !== id));
        setSelectedParty(null);
      } else {
        alert("Failed to delete party");
      }
    } catch (error) {
      console.error("Error deleting party:", error.message);
      alert("An error occurred while deleting the party.");
    }
  };

  const generateStatementPDF = (party) => {
    if (!party) return;

    const tableRows = [];
    let prevCredit = 0;

    tableRows.push([  
      party.name,
      party.shopName,
      "-",
      "-",
      "-",
      "-",
      "-",
      prevCredit.toFixed(2),
    ]);

    const sortedTransactions = party.transactions.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    sortedTransactions.forEach((transaction) => {
      const currentCredit =
        transaction.mode === "debit"
          ? prevCredit + transaction.amount
          : prevCredit - transaction.amount;

      tableRows.push([
        party.name,
        party.shopName,
        prevCredit.toFixed(2),
        transaction.mode === "debit" ? transaction.amount.toFixed(2) : "-",
        transaction.mode === "debit" ? transaction.date : "-",
        transaction.mode === "payment" ? transaction.amount.toFixed(2) : "-",
        transaction.mode === "payment" ? transaction.date : "-",
        currentCredit.toFixed(2),
      ]);

      prevCredit = currentCredit;
    });

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Shop Statement", 14, 20);
    doc.setFontSize(14);
    doc.text(`Shop Name: ${party.shopName}`, 14, 30);

    doc.autoTable({
      startY: 40,
      head: [
        [
          "Name",
          "Shop Name",
          "Prev Credit",
          "Debit Amount",
          "Debit Date",
          "Credit Amount",
          "Credit Date",
          "Total Credit",
        ],
      ],
      body: tableRows,
    });

    doc.save(`${party.shopName}_Statement.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-red-600 flex items-center justify-center py-10">
      <div className="w-full md:w-4/5 bg-white rounded-lg shadow-2xl p-6">
        <h1 className="text-3xl font-extrabold text-center text-red-600 mb-6">
          LEDGER
        </h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : parties.length > 0 ? (
          <div className="overflow-x-auto">
            {selectedParty ? (
              <div className="p-4 border rounded-lg shadow-lg bg-gray-100">
                <h2 className="text-2xl font-bold mb-2 text-red-500">
                  {selectedParty.name}
                </h2>
                <p>
                  <strong>Shop Name:</strong> {selectedParty.shopName}
                </p>
                <p>
                  <strong>Total Credit:</strong> {selectedParty.totalCredit}
                </p>
                <p>
                  <strong>Number:</strong> {selectedParty.number}
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => handleDelete(selectedParty._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedParty(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => generateStatementPDF(selectedParty)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Statement
                  </button>
                </div>
                <PartyAccount
                  party={selectedParty}
                  onUpdateParty={(updatedParty) => {
                    handleUpdateParty(updatedParty);
                    setSelectedParty(null);
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {parties.map((party) => (
                  <div
                    key={party._id} // Change here: use party._id for the unique key
                    className="border rounded-lg shadow-lg p-6 bg-gradient-to-br from-gray-800 to-gray-600 hover:shadow-xl hover:scale-105 transform transition"
                    onClick={() => handleCardClick(party)}
                  >
                    <h3 className="text-lg font-bold text-white">{party.name}</h3>
                    <p className="text-white">ShopName: {party.shopName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">No parties found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;

