import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Custom hook for product-related actions (add to cart, wishlist, etc.)
 */
const useProductActions = () => {
  const navigate = useNavigate();
  const { user } = useUser();  // Just get the user object directly
  const { addToCart } = useCart();
  const { 
    wishlistItems, 
    toggleWishlistItem 
  } = useWishlist();
  const { addNotification } = useNotification();

  // Handle adding to cart
  const handleAddToCart = useCallback(async (product, quantity = 1) => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
      addNotification(`${product.name} added to your cart!`, 'success');
    } catch (error) {
      addNotification(`Error: ${error.message || 'Failed to add item to cart'}`, 'error');
    }
  }, [addToCart, addNotification]);

  // Check if a product is in the wishlist
  const isProductInWishlist = useCallback((productId) => {
    if (!productId) return false;
    
    return wishlistItems.some(item => 
      (item.product_id && item.product_id === parseInt(productId)) || 
      (item.product && item.product.id === parseInt(productId))
    );
  }, [wishlistItems]);
  
  // Handle adding to wishlist - simplified authentication check
  const handleToggleWishlist = useCallback((product) => {
    if (!product) return;
    
    try {
      toggleWishlistItem(product);
      
      const isInList = isProductInWishlist(product.id);
      const message = isInList
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`;
      
      addNotification(message, 'success');
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      addNotification("Failed to update wishlist", "error");
    }
  }, [toggleWishlistItem, isProductInWishlist, addNotification]);

  // Share product via share API or fallback to copy link
  const handleShareProduct = useCallback((product) => {
    const shareUrl = `${window.location.origin}/products/${product.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.short_description || `Check out this ${product.name}`,
        url: shareUrl,
      })
      .then(() => addNotification('Product shared successfully!', 'success'))
      .catch((error) => {
        console.error('Error sharing:', error);
        // Fallback to copying link on share error
        navigator.clipboard.writeText(shareUrl);
        addNotification('Link copied to clipboard!', 'info');
      });
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(shareUrl);
      addNotification('Link copied to clipboard!', 'info');
    }
  }, [addNotification]);

  return {
    handleAddToCart,
    handleToggleWishlist,
    handleShareProduct,
    isProductInWishlist
  };
};

export default useProductActions; 