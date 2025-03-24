import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import cartService from '../services/cartService';
import { useNotification } from './NotificationContext';
import { useUser } from './UserContext';
import { clearApiCache } from '../services/api';
import couponService from '../services/couponService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const { addNotification } = useNotification();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const fetchTimeoutRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const [isCartClearing, setIsCartClearing] = useState(false);
  
  // Use useCallback to prevent recreating this function on each render
  const fetchCart = useCallback(async (force = false) => {
    // Don't fetch if we're already loading or user is not logged in
    if (isLoading || !user) return;
    
    // Implement debouncing - don't fetch if we've fetched recently (within 2 seconds)
    // unless force is true
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 2000) {
      // If we're not forcing and fetched recently, schedule a deferred fetch and return
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = setTimeout(() => fetchCart(true), 2000);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const cartData = await cartService.getCart();
      lastFetchTimeRef.current = Date.now();
      setCart(cartData);
      setCartCount(cartData?.items?.length || 0);
      
      // If there's a coupon on the cart, save it
      if (cartData?.coupon) {
        setCoupon(cartData.coupon);
      } else {
        setCoupon(null);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, user]);
  
  // Only fetch cart when user changes (login/logout)
  useEffect(() => {
    if (user) {
      fetchCart(true);
    } else {
      // Clear cart when user logs out
      setCart(null);
      setCartCount(0);
      setCoupon(null);
    }
    
    return () => {
      // Clear any pending fetch timeout on unmount
      clearTimeout(fetchTimeoutRef.current);
    };
  }, [user, fetchCart]);
  
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      addNotification('Please log in to add items to your cart', 'warning');
      return false;
    }
    
    setIsLoading(true);
    try {
      // Clear the cart cache to ensure fresh data
      clearApiCache('/cart/');
      
      const result = await cartService.addToCart(productId, quantity);
      addNotification('Item added to cart', 'success');
      
      // Update the cart immediately with the response
      // or fetch fresh data if the response doesn't include the updated cart
      if (result && result.items) {
        setCart(result);
        setCartCount(result.items.length || 0);
      } else {
        await fetchCart(true);
      }
      
      return true;
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      addNotification('Failed to add item to cart', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateCartItem = async (itemId, quantity) => {
    if (!user) {
      addNotification('Please log in to update your cart', 'warning');
      return false;
    }
    
    setIsLoading(true);
    try {
      // Clear the cache first to ensure fresh data
      clearApiCache('/cart/');
      
      const result = await cartService.updateCartItem(itemId, quantity);
      
      // Update the cart immediately with the response
      // or fetch fresh data if the response doesn't include the updated cart
      if (result && result.items) {
        setCart(result);
        setCartCount(result.items.length || 0);
      } else {
        await fetchCart(true);
      }
      
      return true;
    } catch (err) {
      console.error('Failed to update cart item:', err);
      addNotification('Failed to update cart item', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeFromCart = async (itemId) => {
    if (!user) {
      addNotification('Please log in to remove items from your cart', 'warning');
      return false;
    }
    
    setIsLoading(true);
    try {
      // Clear the cache first to ensure fresh data
      clearApiCache('/cart/');
      
      const result = await cartService.removeFromCart(itemId);
      addNotification('Item removed from cart', 'success');
      
      // Update the cart immediately with the response
      // or fetch fresh data if the response doesn't include the updated cart
      if (result && result.items) {
        setCart(result);
        setCartCount(result.items.length || 0);
      } else {
        await fetchCart(true);
      }
      
      return true;
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      addNotification('Failed to remove item from cart', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearCart = useCallback(async () => {
    if (!user || isCartClearing) return;
    
    setIsCartClearing(true);
    try {
      // Clear the cache first to ensure fresh data
      clearApiCache('/cart/');
      
      await cartService.clearCart();
      addNotification('Cart cleared', 'success');
      
      // Update local state
      setCart({ items: [], total: 0, subtotal: 0, tax: 0, shipping: 0 });
      setCartCount(0);
      
      return true;
    } catch (err) {
      console.error('Failed to clear cart:', err);
      addNotification('Failed to clear cart', 'error');
      return false;
    } finally {
      setIsCartClearing(false);
    }
  }, [user, isCartClearing, addNotification]);
  
  // Add these methods for coupon handling
  const applyCoupon = async (couponCode) => {
    setIsLoading(true);
    try {
      // First verify if the coupon is valid
      const couponData = await couponService.verifyCouponCode(couponCode);
      
      // Then apply it to the cart
      const response = await cartService.applyCoupon(couponCode);
      
      // Update cart state with new totals
      setCartDiscount(response.discount || 0);
      setCartTotal(response.total || 0);
      setCoupon(couponData);
      
      return response;
    } catch (error) {
      setError(error.message || 'Failed to apply coupon');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeCoupon = async () => {
    setIsLoading(true);
    try {
      const response = await cartService.removeCoupon();
      
      // Update cart state with new totals
      setCartDiscount(0);
      setCartTotal(response.total || 0);
      setCoupon(null);
      
      return response;
    } catch (error) {
      setError(error.message || 'Failed to remove coupon');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Extract cart values for easy consumption
  const cartItems = cart?.items || [];
  const cartTotal = cart?.total || 0;
  const cartSubtotal = cart?.subtotal || 0;
  const cartTax = cart?.tax || 0;
  const cartShipping = cart?.shipping || 0;
  const cartDiscount = cart?.discount || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        cartTotal,
        cartSubtotal,
        cartTax,
        cartShipping,
        cartDiscount,
        coupon,
        isLoading,
        error,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 