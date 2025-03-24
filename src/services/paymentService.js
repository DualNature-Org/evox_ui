import fetchApi from './api';

const paymentService = {
  // Get all payment methods
  getPaymentMethods: async () => {
    try {
      const response = await fetchApi('/payment-methods/', 'GET');
      return response.results || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },
  
  // Get a specific payment method by ID
  getPaymentMethodById: async (methodId) => {
    try {
      const response = await fetchApi(`/payment-methods/${methodId}/`, 'GET');
      return response;
    } catch (error) {
      console.error(`Error fetching payment method with ID ${methodId}:`, error);
      throw error;
    }
  },
  
  // Get all EMI plans
  getEmiPlans: async () => {
    try {
      const response = await fetchApi('/emi-plans/', 'GET');
      return response.results || [];
    } catch (error) {
      console.error('Error fetching EMI plans:', error);
      throw error;
    }
  },
  
  // Create a new payment record
  createPayment: async (paymentData) => {
    try {
      const response = await fetchApi('/payments/', 'POST', paymentData);
      return response;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },
  
  // Get payment details by ID
  getPaymentById: async (paymentId) => {
    try {
      const response = await fetchApi(`/payments/${paymentId}/`, 'GET');
      return response;
    } catch (error) {
      console.error(`Error fetching payment with ID ${paymentId}:`, error);
      throw error;
    }
  },
  
  // Update payment status
  updatePaymentStatus: async (paymentId, status) => {
    try {
      const response = await fetchApi(`/payments/${paymentId}/`, 'PATCH', { status });
      return response;
    } catch (error) {
      console.error(`Error updating payment ${paymentId} status:`, error);
      throw error;
    }
  },
  
  // Process a credit card payment (mock implementation for demo)
  processCreditCardPayment: async (paymentDetails, amount) => {
    try {
      // Simulate an API call to a payment processor
      console.log('Processing credit card payment:', paymentDetails, amount);
      
      // In a real app, you would call your payment processor API here
      // For demo purposes, we'll just simulate a successful payment
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return a mock transaction ID and success status
      return {
        success: true,
        transaction_id: 'cc_' + Math.random().toString(36).substring(2, 15),
        message: 'Payment processed successfully'
      };
    } catch (error) {
      console.error('Error processing credit card payment:', error);
      throw error;
    }
  },
  
  // Generic payment processing method that delegates to specific payment methods
  processPayment: async (paymentMethod, paymentDetails, amount) => {
    try {
      console.log(`Processing ${paymentMethod} payment for $${amount}`);
      
      // Call the appropriate payment processor based on the method
      switch (paymentMethod) {
        case 'credit_card':
        case 'debit_card':
          return await paymentService.processCreditCardPayment(paymentDetails, amount);
          
        case 'upi':
        case 'netbanking':
        case 'wallet':
        case 'emi':
          // For demo, all other methods just succeed
          await new Promise(resolve => setTimeout(resolve, 1000));
          return {
            success: true,
            transaction_id: `${paymentMethod}_` + Math.random().toString(36).substring(2, 15),
            message: `${paymentMethod} payment processed successfully`
          };
          
        default:
          throw new Error(`Unsupported payment method: ${paymentMethod}`);
      }
    } catch (error) {
      console.error(`Error processing ${paymentMethod} payment:`, error);
      throw error;
    }
  }
};

export default paymentService; 