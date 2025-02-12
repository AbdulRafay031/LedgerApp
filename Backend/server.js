import express from"express"
import dotenv from"dotenv"
import path from 'path'
import cors from"cors"
import {connectDB} from"./config/db.js"
import partyRoutes from"./routes/partyRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import employeeRoutes from "./routes/employeeRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js"

import { fileURLToPath } from 'url'; // Import 'fileURLToPath' to convert URL to file path





// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


// PartyRoutes
app.use("/api/parties", partyRoutes); 
app.use("/api/user", partyRoutes);
app.use("/api/delete", partyRoutes);
app.use("/api/update",  partyRoutes);

// EmployeeRoutes
app.use("/api/employees", employeeRoutes);
app.use("/api/user", employeeRoutes);
app.use("/api/delete", employeeRoutes);

// ExpenseRoutes
app.use("/api/expenses", expenseRoutes);
app.use("/api/user", expenseRoutes);
app.use("/api/delete", expenseRoutes);

// AttendanceRoutes
app.use("/api/attendances", attendanceRoutes);
app.use("/api/user", attendanceRoutes);

// Payment Routes 
app.use("/api/payments", paymentRoutes);
app.use("/api/user", paymentRoutes);
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
