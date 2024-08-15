import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import OverviewIcon from '@mui/icons-material/Assessment';
import ReportIcon from '@mui/icons-material/Report';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Logout from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { IconButton } from '@mui/material';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Add expense', icon: <CreateIcon />, path: '/expense-create' },
    { text: 'List expense', icon: <ChecklistIcon />, path: '/expense-list' },
    { text: 'Expense overview', icon: <OverviewIcon />, path: '/expenses' },
    { text: 'Expense report', icon: <ReportIcon />, path: '/expense-report' },
    { text: 'Admin', icon: <AdminPanelSettingsIcon />, path: '', subMenu: [
        { text: 'User management', path: '/admin/users' },
        { text: 'User spending management', path: '/admin/expenses' }
      ]
    },
    { text: 'Sign in', icon: <LoginIcon />, path: '/login' },
    { text: 'Sign up', icon: <HowToRegIcon />, path: '/register' },
  ];

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openAdminSubMenu, setOpenAdminSubMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      setSnackbarMessage('Bạn đã đăng xuất');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setSnackbarMessage('Bạn chưa đăng nhập');
      setSnackbarSeverity('info');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleAdminClick = () => {
    setOpenAdminSubMenu(!openAdminSubMenu);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar sx={{ bgcolor: '#d5ad48', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            EXPENSE MANAGEMENT
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map((item) => (
            <div key={item.text}>
              <ListItem disablePadding>
                <ListItemButton component={item.path ? Link : 'div'} to={item.path} onClick={item.subMenu ? handleAdminClick : null}>
                  <ListItemIcon sx={{ color: '#d5ad48' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              {item.subMenu && openAdminSubMenu && (
                <List sx={{ pl: 4 }}>
                  {item.subMenu.map((subItem) => (
                    <ListItem key={subItem.text} disablePadding>
                      <ListItemButton component={Link} to={subItem.path}>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
