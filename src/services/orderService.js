import fetchApi from './api';

const orderService = {
  // Get all orders for the authenticated user
  getOrders: async (page = 1) => {
    try {
      const response = await fetchApi(`/orders/?page=${page}`, 'GET');
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  
  // Get a specific order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await fetchApi(`/orders/${orderId}/`, 'GET');
      return response;
    } catch (error) {
      console.error(`Error fetching order with ID ${orderId}:`, error);
      throw error;
    }
  },
  
  // Create a new order
  createOrder: async (orderData) => {
    try {
      console.log('Creating order with data:', orderData);
      
      // Ensure the order data has the required fields in the correct format
      const payload = {
        status: orderData.status || 'pending',
        total_amount: orderData.total_amount.toString(),
        billing_address: orderData.billingAddressId,
        shipping_address: orderData.shippingAddressId
      };
      
      console.log('Sending order payload:', payload);
      const response = await fetchApi('/orders/', 'POST', payload);
      console.log('Order created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  // Update an order's status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetchApi(`/orders/${orderId}/`, 'PATCH', { status });
      return response;
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      throw error;
    }
  },
  
  // Cancel an order
  cancelOrder: async (orderId) => {
    try {
      const response = await fetchApi(`/orders/${orderId}/`, 'PATCH', { status: 'cancelled' });
      return response;
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  },
  
  // Apply a coupon to the current cart/order
  applyCoupon: async (couponCode) => {
    try {
      const response = await fetchApi('/coupons/apply/', 'POST', { code: couponCode });
      return response;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }
};

export default orderService; 