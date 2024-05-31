import React, { useState } from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import SalesPage from './pages/SalesPage.jsx';
import SalesReportPage from './pages/SalesReportPage.jsx';
import './index.css';

function App() {
  const [activeLink, setActiveLink] = useState(null);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="logo">
            <h3>MaxStore local</h3>
          </div>
          <ul className="nav-menu">
            <li>
              <NavLink
                to="/"
                className={`nav-link ${activeLink === '/' ? 'active-link' : ''}`}
                onClick={() => handleLinkClick('/')}
              >
                <i className="fa fa-home"></i> Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={`nav-link ${activeLink === '/products' ? 'active-link' : ''}`}
                onClick={() => handleLinkClick('/products')}
              >
                <i className="fa fa-box"></i> Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sales"
                className={`nav-link ${activeLink === '/sales' ? 'active-link' : ''}`}
                onClick={() => handleLinkClick('/sales')}
              >
                <i className="fa fa-shopping-cart"></i> Sales
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sales-report"
                className={`nav-link ${activeLink === '/sales-report' ? 'active-link' : ''}`}
                onClick={() => handleLinkClick('/sales-report')}
              >
                <i className="fa fa-chart-line"></i> Sales Report
              </NavLink>
            </li>
          </ul>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/sales-report" element={<SalesReportPage storeId={1} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;