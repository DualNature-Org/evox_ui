import React from 'react';
import { IconButton, Tooltip, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import { useNotification } from '../../contexts/NotificationContext';

const ShareButtons = ({ title }) => {
  const { addNotification } = useNotification();
  const currentUrl = window.location.href;
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${currentUrl}`)}`
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        addNotification('Link copied to clipboard!', 'success');
      })
      .catch(err => {
        addNotification('Failed to copy link', 'error');
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Share on Facebook">
        <IconButton 
          color="primary" 
          aria-label="share on facebook"
          onClick={() => window.open(shareLinks.facebook, '_blank')}
        >
          <FacebookIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Share on Twitter">
        <IconButton 
          color="primary" 
          aria-label="share on twitter"
          onClick={() => window.open(shareLinks.twitter, '_blank')}
        >
          <TwitterIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Share on LinkedIn">
        <IconButton 
          color="primary" 
          aria-label="share on linkedin"
          onClick={() => window.open(shareLinks.linkedin, '_blank')}
        >
          <LinkedInIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Share via Email">
        <IconButton 
          color="primary" 
          aria-label="share via email"
          onClick={() => window.open(shareLinks.email)}
        >
          <EmailIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Copy Link">
        <IconButton 
          color="primary" 
          aria-label="copy link"
          onClick={copyToClipboard}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default ShareButtons; 