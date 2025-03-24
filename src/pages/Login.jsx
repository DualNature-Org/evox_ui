import React, { useState } from "react";
import {
  TextField,
  Typography,
  Box,
  Link as MuiLink,
  Alert
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm from "../components/auth/AuthForm";
import PasswordField from "../components/auth/PasswordField";
import LoginImage from "../assets/login.png";
import authService from "../services/authService";
import { useUser } from "../contexts/UserContext";
import { useNotification } from "../contexts/NotificationContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotification();
  
  // Get the returnTo parameter from the URL if present
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo') || '/';

  // Handle input change
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

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = "Username/Email is required";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await login(formData.username, formData.password);
      
      // Navigate to the returnTo path after successful login
      navigate(returnTo);
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials and try again.');
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
        title="Welcome Back"
        subtitle="Please sign in to your account"
        onSubmit={handleSubmit}
        submitText="Sign In"
        error={error}
        isLoading={isLoading}
        image={LoginImage}
        extraContent={
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <MuiLink 
                  component={RouterLink} 
                  to="/forgot-password" 
                  color="primary"
                >
                  Forgot password?
                </MuiLink>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Don't have an account?{' '}
                <MuiLink 
                  component={RouterLink} 
                  to="/register" 
                  color="primary" 
                  fontWeight="bold"
                >
                  Sign Up
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        }
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username or Email"
          name="username"
          autoComplete="username email"
          autoFocus
          value={formData.username}
          onChange={handleChange}
          error={!!fieldErrors.username}
          helperText={fieldErrors.username}
          sx={{ mb: 2 }}
        />
        
        <PasswordField
          required
          fullWidth
          name="password"
          label="Password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
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

export default Login;
