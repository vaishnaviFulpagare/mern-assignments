import React, { useState } from 'react';
import TransactionTable from './TransactionTable';
import TransactionStatistics from './TransactionStatistics';
import TransactionBarChart from './TransactionBarChart';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('March');

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div>
      <h1>Transactions Dashboard</h1>
      <select onChange={handleMonthChange} value={selectedMonth}>
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      <TransactionTable selectedMonth={selectedMonth} />
      <TransactionStatistics selectedMonth={selectedMonth} />
      <TransactionBarChart selectedMonth={selectedMonth} />
    </div>
  );
};

export default App;

