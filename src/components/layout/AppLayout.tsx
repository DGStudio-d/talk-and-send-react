import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Divider,
  Button,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  People as PeopleIcon,
  Language as LanguageIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

interface AppLayoutProps {
  userRole?: 'admin' | 'teacher' | 'student' | 'public';
  userName?: string;
  userAvatar?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  userRole = 'public', 
  userName = 'Guest User',
  userAvatar 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  const navigationItems = [
    { 
      text: 'Home', 
      icon: <HomeIcon />, 
      path: '/', 
      roles: ['admin', 'teacher', 'student', 'public'] 
    },
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard', 
      roles: ['admin', 'teacher', 'student'] 
    },
    { 
      text: 'Quizzes', 
      icon: <QuizIcon />, 
      path: '/quizzes', 
      roles: ['admin', 'teacher', 'student', 'public'] 
    },
    { 
      text: 'Users', 
      icon: <PeopleIcon />, 
      path: '/admin/users', 
      roles: ['admin'] 
    },
    { 
      text: 'Languages', 
      icon: <LanguageIcon />, 
      path: '/admin/languages', 
      roles: ['admin'] 
    },
    { 
      text: 'Teachers', 
      icon: <SchoolIcon />, 
      path: '/admin/professors', 
      roles: ['admin'] 
    },
    { 
      text: 'My Students', 
      icon: <PeopleIcon />, 
      path: '/teacher/students', 
      roles: ['teacher'] 
    },
    { 
      text: 'My Quizzes', 
      icon: <QuizIcon />, 
      path: '/teacher/quizzes', 
      roles: ['teacher'] 
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/settings', 
      roles: ['admin', 'teacher', 'student'] 
    },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    // Handle logout logic here
    handleProfileMenuClose();
    navigate('/');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error.main';
      case 'teacher': return 'success.main';
      case 'student': return 'info.main';
      default: return 'primary.main';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <AdminIcon />;
      case 'teacher': return <SchoolIcon />;
      case 'student': return <AccountCircleIcon />;
      default: return <AccountCircleIcon />;
    }
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      {/* User Profile Section */}
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={userAvatar} 
            sx={{ 
              width: 56, 
              height: 56, 
              mr: 2,
              bgcolor: 'primary.dark'
            }}
          >
            {userName.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {userName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getRoleIcon(userRole)}
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {userRole}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ pt: 0 }}>
        {filteredNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.50',
                  borderRight: 3,
                  borderRightColor: 'primary.main',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 'auto' }} />

      {/* Logout Button */}
      {userRole !== 'public' && (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Learn Academy
          </Typography>

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {userRole !== 'public' && (
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}

            {userRole === 'public' ? (
              <Button 
                variant="contained" 
                onClick={() => navigate('/admin/login')}
              >
                Login
              </Button>
            ) : (
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar 
                  src={userAvatar} 
                  sx={{ width: 32, height: 32 }}
                >
                  {userName.split(' ').map(n => n[0]).join('')}
                </Avatar>
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          pt: 8, // Account for AppBar height
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;