import fetchApi from './api';

const offerService = {
  // Flag to prevent multiple fetch attempts
  _hasFetchFailed: false,
  
  // Get all offers
  getOffers: async () => {
    try {
      // Use the correct endpoint
      const response = await fetchApi('/offers/', 'GET');
      console.log("Raw offers response:", response);
      
      // Return the response (which contains the results array)
      return response;
    } catch (error) {
      console.error('Error fetching offers:', error);
      // Return an object with empty results array to match expected structure
      return { results: [] };
    }
  },
  
  // Get offer by ID
  getOfferById: async (id) => {
    try {
      const response = await fetchApi(`/offers/${id}/`, 'GET');
      return response;
    } catch (error) {
      console.error(`Error fetching offer ${id}:`, error);
      return null;
    }
  },
  
  // Get current active offers with associated products
  getActiveOffers: async () => {
    try {
      // If a fetch has previously failed, just return empty array
      if (offerService._hasFetchFailed) {
        return [];
      }
      
      // Make sure we get the offers with their associated products
      const response = await fetchApi('/offers/active/', 'GET');
      
      if (response && response.results && response.results.length > 0) {
        // Process the offers to include necessary display information
        return response.results.map(offer => {
          // For each offer, we need to calculate the sale information for UI display
          const products = offer.products || [];
          
          // Return the structured offer object
          return {
            id: offer.id,
            title: offer.title,
            description: offer.description,
            discountPercentage: offer.discount_percentage,
            discountAmount: offer.discount_amount,
            startDate: new Date(offer.start_date),
            endDate: new Date(offer.end_date),
            isActive: offer.is_active,
            image: offer.image,
            products: products, // Associated products from the OfferProduct relation
            // For UI consistency with the CountdownTimer component
            endTime: new Date(offer.end_date)
          };
        });
      }
      
      // If there are no active offers, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching active offers:', error);
      offerService._hasFetchFailed = true;
      return [];
    }
  },
  
  // Calculate discounted price based on offer
  calculateDiscountedPrice: (originalPrice, offer) => {
    if (!originalPrice || !offer) return originalPrice;
    
    let discountedPrice = originalPrice;
    
    // Apply percentage discount if available
    if (offer.discount_percentage) {
      discountedPrice = originalPrice - (originalPrice * (offer.discount_percentage / 100));
    } 
    // Otherwise apply fixed amount discount
    else if (offer.discount_amount) {
      discountedPrice = originalPrice - offer.discount_amount;
    }
    
    // Ensure price doesn't go below zero
    return Math.max(discountedPrice, 0);
  }
};

// Mock offers for development
function getDevMockOffers() {
  return [
    {
      id: 1,
      title: "Summer Sale - 20% Off All Manual Wheelchairs",
      description: "Get 20% off on our entire collection of manual wheelchairs until August 31st.",
      discount_percentage: 20,
      discount_amount: null,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      image: "https://images.unsplash.com/photo-1584515979956-d0f3cc3c4361?auto=format&fit=crop&q=80&w=1600&h=900"
    },
    {
      id: 2,
      title: "Independence Day Special - €100 Off Power Wheelchairs",
      description: "Celebrate independence with €100 off any power wheelchair purchase.",
      discount_percentage: null,
      discount_amount: 100,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      image: "https://images.unsplash.com/photo-1577428085891-a32a270a748b?auto=format&fit=crop&q=80&w=1600&h=900"
    }
  ];
}

export default offerService; 