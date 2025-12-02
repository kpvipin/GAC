import React, { useState } from "react";
import EmployeeCard from "../Components/EmployeeCard";
import { Box, Grid, Typography } from "@mui/material";
import { useEmployees } from "../hooks/Employee/useEmployees";
import { useCheckIn } from "../hooks/Employee/useCheckIn";
import { useCheckOut } from "../hooks/Employee/useCheckOut";
import { useTenantTime } from "../hooks/Common/useTenantTime";
import { CircularProgress } from "@mui/material";
import { Skeleton } from "@mui/material";

const EmployeeAttendencePage = () => {
    const { data: employees, isLoading, isError, error } = useEmployees();
    const { data: currentTimeInTenantTZ } = useTenantTime();
    const checkInMutation = useCheckIn();
    const checkOutMutation = useCheckOut();
    const [loadingEmployeeIds, setLoadingEmployeeIds] = useState(new Set());
    // Store status per employee: "CHECKED_IN" | "CHECKED_OUT" | "CHECKING"
    const [employeeStatus, setEmployeeStatus] = useState({});
    if (isLoading)
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography>Loading employees...</Typography>
                <Grid container spacing={2}>
                    {[1, 2, 3].map((i) => (
                        <Grid item xs={12} key={i}>
                            <Skeleton variant="rectangular" height={100} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    if (isError) return <Typography color="error">{error.message}</Typography>;
    const onCheckIn = (employee) => {
        setEmployeeStatus(prev => ({ ...prev, [employee.id]: "CHECKING" }));
        checkInMutation.mutate(employee.id, {
            onSuccess: () => {
                setEmployeeStatus(prev => ({ ...prev, [employee.id]: "CHECKED_IN" }));
            },
            onError: () => {
                setEmployeeStatus(prev => ({ ...prev, [employee.id]: "CHECKED_OUT" }));
            },
        });
    };

    const onCheckOut = (employee) => {
        const activeSession = employee.attendance_sessions.find(
            session => session.check_out_time === null
        );
        if (!activeSession) return;
        setEmployeeStatus(prev => ({ ...prev, [employee.id]: "CHECKING" }));
        checkOutMutation.mutate(activeSession.id, {
            onSuccess: () => {
                setEmployeeStatus(prev => ({ ...prev, [employee.id]: "CHECKED_OUT" }));
            },
            onError: () => {
                setEmployeeStatus(prev => ({ ...prev, [employee.id]: "CHECKED_IN" }));
            },
        });
    };

    const formatDateTime = (time) => {
        if (!time) return "--:--";
        const date = new Date(time);
        // Options for date
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        // Options for time
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        const formattedDate = date.toLocaleDateString(undefined, dateOptions);
        const formattedTime = date.toLocaleTimeString(undefined, timeOptions).toUpperCase();
        return `${formattedDate} ${formattedTime}`;
    };



    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight={600}>
                    GAC
                </Typography>
                <Typography variant="h6" fontWeight={200}>
                    {formatDateTime(currentTimeInTenantTZ)}
                </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    {employees.map((emp) => (
                        <Grid size={12} key={emp.id}>
                            <EmployeeCard
                                employee={emp}
                                onCheckIn={onCheckIn}
                                onCheckOut={onCheckOut}
                                isChecking={loadingEmployeeIds.has(emp.id)}
                                status={employeeStatus[emp.id] || (emp.attendance_sessions.some(s => !s.check_out_time) ? "CHECKED_IN" : "CHECKED_OUT")}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box >
    );
}

export default EmployeeAttendencePage;