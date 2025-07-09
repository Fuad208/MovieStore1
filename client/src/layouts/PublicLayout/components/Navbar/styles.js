export default theme => ({
  // Main AppBar styles
  appBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar,
    transition: 'all 300ms ease-in-out',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    backdropFilter: 'blur(10px)',
    '&.scrolled': {
      backgroundColor: `${theme.palette.background.dark}ee`,
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(20px)'
    }
  },
  
  toolbar: {
    padding: theme.spacing(1, 3),
    justifyContent: 'space-between',
    minHeight: '70px',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 2),
      minHeight: '60px'
    }
  },

  // Logo styles
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    zIndex: 1
  },
  
  logo: {
    fontSize: '2rem',
    fontWeight: 700,
    letterSpacing: '1px',
    color: theme.palette.common.white,
    textDecoration: 'none',
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      filter: 'brightness(1.2)'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem'
    }
  },

  // Desktop navigation styles
  navLinksContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },

  navLink: {
    color: theme.palette.common.white,
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}40, transparent)`,
      transition: 'left 0.5s ease'
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      '&::before': {
        left: '100%'
      }
    },
    '&.active': {
      color: theme.palette.primary.main,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -2,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 10px ${theme.palette.primary.main}`
      }
    }
  },

  // Account section styles
  accountSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    zIndex: 1
  },

  // Mobile menu button
  mobileMenuButton: {
    display: 'none',
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'scale(1.1)'
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex'
    }
  },

  // Mobile menu styles
  mobileMenu: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.98) 100%)',
    zIndex: theme.zIndex.modal,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translateX(-100%)',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    backdropFilter: 'blur(20px)',
    '&.open': {
      transform: 'translateX(0)'
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}20 0%, transparent 70%)`,
      pointerEvents: 'none'
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
    borderBottom: `1px solid ${theme.palette.divider}40`,
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)'
  },

  mobileNavLink: {
    color: theme.palette.common.white,
    textDecoration: 'none',
    fontSize: '1.8rem',
    fontWeight: 600,
    padding: theme.spacing(2, 3),
    margin: theme.spacing(0.5, 0),
    borderRadius: theme.shape.borderRadius * 3,
    transition: 'all 0.3s ease',
    position: 'relative',
    textAlign: 'center',
    minWidth: '200px',
    border: '1px solid transparent',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
      borderRadius: 'inherit',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    '&:hover': {
      color: theme.palette.primary.main,
      transform: 'scale(1.05) translateY(-2px)',
      border: `1px solid ${theme.palette.primary.main}40`,
      boxShadow: `0 8px 25px ${theme.palette.primary.main}30`,
      '&::before': {
        opacity: 1
      }
    },
    '&.active': {
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}60`
    }
  },

  // Backdrop styles
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: theme.zIndex.modal - 1,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
    backdropFilter: 'blur(5px)',
    '&.open': {
      opacity: 1,
      visibility: 'visible'
    }
  },

  // Animation keyframes
  '@keyframes slideInFromTop': {
    '0%': {
      transform: 'translateY(-100%)',
      opacity: 0
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1
    }
  },

  '@keyframes fadeInUp': {
    '0%': {
      transform: 'translateY(30px)',
      opacity: 0
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1
    }
  },

  // User popover specific styles
  userPopoverButton: {
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'scale(1.1)'
    }
  },

  // Responsive breakpoints
  [theme.breakpoints.down('lg')]: {
    navLinksContainer: {
      gap: theme.spacing(0.5)
    },
    navLink: {
      fontSize: '0.9rem',
      padding: theme.spacing(0.8, 1.5)
    }
  },

  [theme.breakpoints.down('md')]: {
    toolbar: {
      padding: theme.spacing(1, 2)
    },
    logo: {
      fontSize: '1.8rem'
    }
  },

  [theme.breakpoints.down('sm')]: {
    toolbar: {
      minHeight: '60px'
    },
    logo: {
      fontSize: '1.5rem'
    },
    mobileNavLink: {
      fontSize: '1.5rem',
      minWidth: '180px'
    }
  }
});