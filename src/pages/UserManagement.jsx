import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ChangePasswordModal from './ChangePasswordModal.jsx';
import db from '../database/database';

const UserManagement = ({ user, handleLogout }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [newUserUsername, setNewUserUsername] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('user');

    useEffect(() => {
        if (user && user.role === 'admin') {
            const fetchUsers = async () => {
                const users = await db.getUsers();
                setUsers(users);
            };
            fetchUsers();
        }
    }, [user]);

    const handleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    const handleOpenChangePasswordModal = () => {
        setOpenChangePasswordModal(true);
    };

    const handleCloseChangePasswordModal = () => {
        setOpenChangePasswordModal(false);
    };

    const handleDeleteUser = async (userId) => {
        if (user.role === 'admin') {
            const userToDelete = users.find(u => u.id === userId);
            if (userToDelete && userToDelete.role !== 'admin') {
                await db.removeUser(userId);
                const updatedUsers = users.filter(user => user.id !== userId);
                setUsers(updatedUsers);
            }
        }
    };

    const handleAddUser = async () => {
        if (user.role === 'admin') {
            try {
                const usernameExists = await db.usernameExists(newUserUsername);
                if (usernameExists) {
                    console.error('Username already exists');
                    return;
                }

                const newUser = await db.addUser(newUserUsername, newUserPassword, newUserRole);
                setUsers([...users, newUser]);
                setNewUserUsername('');
                setNewUserPassword('');
                setNewUserRole('user');
            } catch (error) {
                console.error('Error adding user:', error);
            }
        }
    };

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                {user ? (
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={12}>
                            <Typography variant="h4" align="center">Welcome, {user.username}!</Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={handleOpenChangePasswordModal}>Change Password</Button>
                        </Grid>
                        {user.role === 'admin' && (
                            <>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Add New User</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <TextField
                                                fullWidth
                                                label="Username"
                                                value={newUserUsername}
                                                onChange={(e) => setNewUserUsername(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                fullWidth
                                                type="password"
                                                label="Password"
                                                value={newUserPassword}
                                                onChange={(e) => setNewUserPassword(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                fullWidth
                                                label="Role"
                                                value={newUserRole}
                                                onChange={(e) => setNewUserRole(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Button variant="contained" color="primary" onClick={handleAddUser}>
                                                Add
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Users:</Typography>
                                    <List>
                                        {users.map(user => (
                                            <ListItem key={user.id}>
                                                <ListItemText primary={user.username} secondary={user.role} />
                                                <ListItemSecondaryAction>
                                                    {user.role !== 'admin' && (
                                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUser(user.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    )}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                            </>
                        )}
                        <ChangePasswordModal
                            user={user}
                            open={openChangePasswordModal}
                            onClose={handleCloseChangePasswordModal}
                        />
                    </Grid>
                ) : (
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={12}>
                            {isLogin ? (
                                <Login onLogin={handleLogin} />
                            ) : (
                                <Register onRegister={handleAuthMode} />
                            )}
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleAuthMode}>
                                {isLogin ? 'Register' : 'Login'}
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default UserManagement;