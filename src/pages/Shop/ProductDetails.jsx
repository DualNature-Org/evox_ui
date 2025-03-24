import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  Button,
  Rating,
  Chip,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Paper,
  Skeleton,
  Alert,
  useMediaQuery,
  Stack,
  Card,
  CardMedia,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Share as ShareIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import productService from '../../services/productService';
import { useUser } from '../../contexts/UserContext';
import { useNotification } from '../../contexts/NotificationContext';
import ProductSpecifications from '../../components/products/ProductSpecifications';
import ProductReviews from '../../components/products/ProductReviews';
import RelatedProducts from '../../components/products/RelatedProducts';
import { useCart } from '../../contexts/CartContext';
import wishlistService from '../../services/wishlistService';
import useProductActions from '../../hooks/useProductActions';

// Enhanced styled components
const ProductImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover .zoom-icon': {
    opacity: 1,
  }
}));

const ZoomIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 16,
  top: 16,
  backgroundColor: theme.palette.common.white,
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 2,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  }
}));

const ImageGalleryThumbnail = styled(Box)(({ theme, active }) => ({
  width: 70,
  height: 70,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.light,
  }
}));

const QuantitySelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
}));

const ProductFeatureBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  }
}));

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Format description for better display
const formatDescription = (description) => {
  if (!description) return '';
  
  // Replace bullet points for better display
  let formatted = description.replace(/•/g, '<br/>• ');
  
  // Split by lines with "Key Features:" and format
  const parts = formatted.split(/(Key Features:)/i);
  if (parts.length > 1) {
    return `
      <p>${parts[0]}</p>
      <h4>${parts[1]}</h4>
      <p>${parts[2]}</p>
    `;
  }
  
  return formatted;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { addNotification } = useNotification();
  const { addToCart } = useCart();
  
  const { 
    handleAddToCart, 
    handleToggleWishlist, 
    handleShareProduct, 
    isProductInWishlist 
  } = useProductActions();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const sliderRef = useRef(null);
  
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle review submission
  const handleAddReview = async (reviewData) => {
    try {
      // Check if user is logged in
      if (!user) {
        addNotification("Please login to submit a review", "info");
        navigate("/login", { state: { from: `/products/${id}` } });
        return { success: false, error: "Authentication required" };
      }
      
      // Call the product service to submit the review
      const response = await productService.addProductReview(id, reviewData);
      
      // Update product with new review locally
      setProduct({
        ...product,
        reviews: [response, ...(product.reviews || [])],
        average_rating: response.new_average_rating || product.average_rating
      });
      
      addNotification("Your review has been submitted", "success");
      return { success: true };
    } catch (error) {
      console.error("Error submitting review:", error);
      addNotification(error.message || "Failed to submit review", "error");
      return { 
        success: false, 
        error: error.message || "Failed to submit review" 
      };
    }
  };

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      // Validate product ID
      if (!id) {
        console.error("Product ID is undefined:", id);
        setError("Invalid product ID");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching product with ID:", id); // Debug log
        
        // Fetch product details - ensure ID is a string and not undefined
        const productId = String(id);
        const productData = await productService.getProductById(productId);
        
        if (!productData) {
          setError("Product not found");
          setLoading(false);
          return;
        }
        
        console.log("Product data received:", productData);
        setProduct(productData);
        
        // Set document title
        document.title = `${productData.name} | EVOX Wheelchairs`;
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product details");
        addNotification("Failed to load product details", "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
    
    // Cleanup
    return () => {
      document.title = "EVOX Wheelchairs";
    };
  }, [id, user, addNotification]);
  
  // Change quantity
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  
  // Add to cart
  const handleAddToCartWithQuantity = async () => {
    if (!product.stock_quantity || product.stock_quantity <= 0) {
      addNotification('This product is out of stock', 'error');
      return;
    }
    
    await handleAddToCart(product, quantity);
  };
  
  // Handle image change
  const handleThumbnailClick = (index) => {
    setActiveImage(index);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };
  
  // Handle zoom toggle
  const handleZoomToggle = () => {
    setZoomOpen(!zoomOpen);
  };
  
  // Slider settings for product images
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: !isMobile,
    afterChange: (index) => setActiveImage(index)
  };
  
  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={5}>
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton key={index} variant="rectangular" width={60} height={60} sx={{ mx: 1, borderRadius: 1 }} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={7}>
            <Skeleton variant="text" width="70%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" height={60} sx={{ mb: 3 }} />
            <Skeleton variant="text" width="90%" height={100} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 3, borderRadius: 1 }} />
            <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button
          component={RouterLink}
          to="/shop"
          variant="contained"
          color="primary"
        >
          Back to Shop
        </Button>
      </Container>
    );
  }
  
  // If product data is missing, show error
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
        <Button
          component={RouterLink}
          to="/shop"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Back to Shop
        </Button>
      </Container>
    );
  }
  
  const hasSalePrice = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price);
  
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/shop" color="inherit">
          Shop
        </Link>
        {product.category_name && (
          <Link
            component={RouterLink}
            to={`/shop/category/${product.category}`}
            color="inherit"
          >
            {product.category_name}
          </Link>
        )}
        <Typography color="text.primary">
          {product.name}
        </Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6} lg={5}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductImageWrapper>
              <ZoomIconButton 
                className="zoom-icon"
                onClick={handleZoomToggle}
                aria-label="zoom image"
              >
                <ZoomInIcon />
              </ZoomIconButton>
              
              <Paper 
                elevation={2} 
                sx={{ 
                  overflow: 'hidden',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  mb: 2
                }}
              >
                {product.images && product.images.length > 0 ? (
                  <Slider ref={sliderRef} {...sliderSettings}>
                    {product.images.map((image, index) => (
                      <Box key={index} sx={{ pt: '75%', position: 'relative' }}>
                        <Box
                          component="img"
                          src={image.image}
                          alt={`${product.name} - View ${index + 1}`}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            p: 2,
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Slider>
                ) : (
                  <Box sx={{ pt: '75%', position: 'relative' }}>
                    <Box
                      component="img"
                      src={product.primary_image || "/placeholder-image.jpg"}
                      alt={product.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        p: 2
                      }}
                    />
                  </Box>
                )}
              </Paper>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    flexWrap: 'wrap'
                  }}
                >
                  {product.images.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ImageGalleryThumbnail
                        active={activeImage === index}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <Box
                          component="img"
                          src={image.image}
                          alt={`Thumbnail ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </ImageGalleryThumbnail>
                    </motion.div>
                  ))}
                </Box>
              )}
            </ProductImageWrapper>
          </motion.div>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6} lg={7}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box>
              {/* Title and ratings */}
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  color: 'text.primary',
                  fontSize: { xs: '1.75rem', md: '2.25rem' }
                }}
              >
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating 
                  value={parseFloat(product.average_rating) || 0}
                  precision={0.5}
                  readOnly
                  size={isMobile ? 'small' : 'medium'}
                />
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  ({product.reviews?.length || 0} reviews)
                </Typography>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <Tooltip title="Share">
                  <IconButton
                    onClick={() => handleShareProduct(product)}
                    color="primary"
                    aria-label="share product"
                    sx={{
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'scale(1.1)' }
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title={isProductInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}>
                  <IconButton
                    onClick={() => handleToggleWishlist(product)}
                    color={isProductInWishlist(product.id) ? "secondary" : "default"}
                    aria-label={isProductInWishlist(product.id) ? "remove from wishlist" : "add to wishlist"}
                    sx={{
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'scale(1.1)' }
                    }}
                  >
                    {isProductInWishlist(product.id) ? (
                      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                        <FavoriteIcon />
                      </motion.div>
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
              
              {/* SKU and stock */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 3,
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                {product.sku && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      bgcolor: 'background.paper',
                      py: 0.5,
                      px: 1,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    SKU: <strong>{product.sku}</strong>
                  </Typography>
                )}
                
                {product.stock_quantity !== undefined && (
                  <Chip
                    size="small"
                    label={product.stock_quantity > 0 ? 
                      `In Stock (${product.stock_quantity})` : 
                      "Out of Stock"}
                    color={product.stock_quantity > 0 ? "success" : "error"}
                    sx={{ fontWeight: 'medium' }}
                  />
                )}
                
                {product.category_name && (
                  <Chip
                    size="small"
                    label={product.category_name}
                    component={RouterLink}
                    to={`/shop/category/${product.category}`}
                    clickable
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
              
              {/* Price */}
              <Box 
                sx={{ 
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 1
                }}
              >
                {hasSalePrice ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography 
                      variant="h4" 
                      color="secondary.main" 
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                    >
                      ${product.sale_price}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        ml: 2,
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                        fontSize: { xs: '1rem', md: '1.25rem' }
                      }}
                    >
                      ${product.price}
                    </Typography>
                    
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Chip
                        size={isMobile ? "small" : "medium"}
                        label={`Save ${Math.round((1 - parseFloat(product.sale_price) / parseFloat(product.price)) * 100)}%`}
                        color="secondary"
                        sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}
                      />
                    </motion.div>
                  </Box>
                ) : (
                  <Typography 
                    variant="h4" 
                    fontWeight="bold"
                    color="primary.main"
                    sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                  >
                    ${product.price}
                  </Typography>
                )}
              </Box>
              
              {/* Short description */}
              {product.short_description && (
                <Typography
                  variant="body1"
                  sx={{ 
                    mb: 3,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    p: 1,
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    bgcolor: 'background.paper'
                  }}
                >
                  {product.short_description}
                </Typography>
              )}
              
              {/* Quantity selector and Add to cart */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  mb: 4, 
                  alignItems: 'center',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2
                }}
              >
                <QuantitySelector sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <IconButton 
                    onClick={decreaseQuantity} 
                    size="small"
                    color="primary"
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  
                  <TextField
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{ 
                      min: 1, 
                      style: { textAlign: 'center' } 
                    }}
                    sx={{ 
                      width: 60, 
                      mx: 1,
                      '& fieldset': { border: 'none' }
                    }}
                    size="small"
                  />
                  
                  <IconButton 
                    onClick={increaseQuantity} 
                    size="small"
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </QuantitySelector>
                
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  startIcon={<CartIcon />}
                  disabled={!product.stock_quantity || product.stock_quantity <= 0}
                  onClick={handleAddToCartWithQuantity}
                  sx={{ 
                    flexGrow: 1,
                    py: 1.5,
                    width: { xs: '100%', sm: 'auto' }
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add to Cart
                </Button>
              </Box>
              
              {/* Key feature highlights */}
              {product.specifications && product.specifications.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Key Features
                  </Typography>
                  <Grid container spacing={2}>
                    {product.specifications.slice(0, 4).map((spec, index) => (
                      <Grid item xs={6} sm={3} key={spec.id || index}>
                        <ProductFeatureBox>
                          <Typography variant="subtitle2" color="primary" align="center">
                            {spec.feature_name}
                          </Typography>
                          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                            {spec.feature_value}
                          </Typography>
                        </ProductFeatureBox>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {/* Categories and tags */}
              <Box sx={{ mb: 4 }}>
                {product.category_name && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Category:</strong>{' '}
                    <Link
                      component={RouterLink}
                      to={`/shop/category/${product.category}`}
                      color="primary"
                    >
                      {product.category_name}
                    </Link>
                  </Typography>
                )}
                
                {product.tags && product.tags.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Tags:</strong>
                    </Typography>
                    {product.tags.map((tag) => (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        component={RouterLink}
                        to={`/shop?tag=${tag.id}`}
                        clickable
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Grid>
      
      {/* Tabs for description, specifications, and reviews */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{ mt: 6, mb: 4 }}
      >
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="product detail tabs"
            sx={{
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontWeight: 'medium',
                fontSize: { xs: '0.875rem', md: '1rem' },
              }
            }}
          >
            <Tab label="Description" id="product-tab-0" aria-controls="product-tabpanel-0" />
            <Tab label="Specifications" id="product-tab-1" aria-controls="product-tabpanel-1" />
            <Tab 
              label={`Reviews (${product.reviews?.length || 0})`} 
              id="product-tab-2" 
              aria-controls="product-tabpanel-2" 
            />
          </Tabs>
          
          <Box>
            <TabPanel value={activeTab} index={0}>
              <Typography
                variant="body1"
                component="div"
                sx={{
                  '& p': {
                    mb: 2
                  },
                  '& h4': {
                    fontWeight: 'bold',
                    my: 2,
                    color: 'primary.main'
                  },
                  '& ul': {
                    pl: 3
                  },
                  '& li': {
                    mb: 1
                  }
                }}
                dangerouslySetInnerHTML={{ __html: formatDescription(product.description) || "No description available." }}
              />
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              <ProductSpecifications specifications={product.specifications || []} />
              {(!product.specifications || product.specifications.length === 0) && (
                <Typography color="text.secondary">No specifications available.</Typography>
              )}
            </TabPanel>
            
            <TabPanel value={activeTab} index={2}>
              <ProductReviews
                productId={product.id}
                reviews={product.reviews || []}
                averageRating={parseFloat(product.average_rating) || 0}
                onAddReview={handleAddReview}
              />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
      
      {/* Related Products */}
      <RelatedProducts productId={product.id} category={product.category} />
    </Container>
  );
};

export default ProductDetails; 