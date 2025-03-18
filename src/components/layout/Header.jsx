import React, { useState } from "react";
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
} from "@mui/icons-material";
import { Link, Link as RouterLink } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

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
  const { user } = useUser();

  // State for dropdown menus
  const [shopMenuEl, setShopMenuEl] = useState(null);
  const [pagesMenuEl, setPagesMenuEl] = useState(null);
  const handleUserMenuOpen = (event) => setUserAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserAnchorEl(null);

  const [blogMenuEl, setBlogMenuEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // State for search popup
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  // Menu handlers
  const handleShopMenuOpen = (event) => setShopMenuEl(event.currentTarget);
  const handleShopMenuClose = () => setShopMenuEl(null);

  const handlePagesMenuOpen = (event) => setPagesMenuEl(event.currentTarget);
  const handlePagesMenuClose = () => setPagesMenuEl(null);

  const handleBlogMenuOpen = (event) => setBlogMenuEl(event.currentTarget);
  const handleBlogMenuClose = () => setBlogMenuEl(null);

  const toggleMobileDrawer = () => setMobileDrawerOpen(!mobileDrawerOpen);

  // Navigation items
  const navItems = [
    {
      label: "Home",
      path: "/",
      hasMenu: false,
    },
    {
      label: "Shop",
      path: "/shop",
      hasMenu: true,
      menuItems: [
        { label: "Automatic Wheelchairs", path: "/shop/automatic" },
        { label: "Manual Wheelchairs", path: "/shop/manual" },
        { label: "Accessories", path: "/shop/accessories" },
        { label: "New Arrivals", path: "/shop/new-arrivals" },
      ],
      menuHandler: {
        open: handleShopMenuOpen,
        close: handleShopMenuClose,
        element: shopMenuEl,
      },
    },
    {
      label: "Collection",
      path: "/collection",
      hasMenu: false,
    },
    {
      label: "Pages",
      path: "#",
      hasMenu: true,
      menuItems: [
        { label: "About Us", path: "/about" },
        { label: "FAQ", path: "/faq" },
        { label: "Contact", path: "/contact" },
      ],
      menuHandler: {
        open: handlePagesMenuOpen,
        close: handlePagesMenuClose,
        element: pagesMenuEl,
      },
    },
    {
      label: "Blog",
      path: "/blog",
      hasMenu: true,
      menuItems: [
        { label: "All Posts", path: "/blog/all" },
        { label: "Wheelchair Tips", path: "/blog/tips" },
        { label: "Accessibility", path: "/blog/accessibility" },
      ],
      menuHandler: {
        open: handleBlogMenuOpen,
        close: handleBlogMenuClose,
        element: blogMenuEl,
      },
    },
    {
      label: "Contact Us",
      path: "/contact",
      hasMenu: false,
    },
  ];

  return (
    <>
      <TopBar>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {isMobile ? "EN" : "English"}
            </Typography>
            <Typography variant="body2">{isMobile ? "€" : "EUR"}</Typography>
          </Box>

          <Typography variant="body2">Call Us 3965410</Typography>

          <Typography variant="body2" color="primary.main">
            Free delivery on order over €200.00
          </Typography>
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

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.hasMenu ? (
                      <>
                        <NavButton
                          onClick={item.menuHandler.open}
                          endIcon={<ArrowDownIcon />}
                        >
                          {item.label}
                        </NavButton>
                        <Menu
                          anchorEl={item.menuHandler.element}
                          open={Boolean(item.menuHandler.element)}
                          onClose={item.menuHandler.close}
                        >
                          {item.menuItems.map((menuItem) => (
                            <MenuItem
                              key={menuItem.label}
                              onClick={item.menuHandler.close}
                              component={RouterLink}
                              to={menuItem.path}
                            >
                              {menuItem.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </>
                    ) : (
                      <NavButton component={RouterLink} to={item.path}>
                        {item.label}
                      </NavButton>
                    )}
                  </div>
                ))}
              </Box>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileDrawer}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Icons for search, cart, wishlist, account */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="inherit" aria-label="search" onClick={handleSearchOpen}>
                <SearchIcon />
              </IconButton>

              <IconButton color="inherit" aria-label="account">
                <IconButton
                  color="inherit"
                  aria-label="account"
                  onClick={handleUserMenuOpen}
                >
                  <UserIcon />
                </IconButton>
                <Popover
                  open={Boolean(userAnchorEl)}
                  anchorEl={userAnchorEl}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                  disableScrollLock
                >
                  <Box sx={{ p: 1, minWidth: 150 }}>
                    <MenuItem
                      component={RouterLink}
                      to="/login"
                      onClick={handleUserMenuClose}
                    >
                      Login
                    </MenuItem>
                    <MenuItem
                      component={RouterLink}
                      to="/register"
                      onClick={handleUserMenuClose}
                    >
                      Register
                    </MenuItem>
                    <MenuItem
                      component={RouterLink}
                      to="/profile"
                      onClick={handleUserMenuClose}
                    >
                      My Profile
                    </MenuItem>
                  </Box>
                </Popover>
              </IconButton>

              <IconButton color="inherit" aria-label="wishlist">
                <StyledBadge badgeContent={0} color="error">
                  <Link to='/wishlist'>
                  <WishlistIcon />
                  </Link>
                </StyledBadge>
              </IconButton>

              <IconButton color="inherit" aria-label="cart">
                <StyledBadge badgeContent={0} color="error">
                  <CartIcon />
                </StyledBadge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                <ListItem disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to={item.path}
                    onClick={toggleMobileDrawer}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
                {item.hasMenu && (
                  <List disablePadding sx={{ pl: 2 }}>
                    {item.menuItems.map((subItem) => (
                      <ListItem key={subItem.label} disablePadding>
                        <ListItemButton
                          component={RouterLink}
                          to={subItem.path}
                          onClick={toggleMobileDrawer}
                          sx={{ py: 0.5 }}
                        >
                          <ListItemText
                            primary={subItem.label}
                            primaryTypographyProps={{ fontSize: "0.9rem" }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Search Popup */}
      <Dialog open={searchOpen} onClose={handleSearchClose} fullWidth maxWidth="sm">
        <DialogTitle>Search</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="search"
            label="Search for products"
            type="text"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSearchClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => alert(`Searching for: ${searchQuery}`)} color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
