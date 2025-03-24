import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Collapse,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import newsletterService from '../../services/newsletterService';
import { useNotification } from '../../contexts/NotificationContext';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { addNotification } = useNotification();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await newsletterService.subscribe(email);
      setSuccess('Successfully subscribed to newsletter!');
      addNotification('You have successfully subscribed to our newsletter!', 'success');
      setEmail('');
    } catch (error) {
      setError(error.message || 'Failed to subscribe. Please try again.');
      addNotification('Failed to subscribe to newsletter.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component={Paper} sx={{ 
      backgroundColor: 'primary.dark', 
      color: 'white',
      py: 6, 
      borderRadius: 0 
    }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight={700}>
            Join Our Newsletter
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Subscribe to our newsletter to receive updates on new products, special offers, and mobility tips.
          </Typography>
          
          <Box component="form" onSubmit={handleSubscribe} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ 
                  maxWidth: { sm: '400px' },
                  backgroundColor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="secondary"
                disabled={loading}
                sx={{ 
                  minWidth: { xs: '100%', sm: '150px' },
                  height: '56px',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Subscribe'}
              </Button>
            </Box>
            
            <Collapse in={Boolean(error)}>
              <Alert 
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setError('');
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mt: 2 }}
              >
                {error}
              </Alert>
            </Collapse>
            
            <Collapse in={Boolean(success)}>
              <Alert 
                severity="success"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setSuccess('');
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mt: 2 }}
              >
                {success}
              </Alert>
            </Collapse>
          </Box>
          
          <Typography variant="caption" align="center" sx={{ display: 'block', mt: 2 }}>
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Newsletter; 