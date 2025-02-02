import axios from "axios";

// Set the API URL for payments
const API_URL = "http://localhost:8000/api/payments";

// Add a new payment
export const addPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/add-payment`, paymentData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add payment: " + error.message);
  }
};


