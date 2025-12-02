import { CircularProgress, Box } from "@mui/material";

if (isLoading) 
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
    </Box>
  );
