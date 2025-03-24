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
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import addressService from '../../services/addressService';
import AddressForm from '../user/AddressForm';
import AddressCard from '../user/AddressCard';
import { useNotification } from '../../contexts/NotificationContext';

export default function ShippingForm({ initialAddress, onAddressSelected }) {
  const { addNotification } = useNotification();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Use useCallback to prevent recreation on each render
  const fetchAddresses = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const data = await addressService.getAddresses();
      // Filter to only shipping addresses or addresses without a specific type
      const shippingAddresses = data.filter(
        addr => addr.address_type === 'shipping' || !addr.address_type
      );
      setAddresses(shippingAddresses);
      
      // If there's an initialAddress, select it
      if (initialAddress) {
        setSelectedAddress(initialAddress);
      }
      // Otherwise, select the default shipping address if available
      else {
        const defaultAddress = shippingAddresses.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          if (onAddressSelected) onAddressSelected(defaultAddress);
        } else if (shippingAddresses.length > 0) {
          setSelectedAddress(shippingAddresses[0]);
          if (onAddressSelected) onAddressSelected(shippingAddresses[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
      addNotification('Failed to load shipping addresses', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [initialAddress, onAddressSelected, isLoading, addNotification]);
  
  // Only fetch addresses once on component mount
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);
  
  const handleAddressChange = (event) => {
    const addressId = event.target.value;
    const selected = addresses.find(addr => addr.id === parseInt(addressId));
    setSelectedAddress(selected);
    if (onAddressSelected) onAddressSelected(selected);
  };
  
  const handleAddNewClick = () => {
    setEditingAddress(null);
    setShowForm(true);
  };
  
  const handleEditClick = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };
  
  const handleFormSubmit = async (addressData) => {
    setIsLoading(true);
    try {
      let newAddress;
      if (editingAddress) {
        newAddress = await addressService.updateAddress(editingAddress.id, addressData);
        addNotification('Address updated successfully', 'success');
      } else {
        newAddress = await addressService.createAddress(addressData);
        addNotification('Address added successfully', 'success');
      }
      
      // Refresh the addresses list
      await fetchAddresses();
      
      // Select the new/edited address
      setSelectedAddress(newAddress);
      if (onAddressSelected) onAddressSelected(newAddress);
      
      setShowForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error('Failed to save address:', err);
      addNotification('Failed to save address', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && addresses.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      
      {showForm ? (
        <AddressForm 
          initialData={editingAddress} 
          onSubmit={handleFormSubmit} 
          onCancel={handleFormCancel}
          addressType="shipping"
          isLoading={isLoading}
        />
      ) : (
        <>
          {addresses.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography gutterBottom>You don't have any shipping addresses yet.</Typography>
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
                  value={selectedAddress?.id}
                  onChange={handleAddressChange}
                >
                  <Grid container spacing={2}>
                    {addresses.map((address) => (
                      <Grid item xs={12} key={address.id}>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            borderColor: selectedAddress?.id === address.id ? 'primary.main' : 'divider',
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
                Add New Shipping Address
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
} 