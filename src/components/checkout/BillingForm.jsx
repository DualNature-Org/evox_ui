import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Checkbox,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import addressService from '../../services/addressService';
import AddressForm from '../user/AddressForm';
import AddressCard from '../user/AddressCard';
import { useNotification } from '../../contexts/NotificationContext';

export default function BillingForm({ initialAddress, shippingAddress, onAddressSelected }) {
  const { addNotification } = useNotification();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [useSameAsShipping, setUseSameAsShipping] = useState(false);

  // Use useCallback to prevent recreation on each render
  const fetchAddresses = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const data = await addressService.getAddresses();
      // Filter to only billing addresses or addresses without a specific type
      const billingAddresses = data.filter(
        addr => addr.address_type === 'billing' || !addr.address_type
      );
      setAddresses(billingAddresses);
      
      // If there's an initialAddress, select it
      if (initialAddress) {
        setSelectedAddress(initialAddress);
        setUseSameAsShipping(false);
      }
      // Otherwise, select the default billing address if available
      else if (shippingAddress) {
        setUseSameAsShipping(true);
        if (onAddressSelected) onAddressSelected(shippingAddress);
      } else {
        const defaultAddress = billingAddresses.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          if (onAddressSelected) onAddressSelected(defaultAddress);
        } else if (billingAddresses.length > 0) {
          setSelectedAddress(billingAddresses[0]);
          if (onAddressSelected) onAddressSelected(billingAddresses[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
      addNotification('Failed to load billing addresses', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [initialAddress, shippingAddress, onAddressSelected, isLoading, addNotification]);
  
  // Only fetch addresses once on component mount
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    const selected = addresses.find(addr => addr.id === addressId);
    if (selected) {
      onAddressSelected(selected);
    }
  };

  const handleSameAsShippingChange = (event) => {
    setUseSameAsShipping(event.target.checked);
  };

  const handleAddNewClick = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleFormSubmit = async (addressData) => {
    setIsLoading(true);
    try {
      let updatedAddress;
      
      if (editingAddress) {
        // Update existing address
        updatedAddress = await addressService.updateAddress(editingAddress.id, {
          ...addressData,
          address_type: 'billing'
        });
        setAddresses(addresses.map(addr => 
          addr.id === updatedAddress.id ? updatedAddress : addr
        ));
        addNotification('Address updated successfully', 'success');
      } else {
        // Create new address
        updatedAddress = await addressService.createAddress({
          ...addressData,
          address_type: 'billing'
        });
        setAddresses([...addresses, updatedAddress]);
        addNotification('Address added successfully', 'success');
      }
      
      // Select the new/updated address
      setSelectedAddress(updatedAddress.id);
      onAddressSelected(updatedAddress);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save address:', error);
      addNotification('Failed to save address', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  if (isLoading && addresses.length === 0 && !shippingAddress) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Billing Address
      </Typography>
      
      {shippingAddress && (
        <FormControlLabel
          control={
            <Checkbox 
              checked={useSameAsShipping}
              onChange={handleSameAsShippingChange}
              color="primary"
            />
          }
          label="Same as shipping address"
          sx={{ mb: 2 }}
        />
      )}
      
      {!useSameAsShipping && (
        showForm ? (
          <AddressForm 
            initialData={editingAddress} 
            onSubmit={handleFormSubmit} 
            onCancel={handleFormCancel}
            addressType="billing"
            isLoading={isLoading}
          />
        ) : (
          <>
            {addresses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography gutterBottom>You don't have any billing addresses yet.</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddNewClick}
                >
                  Add New Address
                </Button>
              </Box>
            ) : (
              <>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={selectedAddress}
                    onChange={(e) => handleAddressSelect(parseInt(e.target.value))}
                  >
                    <Grid container spacing={2}>
                      {addresses.map((address) => (
                        <Grid item xs={12} key={address.id}>
                          <Paper 
                            variant="outlined" 
                            sx={{ 
                              p: 2, 
                              borderColor: selectedAddress === address.id ? 'primary.main' : 'divider',
                              position: 'relative'
                            }}
                          >
                            <FormControlLabel
                              value={address.id}
                              control={<Radio />}
                              label={<AddressCard address={address} />}
                              sx={{ width: '100%', m: 0 }}
                            />
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => handleEditClick(address)}
                              sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                              Edit
                            </Button>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                </FormControl>
                
                <Divider sx={{ my: 2 }} />
                
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={handleAddNewClick}
                  fullWidth
                >
                  Add New Billing Address
                </Button>
              </>
            )}
          </>
        )
      )}
      
      {useSameAsShipping && shippingAddress && (
        <Paper variant="outlined" sx={{ p: 2, borderColor: 'primary.main' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Using Shipping Address:
          </Typography>
          <AddressCard address={shippingAddress} />
        </Paper>
      )}
    </Box>
  );
} 