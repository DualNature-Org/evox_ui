import React from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider, 
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  AccessibilityNew as AccessibilityIcon,
  EmojiObjects as InnovationIcon,
  PersonPin as PersonalizedIcon,
  VerifiedUser as QualityIcon
} from '@mui/icons-material';

const ValueCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[5],
    '& .cardIcon': {
      transform: 'scale(1.1)',
    }
  }
}));

const CardIconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.lighter,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
  transition: 'transform 0.3s ease',
}));

const TeamMemberCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[10],
    '& .memberImage': {
      transform: 'scale(1.05)',
    }
  }
}));

const TeamMemberImage = styled(CardMedia)(({ theme }) => ({
  height: 280,
  transition: 'transform 0.5s ease-in-out',
}));

const TimelineItem = styled(Box)(({ theme, align }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    [align === 'left' ? 'right' : 'left']: '50%',
    width: 3,
    backgroundColor: theme.palette.primary.main,
    transform: 'translateX(50%)',
  },
  [theme.breakpoints.down('md')]: {
    '&:before': {
      left: 24,
      right: 'auto',
      transform: 'none',
    }
  }
}));

const TimelineDot = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  border: `3px solid ${theme.palette.background.paper}`,
  position: 'absolute',
  top: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
  [theme.breakpoints.down('md')]: {
    left: 24,
    transform: 'none',
  }
}));

const AboutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Company values
  const values = [
    {
      icon: <AccessibilityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Accessibility for All',
      description: 'We believe mobility should be accessible to everyone. Our mission is to provide wheelchair solutions that empower individuals to live life to the fullest.',
      delay: 0.1
    },
    {
      icon: <QualityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Uncompromising Quality',
      description: 'Every wheelchair we produce undergoes rigorous testing to ensure it meets the highest standards of durability, safety, and performance.',
      delay: 0.2
    },
    {
      icon: <InnovationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Continuous Innovation',
      description: "We're constantly exploring new technologies and designs to push the boundaries of what's possible in mobility solutions.",
      delay: 0.3
    },
    {
      icon: <PersonalizedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Personalized Approach',
      description: "We understand that each person's needs are unique. That's why we offer customized solutions tailored to individual requirements.",
      delay: 0.4
    }
  ];
  
  // Team members
  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      bio: 'Former rehabilitation specialist with 15+ years experience working with mobility-challenged patients.',
      delay: 0.1
    },
    {
      name: 'Michael Rodriguez',
      role: 'Chief Design Officer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      bio: 'Award-winning industrial designer focused on creating beautiful, functional mobility solutions.',
      delay: 0.2
    },
    {
      name: 'Dr. Lisa Chen',
      role: 'Head of R&D',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      bio: 'Ph.D. in Biomedical Engineering with expertise in assistive technologies and ergonomics.',
      delay: 0.3
    },
    {
      name: 'James Wilson',
      role: 'Customer Experience Director',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      bio: 'Dedicated to ensuring every customer finds the perfect mobility solution for their needs.',
      delay: 0.4
    }
  ];
  
  // Company timeline
  const timeline = [
    {
      year: '2010',
      title: 'Company Founded',
      description: 'EVOX Wheelchair Store was established with a mission to revolutionize mobility solutions.',
      align: 'left'
    },
    {
      year: '2013',
      title: 'First Product Line Launch',
      description: 'Introduced our innovative line of ultra-lightweight wheelchairs, setting new industry standards.',
      align: 'right'
    },
    {
      year: '2016',
      title: 'Expanded to International Markets',
      description: 'Began serving customers globally, bringing our mobility solutions to those who need them worldwide.',
      align: 'left'
    },
    {
      year: '2018',
      title: 'Innovation Award',
      description: 'Received the prestigious Mobility Innovation Award for our revolutionary smart wheelchair design.',
      align: 'right'
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched our e-commerce platform to provide seamless online shopping experience for our customers.',
      align: 'left'
    },
    {
      year: '2023',
      title: 'Sustainability Initiative',
      description: 'Committed to eco-friendly manufacturing processes and sustainable business practices.',
      align: 'right'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 10 }}>
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
              mb: 3
            }}
          >
            About EVOX Wheelchair Store
          </Typography>
          <Typography 
            variant="h6" 
            color="textSecondary" 
            align="center"
            sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}
          >
            Transforming lives through innovative mobility solutions that empower independence and enhance quality of life.
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box 
            component="img"
            src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="EVOX Wheelchair Store team working on wheelchair design"
            sx={{
              width: '100%',
              height: { xs: 250, md: 400 },
              objectFit: 'cover',
              borderRadius: 2,
              mb: 2
            }}
          />
        </motion.div>
      </Box>

      {/* Our Story */}
      <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              EVOX Wheelchair Store was founded in 2010 with a simple yet profound mission: to transform the wheelchair industry by combining cutting-edge technology with human-centered design.
            </Typography>
            <Typography variant="body1" paragraph>
              Our founder, Dr. Sarah Johnson, a rehabilitation specialist with over 15 years of experience, recognized the gap between what her patients needed and what the market offered. Frustrated by the limitations of existing mobility solutions, she envisioned wheelchairs that would not just meet basic needs but enhance lives.
            </Typography>
            <Typography variant="body1" paragraph>
              Today, EVOX has grown from a small startup to a global leader in mobility solutions, serving thousands of customers worldwide. While we've expanded our reach, our core mission remains unchanged: empowering people through better mobility.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ mt: 2 }}
            >
              Learn More
            </Button>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1573497019236-61f323342eb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="EVOX Wheelchair design lab"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 6
              }}
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Our Values */}
      <Box sx={{ mb: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
            Our Core Values
          </Typography>
        </motion.div>
        
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: value.delay }}
              >
                <ValueCard elevation={2}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
                    <CardIconWrapper className="cardIcon">
                      {value.icon}
                    </CardIconWrapper>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </ValueCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Our Team */}
      <Box sx={{ mb: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Meet Our Team
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}>
            Our diverse team of experts combines medical knowledge, engineering expertise, and design excellence to create mobility solutions that make a difference.
          </Typography>
        </motion.div>
        
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: member.delay }}
              >
                <TeamMemberCard elevation={3}>
                  <TeamMemberImage
                    className="memberImage"
                    image={member.image}
                    title={member.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {member.role}
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="textSecondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </TeamMemberCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Timeline */}
      <Box sx={{ mb: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
            Our Journey
          </Typography>
        </motion.div>
        
        <Box sx={{ position: 'relative' }}>
          {/* Timeline center line for desktop - hidden on mobile */}
          {!isMobile && (
            <Box sx={{ 
              position: 'absolute', 
              left: '50%', 
              top: 0, 
              bottom: 0, 
              width: 3, 
              bgcolor: 'primary.main', 
              transform: 'translateX(-50%)',
              display: { xs: 'none', md: 'block' }
            }} />
          )}
          
          {/* Timeline Items */}
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Grid container spacing={0}>
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: item.align === 'left' ? 'flex-end' : 'flex-start' }}>
                  {item.align === 'left' || isMobile ? (
                    <TimelineItem align={isMobile ? 'right' : item.align} sx={{ width: '100%', maxWidth: { xs: '100%', md: '90%' } }}>
                      <TimelineDot />
                      <Paper elevation={3} sx={{ p: 3, position: 'relative', ml: { xs: 5, md: 0 } }}>
                        <Chip 
                          label={item.year} 
                          color="primary" 
                          sx={{ mb: 1, fontWeight: 'bold' }} 
                        />
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.description}
                        </Typography>
                      </Paper>
                    </TimelineItem>
                  ) : (
                    <Box sx={{ width: '100%' }} />
                  )}
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: item.align === 'right' ? 'flex' : 'none' } }}>
                  {item.align === 'right' && !isMobile && (
                    <TimelineItem align={item.align} sx={{ width: '100%', maxWidth: '90%' }}>
                      <TimelineDot />
                      <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
                        <Chip 
                          label={item.year} 
                          color="primary" 
                          sx={{ mb: 1, fontWeight: 'bold' }} 
                        />
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.description}
                        </Typography>
                      </Paper>
                    </TimelineItem>
                  )}
                </Grid>
              </Grid>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4eaee 100%)',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Join Us in Our Mission
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: 700, mx: 'auto' }}>
            We're committed to creating a world where mobility challenges don't limit independence or quality of life. Explore our range of products designed with care, or contact us to learn more about how we can help.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{ mx: 1, mb: { xs: 2, sm: 0 } }}
            >
              Explore Products
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              sx={{ mx: 1 }}
            >
              Contact Us
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default AboutPage; 