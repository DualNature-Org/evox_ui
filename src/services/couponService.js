import fetchApi from './api';

const couponService = {
  // Get all coupons
  getCoupons: async () => {
    try {
      const response = await fetchApi('/coupons/', 'GET');
      return response;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },
  
  // Get coupon by ID
  getCouponById: async (id) => {
    try {
      const response = await fetchApi(`/coupons/${id}/`, 'GET');
      return response;
    } catch (error) {
      console.error(`Error fetching coupon ${id}:`, error);
      throw error;
    }
  },
  
  // Apply coupon code directly to the cart
  applyCoupon: async (code) => {
    try {
      // In a real implementation, we might need to find the coupon ID first
      // For now, we're assuming the API supports applying by code
      const response = await fetchApi(`/cart/apply-coupon/`, 'POST', { code });
      return response;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  },
  
  // Verify coupon code
  verifyCouponCode: async (code) => {
    try {
      // Since there's no direct endpoint to verify a coupon code,
      // we'll fetch all coupons and find the matching one
      const couponsResponse = await couponService.getCoupons();
      
      console.log('Coupons response:', couponsResponse);
      
      // Check if we have a results array
      if (!couponsResponse || !couponsResponse.results) {
        console.error('Invalid response format from coupons API:', couponsResponse);
        throw new Error('Unable to verify coupon code');
      }
      
      // Find the coupon with the matching code
      const coupon = couponsResponse.results.find(
        c => c.code && c.code.toLowerCase() === code.toLowerCase()
      );
      
      if (!coupon) {
        throw new Error('Invalid coupon code');
      }
      
      // Check if coupon is active
      if (!coupon.is_active) {
        throw new Error('This coupon is no longer active');
      }
      
      // Check validity dates
      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validTo = new Date(coupon.valid_to);
      
      if (now < validFrom) {
        throw new Error(`This coupon is not valid yet. It will be active from ${validFrom.toLocaleDateString()}`);
      }
      
      if (now > validTo) {
        throw new Error('This coupon has expired');
      }
      
      // Check max uses
      if (coupon.max_uses > 0 && coupon.times_used >= coupon.max_uses) {
        throw new Error('This coupon has reached its maximum usage limit');
      }
      
      return coupon;
    } catch (error) {
      console.error('Error verifying coupon code:', error);
      throw error;
    }
  }
};

export default couponService; 