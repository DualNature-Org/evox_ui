import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import productService from '../services/productService';
import { useNotification } from './NotificationContext';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const initialFetchDone = useRef(false);
  
  const { addNotification } = useNotification();

  // Load categories on initial render
  useEffect(() => {
    loadCategories();
  }, []);

  // Load categories
  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.getCategories();
      console.log('Categories data received in context:', data);
      
      // Ensure we're setting an array
      setCategories(Array.isArray(data) ? data : []);
      
      if (!data || data.length === 0) {
        console.warn('No categories found');
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
      addNotification('Failed to load categories', 'error');
      // Set empty array as fallback
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load featured products
  const loadFeaturedProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.getProducts({ featured: true });
      setFeaturedProducts(data || []);
      return data;
    } catch (err) {
      console.error('Failed to load featured products:', err);
      setError('Failed to load featured products');
      addNotification('Failed to load featured products', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  // Load new arrivals
  const loadNewArrivals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.getProducts({ sort: 'newest' });
      setNewArrivals(data || []);
      return data;
    } catch (err) {
      console.error('Failed to load new arrivals:', err);
      setError('Failed to load new arrivals');
      addNotification('Failed to load new arrivals', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  // Load best sellers
  const loadBestSellers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.getProducts({ sort: 'popularity' });
      setBestSellers(data || []);
      return data;
    } catch (err) {
      console.error('Failed to load best sellers:', err);
      setError('Failed to load best sellers');
      addNotification('Failed to load best sellers', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  // Load all products
  const loadProducts = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This should match what our productService returns 
      const response = await productService.getProducts(params, true);
      
      // Check if response has the right format
      if (response && response.results) {
        // Set products state with the results array
        setProducts(response.results);
        return response; // Return full response for pagination
      } else {
        console.error('Unexpected product response format:', response);
        setProducts([]);
        setError('Failed to load products. Unexpected data format.');
        return null;
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setProducts([]);
      setError('Failed to load products. Please try again later.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load product by ID
  const loadProduct = useCallback(async (productId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await productService.getProductById(productId);
    } catch (err) {
      console.error(`Failed to load product ${productId}:`, err);
      setError(`Failed to load product ${productId}`);
      addNotification(`Failed to load product details`, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  // Load products by category
  const loadProductsByCategory = useCallback(async (categoryId, filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.getProductsByCategory(categoryId, filters);
      setProducts(data || []);
      return data;
    } catch (err) {
      console.error(`Failed to load products for category ${categoryId}:`, err);
      setError(`Failed to load products for this category`);
      addNotification(`Failed to load category products`, 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  // Search products
  const searchProducts = useCallback(async (query, params = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const searchResults = await productService.searchProducts(query, params);
      return searchResults;
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Failed to search products. Please try again later.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data load - only fetch once when component mounts
  useEffect(() => {
    if (!initialFetchDone.current) {
      setIsLoading(true);
      Promise.all([
        loadCategories(),
        loadFeaturedProducts()
      ]).finally(() => {
        setIsLoading(false);
        initialFetchDone.current = true;
      });
    }
  }, [loadCategories, loadFeaturedProducts]);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    products,
    categories,
    featuredProducts,
    newArrivals,
    bestSellers,
    isLoading,
    error,
    loadCategories,
    loadProducts,
    loadProduct,
    loadProductsByCategory,
    searchProducts,
    loadFeaturedProducts,
    loadNewArrivals,
    loadBestSellers
  }), [products, categories, featuredProducts, newArrivals, bestSellers, isLoading, error, loadCategories, loadProducts, loadProduct, loadProductsByCategory, searchProducts, loadFeaturedProducts, loadNewArrivals, loadBestSellers]);

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext; 