import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const ProductList = ({ products, onAddToBill }) => {
  console.log(products);
  return (
    <Box my={3}>
      <Typography variant="h5" gutterBottom>
        Products
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Tooltip title={parseInt(product.quantity, 10) === 0 ? "Out of stock" : "Add to bill"}>
                    <span> {/* Tooltip needs a span if the child is disabled */}
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: parseInt(product.quantity, 10) === 0 ? "#FFEB3B" : "", 
                          color: parseInt(product.quantity, 10) === 0 ? "black" : "", 
                        }}
                        onClick={() => onAddToBill(product)}
                        disabled={parseInt(product.quantity, 10) === 0}
                        startIcon={parseInt(product.quantity, 10) === 0 ? <WarningIcon /> : null}
                      >
                        {parseInt(product.quantity, 10) === 0 ? "Out of Stock" : "Add to Bill"}
                      </Button>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductList;
