import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Rating,
  Button,
  TextField,
  Avatar,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Star as StarIcon,
  PersonOutline as PersonIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '../../contexts/UserContext';

const ReviewItem = ({ review }) => {
  const date = new Date(review.created_at);
  const formattedDate = formatDistanceToNow(date, { addSuffix: true });
  
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      elevation={0}
      sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
          {review.user_name ? review.user_name.charAt(0).toUpperCase() : <PersonIcon />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {review.user_name || 'Anonymous'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
          <Rating value={review.rating} precision={0.5} size="small" readOnly />
        </Box>
      </Box>
      
      {review.title && (
        <Typography variant="subtitle2" gutterBottom>
          {review.title}
        </Typography>
      )}
      
      <Typography variant="body2" color="text.secondary">
        {review.content}
      </Typography>
    </Paper>
  );
};

const ProductReviews = ({ 
  productId,
  reviews = [],
  averageRating = 0,
  onAddReview
}) => {
  const { user } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
  const totalReviews = reviews.length;
  
  reviews.forEach(review => {
    const starIndex = Math.floor(review.rating) - 1;
    if (starIndex >= 0 && starIndex < 5) {
      ratingCounts[starIndex]++;
    }
  });
  
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setRating(5);
    setTitle('');
    setContent('');
    setError('');
  };
  
  const handleSubmitReview = async () => {
    if (!content.trim()) {
      setError('Please enter your review content');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onAddReview({
        rating,
        title,
        content
      });
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Customer Reviews
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={4}>
        {/* Summary */}
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h2" color="primary.main" fontWeight="bold">
              {averageRating.toFixed(1)}
            </Typography>
            <Rating value={parseFloat(averageRating)} precision={0.5} size="large" readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Divider />
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<StarIcon />}
              onClick={handleOpenDialog}
              sx={{ mt: 2 }}
              fullWidth
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Write a Review
            </Button>
            
            {/* Rating distribution */}
            {totalReviews > 0 && (
              <Box sx={{ width: '100%', mt: 4 }}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <Box key={star} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ minWidth: 40 }}>
                      <Typography variant="body2">{star} star</Typography>
                    </Box>
                    <Box sx={{ flex: 1, mx: 1, height: 8, bgcolor: 'neutral.dark' }}>
                      <Box 
                        sx={{ 
                          height: '100%', 
                          width: `${totalReviews ? (ratingCounts[star - 1] / totalReviews) * 100 : 0}%`,
                          bgcolor: star > 3 ? 'success.main' : star > 1 ? 'warning.main' : 'error.main'
                        }} 
                      />
                    </Box>
                    <Box sx={{ minWidth: 30 }}>
                      <Typography variant="body2" sx={{ textAlign: 'right' }}>
                        {ratingCounts[star - 1]}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grid>
        
        {/* Review list */}
        <Grid item xs={12} md={8}>
          <AnimatePresence>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <ReviewItem key={review.id || index} review={review} />
              ))
            ) : (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Typography color="text.secondary">
                  No reviews yet. Be the first to share your thoughts!
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>
      
      {/* Review Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 1 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Your Rating:
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue || 0);
              }}
              precision={0.5}
            />
          </Box>
          
          <TextField
            autoFocus
            margin="dense"
            label="Review Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Review Content"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReview} 
            color="primary"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductReviews; 