import React from 'react';
import { Grid } from '@mui/material';
import BlogPostCard from './BlogPostCard';

const RelatedPosts = ({ posts }) => {
  return (
    <Grid container spacing={4}>
      {posts.map((post) => (
        <Grid item xs={12} sm={4} key={post.id}>
          <BlogPostCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
};

export default RelatedPosts; 