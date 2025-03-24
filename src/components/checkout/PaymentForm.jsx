import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Grid,
  Paper,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Collapse,
  Divider
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import paymentService from '../../services/paymentService';
import { useNotification } from '../../contexts/NotificationContext';

export default function PaymentForm({ 
  onPaymentMethodSelected, 
  onPaymentDetailsChange,
  onEmiPlanSelected,
  selectedMethod = null,
  totalAmount = 0
}) {
  const { addNotification } = useNotification();
  const [paymentMethod, setPaymentMethod] = useState(selectedMethod || '');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emiPlans, setEmiPlans] = useState([]);
  const [selectedEmiPlan, setSelectedEmiPlan] = useState(null);
  
  // Credit card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState({});

  // Load payment methods on component mount
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setIsLoading(true);
      try {
        const data = await paymentService.getPaymentMethods();
        setPaymentMethods(data.filter(method => method.is_active));
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
        addNotification('Failed to load payment methods', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentMethods();
  }, [addNotification]);

  // Fetch EMI plans when EMI is selected
  useEffect(() => {
    if (paymentMethod === 'emi') {
      const fetchEmiPlans = async () => {
        setIsLoading(true);
        try {
          const data = await paymentService.getEmiPlans();
          // Filter EMI plans based on total amount
          const eligiblePlans = data.filter(
            plan => parseFloat(plan.min_amount) <= parseFloat(totalAmount) && plan.is_active
          );
          setEmiPlans(eligiblePlans);
        } catch (error) {
          console.error('Failed to fetch EMI plans:', error);
          addNotification('Failed to load EMI plans', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchEmiPlans();
    }
  }, [paymentMethod, totalAmount, addNotification]);

  // Handle payment method change
  const handlePaymentMethodChange = (event) => {
    const method = event.target.value;
    setPaymentMethod(method);
    setErrors({});
    
    if (onPaymentMethodSelected) {
      onPaymentMethodSelected(method);
    }
    
    // Reset EMI plan when switching methods
    if (method !== 'emi') {
      setSelectedEmiPlan(null);
      if (onEmiPlanSelected) {
        onEmiPlanSelected(null);
      }
    }
  };

  // Handle EMI plan selection
  const handleEmiPlanChange = (event) => {
    const planId = event.target.value;
    const plan = emiPlans.find(p => p.id === planId);
    setSelectedEmiPlan(plan);
    
    if (onEmiPlanSelected) {
      onEmiPlanSelected(plan);
    }
  };

  // Handle credit card form changes
  const handleCreditCardChange = () => {
    const details = {
      cardNumber,
      cardName,
      expiryDate,
      cvv
    };
    
    if (onPaymentDetailsChange) {
      onPaymentDetailsChange(details);
    }
  };

  // Format credit card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      
      if (!cardName) {
        newErrors.cardName = 'Please enter the name on the card';
      }
      
      if (!expiryDate || expiryDate.length < 5) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    } else if (paymentMethod === 'emi' && !selectedEmiPlan) {
      newErrors.emiPlan = 'Please select an EMI plan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    // Validate on every change to keep the checkout button state updated
    validate();
  }, [cardNumber, cardName, expiryDate, cvv, selectedEmiPlan, paymentMethod]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <Grid container spacing={2}>
              {paymentMethods.map((method) => (
                <Grid item xs={12} sm={6} key={method.id}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      borderColor: paymentMethod === method.name ? 'primary.main' : 'divider',
                    }}
                  >
                    <FormControlLabel
                      value={method.name}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {method.name === 'credit_card' && <CreditCardIcon sx={{ mr: 1 }} />}
                          {method.name === 'debit_card' && <CreditCardIcon sx={{ mr: 1 }} />}
                          {method.name === 'netbanking' && <AccountBalanceIcon sx={{ mr: 1 }} />}
                          {method.name === 'upi' && <PaymentIcon sx={{ mr: 1 }} />}
                          {method.name === 'wallet' && <AccountBalanceIcon sx={{ mr: 1 }} />}
                          {method.name === 'emi' && <CalendarTodayIcon sx={{ mr: 1 }} />}
                          <Typography>
                            {method.name === 'credit_card' && 'Credit Card'}
                            {method.name === 'debit_card' && 'Debit Card'}
                            {method.name === 'netbanking' && 'Net Banking'}
                            {method.name === 'upi' && 'UPI'}
                            {method.name === 'wallet' && 'Wallet'}
                            {method.name === 'emi' && 'EMI'}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>
      )}
      
      <Divider sx={{ my: 3 }} />
      
      {/* Credit Card Form */}
      <Collapse in={paymentMethod === 'credit_card' || paymentMethod === 'debit_card'}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {paymentMethod === 'credit_card' ? 'Credit Card Details' : 'Debit Card Details'}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Card Number"
                  fullWidth
                  variant="outlined"
                  value={cardNumber}
                  onChange={(e) => {
                    setCardNumber(formatCardNumber(e.target.value));
                    handleCreditCardChange();
                  }}
                  placeholder="1234 5678 9012 3456"
                  inputProps={{ maxLength: 19 }}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Name on Card"
                  fullWidth
                  variant="outlined"
                  value={cardName}
                  onChange={(e) => {
                    setCardName(e.target.value);
                    handleCreditCardChange();
                  }}
                  error={!!errors.cardName}
                  helperText={errors.cardName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Expiry Date"
                  fullWidth
                  variant="outlined"
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(formatExpiryDate(e.target.value));
                    handleCreditCardChange();
                  }}
                  placeholder="MM/YY"
                  inputProps={{ maxLength: 5 }}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVV"
                  fullWidth
                  variant="outlined"
                  value={cvv}
                  onChange={(e) => {
                    setCvv(e.target.value.replace(/[^0-9]/g, '').substring(0, 4));
                    handleCreditCardChange();
                  }}
                  type="password"
                  inputProps={{ maxLength: 4 }}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Collapse>
      
      {/* EMI Plans */}
      <Collapse in={paymentMethod === 'emi'}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              EMI Plans
            </Typography>
            
            {emiPlans.length === 0 ? (
              <Typography color="text.secondary">
                No eligible EMI plans available for your purchase amount
              </Typography>
            ) : (
              <FormControl fullWidth error={!!errors.emiPlan}>
                <InputLabel id="emi-plan-label">Select EMI Plan</InputLabel>
                <Select
                  labelId="emi-plan-label"
                  value={selectedEmiPlan?.id || ''}
                  onChange={handleEmiPlanChange}
                  label="Select EMI Plan"
                >
                  {emiPlans.map((plan) => (
                    <MenuItem key={plan.id} value={plan.id}>
                      {plan.bank_name} - {plan.tenure_months} months @ {plan.interest_rate}% interest
                      {plan.processing_fee && ` (Processing fee: ${plan.processing_fee})`}
                    </MenuItem>
                  ))}
                </Select>
                {errors.emiPlan && <FormHelperText>{errors.emiPlan}</FormHelperText>}
                
                {selectedEmiPlan && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="subtitle2">EMI Details:</Typography>
                    <Typography variant="body2">
                      Monthly payment: ₹
                      {(parseFloat(totalAmount) * (1 + parseFloat(selectedEmiPlan.interest_rate) / 100) / selectedEmiPlan.tenure_months).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Total payment: ₹
                      {(parseFloat(totalAmount) * (1 + parseFloat(selectedEmiPlan.interest_rate) / 100)).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Interest amount: ₹
                      {(parseFloat(totalAmount) * parseFloat(selectedEmiPlan.interest_rate) / 100).toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </FormControl>
            )}
          </CardContent>
        </Card>
      </Collapse>
      
      {/* UPI */}
      <Collapse in={paymentMethod === 'upi'}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              UPI Payment
            </Typography>
            <TextField
              label="UPI ID"
              fullWidth
              variant="outlined"
              placeholder="yourname@upi"
              error={!!errors.upiId}
              helperText={errors.upiId || "e.g., yourname@okhdfcbank, yourname@ybl"}
            />
          </CardContent>
        </Card>
      </Collapse>
      
      {/* Net Banking */}
      <Collapse in={paymentMethod === 'netbanking'}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Net Banking
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="bank-select-label">Select Bank</InputLabel>
              <Select
                labelId="bank-select-label"
                label="Select Bank"
                defaultValue=""
              >
                <MenuItem value="hdfc">HDFC Bank</MenuItem>
                <MenuItem value="sbi">State Bank of India</MenuItem>
                <MenuItem value="icici">ICICI Bank</MenuItem>
                <MenuItem value="axis">Axis Bank</MenuItem>
                <MenuItem value="kotak">Kotak Mahindra Bank</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Collapse>
      
      {/* Wallet */}
      <Collapse in={paymentMethod === 'wallet'}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Wallet Payment
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="wallet-select-label">Select Wallet</InputLabel>
              <Select
                labelId="wallet-select-label"
                label="Select Wallet"
                defaultValue=""
              >
                <MenuItem value="paytm">Paytm</MenuItem>
                <MenuItem value="phonepe">PhonePe</MenuItem>
                <MenuItem value="amazonpay">Amazon Pay</MenuItem>
                <MenuItem value="mobikwik">MobiKwik</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Collapse>
    </Box>
  );
} 