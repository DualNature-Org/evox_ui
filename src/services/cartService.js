import fetchApi from './api';

const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await fetchApi('/cart/', 'GET');
      return response;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const payload = {
        product_id: productId,
        quantity: quantity
      };
      
      const response = await fetchApi('/cart-items/', 'POST', payload);
      return response;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    try {
      const payload = {
        quantity: quantity
      };
      
      const response = await fetchApi(`/cart-items/${itemId}/`, 'PATCH', payload);
      return response;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      await fetchApi(`/cart-items/${itemId}/`, 'DELETE');
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      console.log('Clearing cart...');
      await fetchApi('/cart-items/clear/', 'DELETE');
      console.log('Cart cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Apply coupon to cart
  applyCoupon: async (code) => {
    try {
      const response = await fetchApi('/cart/apply-coupon/', 'POST', { code });
      return response;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  },

  // Remove coupon from cart
  removeCoupon: async () => {
    try {
      const response = await fetchApi('/cart/remove-coupon/', 'DELETE');
      return response;
    } catch (error) {
      console.error('Error removing coupon:', error);
      throw error;
    }
  },

  // Get product details (used for guest cart)
  getProductDetails: async (productId) => {
    try {
      return await fetchApi(`/products/${productId}/`, 'GET', null, false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  }
};

export default cartService; 