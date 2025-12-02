import React from 'react';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const LiveDateTime = ({ variant, sx }) => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const options = {
        month: 'short',    // Nov
        day: 'numeric',    // 11
        year: 'numeric',   // 2025
        hour: 'numeric',   // 11
        minute: '2-digit', // 14
        second: '2-digit', // 00
        hour12: true       // AM/PM
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <Typography variant={variant} sx={sx}>
            {currentDateTime.toLocaleString('en-US', options)}
        </Typography>
    );
}

export default LiveDateTime;