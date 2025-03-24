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
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import orderService from '../../services/orderService';
import { useNotification } from '../../contexts/NotificationContext';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      setError('Failed to load order details. Please try again.');
      addNotification('Failed to load order details', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('Order ID is missing. Please check your order history.');
      setIsLoading(false);
    }
  }, [orderId, addNotification]);
  
  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      await orderService.cancelOrder(orderId);
      addNotification('Order cancelled successfully', 'success');
      fetchOrderDetails(); // Refresh order data
      setShowCancelDialog(false);
    } catch (err) {
      console.error('Failed to cancel order:', err);
      addNotification('Failed to cancel order. Please try again.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'processing': return 'primary';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      case 'returned': return 'warning';
      default: return 'default';
    }
  };
  
  const canBeCancelled = () => {
    const status = order?.status?.toLowerCase();
    return status === 'processing' || status === 'pending';
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading order details...
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
          startIcon={<ArrowBackIcon />}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          variant="text" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/account/orders')}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h4">
          Order #{order?.id}
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6">
              Order Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on: {new Date(order?.created_at).toLocaleString()}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Status: ${order?.status?.toUpperCase() || 'PROCESSING'}`} 
              color={getStatusColor(order?.status)}
              variant="outlined"
            />
            
            {canBeCancelled() && (
              <Button 
                variant="outlined" 
                color="error"
                size="small"
                startIcon={<CancelIcon />}
                onClick={() => setShowCancelDialog(true)}
              >
                Cancel Order
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Shipping Address
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
              <Typography variant="body2" color="text.secondary">
                {order?.tracking_number 
                  ? `Tracking #: ${order.tracking_number}` 
                  : `Estimated Delivery: ${order?.estimated_delivery_date || '5-7 business days'}`
                }
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
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
            
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
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
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        
        <List>
          {order?.items?.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar 
                    alt={item.product.name} 
                    src={item.product.primary_image} 
                    variant="rounded"
                    sx={{ width: 80, height: 80, mr: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle1" 
                      component={RouterLink} 
                      to={`/products/${item.product.id}`}
                      sx={{ 
                        textDecoration: 'none', 
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' } 
                      }}
                    >
                      {item.product.name}
                    </Typography>
                  }
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
                  sx={{ flex: '1 1 auto' }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 2 }}>
                  <Typography variant="subtitle1">
                    ${parseFloat(item.quantity * item.price).toFixed(2)}
                  </Typography>
                  
                  {order.status === 'delivered' && (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      component={RouterLink}
                      to={`/products/${item.product.id}/review`}
                      sx={{ mt: 1 }}
                    >
                      Write Review
                    </Button>
                  )}
                </Box>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 350, mb: 1 }}>
            <Typography variant="body1">Subtotal:</Typography>
            <Typography variant="body1">${parseFloat(order?.subtotal || 0).toFixed(2)}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 350, mb: 1 }}>
            <Typography variant="body1">Shipping:</Typography>
            <Typography variant="body1">${parseFloat(order?.shipping_cost || 0).toFixed(2)}</Typography>
          </Box>
          
          {order?.discount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 350, mb: 1 }}>
              <Typography variant="body1">Discount:</Typography>
              <Typography variant="body1" color="error">
                -${parseFloat(order.discount).toFixed(2)}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 350, mb: 1 }}>
            <Typography variant="body1">Tax:</Typography>
            <Typography variant="body1">${parseFloat(order?.tax || 0).toFixed(2)}</Typography>
          </Box>
          
          <Divider sx={{ width: '100%', maxWidth: 350, my: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 350 }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">${parseFloat(order?.total || 0).toFixed(2)}</Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Cancel Order Dialog */}
      <Dialog
        open={showCancelDialog}
        onClose={() => !isCancelling && setShowCancelDialog(false)}
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowCancelDialog(false)} 
            disabled={isCancelling}
          >
            No, Keep Order
          </Button>
          <Button 
            onClick={handleCancelOrder} 
            color="error" 
            variant="contained"
            disabled={isCancelling}
            startIcon={isCancelling ? <CircularProgress size={20} color="inherit" /> : <CancelIcon />}
          >
            {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 