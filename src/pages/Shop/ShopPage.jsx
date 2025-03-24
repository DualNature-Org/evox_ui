import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Pagination,
  useMediaQuery,
  Paper,
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useProducts } from '../../contexts/ProductContext';
import ProductGrid from '../../components/products/ProductGrid';
import ProductFilter from '../../components/products/ProductFilter';
import ProductSort from '../../components/products/ProductSort';
import { useNotification } from '../../contexts/NotificationContext';
import { useCart } from '../../contexts/CartContext';

const ShopPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Product context
  const {
    products,
    categories,
    isLoading,
    error,
    loadProducts
  } = useProducts();
  
  // State for filtering and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sort, setSort] = useState('newest');
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 10000],
    onlyFeatured: false,
    inStock: false,
    onSale: false
  });
  
  // Map sort values to API parameters
  const sortMapping = {
    newest: '-created_at',
    price_low: 'price',
    price_high: '-price',
    rating: '-average_rating',
    popularity: '-sold_count'
  };
  
  // Load products with current filters and sorting
  const fetchProducts = useCallback(async () => {
    const params = {
      page: currentPage,
    };
    
    // Add sorting
    if (sort && sortMapping[sort]) {
      params.ordering = sortMapping[sort];
    }
    
    // Add filters
    if (filters.categories.length > 0) {
      params.category = filters.categories.join(',');
    }
    
    if (filters.priceRange && filters.priceRange.length === 2) {
      params.min_price = filters.priceRange[0];
      params.max_price = filters.priceRange[1];
    }
    
    if (filters.onlyFeatured) {
      params.is_featured = true;
    }
    
    if (filters.inStock) {
      params.in_stock = true;
    }
    
    if (filters.onSale) {
      params.on_sale = true;
    }
    
    const response = await loadProducts(params);
    
    if (response) {
      setTotalProducts(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / 12)); // Assuming 12 products per page
    }
  }, [currentPage, filters, sort, loadProducts]);
  
  // Load products on initial render and when filters, sort, or page changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle sort change
  const handleSortChange = (newSort) => {
    setSort(newSort);
    setCurrentPage(1); // Reset to first page on sort change
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  // Placeholder for cart and wishlist handlers
  const { addNotification } = useNotification();
  const { addToCart } = useCart();
  
  const handleAddToCart = async (product) => {
    if (!product || product.stock_quantity <= 0) {
      addNotification(`${product.name} is out of stock`, 'error');
      return;
    }
    
    try {
      await addToCart(product.id, 1);
      addNotification(`${product.name} added to your cart!`, 'success');
    } catch (error) {
      addNotification(`Error: ${error.message || 'Failed to add item to cart'}`, 'error');
    }
  };
  
  const handleAddToWishlist = (product) => {
    console.log('Add to wishlist:', product);
    // Implement wishlist functionality
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Shop</Typography>
      </Breadcrumbs>
      
      {/* Page title and product count */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Shop All Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isLoading ? 'Loading products...' : 
            `Showing ${products.length} of ${totalProducts} products`}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Filters - Left sidebar on desktop, drawer on mobile */}
        <Grid item xs={12} md={3} lg={2.5}>
          <ProductFilter
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Grid>
        
        {/* Main product grid */}
        <Grid item xs={12} md={9} lg={9.5}>
          {/* Sort dropdown */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              flexDirection: isSmall ? 'column' : 'row',
              gap: 2
            }}
          >
            <Box>
              <ProductSort sort={sort} onSortChange={handleSortChange} />
            </Box>
            
            {!isSmall && (
              <Typography variant="body2" color="text.secondary">
                Page {currentPage} of {totalPages}
              </Typography>
            )}
          </Box>
          
          {/* Product grid */}
          <ProductGrid
            products={products}
            loading={isLoading}
            error={error}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            emptyMessage="No products match your current filters. Try adjusting your search criteria."
            columns={{ xs: 12, sm: 6, md: 6, lg: 4 }}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 6,
                mb: 2
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShopPage; 