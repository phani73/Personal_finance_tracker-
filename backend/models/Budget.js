const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String, // Format: "YYYY-MM"
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
