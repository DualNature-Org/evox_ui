import fetchApi from './api';

const userService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await fetchApi('/profile/', 'GET');
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      // If profileData is a FormData object, don't try to stringify
      const isFormData = profileData instanceof FormData;
      
      const options = {
        headers: isFormData ? {} : {
          'Content-Type': 'application/json'
        }
      };
      
      const response = await fetchApi('/profile/', 'PUT', profileData, options);
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  // Patch user profile (partial update)
  patchUserProfile: async (profileData) => {
    try {
      const response = await fetchApi('/profile/', 'PATCH', profileData);
      return response;
    } catch (error) {
      console.error('Error patching user profile:', error);
      throw error;
    }
  },
  
  // Get user's complete data (profile, addresses, orders summary, etc.)
  getUserDashboardData: async () => {
    try {
      // This could be a custom endpoint that aggregates all user data
      // For now, let's mock it by calling multiple endpoints
      const profile = await userService.getUserProfile();
      
      // You could add more data aggregation here
      
      return {
        profile,
        // Include other user data as needed
      };
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
      throw error;
    }
  }
};

export default userService; 