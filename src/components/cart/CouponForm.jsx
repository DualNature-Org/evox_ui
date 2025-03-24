import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Collapse,
  IconButton
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from '@mui/icons-material/Close';
import couponService from '../../services/couponService';
import { useNotification } from '../../contexts/NotificationContext';

const CouponForm = ({ onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { addNotification } = useNotification();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For development/testing purpose, add a special code that always works
      if (couponCode.toUpperCase() === 'TESTCOUPON') {
        const mockCoupon = {
          id: 999,
          code: 'TESTCOUPON',
          discount_type: 'percentage',
          discount_value: '10.00',
          min_purchase: '0.00',
          valid_from: new Date().toISOString(),
          valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true
        };
        
        setAppliedCoupon(mockCoupon);
        if (onApplyCoupon) onApplyCoupon(mockCoupon);
        addNotification('Coupon applied successfully!', 'success');
        setCouponCode('');
        setLoading(false);
        return;
      }
      
      // Try to verify the coupon first
      try {
        const couponData = await couponService.verifyCouponCode(couponCode);
        
        // If verification passes, apply the coupon
        await couponService.applyCoupon(couponCode);
        
        setAppliedCoupon(couponData);
        if (onApplyCoupon) onApplyCoupon(couponData);
        
        addNotification('Coupon applied successfully!', 'success');
        setCouponCode('');
      } catch (verifyError) {
        console.log('Error applying coupon:', verifyError);
        setError(verifyError.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      setError(error.message || 'An error occurred while applying the coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    if (onApplyCoupon) onApplyCoupon(null);
    addNotification('Coupon removed', 'info');
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <LocalOfferIcon sx={{ mr: 1 }} />
        Apply Coupon
      </Typography>
      
      {!appliedCoupon ? (
        <Box component="form" onSubmit={handleApplyCoupon} sx={{ display: 'flex', mb: 1 }}>
          <TextField
            label="Coupon Code"
            variant="outlined"
            fullWidth
            size="small"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={loading}
            sx={{ mr: 1 }}
            placeholder="Enter code"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading || !couponCode.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Apply'}
          </Button>
        </Box>
      ) : (
        <Alert 
          severity="success" 
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRemoveCoupon}>
              Remove
            </Button>
          }
        >
          <Typography variant="body2" fontWeight={500}>
            {appliedCoupon.code} applied!
          </Typography>
          <Typography variant="body2">
            {appliedCoupon.discount_type === 'percentage' ? 
              `${appliedCoupon.discount_value}% off` : 
              `$${appliedCoupon.discount_value} off`} your order
          </Typography>
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError('')}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}
      
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Try "TESTCOUPON" for 10% off your order (test code)
      </Typography>
    </Paper>
  );
};

export default CouponForm; 