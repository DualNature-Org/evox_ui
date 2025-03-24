import fetchApi from './api';

const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    try {
      const response = await fetchApi('/wishlist/', 'GET');
      return response;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },
  
  // Add item to wishlist
  addToWishlist: async (productId) => {
    try {
      const payload = {
        product_id: productId
      };
      
      const response = await fetchApi('/wishlist-items/', 'POST', payload);
      return response;
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      throw error;
    }
  },
  
  // Remove item from wishlist
  removeFromWishlist: async (itemId) => {
    try {
      await fetchApi(`/wishlist-items/${itemId}/`, 'DELETE');
      return true;
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      throw error;
    }
  },
  
  // Check if product is in wishlist
  isInWishlist: async (productId) => {
    return await fetchApi(`/wishlist/check/${productId}/`, 'GET');
  },
  
  // Clear wishlist (custom endpoint if available, otherwise remove items one by one)
  clearWishlist: async () => {
    try {
      // First try to get all wishlist items
      const wishlist = await wishlistService.getWishlist();
      console.log('Clearing wishlist with items:', wishlist.items);
      
      // If there's a dedicated clear endpoint, use it
      // Otherwise, delete each item individually
      const deletePromises = wishlist.items.map(item => 
        fetchApi(`/wishlist-items/${item.id}/`, 'DELETE')
      );
      
      await Promise.all(deletePromises);
      console.log('Wishlist cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  },
  
  // Move item from wishlist to cart
  moveToCart: async (itemId, quantity = 1) => {
    return await fetchApi(`/wishlist/items/${itemId}/move-to-cart/`, 'POST', {
      quantity
    });
  }
};

export default wishlistService; 