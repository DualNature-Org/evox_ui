import React, { useState, useEffect } from "react";
import { Popover, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Favorite as WishlistIcon,
  Person as UserIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { productService } from "../../services/productService";
import { useCart } from "../../contexts/CartContext";
import MiniCart from "../cart/MiniCart";

// Custom styled components
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

const TopBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: "8px 0",
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.8rem",
  color: theme.palette.primary.main,
  letterSpacing: "-0.5px",
  textDecoration: "none",
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: "0 4px",
  color: theme.palette.text.primary,
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
  },
}));

const Header = () => {
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { itemCount } = useCart();

  // State for dropdown menus
  const [shopMenuEl, setShopMenuEl] = useState(null);
  const [pagesMenuEl, setPagesMenuEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const handleUserMenuOpen = (event) => setUserAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserAnchorEl(null);

  const [blogMenuEl, setBlogMenuEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // State for language and currency dropdowns
  const [languageMenuEl, setLanguageMenuEl] = useState(null);
  const [currencyMenuEl, setCurrencyMenuEl] = useState(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      handleSearchClose();
      navigate(`/shop/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Handle shopping menu
  const handleShopMenuOpen = (event) => setShopMenuEl(event.currentTarget);
  const handleShopMenuClose = () => setShopMenuEl(null);

  // Handle pages menu
  const handlePagesMenuOpen = (event) => setPagesMenuEl(event.currentTarget);
  const handlePagesMenuClose = () => setPagesMenuEl(null);

  // Handle blog menu
  const handleBlogMenuOpen = (event) => setBlogMenuEl(event.currentTarget);
  const handleBlogMenuClose = () => setBlogMenuEl(null);

  // Language and currency
  const handleLanguageMenuOpen = (event) => setLanguageMenuEl(event.currentTarget);
  const handleLanguageMenuClose = () => setLanguageMenuEl(null);

  const handleCurrencyMenuOpen = (event) => setCurrencyMenuEl(event.currentTarget);
  const handleCurrencyMenuClose = () => setCurrencyMenuEl(null);

  // Handle logout
  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate("/");
  };

  // Load categories for shop menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        setCategories(response.results || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  // Mobile drawer
  const toggleMobileDrawer = () => setMobileDrawerOpen(!mobileDrawerOpen);

  // Simplified navigation items (removed dropdown menus)
  const navItems = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Shop",
      path: "/shop",
    },
    {
      label: "About Us",
      path: "/about",
    },
    {
      label: "Contact",
      path: "/contact",
    },
    {
      label: "Blog",
      path: "/blog",
    },
  ];

  // Language options
  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
  ];

  // Currency options
  const currencies = [
    { code: "USD", label: "US Dollar" },
    { code: "EUR", label: "Euro" },
    { code: "GBP", label: "British Pound" },
    { code: "JPY", label: "Japanese Yen" },
  ];

  return (
    <>
      {/* Top bar */}
      <TopBar>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Language & Currency */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                color="inherit"
                endIcon={<ArrowDownIcon />}
                size="small"
                onClick={handleLanguageMenuOpen}
              >
                EN
              </Button>
              <Menu
                anchorEl={languageMenuEl}
                open={Boolean(languageMenuEl)}
                onClose={handleLanguageMenuClose}
              >
                {languages.map((language) => (
                  <MenuItem
                    key={language.code}
                    onClick={handleLanguageMenuClose}
                  >
                    {language.label}
                  </MenuItem>
                ))}
              </Menu>

              <Button
                color="inherit"
                endIcon={<ArrowDownIcon />}
                size="small"
                onClick={handleCurrencyMenuOpen}
              >
                USD
              </Button>
              <Menu
                anchorEl={currencyMenuEl}
                open={Boolean(currencyMenuEl)}
                onClose={handleCurrencyMenuClose}
              >
                {currencies.map((currency) => (
                  <MenuItem 
                    key={currency.code} 
                    onClick={handleCurrencyMenuClose}
                  >
                    {currency.label} ({currency.code})
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Typography variant="body2">Call Us 3965410</Typography>

            <Typography variant="body2" color="primary.main">
              Free delivery on order over €200.00
            </Typography>
          </Box>
        </Container>
      </TopBar>

      <AppBar position="static" color="default" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <RouterLink to="/" style={{ textDecoration: "none" }}>
              <Logo variant="h6" component="div">
                EVOX
              </Logo>
            </RouterLink>

            {/* Desktop Navigation - Simplified without dropdowns */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {navItems.map((item) => (
                  <NavButton
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                  >
                    {item.label}
                  </NavButton>
                ))}
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Search */}
              <IconButton
                color="inherit"
                aria-label="search"
                onClick={handleSearchOpen}
              >
                <SearchIcon />
              </IconButton>

              {/* Wishlist */}
              <IconButton
                component={RouterLink}
                to="/wishlist"
                color="inherit"
                aria-label="wishlist"
              >
                <WishlistIcon />
              </IconButton>

              {/* User Account */}
              {user ? (
                // Show user menu when logged in
                <>
                  <IconButton
                    color="inherit"
                    aria-label="account"
                    onClick={handleUserMenuOpen}
                  >
                    <UserIcon />
                  </IconButton>
                  <Menu
                    anchorEl={userAnchorEl}
                    open={Boolean(userAnchorEl)}
                    onClose={handleUserMenuClose}
                  >
                    <MenuItem 
                      component={RouterLink} 
                      to="/account/settings"
                      onClick={handleUserMenuClose}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem 
                      component={RouterLink} 
                      to="/account/orders"
                      onClick={handleUserMenuClose}
                    >
                      Orders
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                // Show login button when logged out
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  Login
                </Button>
              )}

              {/* Cart with MiniCart integration */}
              <MiniCart />
            </Box>

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileDrawer}
                sx={{ display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile navigation drawer - Update to match simplified navigation */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
        sx={{ zIndex: 1300 }}
      >
        <Box
          sx={{ width: 280 }}
          role="presentation"
        >
          <List>
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={toggleMobileDrawer}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))}

            {!user && (
              <ListItemButton
                component={RouterLink}
                to="/login"
                onClick={toggleMobileDrawer}
              >
                <ListItemText primary="Login / Register" />
              </ListItemButton>
            )}

            {user && (
              <>
                <ListItemButton
                  component={RouterLink}
                  to="/account/profile"
                  onClick={toggleMobileDrawer}
                >
                  <ListItemText primary="My Account" />
                </ListItemButton>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            )}

            {/* Cart link in mobile menu */}
            <ListItemButton
              component={RouterLink}
              to="/cart"
              onClick={toggleMobileDrawer}
            >
              <ListItemText primary="View Cart" />
              {itemCount > 0 && (
                <Badge badgeContent={itemCount} color="secondary">
                  <CartIcon />
                </Badge>
              )}
            </ListItemButton>

            {/* Add mobile drawer links for About and Contact */}
            <ListItemButton
              component={RouterLink}
              to="/about"
              onClick={toggleMobileDrawer}
            >
              <ListItemText primary="About Us" />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to="/contact"
              onClick={toggleMobileDrawer}
            >
              <ListItemText primary="Contact" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onClose={handleSearchClose} fullWidth maxWidth="sm">
        <DialogTitle>Search Products</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="search"
            label="Search for products..."
            type="text"
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSearchClose}>Cancel</Button>
          <Button onClick={handleSearchSubmit} variant="contained" color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
