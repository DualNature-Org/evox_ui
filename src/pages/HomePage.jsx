import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Paper,
  Rating,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  alpha,
  Avatar,
  Skeleton
} from '@mui/material';
import {
  ArrowForward as RightArrowIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Send as SendIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  FavoriteBorder as HeartOutlineIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import heroImage1 from '../assets/images/hero1.jpg';
import heroImage2 from '../assets/images/hero2.jpg';
import productService from '../services/productService';
import blogService from '../services/blogService';
import { useNotification } from '../contexts/NotificationContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import useProductActions from '../hooks/useProductActions';
import CountdownTimer from '../components/common/CountdownTimer';
import { useTheme } from '@mui/material/styles';
import offerService from '../services/offerService';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [newArrival, setNewArrival] = useState(null);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [bestSeller, setBestSeller] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [dealProduct, setDealProduct] = useState(null);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [deals, setDeals] = useState([]);

  const { 
    handleAddToCart, 
    handleToggleWishlist, 
    isProductInWishlist 
  } = useProductActions();
  
  const { addNotification } = useNotification();

  // Mock FAQs data
  const faqs = [
    {
      id: 1,
      question: 'What types of wheelchairs do you offer?',
      answer: 'We offer a wide range of wheelchairs including manual, electric, sports, pediatric, and specialized wheelchairs designed for different needs and environments.'
    },
    {
      id: 2,
      question: 'How do I know which wheelchair is right for me?',
      answer: 'The right wheelchair depends on your specific needs, lifestyle, and physical capabilities. We recommend consulting with your healthcare provider and exploring our detailed product guides.'
    },
    {
      id: 3,
      question: 'Do you offer warranty on your products?',
      answer: 'Yes, all our wheelchairs come with a manufacturer warranty. The warranty period varies by product, typically ranging from 1-5 years depending on the model and components.'
    },
    {
      id: 4,
      question: 'How can I get my wheelchair serviced?',
      answer: 'We offer servicing through our network of certified technicians. You can schedule a service appointment through our website or by calling our customer service.'
    }
  ];

  // Hero slider settings
  const heroSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          dots: false
        }
      }
    ]
  };
  
  // Video slider settings
  const videoSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
    slidesToScroll: 1,
    arrows: true
  };
  
  // Product slider settings
  const productSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 4,
    slidesToScroll: 1,
    arrows: true
  };

  // Blog slider settings
  const blogSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
    slidesToScroll: 1,
    arrows: true
  };
  
  // Update the formatPrice function to handle zero/null prices better
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0.00';
    
    // If price is zero, show as free or handle appropriately
    const numPrice = parseFloat(price);
    if (numPrice === 0) return '0.00';
    
    // If it's already a number, use toFixed directly
    if (typeof numPrice === 'number' && !isNaN(numPrice)) {
      return numPrice.toFixed(2);
    }
    
    // Try to parse it as a float if it's a string
    try {
      return parseFloat(price).toFixed(2);
    } catch (e) {
      console.error('Unable to parse price:', price);
      return '0.00';
    }
  };

  // Fetch homepage data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch new arrivals
        const newArrivalsResponse = await productService.getProducts({ sort: 'newest' }, true);
        console.log("New arrivals response:", newArrivalsResponse);
        
        // Fetch featured products
        const featuredResponse = await productService.getProducts({ featured: true }, true);
        
        // Fetch best sellers
        const bestSellersResponse = await productService.getProducts({ sort: 'best-selling' }, true);
        
        // Fetch offers
        const offersResponse = await offerService.getOffers();
        console.log("Offers response:", offersResponse);
        
        // Check if the response has results property
        const offersArray = offersResponse?.results || [];
        
        // Filter active offers
        const activeOffers = offersArray.filter(offer => 
          offer.is_active && 
          new Date(offer.start_date) <= new Date() && 
          new Date(offer.end_date) >= new Date()
        );
        
        console.log("Active offers:", activeOffers);
        setDeals(activeOffers);
        
        // Fetch featured blogs
        const blogsResponse = await blogService.getBlogs({ featured: true });
        
        // Safely set state with null checks
        if (newArrivalsResponse?.results?.length > 0) {
          setNewArrival(newArrivalsResponse.results[0]);
        }
        
        if (featuredResponse?.results?.length > 0) {
          setFeaturedProduct(featuredResponse.results[0]);
        }
        
        if (bestSellersResponse?.results?.length > 0) {
          // Set the first item as the featured best seller
          setBestSeller(bestSellersResponse.results[0]);
          
          // Set the rest of the items (or all if no best seller set)
          setBestSellers(bestSellersResponse.results.slice(0, 6));
        }
        
        if (blogsResponse?.results?.length > 0) {
          setFeaturedBlogs(blogsResponse.results.slice(0, 3));
        }
        
        // Mock video data
        setVideos([
          {
            id: 1,
            title: 'How to Choose the Right Wheelchair',
            thumbnail: 'https://i.ytimg.com/vi/Zq9vXqCK_Us/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=Zq9vXqCK_Us',
          },
          {
            id: 2,
            title: 'Wheelchair Maintenance Tips',
            thumbnail: 'https://i.ytimg.com/vi/MFU0ZgB6pP4/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=MFU0ZgB6pP4',
          },
          {
            id: 3,
            title: 'Adaptive Techniques for Wheelchair Users',
            thumbnail: 'https://i.ytimg.com/vi/0O94iPkpCXE/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=0O94iPkpCXE',
          },
        ]);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setDeals([]);
        setNewArrival(null);
        setFeaturedProduct(null);
        setBestSeller(null);
        setBestSellers([]);
        setDealProduct(null);
        setFeaturedBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      addNotification('Please enter a valid email address', 'error');
      return;
    }
    // API call would go here
    addNotification('Thank you for subscribing to our newsletter!', 'success');
    setEmail('');
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Add this function to handle adding products from offers to cart
  const handleAddOfferProductToCart = async (productId) => {
    if (!productId) return;
    
    try {
      await handleAddToCart(productId, 1);
      addNotification('Product added to cart!', 'success');
    } catch (error) {
      addNotification('Failed to add product to cart', 'error');
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Slider - Full Width */}
      <Box sx={{ width: '100%', mb: 6, position: 'relative' }}>
        <Slider {...heroSliderSettings}>
          {/* Hero Slide 1 */}
          <Box sx={{ 
            position: 'relative', 
            height: { xs: '60vh', md: '80vh' },
            minHeight: { xs: '400px', md: '600px' }
          }}>
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Container maxWidth="lg">
                <Box sx={{ maxWidth: { xs: '100%', md: '60%' } }}>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Chip 
                      label="NEW COLLECTION" 
                      color="secondary" 
                      sx={{ mb: 2, fontWeight: 'bold' }} 
                    />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Typography 
                      variant="h1" 
                      color="white"
                      sx={{ 
                        fontWeight: 800,
                        mb: 2,
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                      }}
                    >
                      Enhanced Mobility <br />For Better Living
                    </Typography>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Typography 
                      variant="h6" 
                      color="white"
                      sx={{ 
                        mb: 4,
                        maxWidth: { xs: '100%', md: '80%' },
                        fontWeight: 400,
                        textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                    >
                      Discover our premium range of wheelchairs designed for comfort, durability, and independence.
                    </Typography>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Button 
                      component={RouterLink}
                      to="/shop"
                      variant="contained" 
                      color="primary"
                      size="large"
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontSize: '1.1rem',
                        mr: 2,
                        mb: { xs: 2, sm: 0 }
                      }}
                    >
                      Shop Now
                    </Button>
                    
                    <Button 
                      component={RouterLink}
                      to="/about"
                      variant="outlined" 
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontSize: '1.1rem',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderColor: 'white',
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </Box>
              </Container>
            </Box>
          </Box>
          
          {/* Hero Slide 2 */}
          <Box sx={{ 
            position: 'relative', 
            height: { xs: '60vh', md: '80vh' },
            minHeight: { xs: '400px', md: '600px' }
          }}>
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Container maxWidth="lg">
                <Box sx={{ maxWidth: { xs: '100%', md: '60%' }, ml: { xs: 0, md: 'auto' }, textAlign: { xs: 'left', md: 'right' } }}>
                  <Chip 
                    label="SPECIAL OFFER" 
                    color="error" 
                    sx={{ mb: 2, fontWeight: 'bold' }} 
                  />
                  <Typography 
                    variant="h1" 
                    color="white"
                    sx={{ 
                      fontWeight: 800,
                      mb: 2,
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}
                  >
                    Up to 30% Off <br />Selected Models
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="white"
                    sx={{ 
                      mb: 4,
                      maxWidth: { xs: '100%', md: '80%' },
                      fontWeight: 400,
                      textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      ml: { xs: 0, md: 'auto' }
                    }}
                  >
                    Limited time offer on our most popular electric and manual wheelchairs. Free accessory with every purchase.
                  </Typography>
                  <Button 
                    component={RouterLink}
                    to="/shop?sale=true"
                    variant="contained" 
                    color="error"
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    View Offers
                  </Button>
                </Box>
              </Container>
            </Box>
          </Box>
        </Slider>
      </Box>
      
      <Container maxWidth="lg">
        {/* Featured Products Categories Row */}
        <Box 
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          sx={{ mb: 8 }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            textAlign="center" 
            fontWeight="bold" 
            gutterBottom
          >
            Discover Our Collection
          </Typography>
          <Typography 
            variant="body1" 
            textAlign="center" 
            color="text.secondary" 
            paragraph 
            sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
          >
            Explore our handpicked selection of premium mobility solutions designed for comfort and independence
          </Typography>
          
          <Grid container spacing={4}>
            {/* New Arrival */}
            <Grid item xs={12} md={4}>
              <motion.div variants={fadeInUp}>
                <Card 
                  component={motion.div}
                  whileHover={{ y: -10 }}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '80%' }}>
                    <Chip 
                      label="NEW ARRIVAL" 
                      color="primary" 
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        left: 16, 
                        zIndex: 2,
                        fontWeight: 'bold'
                      }}
                    />
                    
                    {newArrival ? (
                      <CardMedia
                        component="img"
                        image={'http://15.207.21.176:8000' + newArrival.primary_image?.image || '/placeholder.png'}
                        alt={newArrival.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Skeleton 
                        variant="rectangular" 
                        width="100%" 
                        height="100%" 
                        animation="wave" 
                        sx={{ position: 'absolute', top: 0, left: 0 }}
                      />
                    )}
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {newArrival ? (
                      <>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {newArrival.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {newArrival.short_description || truncate(newArrival.description, 90)}
                        </Typography>
                        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
                            ${parseFloat(newArrival.price).toFixed(2)}
                          </Typography>
                          <Button 
                            component={RouterLink}
                            to={`/products/${newArrival?.id}`}
                            variant="contained"
                            color="primary"
                          >
                            View
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="90%" height={20} />
                        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Skeleton variant="text" width={80} height={30} />
                          <Skeleton variant="rectangular" width={80} height={36} />
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            {/* Featured Product */}
            <Grid item xs={12} md={4}>
              <motion.div variants={fadeInUp}>
                <Card 
                  component={motion.div}
                  whileHover={{ y: -10 }}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: '#fcfcfc'
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '80%' }}>
                    <Chip 
                      label="FEATURED" 
                      color="secondary" 
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        left: 16, 
                        zIndex: 2,
                        fontWeight: 'bold'
                      }}
                    />
                    
                    {featuredProduct ? (
                      <CardMedia
                        component="img"
                        image={'http://15.207.21.176:8000' + featuredProduct.primary_image?.image || '/placeholder.png'}
                        alt={featuredProduct.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Skeleton 
                        variant="rectangular" 
                        width="100%" 
                        height="100%" 
                        animation="wave" 
                        sx={{ position: 'absolute', top: 0, left: 0 }}
                      />
                    )}
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {featuredProduct ? (
                      <>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {featuredProduct.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {featuredProduct.short_description || truncate(featuredProduct.description, 90)}
                        </Typography>
                        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
                            ${parseFloat(featuredProduct.price).toFixed(2)}
                          </Typography>
                          <Button 
                            component={RouterLink}
                            to={`/products/${featuredProduct?.id}`}
                            variant="contained"
                            color="primary"
                          >
                            View
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="90%" height={20} />
                        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Skeleton variant="text" width={80} height={30} />
                          <Skeleton variant="rectangular" width={80} height={36} />
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            {/* Best Seller */}
            <Grid item xs={12} md={4}>
              <motion.div variants={fadeInUp}>
                <Card 
                  component={motion.div}
                  whileHover={{ y: -10 }}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    background: alpha(theme.palette.primary.light, 0.05)
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '80%' }}>
                    <Chip 
                      label="BEST SELLER" 
                      color="error" 
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        left: 16, 
                        zIndex: 2,
                        fontWeight: 'bold'
                      }}
                    />
                    
                    {bestSeller ? (
                      <CardMedia
                        component="img"
                        image={'http://15.207.21.176:8000' + bestSeller.primary_image?.image || '/placeholder.png'}
                        alt={bestSeller.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Skeleton 
                        variant="rectangular" 
                        width="100%" 
                        height="100%" 
                        animation="wave" 
                        sx={{ position: 'absolute', top: 0, left: 0 }}
                      />
                    )}
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {bestSeller ? (
                      <>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {bestSeller.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {bestSeller.short_description || truncate(bestSeller.description, 90)}
                        </Typography>
                        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
                            ${parseFloat(bestSeller.price).toFixed(2)}
                          </Typography>
                          <Button 
                            component={RouterLink}
                            to={`/products/${bestSeller?.id}`}
                            variant="contained"
                            color="primary"
                          >
                            View
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="90%" height={20} />
                        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Skeleton variant="text" width={80} height={30} />
                          <Skeleton variant="rectangular" width={80} height={36} />
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
        
        {/* Deals Section */}
        {deals && deals.length > 0 ? (
          <Box component="section" sx={{ py: 8 }}>
            <Container maxWidth="xl">
              <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography
                  variant="h2"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    mb: 2
                  }}
                >
                  Special Offers
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
                  Don't miss these limited-time deals on our best products!
                </Typography>
              </Box>

              {/* Carousel for multiple deals */}
              {deals.length > 1 ? (
                <Box
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                  >
                    {deals.map((deal, index) => (
                      <SwiperSlide key={deal.id || index}>
                        <DealCard deal={deal} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              ) : (
                // Single deal display
                <DealCard deal={deals[0]} />
              )}
            </Container>
          </Box>
        ) : null}

        {/* Best Sellers Section */}
        <Box component="section" sx={{ py: 8, bgcolor: 'background.default' }}>
          <Container maxWidth="xl">
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  mb: 2
                }}
              >
                Best Sellers
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
                Our most popular products chosen by customers like you
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {bestSellers && bestSellers.length > 0 ? (
                bestSellers.slice(0, 4).map((product, index) => (
                  <Grid item xs={12} sm={6} md={3} key={product.id}>
                    <Card
                      component={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      whileHover={{ 
                        y: -10,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        transition: { duration: 0.3 }
                      }}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative',
                        '&:hover .MuiCardMedia-root': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      {/* Wishlist button */}
                      <IconButton
                        aria-label="Add to wishlist"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          bgcolor: 'background.paper',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          zIndex: 10,
                          '&:hover': {
                            bgcolor: 'background.paper',
                            color: 'primary.main',
                          }
                        }}
                      >
                        <HeartOutlineIcon fontSize="small" />
                      </IconButton>

                      {/* Product image with sale badge */}
                      <Box sx={{ position: 'relative', pt: '100%' }}>
                        <CardMedia
                          component="img"
                          image={'http://15.207.21.176:8000' + product.primary_image?.image || '/placeholder.png'}
                          alt={product.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease-in-out'
                          }}
                        />
                        {product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price) && (
                          <Chip
                            label="SALE"
                            color="secondary"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                              fontWeight: 'bold',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Category */}
                        <Typography 
                          variant="caption" 
                          component="div"
                          sx={{ 
                            color: 'text.secondary',
                            mb: 1,
                            textTransform: 'uppercase',
                            letterSpacing: 1
                          }}
                        >
                          {product.category_name || 'Wheelchair'}
                        </Typography>

                        {/* Product name */}
                        <Typography 
                          component={RouterLink}
                          to={`/products/${product.id}`}
                          variant="h6" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 'medium',
                            textDecoration: 'none',
                            color: 'text.primary',
                            display: 'block',
                            transition: '0.2s',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                        >
                          {product.name}
                        </Typography>

                        {/* Rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Rating 
                            value={parseFloat(product.average_rating) || 0} 
                            precision={0.5} 
                            size="small" 
                            readOnly 
                          />
                          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                            ({product.review_count || 0})
                          </Typography>
                        </Box>

                        {/* Price */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {product.sale_price && parseFloat(product.sale_price) > 0 ? (
                            <>
                              <Typography 
                                variant="h6" 
                                component="span"
                                fontWeight="bold"
                                color="primary.main"
                              >
                                ${formatPrice(product.sale_price)}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                component="span"
                                sx={{ 
                                  textDecoration: 'line-through', 
                                  color: 'text.secondary',
                                  ml: 1
                                }}
                              >
                                ${formatPrice(product.price)}
                              </Typography>
                            </>
                          ) : (
                            <Typography 
                              variant="h6" 
                              component="span"
                              fontWeight="bold"
                              color="primary.main"
                            >
                              ${formatPrice(product.price)}
                            </Typography>
                          )}
                        </Box>

                        {/* Add to cart button */}
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<CartIcon />}
                          onClick={() => handleAddToCart(product)}
                          sx={{
                            py: 1.2,
                            borderRadius: 2,
                            boxShadow: 2,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: 3
                            }
                          }}
                        >
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                  {isLoading ? 'Loading best sellers...' : 'No best sellers available at the moment.'}
                </Typography>
              )}
            </Grid>

            {bestSellers && bestSellers.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Button
                  component={RouterLink}
                  to="/shop"
                  variant="outlined"
                  color="primary"
                  size="large"
                  endIcon={<RightArrowIcon />}
                  sx={{
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'medium',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      transform: 'translateY(-3px)',
                      boxShadow: 3
                    }
                  }}
                >
                  View All Products
                </Button>
              </Box>
            )}
          </Container>
        </Box>
        
        {/* Recent Blog Posts */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          sx={{ mb: 8 }}
        >
          <Container maxWidth="xl">
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4 
              }}
            >
              <Typography 
                variant="h4" 
                component="h2" 
                fontWeight="bold"
                sx={{ 
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 80,
                    height: 4,
                    backgroundColor: 'primary.main',
                    borderRadius: 2
                  }
                }}
              >
                Latest Articles
              </Typography>
              <Button 
                component={RouterLink} 
                to="/blog" 
                endIcon={<RightArrowIcon />}
                color="primary"
              >
                View All
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {featuredBlogs && featuredBlogs.length > 0 ? (
                featuredBlogs.map((post) => (
                  <Grid 
                    item 
                    key={post.id} 
                    xs={12} 
                    md={4}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card 
                      component={motion.div}
                      whileHover={{ 
                        y: -10,
                        boxShadow: '0 20px 30px rgba(0,0,0,0.1)',
                        transition: { duration: 0.3 }
                      }}
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        overflow: 'hidden',
                        borderRadius: 3
                      }}
                    >
                      <Box sx={{ position: 'relative', pt: '60%' }}>
                        <CardMedia
                          component="img"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          image={post.thumbnail ? post.thumbnail : '/placeholder-blog.jpg'}
                          alt={post.title}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '10px 16px',
                          }}
                        >
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography 
                          gutterBottom 
                          variant="h5" 
                          component="h3"
                          sx={{
                            fontWeight: 'bold',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mb: 1
                          }}
                        >
                          {post.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 28, 
                              height: 28,
                              bgcolor: 'primary.main',
                              fontSize: '0.875rem'
                            }}
                          >
                            {post.author?.first_name?.[0]}{post.author?.last_name?.[0]}
                          </Avatar>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            {post.author?.first_name} {post.author?.last_name}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          paragraph
                          sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mb: 2,
                            flexGrow: 1
                          }}
                        >
                          {post.content?.replace(/#.*\n/, '').substring(0, 150)}...
                        </Typography>
                        
                        <Button
                          component={RouterLink}
                          to={`/blog/${post.slug}`}
                          endIcon={<RightArrowIcon />}
                          color="primary"
                          sx={{
                            alignSelf: 'flex-start',
                            mt: 'auto',
                            '&:hover': {
                              bgcolor: 'transparent',
                              color: 'primary.dark',
                              transform: 'translateX(5px)',
                              transition: 'transform 0.3s'
                            }
                          }}
                        >
                          Read More
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" align="center">
                    {isLoading ? 'Loading blog posts...' : 'No blog posts available.'}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
        
        {/* YouTube Videos Section */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          sx={{ mb: 8 }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            fontWeight="bold"
            sx={{ 
              mb: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 80,
                height: 4,
                backgroundColor: 'primary.main',
                borderRadius: 2
              }
            }}
          >
            Product Videos
          </Typography>
          
          <Box sx={{ position: 'relative' }}>
            <Slider {...videoSliderSettings}>
              {videos.map((video) => (
                <Box key={video.id} sx={{ px: 1 }}>
                  <Paper 
                    elevation={2}
                    component={motion.div}
                    whileHover={{ y: -10 }}
                    sx={{
                      overflow: 'hidden',
                      borderRadius: 3,
                      height: '100%'
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height={220}
                        image={video.thumbnail}
                        alt={video.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <Box 
                        component="a"
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.5)',
                          }
                        }}
                      >
                        <IconButton
                          component={motion.button}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'primary.dark'
                            }
                          }}
                        >
                          <PlayIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        {video.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {video.description}
                      </Typography>
                    </CardContent>
                  </Paper>
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
        
        {/* FAQs Section */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          sx={{ mb: 8 }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            fontWeight="bold"
            sx={{ 
              mb: 1,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 80,
                height: 4,
                backgroundColor: 'primary.main',
                borderRadius: 2
              }
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, mt: 2 }}>
            Find answers to common questions about our products and services
          </Typography>
          
          <Grid container spacing={3}>
            {faqs.map((faq, index) => (
              <Grid item xs={12} md={6} key={faq.id}>
                <Accordion
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  elevation={0}
                  sx={{
                    mb: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&::before': {
                      display: 'none',
                    },
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium">
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
          
          <Box 
            component={motion.div}
            whileInView={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            sx={{
              mt: 4,
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #3563E9 0%, #6E8DF7 100%)',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Still have questions?
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              Our support team is ready to help you with any questions you may have about our products or services.
            </Typography>
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ 
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 8
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Box>
        
        {/* Newsletter Section */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          sx={{ 
            py: 6, 
            px: { xs: 3, md: 6 },
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              opacity: 0.05,
              backgroundImage: 'url(/path/to/pattern.png)',
              backgroundRepeat: 'repeat'
            }} 
          />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              fontWeight="bold" 
              gutterBottom
            >
              Subscribe to Our Newsletter
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              paragraph
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Stay updated with our latest products, exclusive offers, and helpful tips about mobility solutions.
            </Typography>
            
            <Box 
              component="form" 
              onSubmit={(e) => {
                e.preventDefault();
                if (email) {
                  addNotification('Thank you for subscribing!', 'success');
                  setEmail('');
                }
              }}
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
                maxWidth: 600, 
                mx: 'auto' 
              }}
            >
              <TextField 
                fullWidth
                placeholder="Your email address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderTopRightRadius: { sm: 0 },
                    borderBottomRightRadius: { sm: 0 },
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<SendIcon />}
                sx={{
                  py: 1.8,
                  px: 4,
                  borderTopLeftRadius: { sm: 0 },
                  borderBottomLeftRadius: { sm: 0 },
                  fontWeight: 'bold'
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  ); 
};

const DealCard = ({ deal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  
  // Get the products from the offer's products list
  const featuredProducts = deal.products || [];
  
  // Calculate discounted price safely
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    if (!originalPrice) return '0.00';
    
    // Ensure both values are numbers
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercentage);
    
    if (isNaN(price) || isNaN(discount)) return originalPrice;
    
    // Calculate the discounted price
    const discountedPrice = price * (1 - (discount/100));
    return discountedPrice.toFixed(2);
  };
  
  // Function to handle adding product to cart
  const handleAddToCart = async (productId) => {
    if (!productId) return;
    
    try {
      await addToCart(productId, 1);
      addNotification('Product added to cart!', 'success');
    } catch (error) {
      addNotification('Failed to add product to cart', 'error');
      console.error('Error adding product to cart:', error);
    }
  };
  
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'rgba(232, 240, 254, 0.8)', // Light blue background like in the image
        position: 'relative'
      }}
    >
      <Grid container spacing={0}>
        <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 5 } }}>
          {/* Discount badge */}
          <Chip 
            label={`${deal.discount_percentage}% OFF`}
            color="error"
            size="medium" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              py: 2,
              px: 1,
              fontSize: '1rem',
              bgcolor: '#ff4d4f',
              color: 'white'
            }} 
          />
          
          <Typography 
            variant="h3" 
            component="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: '#111'
            }}
          >
            {deal.title}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              fontWeight: 'normal'
            }}
          >
            {deal.description}
          </Typography>
          
          {/* Featured Products - now without white background */}
          {featuredProducts.length > 0 && (
            <Box sx={{ mt: 3, mb: 4 }}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                gutterBottom
                sx={{ mb: 2 }}
              >
                Featured Products:
              </Typography>
              
              {featuredProducts.map((productItem) => (
                <Box
                  key={productItem.id}
                  sx={{ 
                    mb: 3,
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    pb: 2,
                    '&:last-child': {
                      borderBottom: 'none',
                      pb: 0
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    component="div" 
                    gutterBottom
                    fontWeight="medium"
                  >
                    {productItem.product_name}
                  </Typography>
                  
                  {/* Price display with safer calculation */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      color="primary.main"
                      sx={{ mr: 2 }}
                    >
                      ${calculateDiscountedPrice(productItem.price, deal.discount_percentage)}
                    </Typography>
                    
                    {productItem.price && (
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ${parseFloat(productItem.price).toFixed(2)}
                      </Typography>
                    )}
                    
                    <Chip 
                      label={`Save ${deal.discount_percentage}%`}
                      size="small"
                      color="success"
                      sx={{ ml: 2, height: 24 }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CartIcon />}
                      onClick={() => handleAddToCart(productItem.product)}
                      sx={{
                        fontWeight: 'medium',
                        py: 1,
                        px: 2.5
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          
          {/* Countdown timer moved to the bottom */}
          <Box 
            sx={{ 
              mt: 4,
              p: 3,
              borderRadius: 2,
              bgcolor: 'white',
              display: 'inline-block',
              width: '100%'
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                color: 'text.secondary',
                fontWeight: 'medium'
              }}
            >
              <TimeIcon fontSize="small" sx={{ mr: 1 }} /> Hurry, offer ends in:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{
                bgcolor: '#4285F4',
                color: 'white',
                borderRadius: 1,
                p: 1,
                textAlign: 'center',
                minWidth: 70
              }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                  <CountdownTimer endTime={new Date(deal.end_date)} component="days" />
                </Typography>
                <Typography variant="caption">Days</Typography>
              </Box>
              
              <Box sx={{
                bgcolor: '#4285F4',
                color: 'white',
                borderRadius: 1,
                p: 1,
                textAlign: 'center',
                minWidth: 70
              }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                  <CountdownTimer endTime={new Date(deal.end_date)} component="hours" />
                </Typography>
                <Typography variant="caption">Hours</Typography>
              </Box>
              
              <Box sx={{
                bgcolor: '#4285F4',
                color: 'white',
                borderRadius: 1,
                p: 1,
                textAlign: 'center',
                minWidth: 70
              }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                  <CountdownTimer endTime={new Date(deal.end_date)} component="minutes" />
                </Typography>
                <Typography variant="caption">Mins</Typography>
              </Box>
              
              <Box sx={{
                bgcolor: '#4285F4',
                color: 'white',
                borderRadius: 1,
                p: 1,
                textAlign: 'center',
                minWidth: 70
              }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                  <CountdownTimer endTime={new Date(deal.end_date)} component="seconds" />
                </Typography>
                <Typography variant="caption">Secs</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
          {/* Product image */}
          <Box
            sx={{ 
              height: { xs: 400, md: '100%' },
              width: '100%',
              position: { md: 'absolute' },
              top: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={deal.image || '/placeholder-deal.jpg'}
              alt={deal.title}
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomePage;