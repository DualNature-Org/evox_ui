import React, { useState } from "react";
import {
  TextField,
  Typography,
  Box,
  Link as MuiLink,
  Grid,
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm from "../components/auth/AuthForm";
import PasswordField from "../components/auth/PasswordField";
import SignupImage from "../assets/login.png"; // Update with actual path if needed
import authService from "../services/authService";
import { useNotification } from "../contexts/NotificationContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: ""
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: "Passwords do not match"
      });
      return;
    }
    
    setIsLoading(true);
    setError("");
    setFieldErrors({});
    setSuccess("");

    try {
      // Generate a reasonable username if none provided
      const usernameBase = formData.email.split('@')[0]; 
      const username = usernameBase.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      
      console.log("Submitting registration with data:", {
        username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      
      await authService.register({
        username: username, // Generate username from email prefix
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      
      setSuccess("Registration successful! Please login.");
      addNotification("Registration successful! Please login to your account.", "success");
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle field-specific errors
      if (err.details && typeof err.details === 'object') {
        setFieldErrors(err.details);
        
        // Also set a general error message
        const errorMessages = Object.values(err.details)
          .flat()
          .filter(msg => typeof msg === 'string')
          .join(". ");
          
        setError(errorMessages || "Please correct the errors below.");
      } else {
        // Generic error message
        setError(err.message || "Registration failed. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AuthForm
        title="Create an Account"
        subtitle="Join EVOX to explore wheelchair solutions"
        onSubmit={handleSubmit}
        submitText="Sign Up"
        error={error}
        success={success}
        isLoading={isLoading}
        image={SignupImage}
        extraContent={
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <MuiLink component={RouterLink} to="/login" color="primary" fontWeight="bold">
                Sign In
              </MuiLink>
            </Typography>
          </Box>
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              error={!!fieldErrors.first_name || !!fieldErrors.firstName}
              helperText={fieldErrors.first_name || fieldErrors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              error={!!fieldErrors.last_name || !!fieldErrors.lastName}
              helperText={fieldErrors.last_name || fieldErrors.lastName}
            />
          </Grid>
        </Grid>
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          sx={{ mt: 2 }}
        />
        
        <PasswordField
          margin="normal"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
          sx={{ mt: 2 }}
        />
        
        <PasswordField
          margin="normal"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!fieldErrors.confirmPassword || !!fieldErrors.password2}
          helperText={fieldErrors.confirmPassword || fieldErrors.password2}
          autoComplete="new-password"
          sx={{ mt: 2 }}
        />
        
        {/* Show non-field errors */}
        {fieldErrors.non_field_errors && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {fieldErrors.non_field_errors}
          </Alert>
        )}
      </AuthForm>
    </motion.div>
  );
};

export default Signup;
