import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import addressService from '../../services/addressService';
import AddressCard from '../../components/user/AddressCard';
import AddressForm from '../../components/user/AddressForm';
import { useNotification } from '../../contexts/NotificationContext';

export default function AddressBook() {
  const { addNotification } = useNotification();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error('Failed to load addresses:', err);
      setError('Failed to load addresses. Please try again.');
      addNotification('Failed to load addresses', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddNewClick = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteClick = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setIsDeleting(true);
      try {
        await addressService.deleteAddress(addressId);
        setAddresses(addresses.filter(addr => addr.id !== addressId));
        addNotification('Address deleted successfully', 'success');
      } catch (err) {
        console.error('Failed to delete address:', err);
        addNotification('Failed to delete address', 'error');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSetDefault = async (addressId, addressType) => {
    try {
      await addressService.setDefaultAddress(addressId, addressType);
      // Update local state to reflect the change
      setAddresses(addresses.map(addr => ({
        ...addr,
        is_default: addr.id === addressId && addr.address_type === addressType ? 
                    true : 
                    (addr.address_type === addressType ? false : addr.is_default)
      })));
      addNotification('Default address updated', 'success');
    } catch (err) {
      console.error('Failed to set default address:', err);
      addNotification('Failed to update default address', 'error');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingAddress) {
        // Update existing address
        await addressService.updateAddress(editingAddress.id, formData);
        setAddresses(addresses.map(addr => 
          addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr
        ));
        addNotification('Address updated successfully', 'success');
      } else {
        // Create new address
        const newAddress = await addressService.createAddress(formData);
        setAddresses([...addresses, newAddress]);
        addNotification('Address added successfully', 'success');
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error('Failed to save address:', err);
      addNotification('Failed to save address', 'error');
    }
  };

  // Filter addresses by type
  const shippingAddresses = addresses.filter(addr => addr.address_type === 'shipping');
  const billingAddresses = addresses.filter(addr => addr.address_type === 'billing');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Address Book
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {showForm ? (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Typography>
              <AddressForm
                initialAddress={editingAddress}
                addressType={tabValue === 0 ? 'shipping' : 'billing'}
                onSave={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                }}
              />
            </Paper>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddNewClick}
              >
                Add New Address
              </Button>
            </Box>
          )}
          
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Shipping Addresses" />
                <Tab label="Billing Addresses" />
              </Tabs>
            </Box>
            
            <Box role="tabpanel" hidden={tabValue !== 0} sx={{ py: 3 }}>
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  {shippingAddresses.length === 0 ? (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography>No shipping addresses found.</Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<AddIcon />} 
                          onClick={handleAddNewClick}
                          sx={{ mt: 2 }}
                        >
                          Add New Shipping Address
                        </Button>
                      </Paper>
                    </Grid>
                  ) : (
                    shippingAddresses.map(address => (
                      <Grid item xs={12} sm={6} md={4} key={address.id}>
                        <Paper sx={{ p: 3, height: '100%', position: 'relative' }}>
                          <AddressCard address={address} />
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                              size="small" 
                              startIcon={<EditIcon />}
                              onClick={() => handleEditClick(address)}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="small" 
                              color="error" 
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteClick(address.id)}
                              disabled={isDeleting}
                            >
                              Delete
                            </Button>
                          </Box>
                          {!address.is_default && (
                            <Button
                              size="small"
                              variant="text"
                              fullWidth
                              sx={{ mt: 1 }}
                              onClick={() => handleSetDefault(address.id, 'shipping')}
                            >
                              Set as Default
                            </Button>
                          )}
                        </Paper>
                      </Grid>
                    ))
                  )}
                </Grid>
              )}
            </Box>
            
            <Box role="tabpanel" hidden={tabValue !== 1} sx={{ py: 3 }}>
              {tabValue === 1 && (
                <Grid container spacing={3}>
                  {billingAddresses.length === 0 ? (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography>No billing addresses found.</Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<AddIcon />} 
                          onClick={handleAddNewClick}
                          sx={{ mt: 2 }}
                        >
                          Add New Billing Address
                        </Button>
                      </Paper>
                    </Grid>
                  ) : (
                    billingAddresses.map(address => (
                      <Grid item xs={12} sm={6} md={4} key={address.id}>
                        <Paper sx={{ p: 3, height: '100%', position: 'relative' }}>
                          <AddressCard address={address} />
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                              size="small" 
                              startIcon={<EditIcon />}
                              onClick={() => handleEditClick(address)}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="small" 
                              color="error" 
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteClick(address.id)}
                              disabled={isDeleting}
                            >
                              Delete
                            </Button>
                          </Box>
                          {!address.is_default && (
                            <Button
                              size="small"
                              variant="text"
                              fullWidth
                              sx={{ mt: 1 }}
                              onClick={() => handleSetDefault(address.id, 'billing')}
                            >
                              Set as Default
                            </Button>
                          )}
                        </Paper>
                      </Grid>
                    ))
                  )}
                </Grid>
              )}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
} 