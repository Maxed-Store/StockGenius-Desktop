import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CssBaseline } from '@material-ui/core';
import db from '../database/database';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    tableContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

function CustomersPage() {
    const classes = useStyles();
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            const customersFromDb = await db.getCustomers();
            setCustomers(customersFromDb);
        };

        fetchCustomers();
    }, []);

    return (
        <>
            <CssBaseline />
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell component="th" scope="row">
                                    {customer.id}
                                </TableCell>
                                <TableCell align="right">{customer.name}</TableCell>
                                <TableCell align="right">{customer.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default CustomersPage;
