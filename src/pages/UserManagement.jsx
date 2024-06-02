import React, { useState } from 'react';
import { Box, Button, Typography, Container, Grid } from '@mui/material';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ChangePasswordModal from './ChangePasswordModal.jsx';


const UserManagement = ({ user, handleLogout }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

    const handleAuthMode = () => {
        setIsLogin(!isLogin);
    };
    


    const handleOpenChangePasswordModal = () => {
        setOpenChangePasswordModal(true);
    };

    const handleCloseChangePasswordModal = () => {
        setOpenChangePasswordModal(false);
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