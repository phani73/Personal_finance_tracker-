const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");

// GET all budgets
router.get("/", async (req, res) => {
  try {
    const { month } = req.query;

    let budgets;
    if (month) {
      // Filter budgets by `month` if query param exists
      budgets = await Budget.find({ month });
    } else {
      budgets = await Budget.find(); // return all
    }

    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

// POST create a budget
router.post("/", async (req, res) => {
  try {
    const { category, amount, month } = req.body;
    const newBudget = new Budget({ category, amount, month });
    const saved = await newBudget.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create budget" });
  }
});

// PUT update a budget
router.put("/:id", async (req, res) => {
  try {
    const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update budget" });
  }
});

// DELETE a budget
router.delete("/:id", async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete budget" });
  }
});

module.exports = router;
