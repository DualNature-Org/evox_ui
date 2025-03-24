import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

/**
 * A countdown timer component that displays days, hours, minutes, and seconds
 * 
 * @param {Object} props
 * @param {Date|string|number} props.endTime - The end time for the countdown (Date object, ISO string, or timestamp)
 * @param {string} props.component - Optional component to show (days, hours, minutes, seconds)
 */
const CountdownTimer = ({ endTime, component = null }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  function calculateTimeLeft() {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft = {};
    
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    return timeLeft;
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearTimeout(timer);
  });
  
  // If we're only showing one component
  if (component && timeLeft[component] !== undefined) {
    return String(timeLeft[component]).padStart(2, '0');
  }
  
  // If there's no time left
  if (!timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) {
    return <Typography>Offer has ended</Typography>;
  }
  
  // Otherwise show the full countdown
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography variant="body1" component="span">
        {String(timeLeft.days || 0).padStart(2, '0')}
      </Typography>
      <Typography variant="body1" component="span" color="text.secondary">d</Typography>
      
      <Typography variant="body1" component="span" sx={{ ml: 1 }}>:</Typography>
      
      <Typography variant="body1" component="span" sx={{ ml: 1 }}>
        {String(timeLeft.hours || 0).padStart(2, '0')}
      </Typography>
      <Typography variant="body1" component="span" color="text.secondary">h</Typography>
      
      <Typography variant="body1" component="span" sx={{ ml: 1 }}>:</Typography>
      
      <Typography variant="body1" component="span" sx={{ ml: 1 }}>
        {String(timeLeft.minutes || 0).padStart(2, '0')}
      </Typography>
      <Typography variant="body1" component="span" color="text.secondary">m</Typography>
      
      <Typography variant="body1" component="span" sx={{ ml: 1 }}>:</Typography>
      
      <Typography variant="body1" component="span" sx={{ ml: 1 }}>
        {String(timeLeft.seconds || 0).padStart(2, '0')}
      </Typography>
      <Typography variant="body1" component="span" color="text.secondary">s</Typography>
    </Box>
  );
};

export default CountdownTimer; 