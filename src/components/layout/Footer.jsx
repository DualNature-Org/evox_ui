import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  TextField, 
  Button, 
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import { 
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.100', pt: 6, pb: 3, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              EVOX
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Providing quality wheelchairs and mobility accessories to improve lives and enhance independence.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" color="primary">
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" color="primary">
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" color="primary">
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" color="primary">
                <YouTubeIcon />
              </IconButton>
            </Stack>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link component={RouterLink} to="/shop" color="inherit" display="block" sx={{ mb: 1 }}>
              Shop
            </Link>
            <Link component={RouterLink} to="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              About Us
            </Link>
            <Link component={RouterLink} to="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
              Contact
            </Link>
            <Link component={RouterLink} to="/blog" color="inherit" display="block" sx={{ mb: 1 }}>
              Blog
            </Link>
          </Grid>
          
          {/* Products */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Products
            </Typography>
            <Link component={RouterLink} to="/shop/automatic" color="inherit" display="block" sx={{ mb: 1 }}>
              Automatic Wheelchairs
            </Link>
            <Link component={RouterLink} to="/shop/manual" color="inherit" display="block" sx={{ mb: 1 }}>
              Manual Wheelchairs
            </Link>
            <Link component={RouterLink} to="/shop/accessories" color="inherit" display="block" sx={{ mb: 1 }}>
              Accessories
            </Link>
            <Link component={RouterLink} to="/shop/new-arrivals" color="inherit" display="block" sx={{ mb: 1 }}>
              New Arrivals
            </Link>
            <Link component={RouterLink} to="/shop/best-sellers" color="inherit" display="block" sx={{ mb: 1 }}>
              Best Sellers
            </Link>
          </Grid>
          
          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Subscribe to get updates on our latest products and offers.
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <TextField 
                size="small" 
                placeholder="Your email"
                fullWidth
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0 
                  } 
                }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ 
                  borderTopLeftRadius: 0, 
                  borderBottomLeftRadius: 0 
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Bottom footer */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} EVOX. All Rights Reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
            <Link color="inherit" variant="body2" component={RouterLink} to="/privacy-policy">
              Privacy Policy
            </Link>
            <Link color="inherit" variant="body2" component={RouterLink} to="/terms-of-service">
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;