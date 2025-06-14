const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema({
  productName: String,
  gstPercent: Number,
  commissionPercent: Number,
});

module.exports = mongoose.model("Tax", taxSchema);
