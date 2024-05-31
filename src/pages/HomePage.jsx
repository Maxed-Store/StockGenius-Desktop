import React, { useState, useEffect } from 'react';
import database from '../database/database';
import ProductList from '../components/ProductList.jsx';
import BillReceipt from '../components/BillReceipt.jsx';

const HomePage = ({ storeId = 1 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      if (storeId !== undefined) {
        const recentSearches = await database.getRecentSearches(storeId);
        setRecentSearches(recentSearches);
      }
    };
    fetchRecentSearches();
  }, [storeId]);



  const handleSearch = async () => {
    try {
      const searchResults = await database.searchProducts(searchTerm);
      if (searchResults.length === 0) {
        setError('No products found');
      } else {
        setError(null);
        setProducts(searchResults);
        await database.addRecentSearch(storeId, searchTerm);
      }
    } catch (err) {
      setError(err.message);
    }
  };


  const handleAddToBill = (product) => {
    setBillItems((prevBillItems) => [...prevBillItems, product]);
  };

  const handleRemoveFromBill = (index) => {
    setBillItems((prevBillItems) => prevBillItems.filter((_, i) => i !== index));
  };
const handlePrint = () => {
  const printWindow = window.open('', '_blank');
  const billHTML = document.querySelector('.bill-container').outerHTML;

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Bill</title>
        <style>
          /* Define your print styles here */
          body {
            font-family: Arial, sans-serif;
          }
          .bill-container {
            width: 100%;
            margin: auto;
          }
          /* Add more styles as needed */
        </style>
      </head>
      <body>
        ${billHTML}
      </body>
    </html>
  `);

  printWindow.document.addEventListener('DOMContentLoaded', () => {
    printWindow.print();
  });

  printWindow.document.addEventListener('DOMContentLoaded', () => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  });
};

  return (
    <div>
      <h1>Store Management App</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="recent-searches">
        <h3>Recent Searches</h3>
        <ul>
          {recentSearches.map((search, index) => (
            <li key={index} onClick={() => setSearchTerm(search)}>
              {search}
            </li>
          ))}
        </ul>
      </div>
      <div className="product-list">
        <ProductList products={products} onAddToBill={handleAddToBill} />
      </div>
      <div className="bill-container">
        <h2>Bill</h2>
        <BillReceipt billItems={billItems} onRemoveFromBill={handleRemoveFromBill} />
        <button onClick={handlePrint}>Print Bill</button>
      </div>
    </div>
  );
};

export default HomePage;