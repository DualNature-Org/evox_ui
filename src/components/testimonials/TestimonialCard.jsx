import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar,
  Rating
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
    transform: 'translateY(-8px)'
  }
}));

const QuoteIcon = styled(FormatQuoteIcon)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  fontSize: 60,
  color: theme.palette.grey[100],
  transform: 'rotate(180deg)'
}));

const TestimonialCard = ({ testimonial }) => {
  if (!testimonial) return null;
  
  return (
    <StyledCard>
      <QuoteIcon />
      <CardContent sx={{ flex: 1, pt: 1, px: 0 }}>
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3, fontStyle: 'italic' }}>
          "{testimonial.content}"
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <Avatar 
            src={testimonial.avatar} 
            alt={testimonial.name}
            sx={{ 
              width: 56, 
              height: 56,
              border: '2px solid',
              borderColor: 'primary.main'
            }}
          />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {testimonial.name}
            </Typography>
            <Rating 
              value={testimonial.rating || 5} 
              readOnly 
              size="small" 
              sx={{ my: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {testimonial.title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default TestimonialCard; 