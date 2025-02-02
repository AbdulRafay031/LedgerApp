import mongoose from "mongoose";

// Define Payment schema
const PaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
});

// Create and export the Payment model
export const Payment = mongoose.model("Payment", PaymentSchema);

