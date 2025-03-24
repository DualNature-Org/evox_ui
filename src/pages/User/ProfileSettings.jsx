import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tab,
  Tabs
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { useUser } from '../../contexts/UserContext';
import { useNotification } from '../../contexts/NotificationContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProfileSettings() {
  const { user, updateUserProfile } = useUser();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone_number: '',
    date_of_birth: ''
  });
  
  // Password change form state
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Form validation
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profileData = await userService.getUserProfile();
      setProfileData({
        first_name: profileData.user?.first_name || '',
        last_name: profileData.user?.last_name || '',
        email: profileData.user?.email || '',
        username: profileData.user?.username || '',
        phone_number: profileData.phone_number || '',
        date_of_birth: profileData.date_of_birth || ''
      });
      
      if (profileData.profile_picture) {
        setPreviewUrl(profileData.profile_picture);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError('Failed to load profile data. Please try again.');
      addNotification('Failed to load profile data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateProfileForm = () => {
    const errors = {};
    if (!profileData.first_name) errors.first_name = 'First name is required';
    if (!profileData.last_name) errors.last_name = 'Last name is required';
    if (!profileData.email) errors.email = 'Email is required';
    if (!profileData.username) errors.username = 'Username is required';
    
    // Email validation
    if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.old_password) errors.old_password = 'Current password is required';
    if (!passwordData.new_password) errors.new_password = 'New password is required';
    if (!passwordData.confirm_password) errors.confirm_password = 'Please confirm your new password';
    
    // Password strength
    if (passwordData.new_password && passwordData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters long';
    }
    
    // Password match
    if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsSaving(true);
    try {
      // Create form data for file upload
      const formData = new FormData();
      
      // Add profile data
      Object.entries(profileData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      
      // Add profile picture if changed
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      
      const updatedProfile = await userService.updateUserProfile(formData);
      
      // Update context with new user info
      updateUserProfile({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email
      });
      
      addNotification('Profile updated successfully', 'success');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
      addNotification('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsSaving(true);
    try {
      await authService.changePassword(passwordData);
      
      // Reset password form
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      addNotification('Password changed successfully', 'success');
    } catch (err) {
      console.error('Failed to change password:', err);
      
      // Handle specific error messages from backend
      if (err.response?.data?.old_password) {
        setPasswordErrors(prev => ({
          ...prev,
          old_password: err.response.data.old_password
        }));
      } else {
        setError('Failed to change password. Please try again.');
        addNotification('Failed to change password', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Settings
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile settings tabs">
              <Tab label="Profile Information" />
              <Tab label="Change Password" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleProfileSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Avatar
                      src={previewUrl}
                      alt={`${profileData.first_name} ${profileData.last_name}`}
                      sx={{ width: 150, height: 150 }}
                    />
                    <input
                      accept="image/*"
                      id="profile-picture-input"
                      type="file"
                      onChange={handleProfilePictureChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="profile-picture-input">
                      <IconButton
                        aria-label="upload picture"
                        component="span"
                        sx={{
                          position: 'absolute',
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'primary.dark' }
                        }}
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    </label>
                  </Box>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Click on the camera icon to upload a new profile picture
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleProfileChange}
                        error={!!profileErrors.first_name}
                        helperText={profileErrors.first_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleProfileChange}
                        error={!!profileErrors.last_name}
                        helperText={profileErrors.last_name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        error={!!profileErrors.email}
                        helperText={profileErrors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        error={!!profileErrors.username}
                        helperText={profileErrors.username}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone_number"
                        value={profileData.phone_number}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        name="date_of_birth"
                        type="date"
                        value={profileData.date_of_birth}
                        onChange={handleProfileChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="old_password"
                    type="password"
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.old_password}
                    helperText={passwordErrors.old_password}
                  />
                </Grid>
                <Grid item xs={12} md={6} />
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.new_password}
                    helperText={passwordErrors.new_password}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirm_password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.confirm_password}
                    helperText={passwordErrors.confirm_password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={isSaving ? <CircularProgress size={20} /> : <LockIcon />}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Updating...' : 'Change Password'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
        </Paper>
      )}
    </Container>
  );
} 