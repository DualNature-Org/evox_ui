import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  ButtonBase
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const ProductImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  maxHeight: 120
});

const WishlistItem = ({
  item,
  onRemove,
  onMoveToCart
}) => {
  if (!item) return null;
  
  // Get the proper product ID (handle both direct and nested structures)
  const getProductId = () => {
    if (item.product_id) return item.product_id;
    if (item.product && item.product.id) return item.product.id;
    return null;
  };
  
  const productId = getProductId();
  const productLink = productId ? `/shop/product/${productId}` : '/shop';
  
  const handleRemove = () => {
    if (onRemove && item.id) {
      onRemove(item.id);
    }
  };
  
  const handleMoveToCart = () => {
    if (onMoveToCart && item.id) {
      onMoveToCart(item.id);
    }
  };
  
  // Format the price correctly, ensuring it's a number first
  const formatPrice = (price) => {
    // If price is a string (which it likely is from the API), convert to number
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number before calling toFixed
    if (typeof numPrice === 'number' && !isNaN(numPrice)) {
      return numPrice.toFixed(2);
    }
    
    // Fallback in case price is not a valid number
    return '0.00';
  };
  
  // Get product name (handle both direct and nested structures)
  const getProductName = () => {
    if (item.name) return item.name;
    if (item.product && item.product.name) return item.product.name;
    return 'Product';
  };
  
  // Get product image (handle both direct and nested structures)
  const getProductImage = () => {
    if (item.image) return item.image;
    if (item.product && item.product.primary_image) {
      if (typeof item.product.primary_image === 'object') {
        return item.product.primary_image.image || 'https://via.placeholder.com/150';
      }
      return item.product.primary_image;
    }
    return 'https://via.placeholder.com/150';
  };
  
  // Get price (handle both direct and nested structures)
  const getPrice = () => {
    if (typeof item.sale_price !== 'undefined') return item.sale_price;
    if (typeof item.price !== 'undefined') return item.price;
    if (item.product) {
      if (typeof item.product.sale_price !== 'undefined') return item.product.sale_price;
      if (typeof item.product.price !== 'undefined') return item.product.price;
    }
    return 0;
  };
  
  // Get regular price (handle both direct and nested structures)
  const getRegularPrice = () => {
    if (typeof item.regular_price !== 'undefined') return item.regular_price;
    if (typeof item.price !== 'undefined') return item.price;
    if (item.product) {
      if (typeof item.product.price !== 'undefined') return item.product.price;
    }
    return 0;
  };
  
  // Check if the product has a sale price
  const hasDiscount = () => {
    const salePrice = getPrice();
    const regularPrice = getRegularPrice();
    
    return salePrice !== null && regularPrice !== null && salePrice < regularPrice;
  };
  
  return (
    <StyledPaper component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Product Image */}
        <Grid item xs={12} sm={2}>
          <ButtonBase component={Link} to={productLink} sx={{ display: 'block', width: '100%' }}>
            <ProductImage 
              src={getProductImage()} 
              alt={getProductName()} 
            />
          </ButtonBase>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} sm={6}>
          <Typography 
            variant="h6" 
            component={Link} 
            to={productLink}
            sx={{ 
              textDecoration: 'none', 
              color: 'text.primary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            {getProductName()}
          </Typography>
          
          {item.product && item.product.short_description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {item.product.short_description}
            </Typography>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Added: {new Date(item.added_at).toLocaleDateString()}
          </Typography>
        </Grid>
        
        {/* Price and Actions */}
        <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <Typography variant="h6" color="primary" fontWeight="medium">
            ${formatPrice(getPrice())}
            {hasDiscount() && (
              <Typography 
                component="span" 
                variant="body2" 
                color="text.secondary" 
                sx={{ textDecoration: 'line-through', ml: 1 }}
              >
                ${formatPrice(getRegularPrice())}
              </Typography>
            )}
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<CartIcon />}
              onClick={handleMoveToCart}
            >
              Add to Cart
            </Button>
            <IconButton
              size="small"
              onClick={handleRemove}
              color="error"
              aria-label="remove item"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default WishlistItem; 