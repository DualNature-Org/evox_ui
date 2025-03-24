import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  CardActionArea, 
  Box, 
  Avatar 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const BlogPostCard = ({ post }) => {
  // Default fallback image if no thumbnail is available
  const defaultImage = 'https://images.unsplash.com/photo-1581593261075-4873053407fc?auto=format&fit=crop&q=80&w=600&h=350';
  
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: 6,
      }
    }}>
      <CardActionArea 
        component={Link} 
        to={`/blog/${post.slug}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardMedia
          component="img"
          height="200"
          image={post.thumbnail || defaultImage}
          alt={post.title}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="h2" sx={{ mb: 1 }}>
            {post.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {post.content.substr(0, 120).replace(/<[^>]*>/g, '')}...
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
            {post.author && (
              <>
                <Avatar 
                  alt={`${post.author.first_name} ${post.author.last_name}`}
                  src="/static/images/avatar/1.jpg" // Placeholder
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Box>
                  <Typography variant="caption" display="block">
                    {post.author.first_name} {post.author.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(post.created_at)}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BlogPostCard; 