import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import LoginImage from "../assets/login.png"; // Update with actual path

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submission
  const handleSubmit = async () => {
    try {
      const response = await fetch("https://evox.com/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Login successful! Redirecting...");
        setError("");
      } else {
        setError(data?.message || "Login failed. Please check your credentials.");
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
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        px: 2,
        background: "linear-gradient(to right, #ff9a9e, #fad0c4, #fbc2eb)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 6,
          width: "100%",
          maxWidth: 1200,
        }}
      >
        {/* Left Side - Image Section (Hidden on Small Screens) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ flex: 1, display: "flex", justifyContent: "center" }}
        >
          <Box
            component="img"
            src={LoginImage}
            alt="Login"
            sx={{
              width: "100%",
              maxWidth: 500,
              borderRadius: 3,
              display: { xs: "none", md: "block" },
            }}
          />
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ flex: 1, width: "100%" }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 450,
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              boxShadow: 10,
              backgroundColor: "#fff",
            }}
          >
            <CardContent>
              <Typography
                variant="h3"
                fontWeight={700}
                textAlign="center"
                gutterBottom
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  color: "#FF6F61",
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                color="text.secondary"
                mb={3}
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                }}
              >
                Enter your credentials to continue
              </Typography>

              {/* Error/Success Alerts */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  margin="normal"
                  onChange={handleChange}
                  InputProps={{
                    sx: { fontSize: "1rem" },
                  }}
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  margin="normal"
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ fontSize: "1rem" }}
                />
              </motion.div>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    mt: 3,
                    py: 1.8,
                    fontSize: "1rem",
                    borderRadius: 3,
                    fontWeight: 700,
                    background:
                      "linear-gradient(90deg, #ff6f61, #ff9a8b, #ff7eb3)",
                    "&:hover": {
                      background: "#ff3d71",
                    },
                  }}
                >
                  Login
                </Button>
              </motion.div>

              {/* Sign Up Link */}
              <Typography
                textAlign="center"
                mt={3}
                fontSize="1rem"
                color="text.secondary"
              >
                Don’t have an account?{" "}
                <Typography
                  component="span"
                  color="primary"
                  sx={{
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign Up
                </Typography>
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Login;
