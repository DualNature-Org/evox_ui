import React, { useState } from 'react';
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
  IconButton,
  Paper,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Tooltip,
  Alert,
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Send as SendIcon,
  ChevronRight as ChevronRightIcon,
  Place as PlaceIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as ClockIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' 
    ? 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)'
    : theme.palette.grey[900],
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(3),
  marginTop: theme.spacing(8),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }
}));

const FooterLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  transition: 'all 0.2s ease',
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateX(4px)'
  }
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4],
  }
}));

const NewsletterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  background: theme.palette.mode === 'light' 
    ? 'linear-gradient(145deg, #ffffff, #f5f5f5)'
    : 'linear-gradient(145deg, #2d3748, #1a202c)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Here you would typically call your API to subscribe the user
    console.log('Subscribing email:', email);
    setSubscribed(true);
    setError('');
    setEmail('');
    
    // Reset subscription message after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {/* Replace with your actual logo */}
                <Box 
                  component="img" 
                  src="/logo.png" 
                  alt="EVOX Logo"
                  sx={{ 
                    height: 40, 
                    mr: 1,
                    display: 'block',
                    '&:not([src])': { display: 'none' }
                  }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  EVOX
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Providing quality wheelchairs and mobility accessories to improve lives and enhance independence.
              </Typography>
              
              <Stack spacing={1.5}>
                <Box display="flex" alignItems="center">
                  <PlaceIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    123 Mobility Street, New Delhi, India
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <PhoneIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    +91 98765 43210
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <EmailIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    contact@wheelchairstore.com
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <ClockIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Mon-Sat: 9am to 6pm
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Quick Links
              </Typography>
              <Box sx={{ width: 40, height: 4, bgcolor: 'primary.main', mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FooterLink component={RouterLink} to="/">
                  <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                  Home
                </FooterLink>
                <FooterLink component={RouterLink} to="/about">
                  <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                  About Us
                </FooterLink>
                <FooterLink component={RouterLink} to="/shop">
                  <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                  Shop
                </FooterLink>
                <FooterLink component={RouterLink} to="/contact">
                  <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                  Contact
                </FooterLink>
                <FooterLink component={RouterLink} to="/blog">
                  <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                  Blog
                </FooterLink>
              </Box>
            </motion.div>
          </Grid>
          
          {/* Product Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Categories
              </Typography>
              <Box sx={{ width: 40, height: 4, bgcolor: 'primary.main', mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FooterLink component={RouterLink} to="/shop?sort=best-selling">
                  <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                  Best Sellers
                </FooterLink>
                <FooterLink component={RouterLink} to="/shop?sort=newest">
                  <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                  New Arrivals
                </FooterLink>
                
                <FooterLink component={RouterLink} to="/category/1">
                  <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                  Automatic Wheelchairs
                </FooterLink>
                <FooterLink component={RouterLink} to="/category/2">
                  <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                  Manual Wheelchairs
                </FooterLink>
                <FooterLink component={RouterLink} to="/category/3">
                  <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                  Specialty Wheelchairs
                </FooterLink>
              </Box>
            </motion.div>
          </Grid>
          
          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                pb: 1,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 40,
                  height: 2,
                  backgroundColor: theme.palette.primary.main
                }
              }}>
                Stay Updated
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Subscribe to our newsletter to receive updates, news, and exclusive offers.
              </Typography>
              
              <NewsletterPaper elevation={0}>
                <form onSubmit={handleSubscribe}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error}
                    helperText={error}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Subscribe">
                            <IconButton 
                              edge="end" 
                              color="primary" 
                              type="submit"
                              sx={{
                                borderRadius: '50%',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  background: theme.palette.primary.main,
                                  color: theme.palette.common.white,
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <SendIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1 }}
                  />
                </form>
                
                <Collapse in={subscribed}>
                  <Alert 
                    severity="success" 
                    variant="filled"
                    sx={{ mt: 1 }}
                  >
                    Thanks for subscribing to our newsletter!
                  </Alert>
                </Collapse>
                
                {/* Social Media Icons */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Follow us on:
                  </Typography>
                  <Box sx={{ display: 'flex', mt: 1 }}>
                    <Tooltip title="Facebook">
                      <SocialIconButton aria-label="facebook" size="small">
                        <FacebookIcon fontSize="small" />
                      </SocialIconButton>
                    </Tooltip>
                    <Tooltip title="Twitter">
                      <SocialIconButton aria-label="twitter" size="small">
                        <TwitterIcon fontSize="small" />
                      </SocialIconButton>
                    </Tooltip>
                    <Tooltip title="Instagram">
                      <SocialIconButton aria-label="instagram" size="small">
                        <InstagramIcon fontSize="small" />
                      </SocialIconButton>
                    </Tooltip>
                    <Tooltip title="YouTube">
                      <SocialIconButton aria-label="youtube" size="small">
                        <YouTubeIcon fontSize="small" />
                      </SocialIconButton>
                    </Tooltip>
                    <Tooltip title="LinkedIn">
                      <SocialIconButton aria-label="linkedin" size="small">
                        <LinkedInIcon fontSize="small" />
                      </SocialIconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </NewsletterPaper>
            </motion.div>
          </Grid>
        </Grid>
        
        <Divider sx={{ 
          my: 4, 
          opacity: 0.6,
          background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)'
        }} />
        
        {/* Bottom footer */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} EVOX Wheelchair Store. All Rights Reserved.
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 1, sm: 2 }}
            alignItems={{ xs: 'center', sm: 'flex-start' }}
            divider={
              <Box 
                component="span" 
                sx={{ 
                  width: { xs: '100%', sm: 'auto' },
                  height: { xs: 'auto', sm: '100%' },
                  display: { xs: 'none', sm: 'inline-block' },
                  mx: 1,
                  borderLeft: '1px solid',
                  borderColor: 'divider',
                }}
              />
            }
          >
            <Link 
              color="inherit" 
              variant="body2" 
              component={RouterLink} 
              to="/privacy-policy"
              sx={{ 
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' } 
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              color="inherit" 
              variant="body2" 
              component={RouterLink} 
              to="/terms-of-service"
              sx={{ 
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' } 
              }}
            >
              Terms of Service
            </Link>
            <Link 
              color="inherit" 
              variant="body2" 
              component={RouterLink} 
              to="/return-policy"
              sx={{ 
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' } 
              }}
            >
              Return Policy
            </Link>
          </Stack>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;