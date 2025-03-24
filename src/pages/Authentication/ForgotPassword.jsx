import React, { useState } from 'react';
import { TextField, Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../../components/auth/AuthForm';
import LoginImage from '../../assets/login.png'; // Reusing login image
import authService from '../../services/authService';
import { useNotification } from '../../contexts/NotificationContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { addNotification } = useNotification();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.forgotPassword(email);
      setSuccess('Password reset instructions have been sent to your email.');
      addNotification('Password reset instructions have been sent to your email.', 'success');
    } catch (err) {
      setError(err.message || 'Failed to send password reset. Please try again.');
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
        title="Forgot Password"
        subtitle="Enter your email address and we'll send you a link to reset your password."
        onSubmit={handleSubmit}
        submitText="Send Reset Link"
        error={error}
        success={success}
        isLoading={isLoading}
        image={LoginImage}
        extraContent={
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Remember your password?{' '}
              <MuiLink component={RouterLink} to="/login" color="primary" fontWeight="bold">
                Back to Login
              </MuiLink>
            </Typography>
          </Box>
        }
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={handleChange}
          variant="outlined"
          sx={{ mb: 2 }}
        />
      </AuthForm>
    </motion.div>
  );
};

export default ForgotPassword; 