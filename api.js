const express = require('express');
const router = express.Router();
const {
  seedDatabase,
  listTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
} = require('../controllers/transactionController');

router.get('/seed', seedDatabase);
router.get('/transactions', listTransactions)
