import axios from "axios";

const API_URL = "http://localhost:8000/api/parties";

// Add a new party
export const addParty = async (partyData) => {
  try {
    const response = await axios.post(`${API_URL}/add-party`, partyData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add party: " + error.message);
  }
};


