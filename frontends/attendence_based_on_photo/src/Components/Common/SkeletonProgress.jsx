import { Skeleton, Grid, Box } from "@mui/material";

if (isLoading)
  return (
    <Grid container spacing={2}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} key={i}>
          <Skeleton variant="rectangular" height={100} />
        </Grid>
      ))}
    </Grid>
  );
