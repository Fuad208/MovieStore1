import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../../store/actions';
import classnames from 'classnames';
import { 
  makeStyles, 
  Typography, 
  List, 
  ListItem, 
  AppBar,
  Toolbar,
  IconButton,
  Button,
  useTheme,
  useMediaQuery
} from '@material-ui/core';
import { Menu as MenuIcon, Close as CloseIcon } from '@material-ui/icons';
import UserPopover from './components/UserPopover/UserPopover';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar,
    transition: 'all 300ms ease-in-out',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&.scrolled': {
      backgroundColor: theme.palette.background.dark,
      boxShadow: theme.shadows[4]
    }
  },
  toolbar: {
    padding: theme.spacing(1, 3),
    justifyContent: 'space-between',
    minHeight: '70px'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    fontSize: '2rem',
    fontWeight: 600,
    letterSpacing: '1px',
    color: theme.palette.common.white,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  navLinksContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  navLink: {
    color: theme.palette.common.white,
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 500,
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    transition: 'all 200ms ease',
    position: 'relative',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateY(-2px)'
    },
    '&.active': {
      color: theme.palette.primary.main,
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -4,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main
      }
    }
  },
  accountSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  mobileMenuButton: {
    display: 'none',
    color: theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
      display: 'block'
    }
  },
  mobileMenu: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: theme.zIndex.modal,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translateX(-100%)',
    transition: 'transform 300ms ease-in-out',
    '&.open': {
      transform: 'translateX(0)'
    }
  },
  mobileMenuHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  mobileNavLink: {
    color: theme.palette.common.white,
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 500,
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    borderRadius: theme.shape.borderRadius,
    transition: 'all 200ms ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'scale(1.05)'
    }
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: theme.zIndex.modal - 1,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 300ms ease, visibility 300ms ease',
    '&.open': {
      opacity: 1,
      visibility: 'visible'
    }
  }
}));

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/movie/category/nowShowing', label: 'Now Showing' },
  { path: '/movie/category/comingSoon', label: 'Coming Soon' },
  { path: '/cinemas', label: 'Cinemas' }
];

function Navbar() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated: isAuth, user } = useSelector(state => state.authState);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    setIsScrolled(scrollTop > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setMobileMenuOpen(false);
  }, [dispatch]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const getDashboardPath = () => {
    return user && user.role !== 'guest' ? '/admin/dashboard' : '/mydashboard';
  };

  const renderNavLinks = (isMobile = false) => {
    const linkClass = isMobile ? classes.mobileNavLink : classes.navLink;
    
    return navLinks.map(({ path, label }) => (
      <Link
        key={path}
        to={path}
        className={classnames(linkClass, {
          active: location.pathname === path
        })}
        onClick={isMobile ? toggleMobileMenu : undefined}
      >
        {label}
      </Link>
    ));
  };

  const renderUserSection = (isMobile = false) => {
    if (isMobile) {
      return (
        <div style={{ marginTop: '2rem' }}>
          {user && (
            <Link
              to={getDashboardPath()}
              className={classes.mobileNavLink}
              onClick={toggleMobileMenu}
            >
              Dashboard
            </Link>
          )}
          {isAuth ? (
            <Button
              className={classes.mobileNavLink}
              onClick={handleLogout}
              style={{ display: 'block', textAlign: 'center' }}
            >
              Logout
            </Button>
          ) : (
            <Link
              to="/login"
              className={classes.mobileNavLink}
              onClick={toggleMobileMenu}
            >
              Login
            </Link>
          )}
        </div>
      );
    }

    return (
      <UserPopover>
        <List component="nav">
          {user && (
            <ListItem button component={Link} to={getDashboardPath()}>
              Dashboard
            </ListItem>
          )}
          {isAuth ? (
            <ListItem button onClick={handleLogout}>
              Logout
            </ListItem>
          ) : (
            <ListItem button component={Link} to="/login">
              Login
            </ListItem>
          )}
        </List>
      </UserPopover>
    );
  };

  return (
    <>
      <AppBar 
        className={classnames(classes.appBar, { scrolled: isScrolled })}
        position="fixed"
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.logoContainer}>
            <Typography
              component={Link}
              to="/"
              variant="h4"
              className={classes.logo}
            >
              Movie Store
            </Typography>
          </div>

          <div className={classes.navLinksContainer}>
            {renderNavLinks()}
          </div>

          <div className={classes.accountSection}>
            {!isMobile && renderUserSection()}
            
            <IconButton
              className={classes.mobileMenuButton}
              onClick={toggleMobileMenu}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <div className={classnames(classes.mobileMenu, { open: mobileMenuOpen })}>
        <div className={classes.mobileMenuHeader}>
          <Typography variant="h6" style={{ color: 'white' }}>
            Movie Store
          </Typography>
          <IconButton
            onClick={toggleMobileMenu}
            style={{ color: 'white' }}
            aria-label="Close navigation menu"
          >
            <CloseIcon />
          </IconButton>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderNavLinks(true)}
          {renderUserSection(true)}
        </nav>
      </div>

      {/* Backdrop */}
      <div 
        className={classnames(classes.backdrop, { open: mobileMenuOpen })}
        onClick={toggleMobileMenu}
      />
    </>
  );
}

export default Navbar;