const Transaction = require("../models/Transaction");

// ✅ Create new transaction
exports.addTransaction = async (req, res) => {
  try {
    console.log("📦 Creating transaction with data:", req.body);
    const transaction = new Transaction(req.body);
    const saved = await transaction.save();
    console.log("✅ Transaction saved:", saved);
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error saving transaction:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    console.log(`📊 Fetched ${transactions.length} transactions`);
    res.json(transactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    console.log("🗑 Request to delete transaction ID:", req.params.id);
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      console.warn("⚠️ Transaction not found:", req.params.id);
      return res.status(404).json({ error: "Transaction not found" });
    }

    console.log("✅ Transaction deleted:", transaction);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting transaction:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a transaction (missing before)
exports.updateTransaction = async (req, res) => {
  try {
    console.log("✏️ Request to update transaction ID:", req.params.id);
    console.log("📥 Update data:", req.body);

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      console.warn("⚠️ Transaction not found for update:", req.params.id);
      return res.status(404).json({ error: "Transaction not found" });
    }

    console.log("✅ Transaction updated:", updated);
    res.json(updated);
  } catch (error) {
    console.error("❌ Error updating transaction:", error.message);
    res.status(500).json({ error: error.message });
  }
};
