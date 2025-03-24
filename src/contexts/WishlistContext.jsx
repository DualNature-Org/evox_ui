import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useUser } from './UserContext';
import { useNotification } from './NotificationContext';
import wishlistService from '../services/wishlistService';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useUser();
  const { addNotification } = useNotification();
  const { addToCart } = useCart();

  // Load wishlist from localStorage (for non-authenticated users)
  const loadLocalWishlist = useCallback(() => {
    try {
      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) {
        setWishlistItems(JSON.parse(localWishlist));
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.error('Error loading local wishlist:', err);
      setWishlistItems([]);
    }
  }, []);

  // Save wishlist to localStorage (for non-authenticated users)
  const saveLocalWishlist = useCallback((items) => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(items));
    } catch (err) {
      console.error('Error saving local wishlist:', err);
    }
  }, []);

  // Load wishlist based on authentication status
  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      loadLocalWishlist();
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch wishlist from server for authenticated users
      const response = await wishlistService.getWishlist();
      setWishlistItems(response.items || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      setError('Failed to load wishlist. Please try again.');
      addNotification('Failed to load wishlist', 'error');
      // Fallback to empty wishlist on error
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, addNotification, loadLocalWishlist]);

  // Effect to load wishlist on mount and auth change
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist, isAuthenticated]);

  // Add item to wishlist
  const addToWishlist = async (product) => {
    if (!product || !product.id) {
      console.error('Invalid product provided to addToWishlist');
      return;
    }

    // Check if product is already in wishlist
    const isAlreadyInWishlist = wishlistItems.some(item => 
      item.product_id === product.id || 
      (item.product && item.product.id === product.id)
    );
    
    if (isAlreadyInWishlist) {
      addNotification('This item is already in your wishlist!', 'info');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let newItem;
      
      if (isAuthenticated) {
        // Add to server wishlist if logged in
        newItem = await wishlistService.addToWishlist(product.id);
        setWishlistItems(prev => [...prev, newItem]);
      } else {
        // Add to local wishlist if not logged in
        newItem = {
          id: `local-${Date.now()}`,
          product_id: product.id,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            sale_price: product.sale_price,
            primary_image: product.images?.[0] || '',
            short_description: product.short_description
          },
          added_at: new Date().toISOString()
        };
        const updatedItems = [...wishlistItems, newItem];
        setWishlistItems(updatedItems);
        saveLocalWishlist(updatedItems);
      }
      
      addNotification(`${product.name} added to wishlist!`, 'success');
    } catch (err) {
      console.error('Failed to add item to wishlist:', err);
      setError('Failed to add item to wishlist. Please try again.');
      addNotification('Failed to add item to wishlist', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (itemId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the item to be removed (for notification message)
      const item = wishlistItems.find(item => 
        item.id === itemId || 
        item.product_id === itemId || 
        (item.product && item.product.id === itemId)
      );
      
      if (isAuthenticated) {
        await wishlistService.removeFromWishlist(itemId);
      }
      
      // Update local state regardless of auth status
      const updatedItems = wishlistItems.filter(item => 
        item.id !== itemId && 
        item.product_id !== itemId && 
        (!item.product || item.product.id !== itemId)
      );
      
      setWishlistItems(updatedItems);
      
      if (!isAuthenticated) {
        saveLocalWishlist(updatedItems);
      }
      
      const productName = item?.product?.name || 'Item';
      addNotification(`${productName} removed from wishlist`, 'success');
    } catch (err) {
      console.error('Failed to remove item from wishlist:', err);
      setError('Failed to remove item from wishlist. Please try again.');
      addNotification('Failed to remove item from wishlist', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => 
      item.product_id === productId || 
      (item.product && item.product.id === productId)
    );
  }, [wishlistItems]);

  // Toggle wishlist item (add if not present, remove if present)
  const toggleWishlistItem = useCallback(async (product) => {
    if (!product || !product.id) {
      console.error('Invalid product for wishlist toggle:', product);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if product is already in wishlist
      const existingItem = wishlistItems.find(item => 
        item.product_id === parseInt(product.id) || 
        (item.product && item.product.id === parseInt(product.id))
      );
      
      if (existingItem) {
        // Remove from wishlist if exists
        await removeFromWishlist(existingItem.id);
      } else {
        // Add to wishlist if not exists
        await addToWishlist(product);
      }
    } catch (err) {
      console.error('Failed to toggle wishlist item:', err);
      setError('Failed to update wishlist. Please try again.');
      addNotification('Failed to update wishlist', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [wishlistItems, addToWishlist, removeFromWishlist, addNotification]);

  // Merge local wishlist with server wishlist on login
  const mergeWishlistsOnLogin = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const localItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (localItems.length === 0) return;
      
      // Get current server wishlist to avoid duplicates
      const serverWishlist = await wishlistService.getWishlist();
      const serverProductIds = new Set(
        (serverWishlist.items || []).map(item => item.product_id || (item.product && item.product.id))
      );
      
      // Add local items that don't exist on server
      for (const item of localItems) {
        const productId = item.product_id || (item.product && item.product.id);
        if (productId && !serverProductIds.has(productId)) {
          await wishlistService.addToWishlist(productId);
        }
      }
      
      // Clear local wishlist after merging
      localStorage.removeItem('wishlist');
      
      // Reload the wishlist
      await loadWishlist();
      
    } catch (err) {
      console.error('Error merging wishlists:', err);
    }
  }, [isAuthenticated, loadWishlist]);

  // Effect to merge wishlists when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      mergeWishlistsOnLogin();
    }
  }, [isAuthenticated, mergeWishlistsOnLogin]);

  // Clear wishlist (mainly for logout)
  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    if (!isAuthenticated) {
      localStorage.removeItem('wishlist');
    }
  }, [isAuthenticated]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlistItem,
        loadWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext; 