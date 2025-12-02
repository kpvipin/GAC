import React from "react";
import { Box, Typography } from "@mui/material";

const EmplpoyeeDetailPage = ({ employee }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                employee.name
            </Typography>
        </Box>
    );
}

export default EmplpoyeeDetailPage;