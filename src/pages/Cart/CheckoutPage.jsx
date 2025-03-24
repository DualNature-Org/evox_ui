import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Box, 
  Button,
  Grid,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';
import { useNotification } from '../../contexts/NotificationContext';
import ShippingForm from '../../components/checkout/ShippingForm';
import BillingForm from '../../components/checkout/BillingForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import OrderReview from '../../components/checkout/OrderReview';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import addressService from '../../services/addressService';

const steps = ['Shipping', 'Billing', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { cart, clearCart, isLoading: isCartLoading, fetchCart } = useCart();
  const { user, isAuthenticated } = useUser();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [emiPlan, setEmiPlan] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  
  // Fetch cart data only once on component mount
  useEffect(() => {
    // Only fetch cart if it's not already loaded
    if (!cart && !isSubmitting) {
      fetchCart();
    }
  }, []);
  
  // Skip any render dependencies in useEffect to prevent infinite loops
  useEffect(() => {
    // Redirect if cart is empty
    if (cart && cart.items && cart.items.length === 0 && !isSubmitting) {
      addNotification('Your cart is empty', 'info');
      navigate('/cart');
    }
  }, [cart]);
  
  // Load saved addresses if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const loadAddresses = async () => {
        try {
          const addresses = await addressService.getAddresses();
          const defaultShipping = addresses.find(addr => addr.is_default && addr.address_type === 'shipping');
          const defaultBilling = addresses.find(addr => addr.is_default && addr.address_type === 'billing');
          
          if (defaultShipping) {
            setShippingAddress(defaultShipping);
          }
          
          if (defaultBilling) {
            setBillingAddress(defaultBilling);
          }
        } catch (error) {
          console.error("Failed to load addresses:", error);
        }
      };
      
      loadAddresses();
    }
  }, [isAuthenticated]);
  
  const handleNext = () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }
    
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const validateCurrentStep = () => {
    setError(null);
    
    switch (activeStep) {
      case 0: // Shipping
        if (!shippingAddress) {
          setError('Please provide a shipping address');
          return false;
        }
        break;
      case 1: // Billing
        if (!billingAddress) {
          setError('Please provide a billing address');
          return false;
        }
        break;
      case 2: // Payment
        if (!paymentMethod) {
          setError('Please select a payment method');
          return false;
        }
        
        // Additional validation for credit card or other payment methods
        if (paymentMethod === 'credit_card' && !paymentDetails) {
          setError('Please enter payment details');
          return false;
        }
        
        // Validate EMI plan if selected
        if (paymentMethod === 'emi' && !emiPlan) {
          setError('Please select an EMI plan');
          return false;
        }
        break;
      default:
        break;
    }
    
    return true;
  };
  
  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // First, prepare the basic order data that the API expects
      const orderData = {
        status: "pending",
        total_amount: cart.total.toString(),
        billingAddressId: billingAddress.id,
        shippingAddressId: shippingAddress.id
      };
      
      // Create the order
      const orderResponse = await orderService.createOrder(orderData);
      
      console.log('Order created successfully:', orderResponse);
      
      // After order creation, process payment
      const paymentResponse = await paymentService.processPayment(
        paymentMethod,
        paymentDetails,
        cart.total
      );
      
      console.log('Payment processed successfully:', paymentResponse);
      
      // Clear cart and redirect to order confirmation
      clearCart();
      navigate(`/order-confirmation/${orderResponse.id}`);
      addNotification('Order placed successfully!', 'success');
      
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Failed to place your order. Please try again.');
      addNotification('Order placement failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ShippingForm 
                 initialAddress={shippingAddress} 
                 onAddressSelected={setShippingAddress} 
               />;
      case 1:
        return <BillingForm 
                 initialAddress={billingAddress} 
                 shippingAddress={shippingAddress}
                 onAddressSelected={setBillingAddress} 
               />;
      case 2:
        return <PaymentForm 
                 onPaymentMethodSelected={setPaymentMethod}
                 onPaymentDetailsChange={setPaymentDetails}
                 onEmiPlanSelected={setEmiPlan}
                 selectedMethod={paymentMethod}
                 totalAmount={cart?.total || 0}
               />;
      case 3:
        return <OrderReview 
                 cart={cart}
                 shippingAddress={shippingAddress}
                 billingAddress={billingAddress}
                 paymentMethod={paymentMethod}
                 emiPlan={emiPlan}
                 couponCode={couponCode}
                 onCouponChange={setCouponCode}
               />;
      default:
        return 'Unknown step';
    }
  };
  
  if (isCartLoading) {
    return (
      <Container sx={{ my: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading your cart...</Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            {getStepContent(activeStep)}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {cart && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography>Items ({cart.items?.length || 0}): ${parseFloat(cart.total || 0).toFixed(2)}</Typography>
                  <Typography>Shipping: $0.00</Typography>
                  {cart.discount && <Typography>Discount: -${parseFloat(cart.discount).toFixed(2)}</Typography>}
                  <Typography>Tax: ${parseFloat(cart.tax || 0).toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6">
                  Total: ${parseFloat(cart.total || 0).toFixed(2)}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0 || isSubmitting}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNext}
            disabled={isSubmitting}
          >
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
} 