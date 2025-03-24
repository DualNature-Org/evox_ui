import fetchApi from './api';

const blogService = {
  // Get all blog posts
  getAllPosts: async (page = 1) => {
    try {
      const response = await fetchApi(`/blog/posts/?page=${page}`, 'GET');
      return response;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Get a single blog post by slug
  getPostBySlug: async (slug) => {
    try {
      const response = await fetchApi(`/blog/posts/${slug}/`, 'GET');
      return response;
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      throw error;
    }
  },

  // Get featured/recent posts
  getFeaturedPosts: async () => {
    try {
      const response = await fetchApi('/blog/posts/featured/', 'GET');
      return response;
    } catch (error) {
      console.error('Error fetching featured blog posts:', error);
      throw error;
    }
  },

  // Create a comment on a blog post (if implemented)
  createComment: async (postId, commentData) => {
    try {
      const response = await fetchApi(`/blog/posts/${postId}/comments/`, 'POST', commentData);
      return response;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Add a getBlogs method that works like the product service
  getBlogs: async (filters = {}) => {
    try {
      let endpoint = '/blog/posts/';
      
      if (filters.featured) {
        endpoint = '/blog/posts/featured/';
      }
      
      const response = await fetchApi(endpoint, 'GET');
      
      // If response is null, return mock data
      if (response === null) {
        return { results: getMockBlogs(filters) };
      }
      
      // If response already has results property
      if (response && response.results) {
        return response;
      }
      
      // If response is an array, wrap it
      if (Array.isArray(response)) {
        return { results: response };
      }
      
      // Fallback to mock data
      return { results: getMockBlogs(filters) };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return { results: getMockBlogs(filters) };
    }
  },

  // Add this function to the blogService.js file
  getMockBlogs: (filters = {}) => {
    const blogs = [
      {
        id: 1,
        title: "Choosing the Right Wheelchair for Your Needs",
        slug: "choosing-right-wheelchair",
        excerpt: "A guide to help you navigate the many options and find the perfect wheelchair.",
        content: "Lorem ipsum dolor sit amet...",
        featured_image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        author: "Dr. Sarah Johnson",
        publish_date: "2023-08-15",
        featured: true,
        categories: ["Guides", "Mobility"]
      },
      {
        id: 2,
        title: "10 Accessibility Features Every Home Should Have",
        slug: "accessibility-features-home",
        excerpt: "Make your home more accessible with these simple modifications.",
        content: "Lorem ipsum dolor sit amet...",
        featured_image: "https://images.unsplash.com/photo-1560440021-33f9b867899d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        author: "Michael Roberts",
        publish_date: "2023-07-22",
        featured: true,
        categories: ["Home Accessibility", "Tips"]
      },
      {
        id: 3,
        title: "Maintaining Your Wheelchair: A Complete Guide",
        slug: "wheelchair-maintenance-guide",
        excerpt: "Keep your wheelchair in top condition with these maintenance tips.",
        content: "Lorem ipsum dolor sit amet...",
        featured_image: "https://images.unsplash.com/photo-1611741071024-5a68f35cd112?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        author: "James Wilson",
        publish_date: "2023-06-10",
        featured: true,
        categories: ["Maintenance", "Guides"]
      }
    ];
    
    // Filter featured blogs if requested
    if (filters.featured) {
      return blogs.filter(blog => blog.featured);
    }
    
    return blogs;
  }
};

export default blogService; 