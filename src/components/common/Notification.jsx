import React from 'react';
import { 
  Snackbar, 
  Alert, 
  Stack 
} from '@mui/material';
import { useNotification } from '../../contexts/NotificationContext';

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  const handleClose = (id) => {
    removeNotification(id);
  };

  return (
    <Stack spacing={2} sx={{ 
      position: 'fixed', 
      bottom: 24, 
      right: 24, 
      zIndex: 2000,
      maxWidth: { xs: '80%', sm: 400 }
    }}>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClose={() => handleClose(notification.id)}
          sx={{ position: 'static', mb: 1 }}
        >
          <Alert 
            onClose={() => handleClose(notification.id)} 
            severity={notification.type} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default Notification;
