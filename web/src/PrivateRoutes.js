import { useState, React } from "react";
import { Outlet, useNavigate, Navigate } from 'react-router-dom'
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListItemButton from '@mui/material/ListItemButton';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';

import {
  Typography,
  Toolbar,
  AppBar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import { Home, Info, Mail } from "@material-ui/icons";

const drawerWidth = "240";

export function PrivateRoutes(props) {
  const navigate = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { window } = props;

  const isAuthenticated = !!(user && user.expirationTime && new Date().getTime() < user.expirationTime);

  if (!isAuthenticated) {
    localStorage.removeItem('user');
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/')
  }

  const handleEditProfile = () => {
    navigate('/account');
    setAnchorEl(null);
  }
  const handleGoHome = () => {
    navigate('/');
    setAnchorEl(null);
  }

  const handleGoContact = () => {
    navigate('/contact');
    setAnchorEl(null);
  }

  const handleGoInstruction = () => {
    navigate('/instructions');
    setAnchorEl(null);
  }

  const handleAccountButtonEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountButtonLeave = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Toolbar color="primary">
        <Typography variant="h6">
          BUSCANDO E APRENDENDO
        </Typography>
      </Toolbar>

      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleGoHome}>
            <Home />
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleGoInstruction}>
            <Info />
            <ListItemText primary="Instruções" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleGoContact}>
            <Mail />
            <ListItemText primary="Contato" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;


  return isAuthenticated ? (
    <Box sx={{ display: "block" }}>
      <CssBaseline />
      <AppBar color="primary" component="nav">
        <Toolbar>
          <Box sx={{ display: { sm: 'none', xs: 'flex', md: 'none' } }}>
            <IconButton
              color="inherit"
              aria-label="abrir lateral"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, textAlign: 'left', display: { sm: 'none', xs: 'flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={handleGoHome}
            sx={{
              flexGrow: 1, minWidth: 190,
              display: { xs: 'block', sm: 'block' },
              fontSize: { xs: '1.0rem', sm: '1.2rem' },
              cursor: 'pointer'
            }}
          >
            BUSCANDO E APRENDENDO
          </Typography>
          <Box sx={{ minWidth: 270, textAlign: 'right', display: { xs: 'none', sm: 'block', md: 'block' } }}>
            <Button sx={{ color: '#fff' }} onClick={handleGoHome}>
              HOME
            </Button>
            <Button sx={{ color: '#fff', width: '85px' }} onClick={handleGoInstruction}>
              INSTRUÇÕES
            </Button>
            <Button sx={{ color: '#fff', width: '85px' }} onClick={handleGoContact}>
              CONTATO
            </Button>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <IconButton
              onClick={handleAccountButtonEnter}
              color="inherit"
              edge="end"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              size="large"
            >
              <Typography noWrap style={{ marginRight: 4 }}>Olá, {`${user?.name.charAt(0).toUpperCase()}${user?.name.slice(1)} `}</Typography>
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorEl)}
              onClose={handleAccountButtonLeave}
            >
              <MenuItem onClick={handleEditProfile}><AccountCircle />Meu perfil</MenuItem>
              <MenuItem onClick={handleLogout}><ExitToAppIcon />Sair</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, minWidth: 144 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 2 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box >
  ) : <Navigate to="/" />
}
