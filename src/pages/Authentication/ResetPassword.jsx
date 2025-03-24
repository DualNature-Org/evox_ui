import React, { useState } from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../../components/auth/AuthForm';
import PasswordField from '../../components/auth/PasswordField';
import LoginImage from '../../assets/login.png'; // Reusing login image
import authService from '../../services/authService';
import { useNotification } from '../../contexts/NotificationContext';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      await authService.resetPassword(token, formData.password, formData.confirmPassword);
      setSuccess('Password has been reset successfully.');
      addNotification('Password has been reset successfully. You can now login with your new password.', 'success');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
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
        title="Reset Password"
        subtitle="Enter your new password below"
        onSubmit={handleSubmit}
        submitText="Reset Password"
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
        <PasswordField
          margin="normal"
          required
          fullWidth
          name="password"
          label="New Password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <PasswordField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm New Password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </AuthForm>
    </motion.div>
  );
};

export default ResetPassword; 