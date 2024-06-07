import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';


const BillReceipt = ({ billItems, onRemoveFromBill, store }) => {
  console.log(store)
  const totalAmount = billItems.reduce((total, item) => total + item.price, 0);

  return (
    <Box p={2} component={Paper} className="bill-receipt">
      <Box textAlign="center" mb={2} className="bill-header">
        <Typography variant="h6">{store?.name}</Typography>
        <Typography variant="subtitle1">{store?.addressLine1}</Typography>
        <Typography variant="subtitle1">{store?.addressLine2}</Typography>
        <Typography variant="subtitle2">Phone: {store?.phone}</Typography>
        <Typography variant="subtitle2">Date: {new Date().toLocaleDateString()}</Typography>
      </Box>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" color="secondary" size="small" onClick={() => onRemoveFromBill(index)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
      <Box textAlign="right" mt={2} className="total-amount">
        <Typography variant="h6">Total Amount: ${totalAmount.toFixed(2)}</Typography>
      </Box>
      <Divider />
      <Box textAlign="center" mt={2} className="bill-footer">
        <Typography variant="body1">Thank you for shopping with us!</Typography>
      </Box>
    </Box>
  );
};

export default BillReceipt;
