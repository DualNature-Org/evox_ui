import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  Drawer,
  IconButton,
  Paper,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ProductFilter = ({
  categories = [],
  minPrice = 0,
  maxPrice = 1000,
  filters = {},
  onFilterChange,
  allowMultipleCategorySelection = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [localFilters, setLocalFilters] = useState({
    categories: filters.categories || [],
    priceRange: filters.priceRange || [minPrice, maxPrice],
    onlyFeatured: filters.onlyFeatured || false,
    inStock: filters.inStock || false,
    onSale: filters.onSale || false,
    ...filters
  });
  
  const handleToggleMobileFilter = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleCategoryChange = (categoryId) => {
    let newCategories;
    if (allowMultipleCategorySelection) {
      // Multiple selection mode
      if (localFilters.categories.includes(categoryId)) {
        newCategories = localFilters.categories.filter(id => id !== categoryId);
      } else {
        newCategories = [...localFilters.categories, categoryId];
      }
    } else {
      // Single selection mode (radio button behavior)
      newCategories = localFilters.categories.includes(categoryId) ? [] : [categoryId];
    }
    
    const newFilters = { ...localFilters, categories: newCategories };
    setLocalFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };
  
  const handlePriceChange = (event, newValue) => {
    const newFilters = { ...localFilters, priceRange: newValue };
    setLocalFilters(newFilters);
  };
  
  const handlePriceChangeCommitted = (event, newValue) => {
    onFilterChange && onFilterChange(localFilters);
  };
  
  const handleCheckboxChange = (filterName) => (event) => {
    const newFilters = { ...localFilters, [filterName]: event.target.checked };
    setLocalFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };
  
  const handleClearAll = () => {
    const resetFilters = {
      categories: [],
      priceRange: [minPrice, maxPrice],
      onlyFeatured: false,
      inStock: false,
      onSale: false
    };
    setLocalFilters(resetFilters);
    onFilterChange && onFilterChange(resetFilters);
  };
  
  // Make sure categories is always an array
  const categoriesArray = Array.isArray(categories) ? categories : [];
  
  const filterContent = (
    <Box sx={{ p: isMobile ? 2 : 0 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={handleToggleMobileFilter}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={handleClearAll}
        fullWidth
        sx={{ mb: 2 }}
        component={motion.button}
        whileTap={{ scale: 0.95 }}
      >
        Clear All Filters
      </Button>
      
      {/* Categories */}
      <Accordion defaultExpanded elevation={0} disableGutters>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="categories-content"
          id="categories-header"
        >
          <Typography variant="subtitle1" fontWeight="bold">Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {categoriesArray.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox 
                    checked={localFilters.categories.includes(category.id)} 
                    onChange={() => handleCategoryChange(category.id)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">{category.name}</Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Price Range */}
      <Accordion defaultExpanded elevation={0} disableGutters>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="price-content"
          id="price-header"
        >
          <Typography variant="subtitle1" fontWeight="bold">Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Slider
              value={localFilters.priceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceChangeCommitted}
              valueLabelDisplay="auto"
              min={minPrice}
              max={maxPrice}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">${localFilters.priceRange[0]}</Typography>
              <Typography variant="body2">${localFilters.priceRange[1]}</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Additional filters */}
      <Accordion defaultExpanded elevation={0} disableGutters>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="additional-content"
          id="additional-header"
        >
          <Typography variant="subtitle1" fontWeight="bold">Additional Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={localFilters.onSale} 
                  onChange={handleCheckboxChange('onSale')}
                  color="secondary"
                />
              }
              label={
                <Typography variant="body2">On Sale</Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={localFilters.onlyFeatured} 
                  onChange={handleCheckboxChange('onlyFeatured')}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">Featured Products</Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={localFilters.inStock} 
                  onChange={handleCheckboxChange('inStock')}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">In Stock</Typography>
              }
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
  
  // Mobile filter toggle button
  const filterToggle = isMobile && (
    <Box sx={{ mb: 2 }}>
      <Button 
        variant="outlined" 
        startIcon={<FilterIcon />}
        onClick={handleToggleMobileFilter}
        fullWidth
      >
        Filters
      </Button>
    </Box>
  );
  
  return (
    <>
      {filterToggle}
      
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleToggleMobileFilter}
          PaperProps={{
            sx: { width: 280 }
          }}
        >
          {filterContent}
        </Drawer>
      ) : (
        <Paper 
          elevation={1}
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ p: 2 }}
        >
          {filterContent}
        </Paper>
      )}
    </>
  );
};

export default ProductFilter; 