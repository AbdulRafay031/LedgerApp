import { Payment } from "../models/Payment.js";

const addPayment = async (req, res) => {
    try {
      const payment = new Payment(req.body);
      await payment.save(); // Save the payment to the database
      res.status(201).json({ message: "Payment added successfully", payment }); // Return a success response
    } catch (error) {
      res.status(500).json({ message: "Error adding payment", error: error.message }); // Return an error response if something goes wrong
    }

  };


  const getAllPayments = async (req, res) => {
    try {
      const { employeeName } = req.query;  // Get the employee name from query params
  
      // If employeeName is provided, filter by it
      const payments = employeeName
        ? await Payment.find({ name: employeeName })  // Correct the field name to "name" instead of "employeeName"
        : await Payment.find();  // Fetch all if no employeeName is provided
  
      return res.status(200).json({
        success: true,
        message: "Get all payments successfully",
        data: payments,
      });
    } catch (error) {
      console.error("Error fetching payments:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch payments",
        error: error.message,
      });
    }
  };
  
  
  
  
  export { addPayment, getAllPayments }