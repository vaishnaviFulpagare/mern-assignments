const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: Number,
  productTitle: String,
  productDescription: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  sold: Boolean,
});

module.exports = mongoose.model('Transaction', transactionSchema);
