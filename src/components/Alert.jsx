import React from 'react';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const AlertIcon = ({ severity }) => {
    switch (severity) {
        case 'error':
            return <ErrorIcon />;
        case 'warning':
            return <WarningIcon />;
        case 'info':
            return <InfoIcon />;
        default:
            return null;
    }
};

const Alert = (props) => {
    return (
        <MuiAlert
            elevation={6}
            variant="filled"
            iconMapping={{
                error: <AlertIcon severity="error" />,
                warning: <AlertIcon severity="warning" />,
                info: <AlertIcon severity="info" />,
            }}
            {...props}
        >
            <AlertTitle>{props.severity}</AlertTitle>
            {props.children}
        </MuiAlert>
    );
};

export default Alert;