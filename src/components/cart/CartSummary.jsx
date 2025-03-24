import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  TextField,
  InputAdornment,
  Collapse,
  Alert,
  Grid,
  LinearProgress,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  LocalOffer as CouponIcon,
  Check as CheckIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const CartSummary = ({
  subtotal = 0,
  discount = 0,
  tax = 0,
  shipping = 0,
  total = 0,
  coupon = null,
  onApplyCoupon,
  onRemoveCoupon,
  isProcessing = false,
  checkoutButton = true,
  children
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();
  
  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
    setCouponError('');
  };
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    try {
      await onApplyCoupon(couponCode);
      setCouponCode('');
      setCouponError('');
      setIsCouponOpen(false);
    } catch (error) {
      setCouponError(error.message || 'Invalid coupon code');
    }
  };
  
  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setCouponCode('');
    setCouponError('');
  };
  
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      elevation={1}
      sx={{ p: 3, borderRadius: 2, position: 'relative' }}
    >
      {isProcessing && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      )}
      
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">Subtotal</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
          </Grid>
          
          {discount > 0 && (
            <>
              <Grid item xs={6}>
                <Typography variant="body1" color="secondary.main">
                  Discount {coupon && `(${coupon.code})`}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body1" color="secondary.main">
                  -${discount.toFixed(2)}
                </Typography>
              </Grid>
            </>
          )}
          
          <Grid item xs={6}>
            <Typography variant="body1">Tax</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body1">${tax.toFixed(2)}</Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body1">Shipping</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body1">
              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h6">Total</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="h6" fontWeight="bold">${total.toFixed(2)}</Typography>
        </Grid>
      </Grid>
      
      {/* Coupon Section */}
      {coupon ? (
        <Box sx={{ mb: 2 }}>
          <Alert 
            severity="success" 
            icon={<CheckIcon fontSize="inherit" />}
            action={
              <IconButton
                aria-label="remove coupon"
                color="inherit"
                size="small"
                onClick={handleRemoveCoupon}
              >
                <ClearIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <Typography variant="body2">
              Coupon <strong>{coupon.code}</strong> applied!
            </Typography>
          </Alert>
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Button
            color="primary"
            startIcon={<CouponIcon />}
            onClick={() => setIsCouponOpen(!isCouponOpen)}
            size="small"
            variant="text"
            fullWidth
            sx={{ justifyContent: 'flex-start' }}
          >
            {isCouponOpen ? 'Hide Coupon Form' : 'Add a Coupon Code'}
          </Button>
          
          <Collapse in={isCouponOpen}>
            <Box sx={{ mt: 1, display: 'flex' }}>
              <TextField
                placeholder="Enter coupon code"
                variant="outlined"
                size="small"
                fullWidth
                value={couponCode}
                onChange={handleCouponChange}
                error={Boolean(couponError)}
                helperText={couponError}
                InputProps={{
                  endAdornment: couponCode && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear coupon code"
                        onClick={() => setCouponCode('')}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || isProcessing}
              >
                {isProcessing ? <CircularProgress size={24} /> : 'Apply'}
              </Button>
            </Box>
          </Collapse>
        </Box>
      )}
      
      {/* Checkout button */}
      {checkoutButton && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/checkout')}
          disabled={subtotal === 0 || isProcessing}
          component={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isProcessing ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            'Proceed to Checkout'
          )}
        </Button>
      )}
      
      {/* Optional additional content */}
      {children}
    </Paper>
  );
};

export default CartSummary; 