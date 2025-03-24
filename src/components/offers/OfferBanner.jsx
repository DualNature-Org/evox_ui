import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TimerIcon from '@mui/icons-material/Timer';
import { Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import offerService from '../../services/offerService';

const OfferBanner = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    let isMounted = true;
    
    const fetchOffers = async () => {
      // If we've already tried to fetch offers, don't try again
      if (hasFetched) return;
      
      setLoading(true);
      try {
        const activeOffers = await offerService.getActiveOffers();
        
        if (isMounted) {
          setOffers(activeOffers);
          setHasFetched(true);
        }
      } catch (error) {
        console.error('Failed to fetch offers:', error);
        
        if (isMounted) {
          // Set a specific error message but don't show notifications
          setError('No active offers available');
          setHasFetched(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOffers();
    
    return () => {
      isMounted = false;
    };
  }, [hasFetched]);

  // Calculate days remaining for an offer
  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = Math.abs(end - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // If no offers and not loading, don't render the component at all
  if (!loading && offers.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          py: 4,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
      <Container>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Special Offers
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
            Take advantage of these limited-time deals on our premium wheelchairs and accessories.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {offers.map((offer, index) => (
            <Grid item xs={12} md={6} lg={4} key={offer.id || index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {offer.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={offer.image}
                      alt={offer.title}
                    />
                  )}
                  
                  {offer.discount_percentage && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'error.main',
                        color: 'white',
                        p: 1,
                        borderRadius: 1,
                        fontWeight: 'bold',
                      }}
                    >
                      {offer.discount_percentage}% OFF
                    </Box>
                  )}
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" fontWeight={600} gutterBottom>
                      {offer.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {offer.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {offer.discount_percentage && (
                        <Typography variant="h6" fontWeight={700}>
                          Save {offer.discount_percentage}%
                        </Typography>
                      )}
                      
                      {offer.discount_amount && (
                        <Typography variant="h6" fontWeight={700}>
                          Save €{offer.discount_amount}
                        </Typography>
                      )}
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimerIcon color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Offer ends in {getDaysRemaining(offer.end_date)} days
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      component={Link}
                      to={`/shop?offer=${offer.id}`}
                      fullWidth
                      sx={{ mx: 2 }}
                    >
                      Shop this Offer
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default OfferBanner; 