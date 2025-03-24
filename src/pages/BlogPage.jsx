import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress,
  Pagination,
  TextField,
  InputAdornment,
  Divider,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import blogService from '../services/blogService';
import BlogPostCard from '../components/blog/BlogPostCard';
import FeaturedPost from '../components/blog/FeaturedPost';
import { useNotification } from '../contexts/NotificationContext';
import EmptyState from '../components/common/EmptyState';

const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiOutlinedInput-root': {
    borderRadius: 30,
  }
}));

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { addNotification } = useNotification();

  useEffect(() => {
    // Set document title
    document.title = 'Blog | EVOX Wheelchairs';
    
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAllPosts(page);
        setPosts(data.results || []);
        setTotalPages(Math.ceil(data.count / 10));
        
        // Fetch featured posts if it's the first page
        if (page === 1 && !featuredPosts.length) {
          const featuredData = await blogService.getFeaturedPosts();
          setFeaturedPosts(featuredData.results || []);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        addNotification('Failed to load blog posts', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
    
    // Clean up function
    return () => {
      document.title = 'EVOX Wheelchairs';
    };
  }, [page, addNotification]);

  // Handle page change for pagination
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle search submission
  const handleSearch = async (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      try {
        setLoading(true);
        // You'll need to implement search functionality in your API
        const data = await blogService.getAllPosts(1, searchQuery);
        setPosts(data.results || []);
        setTotalPages(Math.ceil(data.count / 10));
        setPage(1);
      } catch (error) {
        console.error('Error searching blog posts:', error);
        addNotification('Failed to search blog posts', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            EVOX Wheelchair Blog
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Stay updated with the latest news, tips and stories about mobility solutions
          </Typography>
          
          <SearchField
            fullWidth
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon onClick={handleSearch} style={{ cursor: 'pointer' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Featured Posts Section - Display only on first page */}
            {page === 1 && featuredPosts.length > 0 && (
              <>
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h4" component="h2" gutterBottom>
                    Featured Articles
                  </Typography>
                  <Grid container spacing={4}>
                    {featuredPosts.slice(0, 2).map((post) => (
                      <Grid item xs={12} md={6} key={post.id}>
                        <FeaturedPost post={post} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Divider sx={{ mb: 6 }}>
                  <Chip label="Latest Articles" />
                </Divider>
              </>
            )}

            {/* Main Posts Grid */}
            {posts.length > 0 ? (
              <Grid container spacing={4}>
                {posts.map((post) => (
                  <Grid item xs={12} sm={6} md={4} key={post.id}>
                    <BlogPostCard post={post} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <EmptyState 
                title="No posts found"
                description="There are no blog posts available at the moment. Please check back later!"
                icon="article"
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default BlogPage; 