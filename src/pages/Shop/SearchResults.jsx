import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../../contexts/ProductContext';
import ProductGrid from '../../components/products/ProductGrid';
import ProductSort from '../../components/products/ProductSort';
import ProductFilter from '../../components/products/ProductFilter';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    products,
    categories,
    isLoading,
    error,
    searchProducts
  } = useProducts();
  
  // Get search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [sort, setSort] = useState('relevance');
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 10000],
    onlyFeatured: false,
    inStock: false,
    onSale: false
  });
  
  // Map sort values to API parameters
  const sortMapping = {
    relevance: '',
    newest: '-created_at',
    price_low: 'price',
    price_high: '-price',
    rating: '-average_rating',
    popularity: '-sold_count'
  };
  
  // Load search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return;
      
      const params = {};
      
      // Add sorting
      if (sort && sortMapping[sort] && sort !== 'relevance') {
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
      
      await searchProducts(searchQuery, params);
    };
    
    fetchSearchResults();
  }, [searchQuery, sort, filters, searchProducts]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    if (searchQuery) {
      navigate('/shop');
    }
  };
  
  const handleSortChange = (newSort) => {
    setSort(newSort);
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleAddToCart = (product, quantity = 1) => {
    // TODO: Implement cart functionality
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };
  
  const handleAddToWishlist = (product) => {
    // TODO: Implement wishlist functionality
    console.log(`Added ${product.name} to wishlist`);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/shop" color="inherit">
          Shop
        </Link>
        <Typography color="text.primary">
          Search Results
        </Typography>
      </Breadcrumbs>
      
      {/* Search form */}
      <Paper
        component={motion.form}
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={2}
        sx={{ p: 3, mb: 4, borderRadius: 2 }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Search Products
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="What are you looking for?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />
        
        {searchQuery && (
          <Box sx={{ mt: 2 }}>
            <Chip 
              label={`Search: "${searchQuery}"`} 
              onDelete={handleClearSearch}
              color="primary"
            />
          </Box>
        )}
      </Paper>
      
      {searchQuery && (
        <>
          {/* Search Results Header */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ mb: 4 }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              {products.length > 0 
                ? `Found ${products.length} result${products.length !== 1 ? 's' : ''} for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </Typography>
            <Divider />
          </Box>
          
          {/* Products Grid with Filters */}
          <Grid container spacing={4}>
            {/* Filters */}
            <Grid item xs={12} md={3}>
              <ProductFilter
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </Grid>
            
            {/* Products */}
            <Grid item xs={12} md={9}>
              {/* Sort controls */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mb: 3
                }}
              >
                <ProductSort sort={sort} onSortChange={handleSortChange} />
              </Box>
              
              {/* Product Grid */}
              <ProductGrid
                products={products}
                loading={isLoading}
                error={error}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                emptyMessage={`No products match your search for "${searchQuery}". Try different keywords or browse our shop.`}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default SearchResults; 