import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Snackbar
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import Alert from './Alert.jsx';


const useStyles = makeStyles((theme) => ({
  receipt: {
    padding: theme.spacing(2),
    fontFamily: 'Courier, monospace',
    maxWidth: 400,
    margin: '0 auto',
    '@media print': {
      boxShadow: 'none',
      margin: 0,
      maxWidth: '100%',
      padding: 0,
    }
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  footer: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  table: {
    marginTop: theme.spacing(2),
  },
  tableCell: {
    padding: theme.spacing(0.5),
  },
  totalAmount: {
    textAlign: 'right',
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
  },
  printButton: {
    display: 'block',
    '@media print': {
      display: 'none',
    },
  },
  removeButton: {
    display: 'block',
    '@media print': {
      display: 'none',
    },
  },
  noItems: {
    textAlign: 'center',
    padding: theme.spacing(2),
  }
}));


const BillReceipt = ({ billItems, onRemoveFromBill, store, onPrint, products, handleAddToBill }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  // Group items by name and calculate quantities and total amount
  const itemMap = billItems.reduce((map, item) => {
    if (map[item.name]) {
      map[item.name].quantity += 1;
      map[item.name].totalPrice += item.price;
    } else {
      map[item.name] = { ...item, quantity: 1, totalPrice: item.price };
    }
    return map;
  }, {});

  const groupedItems = Object.values(itemMap);
  const totalAmount = groupedItems.reduce((total, item) => total + item.totalPrice, 0);

  const handleAddToBillChecked = (item) => {
    const product = products.find((product) => product.name === item.name);
    const currentQuantity = itemMap[item.name] ? itemMap[item.name].quantity : 0;

    if (currentQuantity < parseInt(product.quantity, 10)) {
      handleAddToBill(item);
    } else {
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box component={Paper} className={classes.receipt}>
      <Box className={classes.header}>
        <Typography variant="h6">{store?.name}</Typography>
        <Typography variant="body2">{store?.addressLine1}</Typography>
        <Typography variant="body2">{store?.addressLine2}</Typography>
        <Typography variant="body2">Phone: {store?.phone}</Typography>
        <Typography variant="body2">Date: {new Date().toLocaleDateString()}</Typography>
      </Box>
      <Divider />
      {groupedItems.length > 0 ? (
        <>
          <TableContainer className={classes.table}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>Item</TableCell>
                  <TableCell className={classes.tableCell} align="right">Quantity</TableCell>
                  <TableCell className={classes.tableCell} align="right">Price</TableCell>
                  <TableCell className={classes.tableCell} align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>{item.name}</TableCell>
                    <TableCell className={classes.tableCell} align="right">{item.quantity}</TableCell>
                    <TableCell className={classes.tableCell} align="right">${item.totalPrice.toFixed(2)}</TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        className={classes.removeButton}
                        onClick={() => onRemoveFromBill(index)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <Box className={classes.totalAmount}>
            <Typography variant="body1">Total: ${totalAmount.toFixed(2)}</Typography>
          </Box>
        </>
      ) : (
        <Box className={classes.noItems}>
          <Typography variant="body1">No items in the bill</Typography>
        </Box>
      )}
      <Divider />
      <Box className={classes.footer}>
        <Typography variant="body2">Thank you for shopping with us!</Typography>
      </Box>
      {groupedItems.length > 0 && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={onPrint}
            className={classes.printButton}
          >
            Print Bill
          </Button>
        </Box>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning">
          No more products available
        </Alert>
      </Snackbar> 
    </Box>
  );
};

export default BillReceipt;
