import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import ShopPage from './pages/Shop/ShopPage';
import ProductDetails from './pages/Shop/ProductDetails';
import CategoryPage from './pages/Shop/CategoryPage';
import SearchResults from './pages/Shop/SearchResults';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Cart/CheckoutPage';
import OrderConfirmation from './pages/Orders/OrderConfirmation';
import OrderDetails from './pages/Orders/OrderDetails';
import WishlistPage from './pages/Shop/WishlistPage';
import Account from './pages/Account';
import AddressBook from './pages/User/AddressBook';
import OrderHistory from './pages/User/OrderHistory';
import ProfileSettings from './pages/User/ProfileSettings';
import ProtectedRoute from './components/auth/ProtectedRoute';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
// import { HelmetProvider } from 'react-helmet-async';

// Create placeholder pages for now
const NotFoundPage = () => <div>404 - Page Not Found</div>;

const App = () => {
  return (
    // <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <UserProvider>
            <NotificationProvider>
              <ProductProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Router>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/reset-password" element={<ResetPassword />} />
                          
                          <Route path="/shop" element={<ShopPage />} />
                          <Route path="/category/:categoryId" element={<CategoryPage />} />
                          <Route path="/products/:id" element={<ProductDetails />} />
                          <Route path="/search" element={<SearchResults />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/about" element={<AboutPage />} />

                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={
                            <ProtectedRoute>
                              <CheckoutPage />
                            </ProtectedRoute>
                          } />
                          <Route path="/order-confirmation/:orderId" element={
                            <ProtectedRoute>
                              <OrderConfirmation />
                            </ProtectedRoute>
                          } />
                          
                          <Route path="/account" element={
                            <ProtectedRoute>
                              <Account />
                            </ProtectedRoute>
                          } />
                          <Route path="/account/addresses" element={
                            <ProtectedRoute>
                              <AddressBook />
                            </ProtectedRoute>
                          } />
                          <Route path="/account/orders" element={
                            <ProtectedRoute>
                              <OrderHistory />
                            </ProtectedRoute>
                          } />
                          <Route path="/account/orders/:orderId" element={
                            <ProtectedRoute>
                              <OrderDetails />
                            </ProtectedRoute>
                          } />
                          <Route path="/account/settings" element={
                            <ProtectedRoute>
                              <ProfileSettings />
                            </ProtectedRoute>
                          } />
                          <Route path="/wishlist" element={
                            <ProtectedRoute>
                              <WishlistPage />
                            </ProtectedRoute>
                          } />
                          <Route path="/blog" element={<BlogPage />} />
                          <Route path="/blog/:slug" element={<BlogPostPage />} />
                          
                          <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                      </Layout>
                    </Router>
                  </WishlistProvider>
                </CartProvider>
              </ProductProvider>
            </NotificationProvider>
          </UserProvider>
        </ErrorBoundary>
      </ThemeProvider>
    // </HelmetProvider>
  );
};

export default App;
