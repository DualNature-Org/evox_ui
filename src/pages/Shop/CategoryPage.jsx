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
  Skeleton,
  Paper,
  Button,
  Chip
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useProducts } from '../../contexts/ProductContext';
import ProductGrid from '../../components/products/ProductGrid';
// import ProductFilter from '../../components/products/ProductFilter';
import ProductSort from '../../components/products/ProductSort';
import { useNotification } from '../../contexts/NotificationContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

// Hardcoded categories for now
const HARDCODED_CATEGORIES = {
  '1': { 
    id: 1, 
    name: 'Automatic Wheelchairs', 
    description: 'Premium motorized wheelchairs with advanced features for enhanced mobility and independence.'
  },
  '2': { 
    id: 2, 
    name: 'Manual Wheelchairs', 
    description: 'Lightweight, durable manual wheelchairs designed for comfort and ease of use.'
  },
  '3': { 
    id: 3, 
    name: 'Specialty Wheelchairs', 
    description: 'Specialized wheelchairs for unique needs including sports, pediatric, and all-terrain models.'
  }
};

const CategoryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { categoryId } = useParams();
  
  // Product context
  const {
    products,
    categories,
    isLoading,
    error,
    loadProducts
  } = useProducts();
  
  // State for current category - use hardcoded data
  const [category, setCategory] = useState(null);
  
  // State for filtering and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sort, setSort] = useState('newest');
  const [filters, setFilters] = useState({
    categories: [parseInt(categoryId)], // Pre-select current category
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
  
  // Load category information from hardcoded data
  useEffect(() => {
    if (categoryId) {
      setCategory(HARDCODED_CATEGORIES[categoryId]);
      
      // Update filters to include this category
      setFilters(prev => ({
        ...prev,
        categories: [parseInt(categoryId)]
      }));
    }
  }, [categoryId]);
  
  // Load products with current filters and sorting
  const fetchProducts = useCallback(async () => {
    const params = {
      page: currentPage,
      category: categoryId // Always filter by this category
    };
    
    // Add sorting
    if (sort && sortMapping[sort]) {
      params.ordering = sortMapping[sort];
    }
    
    // Add other filters
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
  }, [currentPage, filters, sort, categoryId, loadProducts]);
  
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
    // Ensure the category filter stays applied
    const updatedFilters = {
      ...newFilters,
      categories: [parseInt(categoryId)]
    };
    
    setFilters(updatedFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  // Cart and wishlist handlers
  const { addNotification } = useNotification();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
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
  
  const handleAddToWishlist = async (product) => {
    try {
      if (await isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        addNotification(`${product.name} removed from your wishlist`, 'info');
      } else {
        await addToWishlist(product.id);
        addNotification(`${product.name} added to your wishlist!`, 'success');
      }
    } catch (error) {
      addNotification(`Error: ${error.message || 'Failed to update wishlist'}`, 'error');
    }
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/shop" color="inherit">
          Shop
        </Link>
        <Typography color="text.primary">
          {isLoading || !category ? (
            <Skeleton width={100} />
          ) : (
            category?.name || 'Category'
          )}
        </Typography>
      </Breadcrumbs>
      
      {/* Page title and product count */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 4 }}
      >
        {isLoading || !category ? (
          <>
            <Skeleton variant="text" width="60%" height={60} />
            <Skeleton variant="text" width="40%" />
          </>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              {category?.name || 'Products'}
            </Typography>
            {category?.description && (
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ mb: 2, maxWidth: '800px' }}
              >
                {category.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {isLoading ? 'Loading products...' : 
                  `Showing ${products.length} of ${totalProducts} products`}
              </Typography>
              {category && (
                <Chip 
                  label={`${category.name} Collection`} 
                  color="primary" 
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {/* Filters - Left sidebar on desktop, drawer on mobile */}
        {/* <Grid item xs={12} md={3} lg={2.5}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductFilter
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              disableCategoryFilter={true} // Disable category selection as we're in a category page
            />
          </motion.div>
        </Grid> */}
        
        {/* Main product grid */}
        <Grid item xs={12} md={12} lg={9.5}>
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
                Page {currentPage} of {totalPages || 1}
              </Typography>
            )}
          </Box>
          
          {/* Product grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProductGrid
              products={products}
              loading={isLoading}
              error={error}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              emptyMessage={`No products found in the ${category?.name || 'selected'} category. Please check back later.`}
              columns={{ xs: 12, sm: 6, md: 6, lg: 4 }}
            />
          </motion.div>
          
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

export default CategoryPage; 