import express from "express";
// import { Payment } from '../models/Payment'; 
import { addPayment, getAllPayments } from "../controllers/paymentController.js"


const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const payments = await Payment.find(); // Fetch all payments from the database
      res.status(200).json(payments); // Return the payments as a JSON response
    } catch (error) {
      res.status(500).json({ message: "Error fetching payments", error });
    }
  });
  
  // Route for adding a new payment
  router.post("/add-payment", addPayment); // Handle POST requests to add a new payment
  router.get("/get-all-payment", getAllPayments);

export default router;