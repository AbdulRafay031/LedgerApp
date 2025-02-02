import { useState } from "react";

const PartyAccount = ({ party, onUpdateParty }) => {
  const [mode, setMode] = useState(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        throw new Error("Invalid amount entered.");
      }

      // Create a transaction object
      const transaction = {
        mode,
        amount: numericAmount,
        date,
      };

      // Prepare the updated total credit
      const updatedTotalCredit =
        mode === "debit"
          ? (party.totalCredit || 0) + numericAmount
          : (party.totalCredit || 0) - numericAmount;

      // API call to update the database
      const response = await fetch(
        `http://localhost:8000/api/update/update-credit/${party._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalCredit: updatedTotalCredit,
            transaction,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the party in the database.");
      }

      // Update the parent state
      onUpdateParty({
        ...party,
        totalCredit: updatedTotalCredit,
      });

      // Update localStorage with the transaction
      const partiesFromLocalStorage =
        JSON.parse(localStorage.getItem("parties")) || [];
      const updatedParties = partiesFromLocalStorage.map((storedParty) => {
        if (storedParty.name === party.name) {
          return {
            ...storedParty,
            transactions: [...(storedParty.transactions || []), transaction],
          };
        }
        return storedParty;
      });

      if (
        !updatedParties.some((storedParty) => storedParty.name === party.name)
      ) {
        updatedParties.push({ name: party.name, transactions: [transaction] });
      }

      localStorage.setItem("parties", JSON.stringify(updatedParties));

      // Reset form
      setMode(null);
      setAmount("");
      setDate("");
    } catch (error) {
      console.error("Error:", error.message || error);
      alert(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">{party.name}'s Account</h2>
      <p className="text-lg">Shop: {party.shopName}</p>
      <p className="text-lg">Total Credit: {party.totalCredit}</p>

      <div className="mt-6 space-x-4">
        <button
          onClick={() => setMode("debit")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Debit
        </button>
        <button
          onClick={() => setMode("payment")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Give Payment
        </button>
      </div>

      {mode && (
        <div className="mt-6">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded mb-3 text-black"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded mb-3 text-black"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-black to-red-600 text-white py-2 rounded border-white"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default PartyAccount;
