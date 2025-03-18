import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import img from "../assets/p1.png";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Electric Wheelchair",
      price: "€350.00",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Manual Wheelchair",
      price: "€250.00",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Wheelchair Cushion",
      price: "€50.00",
      image: "https://via.placeholder.com/150",
    },
  ]);

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const moveToCart = (id) => {
    alert(`Moved item ${id} to cart!`);
    removeItem(id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 5,
        gap: 5,
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f5f7fa, #e2eafc)",
      }}
    >
      

      {/* Wishlist Items Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          fontWeight={700}
          sx={{
            mb: 4,
            background: "linear-gradient(90deg, #FF6F61, #FF9A8B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "2rem", md: "1.7rem" },
          }}
        >
          My Wishlist 💖
        </Typography>

        {wishlistItems.length > 0 ? (
          <Grid container spacing={3}>
            {wishlistItems.map((item) => (
              <Grid item xs={12} sm={6} key={item.id}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      maxWidth: 340,
                      mx: "auto",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
                      transition: "0.3s",
                      "&:hover": {
                        boxShadow: "0px 15px 40px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={item.image}
                      alt={item.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{
                          color: "#333",
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        fontWeight="500"
                        sx={{
                          color: "#555",
                        }}
                      >
                        Price: {item.price}
                      </Typography>
                    </CardContent>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 2,
                        background: "#f5f5f5",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => moveToCart(item.id)}
                        sx={{
                          textTransform: "none",
                          borderRadius: "10px",
                        }}
                      >
                        Move to Cart
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => removeItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              mt: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <FavoriteBorderIcon
                sx={{
                  fontSize: 100,
                  color: "#FF6F61",
                }}
              />
            </motion.div>
            <Typography
              variant="h5"
              color="text.secondary"
              mt={2}
              fontWeight="500"
            >
              Your wishlist is feeling empty! Add some love ❤️
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Wishlist;
