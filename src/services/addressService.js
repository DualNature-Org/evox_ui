import fetchApi from './api';

const addressService = {
  // Get all addresses for the authenticated user
  getAddresses: async () => {
    try {
      const response = await fetchApi('/addresses/', 'GET');
      return response.results || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },
  
  // Get a specific address by ID
  getAddressById: async (addressId) => {
    try {
      const response = await fetchApi(`/addresses/${addressId}/`, 'GET');
      return response;
    } catch (error) {
      console.error(`Error fetching address with ID ${addressId}:`, error);
      throw error;
    }
  },
  
  // Create a new address
  createAddress: async (addressData) => {
    try {
      const response = await fetchApi('/addresses/', 'POST', addressData);
      return response;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  },
  
  // Update an existing address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await fetchApi(`/addresses/${addressId}/`, 'PUT', addressData);
      return response;
    } catch (error) {
      console.error(`Error updating address with ID ${addressId}:`, error);
      throw error;
    }
  },
  
  // Update only specific fields of an address
  patchAddress: async (addressId, addressData) => {
    try {
      const response = await fetchApi(`/addresses/${addressId}/`, 'PATCH', addressData);
      return response;
    } catch (error) {
      console.error(`Error patching address with ID ${addressId}:`, error);
      throw error;
    }
  },
  
  // Delete an address
  deleteAddress: async (addressId) => {
    try {
      await fetchApi(`/addresses/${addressId}/`, 'DELETE');
      return true;
    } catch (error) {
      console.error(`Error deleting address with ID ${addressId}:`, error);
      throw error;
    }
  },
  
  // Set an address as default
  setDefaultAddress: async (addressId, addressType) => {
    try {
      const response = await fetchApi(`/addresses/${addressId}/`, 'PATCH', {
        is_default: true
      });
      return response;
    } catch (error) {
      console.error(`Error setting address ${addressId} as default:`, error);
      throw error;
    }
  }
};

export default addressService; 