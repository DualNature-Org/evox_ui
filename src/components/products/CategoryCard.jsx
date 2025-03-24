import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
    '& .category-image': {
      transform: 'scale(1.05)'
    }
  }
}));

const StyledCardMedia = styled(CardMedia)({
  height: 240,
  transition: 'transform 0.6s ease',
});

const OverlayContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(3),
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
  color: theme.palette.common.white,
  zIndex: 1
}));

const CategoryCard = ({ category }) => {
  if (!category) return null;
  
  return (
    <StyledCard
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      component={Link}
      to={`/category/${category.id}`}
      sx={{ textDecoration: 'none' }}
    >
      <Box sx={{ position: 'relative' }}>
        <StyledCardMedia
          component="img"
          image={category.image || 'https://via.placeholder.com/300x240?text=Category'}
          alt={category.name}
          className="category-image"
        />
        <OverlayContent>
          <Typography variant="h5" component="h2" fontWeight="bold">
            {category.name}
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 1,
              fontSize: '0.9rem'
            }}
          >
            <Typography variant="body2" sx={{ mr: 0.5 }}>
              Shop Now
            </Typography>
            <KeyboardArrowRightIcon fontSize="small" />
          </Box>
        </OverlayContent>
      </Box>
    </StyledCard>
  );
};

export default CategoryCard; 