// client/src/layouts/AdminLayout/components/Topbar/Topbar.js
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../../../../store/actions';
import { 
  makeStyles, 
  Badge, 
  Toolbar, 
  IconButton, 
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import styles from './styles';

const useStyles = makeStyles(styles);

const Topbar = ({ 
  title = 'Dashboard', 
  isSidebarOpen = false, 
  onToggleSidebar,
  ToolbarClasses,
  children 
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.authState);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount] = useState(4); // This could come from Redux state

  const handleSignOut = useCallback(async () => {
    try {
      await dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [dispatch]);

  const handleNotificationClick = useCallback(() => {
    console.log('Notification clicked');
    // Handle notification logic here
  }, []);

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleProfileClick = useCallback(() => {
    handleMenuClose();
    // Navigate to profile or handle profile action
  }, []);

  return (
    <div className={`${classes.root} ${ToolbarClasses}`}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.brandWrapper}>
          <Typography variant="h6" className={classes.logo}>
            Movie Store
          </Typography>
          <Tooltip title={isSidebarOpen ? 'Close Menu' : 'Open Menu'}>
            <IconButton
              className={classes.menuButton}
              aria-label={isSidebarOpen ? 'Close Menu' : 'Open Menu'}
              onClick={onToggleSidebar}
              edge="start"
            >
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Tooltip>
        </div>

        <NavLink 
          className={classes.title} 
          to="/"
          aria-label="Go to main site"
        >
          <Typography variant="body2" component="span">
            Movie Store →
          </Typography>
        </NavLink>

        <div className={classes.actions}>
          <Tooltip title="Notifications">
            <IconButton
              className={classes.notificationsButton}
              onClick={handleNotificationClick}
              aria-label={`${notificationCount} notifications`}
            >
              <Badge 
                badgeContent={notificationCount} 
                color="primary" 
                variant={notificationCount > 0 ? 'standard' : 'dot'}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton
              onClick={handleMenuOpen}
              aria-label="Account menu"
            >
              <Avatar className={classes.avatar}>
                {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleSignOut}>
              <InputIcon fontSize="small" style={{ marginRight: 8 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
      {children}
    </div>
  );
};

export default Topbar;