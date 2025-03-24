import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Avatar 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const FeaturedPost = ({ post }) => {
  // Default fallback image if no thumbnail is available
  const defaultImage = 'https://images.unsplash.com/photo-1581593261075-4873053407fc?auto=format&fit=crop&q=80&w=1200&h=600';
  
  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: 'white',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${post.thumbnail || defaultImage})`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Increase the priority of the hero background image */}
      <img 
        style={{ display: 'none' }} 
        src={post.thumbnail || defaultImage} 
        alt={post.title} 
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.5)',
        }}
      />
      
      <Box
        sx={{
          position: 'relative',
          p: { xs: 3, md: 6 },
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Typography component="h3" variant="h4" color="inherit" gutterBottom>
          {post.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {post.author && (
            <>
              <Avatar 
                alt={`${post.author.first_name} ${post.author.last_name}`}
                src="/static/images/avatar/1.jpg" // Placeholder
                sx={{ width: 40, height: 40, mr: 1, border: '2px solid white' }}
              />
              <Box>
                <Typography variant="subtitle2" color="inherit">
                  {post.author.first_name} {post.author.last_name}
                </Typography>
                <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                  {formatDate(post.created_at)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
        
        <Typography variant="subtitle1" color="inherit" paragraph sx={{ opacity: 0.9 }}>
          {post.content.substr(0, 140).replace(/<[^>]*>/g, '')}...
        </Typography>
        
        <Button 
          component={Link} 
          to={`/blog/${post.slug}`} 
          variant="contained" 
          sx={{ alignSelf: 'flex-start' }}
        >
          Read More
        </Button>
      </Box>
    </Paper>
  );
};

export default FeaturedPost; 