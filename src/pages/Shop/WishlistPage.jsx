import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  CircularProgress,
  Paper,
  Alert,
  Breadcrumbs,
  Link,
  Card,
  CardMedia,
  CardContent,
  Stack,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  DeleteOutline as ClearIcon,
  ShoppingCart as CartIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import WishlistItem from '../../components/wishlist/WishlistItem';
import useProductActions from '../../hooks/useProductActions';
import EmptyState from '../../components/common/EmptyState';

const WishlistPage = () => {
  const navigate = useNavigate();
  const {
    wishlistItems,
    isLoading,
    error,
    removeFromWishlist,
    moveToCart,
    clearWishlist,
    loadWishlist
  } = useWishlist();
  
  const { addToCart } = useCart();
  
  const { handleAddToCart } = useProductActions();
  
  const isEmpty = !wishlistItems || wishlistItems.length === 0;
  
  // Function to move all items to cart
  const handleMoveAllToCart = async () => {
    for (const item of wishlistItems) {
      await addToCart(item.product_id, 1);
      await removeFromWishlist(item.id);
    }
  };
  
  // Reload wishlist on page visit
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Handle removing item from wishlist
  const handleRemoveItem = async (itemId) => {
    await removeFromWishlist(itemId);
  };

  // Handle moving item to cart
  const handleMoveToCart = async (item) => {
    await handleAddToCart(item.product);
    await removeFromWishlist(item.id);
  };

  // Handle going to product details
  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Wishlist</Typography>
      </Breadcrumbs>
      
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <FavoriteIcon sx={{ mr: 2, fontSize: 28 }} color="secondary" />
          <Typography variant="h4" component="h1">
            Your Wishlist
          </Typography>
          
          {!isEmpty && (
            <Box sx={{ ml: 'auto', display: 'flex' }}>
              <Button
                startIcon={<CartIcon />}
                onClick={handleMoveAllToCart}
                sx={{ mr: 2 }}
                variant="contained"
                color="primary"
              >
                Add All to Cart
              </Button>
              <Button
                startIcon={<ClearIcon />}
                onClick={clearWishlist}
                color="error"
                variant="outlined"
              >
                Clear Wishlist
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : isEmpty ? (
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You haven't added any products to your wishlist yet.
          </Typography>
          <Button
            component={RouterLink}
            to="/shop"
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
          >
            Browse Products
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.product?.primary_image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={item.product?.name || 'Product image'}
                      onClick={() => handleViewProduct(item.product?.id)}
                      sx={{ cursor: 'pointer', objectFit: 'contain', bgcolor: '#f5f5f5' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveItem(item.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'error.light', color: 'white' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      gutterBottom
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                        minHeight: '64px'
                      }}
                      onClick={() => handleViewProduct(item.product?.id)}
                    >
                      {item.product?.name}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      {item.product?.sale_price ? (
                        <>
                          <Typography variant="h6" color="primary.main">
                            €{item.product.sale_price}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            €{item.product.price}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="h6" color="text.primary">
                          €{item.product?.price}
                        </Typography>
                      )}
                    </Stack>
                    
                    <Box flexGrow={1} />
                    
                    <Button
                      variant="contained"
                      startIcon={<CartIcon />}
                      onClick={() => handleMoveToCart(item)}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Move to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Box display="flex" justifyContent="center" mt={6}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/shop')}
          sx={{ px: 4 }}
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
};

export default WishlistPage; 