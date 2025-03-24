import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  CircularProgress,
  Paper,
  Alert,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as CartIcon,
  DeleteOutline as ClearIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import CouponForm from '../../components/cart/CouponForm';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartShipping,
    coupon,
    isLoading,
    error,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();
  const [localLoading, setLocalLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // Ensure the cart data is fetched when the component mounts
  useEffect(() => {
    // Force refresh cart data when component mounts
    fetchCart(true);
  }, [fetchCart]);
  
  const handleQuantityChange = async (itemId, newQuantity) => {
    setLocalLoading(true);
    try {
      await updateCartItem(itemId, newQuantity);
    } finally {
      setLocalLoading(false);
    }
  };
  
  const handleRemoveItem = async (itemId) => {
    setLocalLoading(true);
    try {
      await removeFromCart(itemId);
    } finally {
      setLocalLoading(false);
    }
  };
  
  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    // Here you would also recalculate the cart total with the discount
    // This depends on your cart state management
  };
  
  if (isLoading || localLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your cart...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => fetchCart(true)} 
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Container>
    );
  }
  
  if (!cartItems || cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <EmptyState
          icon={<CartIcon sx={{ fontSize: 80 }} />}
          title="Your Cart is Empty"
          description="Looks like you haven't added any products to your cart yet."
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </Container>
    );
  }
  
  const calculateDiscount = (subtotal, coupon) => {
    if (!coupon) return 0;
    
    if (coupon.discount_type === 'percentage') {
      return (subtotal * parseFloat(coupon.discount_value)) / 100;
    } else {
      return parseFloat(coupon.discount_value);
    }
  };
  
  const calculateTotal = (subtotal, shipping, coupon) => {
    const discount = coupon ? calculateDiscount(subtotal, coupon) : 0;
    return subtotal + shipping - discount;
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Cart</Typography>
      </Breadcrumbs>
      
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <CartIcon sx={{ mr: 2, fontSize: 28 }} color="primary" />
          <Typography variant="h4" component="h1">
            Your Cart
          </Typography>
          
          {!cartItems.length && (
            <Button
              startIcon={<ClearIcon />}
              onClick={clearCart}
              sx={{ ml: 'auto' }}
              color="error"
              variant="outlined"
              size="small"
            >
              Clear Cart
            </Button>
          )}
        </Box>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Cart Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </Typography>
            <Typography variant="subtitle1" component={RouterLink} to="/shop" sx={{ 
              color: 'primary.main', 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}>
              Continue Shopping
            </Typography>
          </Box>
          
          {/* Cart Items List */}
          <AnimatePresence>
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </AnimatePresence>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <CouponForm onApplyCoupon={handleApplyCoupon} />
          
          <CartSummary
            subtotal={cartSubtotal}
            discount={appliedCoupon ? calculateDiscount(cartSubtotal, appliedCoupon) : 0}
            tax={cartTax}
            shipping={cartShipping}
            total={calculateTotal(cartSubtotal, cartShipping, appliedCoupon)}
            coupon={coupon}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
          />
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/checkout')}
            sx={{ mb: 2 }}
          >
            Proceed to Checkout
          </Button>
          
          <Button
            variant="outlined"
            component={RouterLink}
            to="/shop"
            fullWidth
          >
            Continue Shopping
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage; 