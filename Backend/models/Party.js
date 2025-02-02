import mongoose from "mongoose";

const PartySchema = new mongoose.Schema({
  name: { type: String, required: true },
  shopName: { type: String, required: true },
  totalCredit: { type: Number, required: true },
  number: { type: String, required: true },
  creditHistory: [Number],
  transactions: [
    {
      amount: Number,
      mode: String,
      date: Date,
    },
  ],
});

export const Party = mongoose.model("Party", PartySchema);
