const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getAllInvoices,
} = require("../controllers/order.controller");

router.post("/order", placeOrder);
router.get("/invoices", getAllInvoices); // ✅ Add this

module.exports = router;
