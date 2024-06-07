import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import db from '../database/database';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

ChartJS.register(...registerables);

const SalesReportPage = () => {
  const [productSalesData, setProductSalesData] = useState({});
  const [inventoryChangesData, setInventoryChangesData] = useState({});
  const [userActivityData, setUserActivityData] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const audits = await db.db.audits.toArray();

        // Separate data for different types of audits
        const productSales = audits.filter(audit => audit.type === 'product_sold');
        const inventoryChanges = audits.filter(audit => audit.type === 'inventory_change');
        const userActivities = audits.filter(audit => audit.type === 'user_activity');

        // Process product sales data
        const productSalesLabels = productSales.map(audit => new Date(audit.timestamp).toLocaleString());
        const productSalesQuantities = productSales.map(audit => audit.data.quantity);
        const productSalesTotals = productSales.map(audit => audit.data.total);

        setProductSalesData({
          labels: productSalesLabels,
          datasets: [
            {
              label: 'Quantity Sold',
              data: productSalesQuantities,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Total Sales',
              data: productSalesTotals,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Process inventory changes data
        const inventoryChangesLabels = inventoryChanges.map(audit => new Date(audit.timestamp).toLocaleString());
        const inventoryChangesQuantities = inventoryChanges.map(audit => audit.data.change);

        setInventoryChangesData({
          labels: inventoryChangesLabels,
          datasets: [
            {
              label: 'Inventory Changes',
              data: inventoryChangesQuantities,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Process user activities data
        const userActivityLabels = userActivities.map(audit => new Date(audit.timestamp).toLocaleString());
        const userActivityCounts = userActivities.reduce((acc, audit) => {
          acc[audit.data.action] = (acc[audit.data.action] || 0) + 1;
          return acc;
        }, {});
        const userActivityActions = Object.keys(userActivityCounts);
        const userActivityValues = Object.values(userActivityCounts);

        setUserActivityData({
          labels: userActivityActions,
          datasets: [
            {
              label: 'User Activities',
              data: userActivityValues,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });

        setAuditLogs(audits);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        setError('Error fetching audit logs');
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Audit Logs</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        <div style={{ width: '45%', margin: '20px 0' }}>
          <h3>Product Sales</h3>
          <Bar data={productSalesData.datasets.length > 0 ? productSalesData : { datasets: [] }} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>
        <div style={{ width: '45%', margin: '20px 0' }}>
          <h3>Inventory Changes</h3>
          <Line data={inventoryChangesData.datasets.length > 0 ? inventoryChangesData : { datasets: [] }} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>
        <div style={{ width: '45%', margin: '20px 0' }}>
          <h3>User Activities</h3>
          <Pie data={userActivityData.datasets.length > 0 ? userActivityData : { datasets: [] }} />
        </div>
      </div>
      {auditLogs.length > 0 && (
        <div>
          <h3>Audit Logs Table</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs.map((audit, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(audit.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{audit.type}</TableCell>
                  <TableCell>{JSON.stringify(audit.data)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SalesReportPage;