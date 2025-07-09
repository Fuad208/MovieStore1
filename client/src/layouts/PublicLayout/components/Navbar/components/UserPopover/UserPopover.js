import React, { useState, useCallback } from 'react';
import {
  Popover,
  IconButton,
  Paper,
  ClickAwayListener,
  Grow,
  MenuList,
  MenuItem,
  Typography,
  Divider,
  Box,
  Avatar
} from '@material-ui/core';
import { 
  Person as PersonIcon, 
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  iconButton: {
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  },
  popoverPaper: {
    marginTop: theme.spacing(1),
    minWidth: 220,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden'
  },
  userHeader: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5)
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: theme.palette.secondary.main
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontWeight: 600,
    fontSize: '1rem',
    marginBottom: theme.spacing(0.5)
  },
  userRole: {
    fontSize: '0.8rem',
    opacity: 0.8,
    textTransform: 'capitalize'
  },
  menuList: {
    padding: theme.spacing(1, 0)
  },
  menuItem: {
    padding: theme.spacing(1.5, 2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    minHeight: 48,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  menuIcon: {
    fontSize: '1.2rem',
    color: theme.palette.text.secondary
  },
  menuText: {
    fontSize: '0.9rem',
    fontWeight: 500
  },
  guestPrompt: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  loginPrompt: {
    fontSize: '0.9rem',
    marginBottom: theme.spacing(1)
  }
}));

function UserPopover({ children }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isAuthenticated } = useSelector(state => state.authState);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'user-popover' : undefined;

  const getUserInitials = (user) => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderUserHeader = () => {
    if (!isAuthenticated || !user) return null;

    return (
      <Box className={classes.userHeader}>
        <Avatar className={classes.avatar}>
          {getUserInitials(user)}
        </Avatar>
        <Box className={classes.userInfo}>
          <Typography className={classes.userName}>
            {user.name || 'User'}
          </Typography>
          <Typography className={classes.userRole}>
            {user.role || 'Guest'}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderGuestPrompt = () => (
    <Box className={classes.guestPrompt}>
      <Typography className={classes.loginPrompt}>
        Sign in to access your account
      </Typography>
    </Box>
  );

  return (
    <>
      <IconButton 
        aria-describedby={id} 
        onClick={handleClick}
        className={classes.iconButton}
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <PersonIcon fontSize="large" />
      </IconButton>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          className: classes.popoverPaper
        }}
        TransitionComponent={Grow}
        transitionDuration={200}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper>
            {isAuthenticated ? renderUserHeader() : renderGuestPrompt()}
            
            <MenuList className={classes.menuList}>
              {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, {
                    onClick: (event) => {
                      if (child.props.onClick) {
                        child.props.onClick(event);
                      }
                      handleClose();
                    },
                    className: classes.menuItem
                  });
                }
                return child;
              })}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popover>
    </>
  );
}

export default UserPopover;