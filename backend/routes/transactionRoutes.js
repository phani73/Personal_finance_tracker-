const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");

router.get("/", getTransactions);
router.post("/", addTransaction);
router.delete("/:id", deleteTransaction);
router.put("/:id", updateTransaction); 
module.exports = router;
