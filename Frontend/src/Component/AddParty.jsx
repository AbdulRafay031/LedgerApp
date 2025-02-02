import { useState } from "react";
import { addParty } from "../services/partyService";
import { toast } from "react-toastify"; // Import toast

const AddParty = ({ onAddParty }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [partyData, setPartyData] = useState({
    name: "",
    shopName: "",
    totalCredit: "",
    number: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartyData({ ...partyData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const newParty = await addParty(partyData);
      onAddParty(newParty);
      setPartyData({ name: "", shopName: "", totalCredit: "", number: "" });
      setIsFormOpen(false);
      
      // Show success toast after submitting
      toast.success("Party added successfully!");  // Show success toast
    } catch (error) {
      console.error("Error adding party:", error.message);
      toast.error("Failed to add party.");  // Show error toast in case of failure
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-black to-red-600">
      {!isFormOpen ? (
        <div
          className="w-60 h-20 mt-10 flex items-center justify-center border border-white rounded-md cursor-pointer hover:shadow-lg transition-all duration-300 text-white"
          onClick={() => setIsFormOpen(true)}
        >
          ADD PARTY
          <span className="text-6xl text-white font-bold">+</span>
        </div>
      ) : (
        <div className="w-full max-w-sm bg-gradient-to-r from-black to-red-200 p-8 rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105">
          <h2 className="text-3xl font-semibold mb-6 text-center text-red-600">
            Add Party
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={partyData.name}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          />

          <input
            type="text"
            name="shopName"
            placeholder="Shop Name"
            value={partyData.shopName}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          />

          <input
            type="number"
            name="totalCredit"
            placeholder="Total Credit"
            value={partyData.totalCredit}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          />

          <input
            type="text"
            name="number"
            placeholder="Number"
            value={partyData.number}
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

export default AddParty;

