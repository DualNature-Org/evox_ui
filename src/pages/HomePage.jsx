import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions 
} from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';

const HomePage = () => {
  const { success } = useNotification();

  const handleTestNotification = () => {
    success('Welcome to EVOX - Your wheelchair mobility partner!');
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8, 
          px: 2,
          bgcolor: 'primary.light',
          color: 'white',
          borderRadius: 2,
          mb: 6
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Welcome to EVOX Wheelchair Store
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Enhancing mobility, improving lives with quality wheelchairs and accessories
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          onClick={handleTestNotification}
        >
          Shop Now
        </Button>
      </Box>

      {/* Featured Categories */}
      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        Browse Categories
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {['Automatic Wheelchairs', 'Manual Wheelchairs', 'Accessories'].map((category) => (
          <Grid item xs={12} sm={4} key={category}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="div"
                sx={{ 
                  height: 140, 
                  bgcolor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {category} Image
                </Typography>
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse our selection of {category.toLowerCase()} 
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Shop Now</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Featured Products Section */}
      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        Featured Products
      </Typography>
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="div"
                sx={{ 
                  height: 140, 
                  bgcolor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Product Image
                </Typography>
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Product {item}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  High-quality wheelchair with advanced features
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  €199.99
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Add to Cart</Button>
                <Button size="small">View Details</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
