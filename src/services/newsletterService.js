import fetchApi from './api';

const newsletterService = {
  // Subscribe to newsletter
  subscribe: async (email) => {
    try {
      const payload = {
        email: email,
        is_subscribed: true
      };
      const response = await fetchApi('/newsletter/subscribe/', 'POST', payload);
      return response;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  },
  
  // Unsubscribe from newsletter
  unsubscribe: async (email) => {
    try {
      await fetchApi(`/newsletter/unsubscribe/${email}/`, 'PATCH', {});
      return true;
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      throw error;
    }
  }
};

export default newsletterService; 