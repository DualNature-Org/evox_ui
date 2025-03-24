import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Grid,
  Paper,
  ButtonBase
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius
}));

const ProductImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  maxHeight: 120
});

const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  editable = true
}) => {
  if (!item) return null;

  // Use the correct property path for the product ID
  const productLink = `/shop/product/${item.product_id || (item.product && item.product.id)}`;
  
  // Handle both directly attached prices and nested product prices
  const getPrice = () => {
    // If price is directly on the item
    if (typeof item.sale_price === 'number' || typeof item.price === 'number') {
      return item.sale_price || item.price;
    }
    
    // If price is in a nested product object
    if (item.product) {
      return item.product.sale_price || item.product.price;
    }
    
    // Default fallback
    return 0;
  };
  
  const price = getPrice();
  const totalPrice = price * (item.quantity || 1);
  
  // Check if there's a discount by comparing sale_price and regular price
  const hasDiscount = () => {
    // Direct properties
    if (typeof item.sale_price === 'number' && typeof item.price === 'number') {
      return item.sale_price < item.price;
    }
    
    // Nested product properties
    if (item.product && typeof item.product.sale_price === 'number' && typeof item.product.price === 'number') {
      return item.product.sale_price < item.product.price;
    }
    
    return false;
  };
  
  // Get the regular price (not sale price)
  const getRegularPrice = () => {
    if (typeof item.price === 'number') {
      return item.price;
    }
    
    if (item.product && typeof item.product.price === 'number') {
      return item.product.price;
    }
    
    return 0;
  };
  
  // Handlers remain the same
  const handleIncrementQuantity = () => {
    onUpdateQuantity(item.id, (item.quantity || 1) + 1);
  };
  
  const handleDecrementQuantity = () => {
    if ((item.quantity || 1) > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onUpdateQuantity(item.id, value);
    }
  };
  
  const handleRemove = () => {
    onRemove(item.id);
  };
  
  // Get the appropriate image URL
  const getImageUrl = () => {
    if (item.image) return item.image;
    if (item.product && item.product.primary_image) return item.product.primary_image;
    return 'https://via.placeholder.com/150';
  };
  
  // Get the product name
  const getProductName = () => {
    return item.name || (item.product && item.product.name) || 'Product';
  };
  
  return (
    <StyledPaper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      elevation={1}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Product Image */}
        <Grid item xs={3} sm={2}>
          <ButtonBase
            component={Link}
            to={productLink}
            sx={{ width: '100%', height: '100%', display: 'block' }}
          >
            <ProductImage 
              src={getImageUrl()} 
              alt={getProductName()} 
            />
          </ButtonBase>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={9} sm={6}>
          <Box>
            <Typography
              variant="subtitle1"
              component={Link}
              to={productLink}
              sx={{ 
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              {getProductName()}
            </Typography>
            
            {/* Product variants/options if any */}
            {item.options && Object.keys(item.options).length > 0 && (
              <Box mt={1}>
                {Object.entries(item.options).map(([key, value]) => (
                  <Typography key={key} variant="body2" color="text.secondary">
                    {key}: {value}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Grid>
        
        {/* Quantity Controls */}
        <Grid item xs={6} sm={2}>
          {editable ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                size="small" 
                onClick={handleDecrementQuantity}
                disabled={(item.quantity || 1) <= 1}
                color="primary"
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              
              <TextField
                value={item.quantity || 1}
                onChange={handleQuantityChange}
                variant="outlined"
                size="small"
                inputProps={{ 
                  min: 1, 
                  style: { textAlign: 'center', width: '40px', padding: '4px' } 
                }}
                sx={{ mx: 1 }}
              />
              
              <IconButton 
                size="small" 
                onClick={handleIncrementQuantity}
                color="primary"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Typography variant="body1">
              Qty: {item.quantity || 1}
            </Typography>
          )}
        </Grid>
        
        {/* Price */}
        <Grid item xs={4} sm={1}>
          <Box sx={{ textAlign: 'right' }}>
            {hasDiscount() && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${typeof getRegularPrice() === 'number' ? getRegularPrice().toFixed(2) : '0.00'}
              </Typography>
            )}
            <Typography variant="body1" fontWeight="bold" color={hasDiscount() ? 'secondary.main' : 'inherit'}>
              ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
            </Typography>
          </Box>
        </Grid>
        
        {/* Total Price & Remove Button */}
        <Grid item xs={2} sm={1}>
          <Box sx={{ textAlign: 'right', fontWeight: 'bold' }}>
            ${typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00'}
          </Box>
          {editable && (
            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <IconButton 
                size="small" 
                onClick={handleRemove}
                color="error"
                aria-label="remove item"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default CartItem; 