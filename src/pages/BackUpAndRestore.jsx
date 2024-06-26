
import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import db from '../database/database';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  alert: {
    marginTop: theme.spacing(2),
  },
}));

const BackupAndRestore = () => {
  const classes = useStyles();
  const [backupStatus, setBackupStatus] = useState('');
  const [restoreStatus, setRestoreStatus] = useState('');
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudRestoreLoading, setCloudRestoreLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const stores = await db.getStores();
        console.log(stores);
        if (stores.length > 0) {
          setStore(stores[0]);
        }
      } catch (error) {
        setError('Error fetching store: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  const handleBackup = async () => {
    setBackupLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (store) {
        await db.backupToLocal(store.email);
        setSuccessMessage('Local backup successful!');
      } else {
        setError('Store not found.');
      }
    } catch (error) {
      setError('Error while backing up locally: ' + error.message);
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async (file) => {
    setRestoreLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await db.restoreFromLocal(file);
      setSuccessMessage('Local restore successful!');
    } catch (error) {
      setError('Error while restoring locally: ' + error.message);
    } finally {
      setRestoreLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleRestore(file);
  };

  const handleCloudBackup = async () => {
    setCloudLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (store) {
        await db.backupToMongoDB(store.email);
        setSuccessMessage('Cloud backup successful!');
      } else {
        setError('Store not found.');
      }
    } catch (error) {
      setError('Error while backing up to cloud: ' + error.message);
    } finally {
      setCloudLoading(false);
    }
  };

  const handleCloudRestore = async () => {
    setCloudRestoreLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (store) {
        await db.restoreFromMongoDB(store.email);
        setSuccessMessage('Cloud restore successful!');
      } else {
        setError('Store not found.');
      }
    } catch (error) {
      setError('Error while restoring from cloud: ' + error.message);
    } finally {
      setCloudRestoreLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>Backup and Restore</Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            onClick={handleBackup}
            className={classes.button}
            disabled={backupLoading}
          >
            Backup Database
          </Button>
          {backupLoading && <CircularProgress size={24} />}
        </Grid>
        <Grid item>
          <input
            accept=".json"
            style={{ display: 'none' }}
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleFileChange}
            disabled={restoreLoading}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              component="span"
              color="secondary"
              startIcon={<CloudUploadIcon />}
              className={classes.button}
              disabled={restoreLoading}
            >
              Restore Backup
            </Button>
          </label>
          {restoreLoading && <CircularProgress size={24} />}
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudQueueIcon />}
            onClick={handleCloudBackup}
            className={classes.button}
            disabled={cloudLoading}
          >
            Backup to Cloud
          </Button>
          {cloudLoading && <CircularProgress size={24} />}
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudQueueIcon />}
            onClick={handleCloudRestore}
            className={classes.button}
            disabled={cloudRestoreLoading}
          >
            Restore from Cloud
          </Button>
          {cloudRestoreLoading && <CircularProgress size={24} />}
        </Grid>
      </Grid>
      {error && <Alert severity="error" className={classes.alert}>{error}</Alert>}
      {successMessage && <Alert severity="success" className={classes.alert}>{successMessage}</Alert>}
    </div>
  );
};

export default BackupAndRestore;
