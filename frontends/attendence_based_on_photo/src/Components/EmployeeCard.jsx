import React from "react";
import { Card, CardContent, Typography, Button, Box, CardActions } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useTenantTime } from "../hooks/Common/useTenantTime";

const EmployeeCard = ({ employee, onCheckIn, onCheckOut, isChecking, status }) => {
    console.log("isChecking prop:", isChecking);
    const { data: currentTimeInTenantTZ } = useTenantTime();
    const calculateDuration = (employee) => {
        if (!employee.attendance_sessions || employee.attendance_sessions.length === 0) return null;
        let totalMilliseconds = 0;
        employee.attendance_sessions.forEach(session => {
            if (session.check_in_time) {
                const inTime = new Date(session.check_in_time);
                // If checked out, use check_out_time
                if (session.check_out_time) {
                    const outTime = new Date(session.check_out_time);
                    totalMilliseconds += outTime - inTime;
                }
                // If NOT checked out, treat NOW as checkout time
                else {
                    console.log("Calculating duration for active session at time:", currentTimeInTenantTZ);
                    const now = new Date(currentTimeInTenantTZ);
                    totalMilliseconds += now - inTime;
                }
            }
        });
        const totalMinutes = Math.floor(totalMilliseconds / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return { hours, minutes };
    };
    const isCheckedIn = employee.attendance_sessions.some(
        session => session.check_out_time === null
    );
    const duration = calculateDuration(employee);

    return (
        <Card
            variant=""
            sx={{
                height: 220,
                background: "linear-gradient(135deg, #4ba1e7ff 0%, #095fa1ff 100%)",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <CardContent>
                {/* Employee Name */}
                <Typography variant="h5" fontWeight={600} color="white">
                    {employee.full_name}
                </Typography>

                {duration && status === "CHECKED_IN" && (
                    <Typography variant="body2" color="white" sx={{ mt: 0.5 }}>
                        <span style={{ fontSize: '3.5em', fontWeight: 400 }}>{duration.hours}</span>
                        <span style={{ fontSize: '1.75em', fontWeight: 200, color: "#d4d0d0ff" }}>h </span>
                        <span style={{ fontSize: '3.5em', fontWeight: 400 }}>{duration.minutes}</span>
                        <span style={{ fontSize: '1.75em', fontWeight: 200, color: "#d4d0d0ff" }}>m</span>
                    </Typography>
                )}
            </CardContent>

            <CardActions sx={{ m: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Box>
                    <Button
                        fullWidth
                        variant="contained"
                        color={status === "CHECKED_IN" ? "error" : "success"}
                        onClick={() => (status === "CHECKED_IN" ? onCheckOut(employee) : onCheckIn(employee))}
                        disabled={status === "CHECKING"}
                    >
                        {status === "CHECKING"
                            ? status === "CHECKED_IN"
                                ? "Checking Out..."
                                : "Checking In..."
                            : status === "CHECKED_IN"
                                ? "Check-Out"
                                : "Check-In"}
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
}

export default EmployeeCard;
