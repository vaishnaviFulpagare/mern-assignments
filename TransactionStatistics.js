import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionStatistics = ({ selectedMonth }) => {
  const [stats, setStats] = useState({ totalSales: 0, totalSold: 0, totalNotSold: 0 });

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/statistics', { params: { month: selectedMonth } });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div>
      <h2>Statistics for {selectedMonth}</h2>
      <p>Total Sales: {stats.totalSales}</p>
      <p>Total Sold Items: {stats.totalSold}</p>
      <p>Total Not Sold Items: {stats.totalNotSold}</p>
    </div>
  );
};

export default TransactionStatistics;
