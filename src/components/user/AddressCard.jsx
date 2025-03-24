import React from 'react';
import { Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function AddressCard({ address }) {
  if (!address) return null;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <LocationOnIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5 }} />
      <Box>
        <Typography variant="body1">
          {address.street_address}
          {address.apartment_number && `, ${address.apartment_number}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {address.city}, {address.state} {address.postal_code}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {address.country}
        </Typography>
        {address.is_default && (
          <Typography variant="caption" sx={{ 
            color: 'primary.main', 
            mt: 1, 
            display: 'block' 
          }}>
            Default {address.address_type === 'shipping' ? 'Shipping' : 'Billing'} Address
          </Typography>
        )}
      </Box>
    </Box>
  );
} 