import React, { useState } from 'react';
import { Button, Typography, Grid, CircularProgress } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import db from '../database/database'; 
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const BackupAndRestore = () => {
  const classes = useStyles();
  const [backupStatus, setBackupStatus] = useState('');
  const [restoreStatus, setRestoreStatus] = useState('');
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      await db.backupToLocal();
      setBackupStatus('Backup successful!');
    } catch (error) {
      setBackupStatus('Error while backing up: ' + error.message);
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async (file) => {
    setRestoreLoading(true);
    try {
      await db.restoreFromLocal(file);
      setRestoreStatus('Restore successful!');
    } catch (error) {
      setRestoreStatus('Error while restoring: ' + error.message);
    } finally {
      setRestoreLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleRestore(file);
  };

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
          {backupStatus && <Typography>{backupStatus}</Typography>}
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
          {restoreStatus && <Typography>{restoreStatus}</Typography>}
        </Grid>
      </Grid>
    </div>
  );
};

export default BackupAndRestore;
