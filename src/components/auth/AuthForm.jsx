import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';

const AuthForm = ({
  title,
  subtitle,
  children,
  onSubmit,
  submitText = 'Submit',
  error = '',
  success = '',
  isLoading = false,
  image = null,
  extraContent = null
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: '100%',
          maxWidth: 800,
          overflow: 'hidden',
          boxShadow: (theme) => theme.shadows[10],
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left side - Form */}
          <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
            <CardContent>
              <Typography
                component={motion.h1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                variant="h4"
                fontWeight="bold"
                gutterBottom
              >
                {title}
              </Typography>
              
              {subtitle && (
                <Typography
                  component={motion.p}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {subtitle}
                </Typography>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                  </Alert>
                </motion.div>
              )}

              <Box component="form" onSubmit={onSubmit} noValidate>
                {/* Form fields passed as children */}
                {children}

                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 3, mb: 2, py: 1.2 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    submitText
                  )}
                </Button>
              </Box>

              {extraContent}
            </CardContent>
          </Box>

          {/* Right side - Image */}
          {image && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{
                flex: 1,
                display: { xs: 'none', md: 'block' },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Paper
                sx={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '100%',
                  minHeight: 400,
                }}
              />
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default AuthForm; 