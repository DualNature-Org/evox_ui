import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
  Alert
} from '@mui/material';
import { useNotification } from '../../contexts/NotificationContext';
import addressService from '../../services/addressService';

export default function AddressForm({ 
  initialAddress = null,
  addressType = 'shipping',
  onSave,
  onCancel
}) {
  const { addNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    address_type: addressType,
    street_address: '',
    apartment_number: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    is_default: false
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Load initial address if editing
  useEffect(() => {
    if (initialAddress) {
      setFormData({
        address_type: initialAddress.address_type || addressType,
        street_address: initialAddress.street_address || '',
        apartment_number: initialAddress.apartment_number || '',
        city: initialAddress.city || '',
        state: initialAddress.state || '',
        postal_code: initialAddress.postal_code || '',
        country: initialAddress.country || '',
        is_default: initialAddress.is_default || false
      });
    }
  }, [initialAddress, addressType]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_default' ? checked : value
    }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.street_address.trim()) {
      newErrors.street_address = 'Street address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Postal code is required';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      let result;
      
      if (initialAddress?.id) {
        // Update existing address
        result = await addressService.updateAddress(initialAddress.id, formData);
        addNotification('Address updated successfully', 'success');
      } else {
        // Create new address
        result = await addressService.createAddress(formData);
        addNotification('Address added successfully', 'success');
      }
      
      if (onSave) {
        onSave(result);
      }
    } catch (err) {
      console.error('Failed to save address:', err);
      setError('Failed to save address. Please try again.');
      addNotification('Failed to save address', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel id="address-type-label">Address Type</InputLabel>
            <Select
              labelId="address-type-label"
              id="address_type"
              name="address_type"
              value={formData.address_type}
              onChange={handleChange}
              label="Address Type"
            >
              <MenuItem value="shipping">Shipping</MenuItem>
              <MenuItem value="billing">Billing</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="street_address"
            name="street_address"
            label="Street Address"
            value={formData.street_address}
            onChange={handleChange}
            error={!!errors.street_address}
            helperText={errors.street_address}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="apartment_number"
            name="apartment_number"
            label="Apartment, Suite, etc. (optional)"
            value={formData.apartment_number}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="city"
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="state"
            name="state"
            label="State / Province / Region"
            value={formData.state}
            onChange={handleChange}
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="postal_code"
            name="postal_code"
            label="Postal Code"
            value={formData.postal_code}
            onChange={handleChange}
            error={!!errors.postal_code}
            helperText={errors.postal_code}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="country"
            name="country"
            label="Country"
            value={formData.country}
            onChange={handleChange}
            error={!!errors.country}
            helperText={errors.country}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                id="is_default"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                color="primary"
              />
            }
            label={`Set as default ${formData.address_type === 'shipping' ? 'shipping' : 'billing'} address`}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : initialAddress?.id ? (
            'Update Address'
          ) : (
            'Save Address'
          )}
        </Button>
      </Box>
    </Box>
  );
} 