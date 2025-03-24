import fetchApi from './api';

export const productService = {
  // Get all products with optional filters
  getProducts: async (filters = {}, wrapInResults = true) => {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.featured) queryParams.append('featured', filters.featured);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.perPage) queryParams.append('perPage', filters.perPage);
    
    const query = queryParams.toString();
    const endpoint = `/products${query ? '?' + query : ''}`;
    
    try {
      // Try to fetch from server
      const data = await fetchApi(endpoint, 'GET', null, false);
      // If we get null response (server connectivity issue), use mock data
      if (data === null) {
        console.log('Server not available, using mock products data');
        const mockData = getMockProducts(filters);
        return wrapInResults ? { results: mockData } : mockData;
      }
      
    //   console.log('Products fetched successfully:', data);
      
      // Handle paginated response
      if (data && data.results && Array.isArray(data.results)) {
        return wrapInResults ? data : data.results;
      }
      
      // If the data is already an array, wrap it in a results object or return directly
      if (Array.isArray(data)) {
        return wrapInResults ? { results: data } : data;
      }
      
      // If we got unexpected format, fall back to mock data
      console.error('Unexpected products data format:', data);
      const mockData = getMockProducts(filters);
      return wrapInResults ? { results: mockData } : mockData;
    } catch (error) {
      console.error('Product fetch failed, using mock data instead:', error);
      const mockData = getMockProducts(filters);
      return wrapInResults ? { results: mockData } : mockData;
    }
  },
  
  // Get product by ID
  getProductById: async (productId) => {
    // Make sure productId is valid and not undefined
    if (!productId) {
      console.error("Invalid product ID provided:", productId);
      return null;
    }
    
    try {
      console.log("ProductService: Fetching product with ID:", productId);
      const data = await fetchApi(`/products/${productId}`, 'GET', null, false);
      
      if (data === null) {
        console.log('Server not available, using mock product data');
        const allProducts = getMockProducts();
        return allProducts.find(p => p.id === productId) || null;
      }
      return data;
    } catch (error) {
      console.error('Product fetch failed, using mock data instead:', error);
      const allProducts = getMockProducts();
      return allProducts.find(p => p.id === productId) || null;
    }
  },
  
  // Get products by category
  getProductsByCategory: async (categoryId, filters = {}) => {
    // Add category to filters and use the getProducts method
    return productService.getProducts({
      ...filters,
      category: categoryId
    });
  },
  
  // Search products
  searchProducts: async (query, filters = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.perPage) queryParams.append('perPage', filters.perPage);
    
    const queryString = queryParams.toString();
    const endpoint = `/products/search?${queryString}`;
    
    try {
      const data = await fetchApi(endpoint, 'GET', null, false);
      if (data === null) {
        // For demo - filter mock products by name containing the query
        console.log('Server not available, using mock search results');
        const allProducts = getMockProducts();
        return query ? 
          allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())) :
          allProducts;
      }
      return data;
    } catch (error) {
      console.error('Search failed, using mock data instead:', error);
      const allProducts = getMockProducts();
      return query ? 
        allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())) :
        allProducts;
    }
  },
  
  // Get all categories
  getCategories: async () => {
    try {
      const data = await fetchApi('/categories', 'GET', null, false);
      if (data === null) {
        console.log('Server not available, using mock categories');
        return getMockCategories();
      }
      
    //   console.log('Categories fetched successfully:', data);
      
      // Check if we got a paginated response and extract results
      if (data && data.results && Array.isArray(data.results)) {
        return data.results;
      }
      
      // If the data is already an array, return it directly
      if (Array.isArray(data)) {
        return data;
      }
      
      // If we got unexpected format, fall back to mock data
      console.error('Unexpected categories data format:', data);
      return getMockCategories();
    } catch (error) {
      console.error('Categories fetch failed, using mock data instead:', error);
      return getMockCategories();
    }
  },
  
  // Get category by ID
  getCategoryById: async (categoryId) => {
    try {
      const data = await fetchApi(`/categories/${categoryId}`, 'GET', null, false);
      if (data === null) {
        console.log('Server not available, using mock category data');
        const allCategories = getMockCategories();
        return allCategories.find(c => c.id === categoryId) || null;
      }
      return data;
    } catch (error) {
      console.error('Category fetch failed, using mock data instead:', error);
      const allCategories = getMockCategories();
      return allCategories.find(c => c.id === categoryId) || null;
    }
  }
};

// Mock data for development
const getMockProducts = (filters = {}) => {
  // Create sample product data
  const products = [
    {
      id: '1',
      name: 'EVOX Pro Ultra-Light Wheelchair',
      description: 'Our most advanced ultra-lightweight wheelchair with carbon fiber frame, ergonomic seating, and precision controls.',
      short_description: 'Advanced ultra-lightweight wheelchair with carbon fiber frame',
      price: 1299.99,
      sale_price: 999.99,
      stock_quantity: 15,
      average_rating: '4.8',
      sku: 'EVOX-UL-001',
      featured: true,
      categories: ['1', '5'],
      tags: ['premium', 'lightweight', 'adjustable'],
      images: [
        'https://images.unsplash.com/photo-1576765608856-5b18f2bce4da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581153920860-dc0cb5e279da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      specifications: [
        { name: 'Weight', value: '4.9 kg' },
        { name: 'Frame Material', value: 'Carbon Fiber' },
        { name: 'Seat Width', value: '14" - 20"' },
        { name: 'Max Weight Capacity', value: '265 lbs' }
      ],
      related_products: ['2', '3', '5'],
      created_at: '2023-01-15'
    },
    {
      id: '2',
      name: 'EVOX Sport Active Wheelchair',
      description: 'Designed for active lifestyles with responsive handling, customizable configurations, and sporty aesthetics.',
      short_description: 'Responsive handling and sporty design for active users',
      price: 899.99,
      sale_price: null,
      stock_quantity: 8,
      average_rating: '4.6',
      sku: 'EVOX-SP-002',
      featured: true,
      categories: ['2', '5'],
      tags: ['sports', 'active', 'outdoor'],
      images: [
        'https://images.unsplash.com/photo-1599304245029-d1c955a94cf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      specifications: [
        { name: 'Weight', value: '5.4 kg' },
        { name: 'Frame Material', value: 'Aluminum Alloy' },
        { name: 'Seat Width', value: '14" - 18"' },
        { name: 'Max Weight Capacity', value: '220 lbs' }
      ],
      related_products: ['1', '3', '4'],
      created_at: '2023-03-20'
    },
    {
      id: '3',
      name: 'EVOX Comfort Plus Wheelchair',
      description: 'Premium comfort for extended use with extra cushioning, adjustable backrest, and smooth-rolling wheels.',
      short_description: 'Extra cushioning and adjustable features for maximum comfort',
      price: 749.99,
      sale_price: 699.99,
      stock_quantity: 12,
      average_rating: '4.5',
      sku: 'EVOX-CP-003',
      featured: false,
      categories: ['3', '5'],
      tags: ['comfort', 'adjustable', 'indoor'],
      images: [
        'https://images.unsplash.com/photo-1636989586280-87208b80ed5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      specifications: [
        { name: 'Weight', value: '6.8 kg' },
        { name: 'Frame Material', value: 'Steel' },
        { name: 'Seat Width', value: '16" - 22"' },
        { name: 'Max Weight Capacity', value: '300 lbs' }
      ],
      related_products: ['1', '2', '6'],
      created_at: '2023-05-10'
    },
    {
      id: '4',
      name: 'EVOX Compact Foldable Wheelchair',
      description: 'Easy transport and storage with quick-fold mechanism, compact design, and lightweight construction.',
      short_description: 'Quick-fold mechanism for easy transport and storage',
      price: 599.99,
      sale_price: null,
      stock_quantity: 20,
      average_rating: '4.3',
      sku: 'EVOX-CF-004',
      featured: false,
      categories: ['4', '5'],
      tags: ['portable', 'travel', 'foldable'],
      images: [
        'https://images.unsplash.com/photo-1624385392543-6e4781eb5011?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      specifications: [
        { name: 'Weight', value: '5.2 kg' },
        { name: 'Frame Material', value: 'Aluminum' },
        { name: 'Seat Width', value: '16" - 18"' },
        { name: 'Max Weight Capacity', value: '220 lbs' },
        { name: 'Folded Dimensions', value: '30" x 12" x 30"' }
      ],
      related_products: ['2', '3', '5'],
      created_at: '2023-07-05'
    },
    {
      id: '5',
      name: 'EVOX All-Terrain Wheelchair',
      description: 'Tackle any environment with rugged wheels, enhanced stability, and durable construction.',
      short_description: 'Rugged design for outdoor adventures on any terrain',
      price: 1099.99,
      sale_price: null,
      stock_quantity: 7,
      average_rating: '4.7',
      sku: 'EVOX-AT-005',
      featured: true,
      categories: ['2', '5'],
      tags: ['outdoor', 'all-terrain', 'rugged'],
      images: [
        'https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      specifications: [
        { name: 'Weight', value: '7.8 kg' },
        { name: 'Frame Material', value: 'Reinforced Aluminum' },
        { name: 'Seat Width', value: '16" - 20"' },
        { name: 'Max Weight Capacity', value: '275 lbs' },
        { name: 'Wheel Type', value: 'Pneumatic All-Terrain' }
      ],
      related_products: ['1', '2', '4'],
      created_at: '2023-02-18'
    },
    {
      id: '6',
      name: 'EVOX Pediatric Wheelchair',
      description: 'Designed specifically for children with colorful options, growth-adjustable features, and kid-friendly controls.',
      short_description: 'Colorful, growth-adjustable design made for children',
      price: 649.99,
      sale_price: 599.99,
      stock_quantity: 9,
      average_rating: '4.9',
      sku: 'EVOX-PD-006',
      featured: false,
      categories: ['6', '5'],
      tags: ['pediatric', 'children', 'adjustable'],
      images: [
        'https://images.unsplash.com/photo-1559485364-afde2b8951a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      specifications: [
        { name: 'Weight', value: '4.1 kg' },
        { name: 'Frame Material', value: 'Aluminum' },
        { name: 'Seat Width', value: '10" - 14"' },
        { name: 'Max Weight Capacity', value: '150 lbs' },
        { name: 'Age Range', value: '4-14 years' }
      ],
      related_products: ['3', '4'],
      created_at: '2023-04-25'
    },
  ];
  
  // Apply filters
  let filteredProducts = [...products];
  
  if (filters.featured) {
    filteredProducts = filteredProducts.filter(p => p.featured);
  }
  
  if (filters.category) {
    filteredProducts = filteredProducts.filter(p => p.categories.includes(filters.category));
  }
  
  if (filters.minPrice) {
    filteredProducts = filteredProducts.filter(p => 
      (p.sale_price || p.price) >= filters.minPrice
    );
  }
  
  if (filters.maxPrice) {
    filteredProducts = filteredProducts.filter(p => 
      (p.sale_price || p.price) <= filters.maxPrice
    );
  }
  
  // Sort products
  if (filters.sort) {
    switch (filters.sort) {
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'price-low-to-high':
        filteredProducts.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
        break;
      case 'price-high-to-low':
        filteredProducts.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
        break;
      case 'popularity':
        filteredProducts.sort((a, b) => parseFloat(b.average_rating) - parseFloat(a.average_rating));
        break;
      case 'best-selling':
        // Sort by rating as a stand-in for "best selling"
        filteredProducts.sort((a, b) => parseFloat(b.average_rating) - parseFloat(a.average_rating));
        break;
      default:
        break;
    }
  }
  
  return filteredProducts;
};

const getMockCategories = () => {
  return [
    { id: '1', name: 'Ultra-Light', description: 'Extremely lightweight wheelchairs for maximum mobility', count: 4 },
    { id: '2', name: 'Sport & Active', description: 'Designed for active lifestyles and sports', count: 6 },
    { id: '3', name: 'Comfort', description: 'Enhanced comfort features for daily use', count: 5 },
    { id: '4', name: 'Foldable', description: 'Easily foldable designs for transportation', count: 7 },
    { id: '5', name: 'All Wheelchairs', description: 'Complete collection of wheelchairs', count: 22 },
    { id: '6', name: 'Pediatric', description: 'Wheelchairs designed for children', count: 3 }
  ];
};

export default productService; 