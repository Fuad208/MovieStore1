import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    marginTop: 'auto',
    padding: theme.spacing(6, 0, 3),
    borderTop: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
      pointerEvents: 'none'
    }
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing(0, 3),
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0, 2)
    }
  },

  section: {
    marginBottom: theme.spacing(4),
    animation: '$fadeInUp 0.6s ease-out'
  },

  brandSection: {
    textAlign: 'center',
    marginBottom: theme.spacing(5),
    animation: '$fadeInUp 0.6s ease-out'
  },

  brand: {
    fontSize: '2rem',
    fontWeight: 700,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: theme.spacing(2),
    letterSpacing: '1px',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '3px',
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      borderRadius: '2px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem'
    }
  },

  tagline: {
    fontSize: '1.1rem',
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    fontWeight: 300,
    maxWidth: '400px',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem'
    }
  },

  linksSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: theme.spacing(3)
    }
  },

  linkGroup: {
    textAlign: 'center',
    animation: '$slideInFromBottom 0.6s ease-out',
    '&:nth-child(1)': { animationDelay: '0.1s' },
    '&:nth-child(2)': { animationDelay: '0.2s' },
    '&:nth-child(3)': { animationDelay: '0.3s' },
    '&:nth-child(4)': { animationDelay: '0.4s' }
  },

  linkGroupTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    position: 'relative',
    paddingBottom: theme.spacing(1),
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '30px',
      height: '2px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '1px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.1rem'
    }
  },

  footerLink: {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    fontSize: '0.95rem',
    display: 'block',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}20, transparent)`,
      transition: 'left 0.5s ease'
    },
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      transform: 'translateX(5px)',
      '&::before': {
        left: '100%'
      }
    },
    '&:last-child': {
      marginBottom: 0
    }
  },

  socialSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(5),
    animation: '$fadeInUp 0.6s ease-out 0.5s both'
  },

  socialLink: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(1.5),
    borderRadius: '50%',
    border: `2px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      opacity: 0,
      transition: 'opacity 0.3s ease',
      borderRadius: '50%'
    },
    '&:hover': {
      color: theme.palette.common.white,
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-3px) scale(1.1)',
      boxShadow: `0 8px 25px ${theme.palette.primary.main}30`,
      '&::before': {
        opacity: 1
      },
      '& .MuiSvgIcon-root': {
        position: 'relative',
        zIndex: 1
      }
    }
  },

  bottomSection: {
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(4),
    textAlign: 'center',
    animation: '$fadeInUp 0.6s ease-out 0.6s both'
  },

  copyright: {
    fontSize: '0.95rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    fontWeight: 400,
    letterSpacing: '0.5px'
  },

  credits: {
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap'
  },

  creditsLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -2,
      left: 0,
      width: '0%',
      height: '1px',
      backgroundColor: theme.palette.primary.main,
      transition: 'width 0.3s ease'
    },
    '&:hover': {
      color: theme.palette.secondary.main,
      '&::after': {
        width: '100%'
      }
    }
  },

  heartIcon: {
    color: theme.palette.error.main,
    fontSize: '1rem',
    animation: '$heartbeat 1.5s ease-in-out infinite'
  },

  // Animations
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(30px)'
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  },

  '@keyframes slideInFromBottom': {
    '0%': {
      opacity: 0,
      transform: 'translateY(50px)'
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  },

  '@keyframes heartbeat': {
    '0%, 100%': {
      transform: 'scale(1)'
    },
    '50%': {
      transform: 'scale(1.2)'
    }
  },

  // Responsive design
  [theme.breakpoints.down('md')]: {
    footer: {
      padding: theme.spacing(4, 0, 2)
    },
    brandSection: {
      marginBottom: theme.spacing(4)
    },
    linksSection: {
      marginBottom: theme.spacing(4)
    },
    socialSection: {
      marginBottom: theme.spacing(4),
      gap: theme.spacing(2)
    },
    bottomSection: {
      paddingTop: theme.spacing(3)
    }
  },

  [theme.breakpoints.down('sm')]: {
    footer: {
      padding: theme.spacing(3, 0, 2)
    },
    brandSection: {
      marginBottom: theme.spacing(3)
    },
    linksSection: {
      marginBottom: theme.spacing(3)
    },
    socialSection: {
      marginBottom: theme.spacing(3),
      gap: theme.spacing(1.5)
    },
    socialLink: {
      padding: theme.spacing(1.2)
    },
    credits: {
      fontSize: '0.8rem'
    }
  }
}));