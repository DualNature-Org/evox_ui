import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import ProductGrid from './ProductGrid';

const RelatedProducts = ({
  products = [],
  loading = false,
  error = null,
  onAddToCart,
  onAddToWishlist,
  wishlistItems = []
}) => {
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ mt: 8, mb: 4 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        You May Also Like
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        wishlistItems={wishlistItems}
        emptyMessage="No related products found"
        columns={{ xs: 12, sm: 6, md: 4, lg: 3 }}
      />
    </Box>
  );
};

export default RelatedProducts; 