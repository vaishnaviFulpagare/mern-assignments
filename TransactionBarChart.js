import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionBarChart = ({ selectedMonth }) => {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchChartData();
  }, [selectedMonth]);

  const fetchChartData = async () => {
    try {
      const response = await axios.get('/api/chartdata', { params: { month: selectedMonth } });
      const chartData = response.data;

      setData({
        labels: chartData.labels,
        datasets: [
          {
            label: 'Price Range',
            data: chartData.data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  return (
    <div>
      <h2>Price Range Chart for {selectedMonth}</h2>
      <Bar data={data} />
    </div>
  );
};

export default TransactionBarChart;
