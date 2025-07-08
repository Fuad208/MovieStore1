export default theme => ({
  movieHero: {
    position: 'relative',
    height: props => (props.height ? props.height : '100vh'),
    width: '100%',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.background.dark,
    overflow: 'hidden'
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    height: '100%',
    width: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    filter: 'blur(8px)',
    transform: 'scale(1.1)' // Prevent blur edges
  },
  infoSection: {
    position: 'relative',
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundBlendMode: 'multiply',
    background: [
      'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
      'linear-gradient(to right, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.7) 40%, transparent 100%)'
    ],
    zIndex: 2
  },
  movieHeader: {
    position: 'relative',
    padding: theme.spacing(2),
    maxWidth: '65%',
    zIndex: 3
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  tag: {
    padding: theme.spacing(0.5, 2),
    marginRight: theme.spacing(1),
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderColor: 'rgba(255,255,255,0.5)'
    }
  },
  movieTitle: {
    maxWidth: '90%',
    fontSize: '3.5rem',
    lineHeight: 1.1,
    fontWeight: 700,
    textTransform: 'capitalize',
    marginBottom: theme.spacing(2),
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  movieSubtitle: {
    fontSize: '1.2rem',
    color: '#ccc',
    marginBottom: theme.spacing(1),
    fontWeight: 300
  },
  director: {
    color: '#9ac7fa',
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    '&::before': {
      content: '"Directed by "',
      color: '#ccc',
      fontWeight: 400,
      marginRight: theme.spacing(0.5)
    }
  },
  movieDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  duration: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: theme.spacing(0.8, 1.5),
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    fontSize: '0.9rem',
    fontWeight: 500
  },
  genre: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#cee4fd',
    fontSize: '0.9rem',
    fontWeight: 500,
    padding: theme.spacing(0.8, 1.5),
    backgroundColor: 'rgba(206, 228, 253, 0.1)',
    borderRadius: 20,
    border: '1px solid rgba(206, 228, 253, 0.2)'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.8, 1.5),
    backgroundColor: 'rgba(255, 180, 0, 0.1)',
    borderRadius: 20,
    border: '1px solid rgba(255, 180, 0, 0.2)'
  },
  descriptionText: {
    color: '#e0e0e0',
    padding: theme.spacing(2, 0),
    maxWidth: '70%',
    fontSize: '1.1rem',
    lineHeight: 1.6,
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    fontWeight: 300
  },
  footer: {
    position: 'absolute',
    left: theme.spacing(4),
    bottom: theme.spacing(4),
    zIndex: 3,
    display: 'flex',
    gap: theme.spacing(2)
  },
  socialIcons: {
    display: 'flex',
    gap: theme.spacing(1)
  },
  icons: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.9)',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.1) translateY(-2px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
    }
  },
  movieActions: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0,
    zIndex: 3
  },
  button: {
    width: 220,
    height: 70,
    borderRadius: 0,
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    fontWeight: 600,
    fontSize: '1.1rem',
    textTransform: 'none',
    boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(33, 150, 243, 0.6)'
    }
  },
  learnMore: { 
    color: theme.palette.common.white,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  buttonIcon: { 
    marginLeft: theme.spacing(1),
    transition: 'transform 0.2s ease',
    '.MuiButton-root:hover &': {
      transform: 'translateX(4px)'
    }
  },
  
  // Responsive design
  [theme.breakpoints.down('lg')]: {
    movieTitle: {
      fontSize: '3rem'
    },
    movieHeader: {
      maxWidth: '70%'
    },
    descriptionText: {
      maxWidth: '75%'
    }
  },
  [theme.breakpoints.down('md')]: {
    infoSection: {
      background: [
        'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)',
        'linear-gradient(to right, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.8) 60%, transparent 100%)'
      ],
      padding: theme.spacing(3)
    },
    movieHeader: { 
      maxWidth: '80%',
      padding: theme.spacing(1)
    },
    movieTitle: {
      maxWidth: '100%',
      fontSize: '2.5rem'
    },
    descriptionText: {
      maxWidth: '85%',
      fontSize: '1rem'
    }
  },
  [theme.breakpoints.down('sm')]: {
    infoSection: {
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
      padding: theme.spacing(2),
      flexDirection: 'column',
      justifyContent: 'flex-end'
    },
    movieHeader: { 
      maxWidth: '100%',
      padding: theme.spacing(1, 0)
    },
    movieTitle: {
      maxWidth: '100%',
      fontSize: '2rem',
      lineHeight: 1.2
    },
    movieSubtitle: {
      fontSize: '1rem'
    },
    director: {
      fontSize: '1rem'
    },
    descriptionText: {
      maxWidth: '100%',
      fontSize: '0.9rem',
      padding: theme.spacing(1, 0)
    },
    movieDetails: {
      flexDirection: 'column',
      gap: theme.spacing(1)
    },
    duration: {
      fontSize: '0.8rem',
      padding: theme.spacing(0.6, 1.2)
    },
    genre: {
      fontSize: '0.8rem',
      padding: theme.spacing(0.6, 1.2)
    },
    tag: { 
      padding: theme.spacing(0.4, 1.2), 
      margin: theme.spacing(0.5, 0.5, 0.5, 0),
      fontSize: '0.75rem'
    },
    movieActions: { 
      display: 'flex', 
      width: '100%',
      position: 'relative',
      bottom: 'auto',
      right: 'auto'
    },
    button: {
      flex: 1,
      fontSize: '0.9rem',
      height: 50,
      borderRadius: 8,
      margin: theme.spacing(1, 0)
    },
    footer: {
      left: theme.spacing(2),
      bottom: theme.spacing(2),
      flexDirection: 'column',
      gap: theme.spacing(1)
    },
    icons: {
      width: 40,
      height: 40
    }
  },
  [theme.breakpoints.down('xs')]: {
    movieTitle: {
      fontSize: '1.5rem'
    },
    movieSubtitle: {
      fontSize: '0.9rem'
    },
    descriptionText: {
      fontSize: '0.8rem'
    },
    infoSection: {
      padding: theme.spacing(1.5)
    }
  }
});