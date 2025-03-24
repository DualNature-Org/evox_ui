import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Rating, 
  Button, 
  IconButton,
  Chip,
  Skeleton
} from '@mui/material';
import { 
  FavoriteBorder as FavoriteBorderIcon, 
  Favorite as FavoriteIcon,
  ShoppingCartOutlined as CartIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import useProductActions from '../../hooks/useProductActions';

// Styled components
const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8]
  }
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1
}));

const SaleChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  fontWeight: 'bold',
  zIndex: 1
}));

const ProductCard = ({ product, loading = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Use our custom hook for product actions
  const { 
    handleAddToCart, 
    handleToggleWishlist, 
    isProductInWishlist 
  } = useProductActions();
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggleWishlist(product);
  };
  
  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(product);
  };

  const hasSalePrice = product?.sale_price && product.sale_price < product.price;
  
  // Calculate discount percentage if there's a sale price
  const discountPercent = hasSalePrice 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100) 
    : 0;

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <StyledCard
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      component={Link}
      to={product?.id ? `/products/${product.id}` : '/shop'}
      sx={{ textDecoration: 'none' }}
    >
      {/* Sale badge */}
      {hasSalePrice && (
        <SaleChip 
          label={`-${discountPercent}%`} 
          component={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}
      
      {/* Card overlay with action buttons */}
      <CardOverlay>
        <IconButton 
          onClick={handleFavoriteClick}
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.9)', 
            mb: 1,
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
          }}
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isProductInWishlist(product?.id) ? (
            <FavoriteIcon color="secondary" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </CardOverlay>

      {/* Product image */}
      <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={
            product?.primary_image ? (
              typeof product.primary_image === 'object' 
                ? product.primary_image.image && product.primary_image.image !== 'null' 
                  ? `http://15.207.21.176:8000${product.primary_image.image}`
                  : 'https://via.placeholder.com/300x200?text=No+Image' 
                : product.primary_image && product.primary_image !== 'null'
                  ? `http://15.207.21.176:8000${product.primary_image}`
                  : 'https://via.placeholder.com/300x200?text=No+Image'
            ) : 'https://via.placeholder.com/300x200?text=No+Image'
          }
          alt={product?.name || 'Product image'}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      </Box>
      
      {/* Product details */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {product.category_name}
          </Typography>
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
              height: '2.4em'
            }}
          >
            {product.name}
          </Typography>
        </Box>
        
        {/* Ratings */}
        {product.average_rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating 
              value={parseFloat(product.average_rating)} 
              precision={0.5} 
              size="small" 
              readOnly 
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              ({product.average_rating})
            </Typography>
          </Box>
        )}
        
        {/* Short description */}
        {product.short_description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2,
              flexGrow: 1
            }}
          >
            {product.short_description}
          </Typography>
        )}
        
        {/* Price and Add to Cart */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mt: 'auto'
        }}>
          <Box>
            {hasSalePrice ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" color="secondary.main" fontWeight="bold">
                  ${product.sale_price}
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, textDecoration: 'line-through' }} color="text.secondary">
                  ${product.price}
                </Typography>
              </Box>
            ) : (
              <Typography variant="h6" fontWeight="bold">
                ${product.price}
              </Typography>
            )}
          </Box>
          
          <Button
            onClick={handleAddToCartClick}
            size="small"
            variant="contained"
            color="primary"
            startIcon={<CartIcon />}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ProductCard; 