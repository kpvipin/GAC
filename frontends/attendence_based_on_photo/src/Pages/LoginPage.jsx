import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // React Query mutation for login
    const loginMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            return data;
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            window.location.href = "/employees/attendence"; // redirect after login
        },
    });

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: "auto",
                mt: 10,
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" mb={3} align="center">
                Login
            </Typography>

            {loginMutation.isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {loginMutation.error?.message}
                </Alert>
            )}

            <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => loginMutation.mutate()}
                disabled={loginMutation.isLoading}
            >
                {loginMutation.isLoading ? "Logging in..." : "Login"}
            </Button>
        </Box>
    );
};

export default LoginPage;
