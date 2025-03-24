import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Box, 
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';

const ContactInfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[6]
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.grey[300]}`,
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    transform: 'scale(1.1)',
  }
}));

const ContactPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.name.trim()) newErrors.name = 'Name is required';
    if (!formState.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formState.email)) newErrors.email = 'Email is invalid';
    if (!formState.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formState.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setSubmitted(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 4
          }}
        >
          Get in Touch
        </Typography>
        <Typography 
          variant="h6" 
          color="textSecondary" 
          align="center"
          sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}
        >
          We're here to help and answer any questions you might have about our wheelchairs, services, or anything else. We look forward to hearing from you.
        </Typography>
      </motion.div>

      {/* Contact Info Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {[
          { 
            icon: <PhoneIcon fontSize="large" />, 
            title: 'Call Us', 
            content: ['+1 (800) EVOX-CARE', '+1 (800) 555-1234'],
            delay: 0.1
          },
          { 
            icon: <EmailIcon fontSize="large" />, 
            title: 'Email Us', 
            content: ['contact@wheelchairstore.com', 'support@wheelchairstore.com'],
            delay: 0.2
          },
          { 
            icon: <LocationIcon fontSize="large" />, 
            title: 'Visit Us', 
            content: ['123 Mobility Street', 'Wheelchair City, WC 10101'],
            delay: 0.3
          },
          { 
            icon: <TimeIcon fontSize="large" />, 
            title: 'Working Hours', 
            content: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM'],
            delay: 0.4
          }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item.delay }}
            >
              <ContactInfoCard elevation={3}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      color: 'primary.main', 
                      mb: 2,
                      p: 1,
                      borderRadius: '50%',
                      bgcolor: 'primary.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  {item.content.map((line, i) => (
                    <Typography key={i} variant="body2" color="textSecondary">
                      {line}
                    </Typography>
                  ))}
                </CardContent>
              </ContactInfoCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Contact Form & Map */}
      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Send Us a Message
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Fill out the form below and we'll get back to you as soon as possible.
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Your Name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="Subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleInputChange}
                  error={!!errors.subject}
                  helperText={errors.subject}
                  required
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="Your Message"
                  name="message"
                  multiline
                  rows={5}
                  value={formState.message}
                  onChange={handleInputChange}
                  error={!!errors.message}
                  helperText={errors.message}
                  required
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 3 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Map & More Info */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Our Location
              </Typography>
              
              {/* Map Embed */}
              <Box sx={{ 
                width: '100%', 
                height: '300px', 
                bgcolor: 'grey.200', 
                mb: 3, 
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative'
              }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059445135!2d-74.25986613799748!3d40.69714941954754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sca!4v1629814426786!5m2!1sen!2sca" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen="" 
                  loading="lazy"
                  title="EVOX Wheelchair Store Location"
                ></iframe>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Social Media */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <SocialButton aria-label="facebook">
                    <FacebookIcon />
                  </SocialButton>
                  <SocialButton aria-label="twitter">
                    <TwitterIcon />
                  </SocialButton>
                  <SocialButton aria-label="instagram">
                    <InstagramIcon />
                  </SocialButton>
                  <SocialButton aria-label="linkedin">
                    <LinkedInIcon />
                  </SocialButton>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Info Section - FAQ Link */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Box sx={{ 
          mt: 8, 
          p: 5, 
          borderRadius: 2, 
          textAlign: 'center',
          bgcolor: 'primary.lighter',
        }}>
          <Typography variant="h5" gutterBottom>
            Have More Questions?
          </Typography>
          <Typography variant="body1" paragraph>
            Check out our frequently asked questions section for quick answers.
          </Typography>
          <Button variant="contained" color="primary">
            View FAQs
          </Button>
        </Box>
      </motion.div>

      <Snackbar 
        open={submitted} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          Message sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage; 