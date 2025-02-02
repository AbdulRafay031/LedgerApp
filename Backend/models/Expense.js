import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  totalSell: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  expenses: [
    {
      expenseType: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

export const Expense = mongoose.model("Expense", expenseSchema);


