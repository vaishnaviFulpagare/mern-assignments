import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, searchTerm, currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions', {
        params: {
          month: selectedMonth,
          search: searchTerm,
          page: currentPage
        }
      });
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
      <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>Next</button>
    </div>
  );
};

export default TransactionTable;
