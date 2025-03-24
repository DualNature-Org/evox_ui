import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Drawer,
  IconButton,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  CircularProgress
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const MiniCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hasInitiallyFetched = useRef(false);
  const navigate = useNavigate();
  const {
    cart,
    cartCount,
    isLoading,
    removeFromCart,
    fetchCart
  } = useCart();

  // Extract items and total from the cart object safely
  const cartItems = cart?.items || [];
  const cartTotal = cart?.total || 0;

  // Only fetch cart once when the component mounts or drawer is first opened
  useEffect(() => {
    if (isOpen && !hasInitiallyFetched.current) {
      fetchCart();
      hasInitiallyFetched.current = true;
    }
  }, [isOpen, fetchCart]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };
  
  const goToCart = () => {
    setIsOpen(false);
    navigate('/cart');
  };

  const goToCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };
  
  return (
    <>
      <IconButton 
        color="inherit" 
        onClick={toggleDrawer} 
        aria-label="cart"
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <StyledBadge badgeContent={cartCount} color="secondary">
          <CartIcon />
        </StyledBadge>
      </IconButton>
      
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
      >
        <Box sx={{ width: 320, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Your Cart</Typography>
            <IconButton onClick={toggleDrawer} edge="end" aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : cartItems.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>Your cart is empty</Typography>
              <Button 
                component={RouterLink} 
                to="/shop" 
                variant="contained" 
                color="primary"
                onClick={toggleDrawer}
              >
                Shop Now
              </Button>
            </Box>
          ) : (
            <>
              <List sx={{ mb: 2 }}>
                <AnimatePresence>
                  {cartItems.slice(0, 4).map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar 
                            alt={item.name} 
                            src={item.image} 
                            variant="rounded"
                            component={RouterLink}
                            to={`/shop/product/${item.product_id}`}
                            onClick={toggleDrawer}
                            sx={{ cursor: 'pointer' }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              component={RouterLink}
                              to={`/shop/product/${item.product_id}`}
                              onClick={toggleDrawer}
                              variant="body2"
                              sx={{ 
                                fontWeight: 'bold',
                                color: 'text.primary',
                                textDecoration: 'none',
                                '&:hover': {
                                  color: 'primary.main',
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {item.quantity} × {typeof (item.product?.sale_price || item.product?.price) === 'number' 
                                  ? `$${(item.product?.sale_price || item.product?.price).toFixed(2)}`
                                  : '$0.00'}
                              </Typography>
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleRemoveItem(item.id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {cartItems.length > 4 && (
                  <ListItem>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" align="center">
                          +{cartItems.length - 4} more items
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1" fontWeight="bold">${typeof cartTotal === 'number' ? cartTotal.toFixed(2) : '0.00'}</Typography>
                </Box>
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Shipping and taxes calculated at checkout
                </Typography>
              </Box>
              
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/cart"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={toggleDrawer}
                  sx={{ mt: 2 }}
                >
                  View Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                </Button>
                
                <Button
                  component={RouterLink}
                  to="/checkout"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={toggleDrawer}
                  disabled={cartItems.length === 0}
                >
                  Checkout (${typeof cartTotal === 'number' ? cartTotal.toFixed(2) : '0.00'})
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default MiniCart; 