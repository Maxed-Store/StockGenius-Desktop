import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import db from '../database/database';

const SalesChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Quantity Sold',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
      {
        label: 'Total Sales',
        data: [],
        backgroundColor: 'rgba(255,99,132,0.6)',
      },
    ],
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      const audits = await db.audits.where('type').equals('product_sold').toArray();

      const salesData = audits.reduce((acc, audit) => {
        const { productId, quantity, total } = audit.data;
        const existingProduct = acc.find((product) => product.productId === productId);

        if (existingProduct) {
          existingProduct.quantity += quantity;
          existingProduct.total += total;
        } else {
          acc.push({ productId, quantity, total });
        }

        return acc;
      }, []);

      const labels = salesData.map((product) => `Product ${product.productId}`);
      const quantities = salesData.map((product) => product.quantity);
      const totals = salesData.map((product) => product.total);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Quantity Sold',
            data: quantities,
            backgroundColor: 'rgba(75,192,192,0.6)',
          },
          {
            label: 'Total Sales',
            data: totals,
            backgroundColor: 'rgba(255,99,132,0.6)',
          },
        ],
      });
    };

    fetchSalesData();
  }, []);

  return (
    <div>
      <h2>Product Sales Data</h2>
      <Bar
        data={chartData}
        options={{
          scales: {
            x: {
              type: 'categorical',
            },
            y: {
              type: 'linear',
            },
          },
        }}
      />
    </div>
  );
};

export default SalesChart;