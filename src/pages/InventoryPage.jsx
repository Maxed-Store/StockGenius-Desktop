import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Grid,
} from '@material-ui/core';
import db from '../database/database';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    container: {
        padding: theme.spacing(3),
    },
    filterContainer: {
        marginBottom: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(2),
    },
}));

function InventoryPage() {
    const classes = useStyles();
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        minQuantity: '',
        maxQuantity: '',
    });

    const fetchFilteredProducts = async () => {
        const { name, minQuantity, maxQuantity } = filters;
        const filteredProducts = await db.getFilteredProducts({
            name,
            minQuantity: minQuantity !== '' ? Number(minQuantity) : undefined,
            maxQuantity: maxQuantity !== '' ? Number(maxQuantity) : undefined,
        });
        setProducts(filteredProducts);
    };

    useEffect(() => {
        fetchFilteredProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        fetchFilteredProducts();
    };

    return (
        <div className={classes.container}>
            <Grid container spacing={2} className={classes.filterContainer}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Product Name"
                        name="name"
                        value={filters.name}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Min Quantity"
                        name="minQuantity"
                        value={filters.minQuantity}
                        onChange={handleChange}
                        variant="outlined"
                        type="number"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Max Quantity"
                        name="maxQuantity"
                        value={filters.maxQuantity}
                        onChange={handleChange}
                        variant="outlined"
                        type="number"
                    />
                </Grid>
                <Grid item xs={12} sm={4} className={classes.button}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="inventory table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">User Defined ID</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((product) => (
                            <TableRow key={product.id}>
                                <TableCell component="th" scope="row">
                                    {product.id}
                                </TableCell>
                                <TableCell align="right">{product.userDefinedId}</TableCell>
                                <TableCell align="right">{product.name}</TableCell>
                                <TableCell align="right">{product.quantity}</TableCell>
                                <TableCell align="right">{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default InventoryPage;