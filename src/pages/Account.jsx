import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, TextField, Button, Typography, Box, Alert, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const Account = () => {
  const [formData, setFormData] = useState({
    accountInfo: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    landmark: "",
    altPhone: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (section) => {
    try {
      const response = await fetch(`https://evox.com/auth/${section}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(`${section.replace(/_/g, " ")} updated successfully!`);
        setError("");
      } else {
        setError(data?.message || `Failed to update ${section.replace(/_/g, " ")}`);
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        px: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ width: "100%", maxWidth: 900 }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          textAlign="center"
          gutterBottom
          sx={{ mb: 3 }}
        >
          My Account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Edit Account Information Section */}
        <Accordion sx={{ mb: 2, borderRadius: 3, boxShadow: 5, background: "#fff" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">1. Edit Your Account Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              label="Full Name"
              name="accountInfo"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="error"
              onClick={() => handleSubmit("accountInfo")}
              sx={{ mt: 2, width: "100%" }}
            >
              Update Info
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* Change Password Section */}
        <Accordion sx={{ mb: 2, borderRadius: 3, boxShadow: 5, background: "#fff" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">2. Change Your Password</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type="password"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit("password")}
              sx={{ mt: 2, width: "100%" }}
            >
              Change Password
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* Modify Address Section */}
        <Accordion sx={{ borderRadius: 3, boxShadow: 5, background: "#fff" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">3. Modify Your Address Book Entries</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="address"
                  variant="outlined"
                  margin="normal"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  variant="outlined"
                  margin="normal"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  variant="outlined"
                  margin="normal"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  name="zip"
                  variant="outlined"
                  margin="normal"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  variant="outlined"
                  margin="normal"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Landmark"
                  name="landmark"
                  variant="outlined"
                  margin="normal"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Alternate Phone Number"
                  name="altPhone"
                  variant="outlined"
                  margin="normal"
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleSubmit("address")}
              sx={{ mt: 2, width: "100%" }}
            >
              Update Address
            </Button>
          </AccordionDetails>
        </Accordion>
      </motion.div>
    </Box>
  );
};

export default Account;
