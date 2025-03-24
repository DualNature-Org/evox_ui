import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HomeIcon from '@mui/icons-material/Home';
import orderService from '../../services/orderService';
import { useCart } from '../../contexts/CartContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { addNotification } = useNotification();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
        
        // Clear the cart after successful order confirmation
        clearCart();
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to load order details. Please try again.');
        addNotification('Failed to load order details', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('Order ID is missing. Please check your order history.');
      setIsLoading(false);
    }
  }, [orderId, clearCart, addNotification]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your order confirmation...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        <Button 
          variant="contained" 
          component={RouterLink} 
          to="/account/orders"
          startIcon={<ReceiptIcon />}
        >
          View All Orders
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          Thank You for Your Order!
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Your order #{order?.id} has been placed successfully.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Chip 
            label={`Order Status: ${order?.status?.toUpperCase() || 'PROCESSING'}`} 
            color="primary" 
            variant="outlined"
          />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          We've sent a confirmation email to {order?.user_email || 'your email address'}.
          You can track your order status in your account.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to={`/account/orders/${orderId}`}
            startIcon={<ReceiptIcon />}
          >
            Order Details
          </Button>
          
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/"
            startIcon={<HomeIcon />}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <List>
              {order?.items?.map((item) => (
                <ListItem key={item.id} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar 
                      alt={item.product.name} 
                      src={item.product.primary_image} 
                      variant="rounded"
                      sx={{ width: 60, height: 60, mr: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.product.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                          ${parseFloat(item.price).toFixed(2)} each
                        </Typography>
                      </>
                    }
                  />
                  <Typography variant="subtitle1">
                    ${parseFloat(item.quantity * item.price).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 300, mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">${parseFloat(order?.subtotal || 0).toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 300, mb: 1 }}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">${parseFloat(order?.shipping_cost || 0).toFixed(2)}</Typography>
              </Box>
              
              {order?.discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 300, mb: 1 }}>
                  <Typography variant="body1">Discount:</Typography>
                  <Typography variant="body1" color="error">
                    -${parseFloat(order.discount).toFixed(2)}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 300, mb: 1 }}>
                <Typography variant="body1">Tax:</Typography>
                <Typography variant="body1">${parseFloat(order?.tax || 0).toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ width: '100%', maxWidth: 300, my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 300 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${parseFloat(order?.total || 0).toFixed(2)}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              {order?.shipping_address?.street_address}
              {order?.shipping_address?.apartment_number && `, ${order?.shipping_address?.apartment_number}`}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              {order?.shipping_address?.city}, {order?.shipping_address?.state} {order?.shipping_address?.postal_code}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              {order?.shipping_address?.country}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <LocalShippingIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Estimated Delivery: {order?.estimated_delivery_date || '5-7 business days'}
              </Typography>
            </Box>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              Payment Method: {order?.payment?.payment_method_name || 'Credit Card'}
            </Typography>
            
            {order?.payment?.transaction_id && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                Transaction ID: {order.payment.transaction_id}
              </Typography>
            )}
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              Billing Address:
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              {order?.billing_address?.street_address}
              {order?.billing_address?.apartment_number && `, ${order?.billing_address?.apartment_number}`}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              {order?.billing_address?.city}, {order?.billing_address?.state} {order?.billing_address?.postal_code}
            </Typography>
            
            <Typography variant="body1">
              {order?.billing_address?.country}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 