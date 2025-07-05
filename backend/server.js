const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const budgetRoutes = require("./routes/budget");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Finance API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
