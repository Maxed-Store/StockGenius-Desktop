import React from "react";
import database from "../database/database";

const SalesReportPage = ({ storeId }) => {
  const [sales, setSales] = React.useState([]);

  React.useEffect(() => {
    const fetchSales = async () => {
      const sales = await database.getSales(storeId);
      setSales(sales);
    };
    fetchSales();
  }, [storeId]);

  return (
    <div>
      <h2>Sales Report</h2>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={index}>
              <td>{sale.product.name}</td>
              <td>{sale.quantity}</td>
              <td>{sale.product.price}</td>
              <td>{sale.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReportPage;