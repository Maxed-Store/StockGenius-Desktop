import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import db from '../database/database';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TextField, Button } from '@mui/material';

ChartJS.register(...registerables);

const SalesReportPage = () => {
  const [productSalesData, setProductSalesData] = useState({});
  const [inventoryChangesData, setInventoryChangesData] = useState({});
  const [userActivityData, setUserActivityData] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [sortColumn, setSortColumn] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterText, setFilterText] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const offset = page * rowsPerPage;
        const audits = await db.getAuditLogsPaginated(offset, rowsPerPage);
        const totalCount = await db.db.audits.count();
        setTotalPages(Math.ceil(totalCount / rowsPerPage));

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
              yAxisID: 'y1',
            },
            {
              label: 'Total Sales',
              data: productSalesTotals,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              yAxisID: 'y2',
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
    // Fetch the total count of audit logs only once
    const fetchTotalCount = async () => {
      const totalCount = await db.db.audits.count();
      setTotalPages(Math.ceil(totalCount / rowsPerPage));
    };
    fetchTotalCount();
  }, [page, rowsPerPage]);

  const handleSort = (column) => {
    setSortColumn(column);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const sortedAndFilteredLogs = auditLogs
    .filter((log) => JSON.stringify(log).toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedLogs = sortedAndFilteredLogs.slice(startIndex, endIndex);
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const assignColorsToDatasets = (data) => {
    if (data.datasets && data.datasets.length > 0) {
      const dataset = data.datasets[0];
      dataset.backgroundColor = dataset.data.map((_, index) => colors[index % colors.length]);
      return { ...data, datasets: [dataset] };
    }
    return data;
  };

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
          <Bar
            data={productSalesData.datasets && productSalesData.datasets.length > 0 ? productSalesData : { labels: [], datasets: [] }}
            options={{
              scales: {
                y1: {
                  type: 'linear',
                  position: 'left',
                  beginAtZero: true,
                },
                y2: {
                  type: 'linear',
                  position: 'right',
                  beginAtZero: true,
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                      }
                      return label;
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div style={{ width: '45%', margin: '20px 0' }}>
          <h3>Inventory Changes</h3>
          <Line
            data={inventoryChangesData.datasets && inventoryChangesData.datasets.length > 0 ? inventoryChangesData : { labels: [], datasets: [] }}
            options={{
              scales: {
                y: {
                  beginAtZero: true
                }
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('en-US').format(context.parsed.y);
                      }
                      return label;
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div style={{ width: '45%', margin: '20px 0' }}>
          <h3>User Activities</h3>
          <Pie
            data={userActivityData.datasets && userActivityData.datasets.length > 0 ? assignColorsToDatasets(userActivityData) : { labels: [], datasets: [] }}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.raw !== null) {
                        label += new Intl.NumberFormat('en-US').format(context.raw);
                      }
                      return label;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
      {auditLogs.length > 0 && (
        <div>
          <TextField
            label="Filter Logs"
            value={filterText}
            onChange={handleFilterChange}
            style={{ marginBottom: '16px' }}
          />
          <h3>Audit Logs Table</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'timestamp'}
                    direction={sortColumn === 'timestamp' ? sortDirection : 'asc'}
                    onClick={() => handleSort('timestamp')}
                  >
                    Timestamp
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'type'}
                    direction={sortColumn === 'type' ? sortDirection : 'asc'}
                    onClick={() => handleSort('type')}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === 'data'}
                    direction={sortColumn === 'data' ? sortDirection : 'asc'}
                    onClick={() => handleSort('data')}
                  >
                    Data
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLogs.map((audit, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(audit.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{audit.type}</TableCell>
                  <TableCell>{JSON.stringify(audit.data)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Button
              variant="contained"
              color="primary"
              disabled={page === 0}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <span style={{ margin: '0 16px' }}>
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="contained"
              color="primary"
              disabled={page === totalPages - 1}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReportPage;
