import React from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products, 
  loading = false, 
  error = null, 
  onAddToCart, 
  onAddToWishlist,
  wishlistItems = [], 
  emptyMessage = "No products found",
  columns = { xs: 12, sm: 6, md: 4, lg: 3 }
}) => {
  
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  };
  
  // Show loading state
  if (loading) {
    return (
      <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Box 
        sx={{ 
          padding: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          color: 'error.main',
          textAlign: 'center'
        }}
      >
        <Typography>{error}</Typography>
      </Box>
    );
  }
  
  // Show empty state
  if (!products || products.length === 0) {
    return (
      <Box 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{ 
          padding: 3, 
          display: 'flex', 
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }
  
  // Make sure products is always an array before mapping
  const productsArray = Array.isArray(products) ? products : [];
  
  return (
    <Grid container spacing={3}>
      {productsArray.length > 0 ? (
        productsArray.map((product, index) => (
          <Grid 
            item 
            {...columns}
            key={product.id}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ProductCard 
              product={product} 
              onAddToCart={onAddToCart} 
              onAddToWishlist={onAddToWishlist}
              inWishlist={isInWishlist(product.id)}
            />
          </Grid>
        ))
      ) : (
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{ 
            padding: 3, 
            display: 'flex', 
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="text.secondary">{emptyMessage}</Typography>
        </Box>
      )}
    </Grid>
  );
};

export default ProductGrid; 