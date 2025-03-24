import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Divider, 
  Avatar, 
  Grid,
  Card,
  Button,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';
import { useNotification } from '../contexts/NotificationContext';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '../utils/formatters';
import ShareButtons from '../components/blog/ShareButtons';
import RelatedPosts from '../components/blog/RelatedPosts';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await blogService.getPostBySlug(slug);
        setPost(data);
        
        // Set document title based on post title
        document.title = `${data.title} | EVOX Wheelchairs Blog`;
        
        // Optionally fetch related posts - you might need to implement this API call
        try {
          const related = await blogService.getFeaturedPosts();
          // Filter out the current post and take up to 3 posts
          setRelatedPosts(
            related.results.filter(p => p.id !== data.id).slice(0, 3)
          );
        } catch (error) {
          console.error('Error fetching related posts:', error);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        addNotification('Failed to load blog post', 'error');
        navigate('/blog', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
    
    // Clean up function
    return () => {
      document.title = 'EVOX Wheelchairs';
    };
  }, [slug, navigate, addNotification]);

  // Function to render post content, handling HTML or Markdown
  const renderContent = () => {
    if (!post) return null;
    
    // If using Markdown
    if (post.content_html) {
      return (
        <Box className="blog-content" sx={{ 
          typography: 'body1',
          '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1, my: 2 },
          '& h1, & h2, & h3, & h4, & h5, & h6': { mt: 4, mb: 2 },
          '& p': { mb: 2 },
          '& ul, & ol': { mb: 2, pl: 4 },
          '& blockquote': { 
            borderLeft: '4px solid', 
            borderColor: 'primary.main', 
            pl: 2, 
            py: 1,
            my: 2,
            backgroundColor: 'grey.50',
            fontStyle: 'italic'
          },
        }} 
        dangerouslySetInnerHTML={{ __html: post.content_html }} 
        />
      );
    }
    
    // If using ReactMarkdown
    return (
      <ReactMarkdown className="blog-content">
        {post.content}
      </ReactMarkdown>
    );
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 8 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : !post ? (
          <Typography variant="h5" color="text.secondary" align="center">
            Post not found
          </Typography>
        ) : (
          <>
            <Breadcrumbs sx={{ mb: 4 }}>
              <MuiLink component={Link} to="/" color="inherit">
                Home
              </MuiLink>
              <MuiLink component={Link} to="/blog" color="inherit">
                Blog
              </MuiLink>
              <Typography color="text.primary">{post.title}</Typography>
            </Breadcrumbs>
            
            <Typography variant="h3" component="h1" gutterBottom>
              {post.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {post.author && (
                <>
                  <Avatar 
                    alt={`${post.author.first_name} ${post.author.last_name}`}
                    src="/static/images/avatar/1.jpg" // Placeholder
                    sx={{ width: 40, height: 40, mr: 1.5 }}
                  />
                  <Box sx={{ mr: 3 }}>
                    <Typography variant="subtitle2">
                      {post.author.first_name} {post.author.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(post.created_at)}
                    </Typography>
                  </Box>
                </>
              )}
              
              <Box sx={{ ml: 'auto' }}>
                <ShareButtons title={post.title} />
              </Box>
            </Box>
            
            {post.thumbnail && (
              <Box 
                component="img" 
                src={post.thumbnail} 
                alt={post.title}
                sx={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: 2,
                  mb: 4
                }} 
              />
            )}
            
            {renderContent()}

            <Divider sx={{ mt: 6, mb: 4 }} />

            {/* Author section */}
            {post.author && (
              <Card sx={{ p: 4, mb: 6 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <Avatar 
                      alt={`${post.author.first_name} ${post.author.last_name}`}
                      src="/static/images/avatar/1.jpg" // Placeholder
                      sx={{ width: 80, height: 80 }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">About the author</Typography>
                    <Typography variant="subtitle1">
                      {post.author.first_name} {post.author.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {/* Add author bio if available */}
                      Content specialist at EVOX Wheelchairs with expertise in accessibility and mobility solutions.
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            )}

            {/* Related posts section */}
            {relatedPosts.length > 0 && (
              <Box sx={{ mt: 8 }}>
                <Typography variant="h5" gutterBottom>
                  Related Articles
                </Typography>
                <RelatedPosts posts={relatedPosts} />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/blog"
                    size="large"
                  >
                    View All Articles
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default BlogPostPage; 