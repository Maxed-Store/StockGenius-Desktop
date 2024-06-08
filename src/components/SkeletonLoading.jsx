import React from 'react';
import { Box, Grid, Skeleton, Typography, Paper } from '@mui/material';

const SkeletonLoading = () => {
  return (
    <Box my={4}>
      <Typography variant="h4" component="h2" gutterBottom>
        <Skeleton width="50%" />
      </Typography>
      <Box my={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} md={9}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Skeleton variant="rectangular" height={56} />
            <Box mt={2}>
              <Skeleton variant="rectangular" height={56} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box my={3}>
        <Typography variant="h5">
          <Skeleton width="30%" />
        </Typography>
        <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto' }}>
          <Skeleton variant="rectangular" height={200} />
        </Paper>
      </Box>
      <Box my={3}>
        <Typography variant="h5">
          <Skeleton width="30%" />
        </Typography>
        <Skeleton variant="rectangular" height={400} />
        <Box mt={2}>
          <Skeleton variant="rectangular" height={56} />
        </Box>
      </Box>
      <Box my={3}>
        <Typography variant="h5">
          <Skeleton width="30%" />
        </Typography>
        <Skeleton variant="rectangular" height={400} />
        <Box mt={2}>
          <Skeleton variant="rectangular" height={56} />
        </Box>
      </Box>
    </Box>
  );
};

export default SkeletonLoading;
