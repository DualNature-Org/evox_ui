import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddressCard from '../user/AddressCard';

export default function OrderReview({ 
  cart,
  shippingAddress,
  billingAddress,
  paymentMethod,
  paymentDetails,
  emiPlan
}) {
  const navigate = useNavigate();
  
  const formatPaymentMethodName = (method) => {
    switch(method) {
      case 'credit_card': return 'Credit Card';
      case 'debit_card': return 'Debit Card';
      case 'netbanking': return 'Net Banking';
      case 'upi': return 'UPI';
      case 'wallet': return 'Wallet';
      case 'emi': return 'EMI';
      default: return method;
    }
  };
  
  const getLastFourDigits = (cardNumber) => {
    if (!cardNumber) return '';
    const trimmed = cardNumber.replace(/\s/g, '');
    return trimmed.substring(trimmed.length - 4);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Review
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Shipping Address
            </Typography>
            {shippingAddress ? (
              <AddressCard address={shippingAddress} />
            ) : (
              <Typography color="text.secondary">No shipping address selected</Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Billing Address
            </Typography>
            {billingAddress ? (
              <AddressCard address={billingAddress} />
            ) : (
              <Typography color="text.secondary">No billing address selected</Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Payment Method
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>
                {formatPaymentMethodName(paymentMethod)}
              </Typography>
              
              {paymentMethod === 'credit_card' && paymentDetails?.cardNumber && (
                <Chip 
                  label={`**** **** **** ${getLastFourDigits(paymentDetails.cardNumber)}`} 
                  variant="outlined" 
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
              
              {paymentMethod === 'emi' && emiPlan && (
                <Chip 
                  label={`${emiPlan.bank_name} - ${emiPlan.tenure_months} months`} 
                  variant="outlined" 
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        Order Items
      </Typography>
      
      <Paper elevation={0} variant="outlined" sx={{ mb: 3 }}>
        <List disablePadding>
          {cart?.items?.map((item) => (
            <Box key={item.id}>
              <ListItem sx={{ py: 2, px: 3 }}>
                <ListItemAvatar>
                  <Avatar 
                    src={item.product.primary_image} 
                    alt={item.product.name}
                    variant="rounded"
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.product.name}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        Quantity: {item.quantity}
                      </Typography>
                      {item.product.sale_price ? (
                        <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                          <Typography component="span" color="text.secondary" sx={{ textDecoration: 'line-through', mr: 1 }}>
                            ${parseFloat(item.product.price).toFixed(2)}
                          </Typography>
                          <Typography component="span" color="primary.main">
                            ${parseFloat(item.product.sale_price).toFixed(2)}
                          </Typography>
                        </Typography>
                      ) : (
                        <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                          ${parseFloat(item.product.price).toFixed(2)}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                  sx={{ mr: 2 }}
                />
                <Typography variant="subtitle1">
                  ${(parseFloat(item.subtotal)).toFixed(2)}
                </Typography>
              </ListItem>
              <Divider />
            </Box>
          ))}
          
          <Box sx={{ p: 3 }}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/cart')}
                  size="small"
                >
                  Edit Cart
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 250, mb: 1 }}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1">${parseFloat(cart?.total || 0).toFixed(2)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 250, mb: 1 }}>
                    <Typography variant="body1">Shipping:</Typography>
                    <Typography variant="body1">$0.00</Typography>
                  </Box>
                  
                  {cart?.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 250, mb: 1 }}>
                      <Typography variant="body1">Discount:</Typography>
                      <Typography variant="body1" color="error">
                        -${parseFloat(cart.discount).toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 250, mb: 1 }}>
                    <Typography variant="body1">Tax:</Typography>
                    <Typography variant="body1">${parseFloat(cart?.tax || 0).toFixed(2)}</Typography>
                  </Box>
                  
                  <Divider sx={{ width: '100%', maxWidth: 250, my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 250 }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">${parseFloat(cart?.total || 0).toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </List>
      </Paper>
    </Box>
  );
} 