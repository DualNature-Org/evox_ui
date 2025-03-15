import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';

// Create placeholder pages for now
const ShopPage = () => <div>Shop Page</div>;
const CollectionPage = () => <div>Collection Page</div>;
const ContactPage = () => <div>Contact Page</div>;
const NotFoundPage = () => <div>404 - Page Not Found</div>;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <NotificationProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop/*" element={<ShopPage />} />
                <Route path="/collection" element={<CollectionPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </Router>
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
