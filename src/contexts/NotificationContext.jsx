import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    
    // Auto-remove after duration
    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      removeNotification,
      success: (message, duration) => addNotification(message, 'success', duration),
      error: (message, duration) => addNotification(message, 'error', duration),
      warning: (message, duration) => addNotification(message, 'warning', duration),
      info: (message, duration) => addNotification(message, 'info', duration)
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
