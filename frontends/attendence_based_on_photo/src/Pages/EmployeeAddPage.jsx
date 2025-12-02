import React, { useState } from "react";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import { useAddEmployee } from "../hooks/Employee/useAddEmployee";

const EmployeeAddPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "EMPLOYEE",
  });

  const addEmployeeMutation = useAddEmployee();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEmployeeMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ fullName: "", email: "", phone: "", role: "EMPLOYEE" });
      },
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Add New Employee
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              disabled={addEmployeeMutation.isLoading}
            >
              {addEmployeeMutation.isLoading ? "Adding..." : "Add Employee"}
            </Button>
          </Grid>
        </Grid>
      </form>
      {addEmployeeMutation.isError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {addEmployeeMutation.error.message}
        </Typography>
      )}
      {addEmployeeMutation.isSuccess && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          Employee added successfully!
        </Typography>
      )}
    </Box>
  );
};

export default EmployeeAddPage;
