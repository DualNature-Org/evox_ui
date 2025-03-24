import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * A reusable empty state component that shows when there's no data to display
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.title - Title text
 * @param {string} props.description - Description text
 * @param {string} props.actionText - Text for the action button
 * @param {string} props.actionLink - Link for the action button
 * @param {Function} props.actionHandler - Click handler for the action button (alternative to actionLink)
 */
const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  actionLink,
  actionHandler,
  sx = {}
}) => {
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={0}
      sx={{ 
        textAlign: 'center', 
        py: 6, 
        px: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        ...sx
      }}
    >
      <Box sx={{ mb: 3, color: 'text.secondary' }}>
        {icon}
      </Box>
      
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}
      >
        {description}
      </Typography>
      
      {(actionText && (actionLink || actionHandler)) && (
        <Button
          variant="contained"
          color="primary"
          component={actionLink ? RouterLink : 'button'}
          to={actionLink}
          onClick={actionHandler}
          size="large"
        >
          {actionText}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState; 