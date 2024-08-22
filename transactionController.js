const axios = require('axios');
const Transaction = require('../models/Transaction');

// Seed the database with data from the third-party API
const seedDatabase = async (req, res) => {
  try {
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany(); // Clear the collection before seeding
    await Transaction.insertMany(data);
    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database' });
  }
};

// List all transactions with search and pagination
const listTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;

  const query = {
    dateOfSale: { $regex: `-${month}-`, $options: 'i' },
    $or: [
      { productTitle: { $regex: search, $options: 'i' } },
      { productDescription: { $regex: search, $options: 'i' } },
      { price: search ? Number(search) : { $exists: true } },
    ],
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get statistics
const getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `-${month}-`, $options: 'i' },
    });

    const totalSales = transactions.reduce((acc, t) => acc + t.price, 0);
    const soldItems = transactions.filter(t => t.sold).length;
    const unsoldItems = transactions.length - soldItems;

    res.json({
      totalSales,
      soldItems,
      unsoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Bar chart data
const getBarChartData = async (req, res) => {
  const { month } = req.query;

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `-${month}-`, $options: 'i' },
    });

    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0,
    };

    transactions.forEach(({ price }) => {
      if (price <= 100) priceRanges['0-100']++;
      else if (price <= 200) priceRanges['101-200']++;
      else if (price <= 300) priceRanges['201-300']++;
      else if (price <= 400) priceRanges['301-400']++;
      else if (price <= 500) priceRanges['401-500']++;
      else if (price <= 600) priceRanges['501-600']++;
      else if (price <= 700) priceRanges['601-700']++;
      else if (price <= 800) priceRanges['701-800']++;
      else if (price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    res.json(priceRanges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bar chart data' });
  }
};

// Pie chart data
const getPieChartData = async (req, res) => {
  const { month } = req.query;

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `-${month}-`, $options: 'i' },
    });

    const categoryCounts = transactions.reduce((acc, { category }) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    res.json(categoryCounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pie chart data' });
  }
};

// Combine data from all APIs
const getCombinedData = async (req, res) => {
  const { month } = req.query;

  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      Transaction.find({ dateOfSale: { $regex: `-${month}-`, $options: 'i' } }),
      Transaction.aggregate([
        { $match: { dateOfSale: { $regex: `-${month}-`, $options: 'i' } } },
        { $group: { _id: null, totalSales: { $sum: '$price' }, soldItems: { $sum: { $cond: ['$sold', 1, 0] } }, unsoldItems: { $sum: { $cond: ['$sold', 0, 1] } } } },
      ]),
      Transaction.aggregate([
        { $match: { dateOfSale: { $regex: `-${month}-`, $options: 'i' } } },
        {
          $bucket: {
            groupBy: '$price',
            boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
            default: '901-above',
            output: { count: { $sum: 1 } },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { dateOfSale: { $regex: `-${month}-`, $options: 'i' } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
    ]);

    res.json({ transactions, statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch combined data' });
  }
};

module.exports = {
  seedDatabase,
  listTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
};
