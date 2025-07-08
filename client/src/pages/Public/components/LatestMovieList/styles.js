export default theme => ({
  container: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.background.dark,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    minHeight: '100vh'
  },
  fullHeight: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    width: '100%',
    color: theme.palette.common.white,
    padding: theme.spacing(2)
  },
  h2: {
    fontSize: '3rem',
    lineHeight: '3.2rem',
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  h4: {
    fontSize: '1.2rem',
    lineHeight: '1.5rem',
    opacity: 0.9,
    marginBottom: theme.spacing(1)
  },
  body2: {
    paddingTop: theme.spacing(2),
    fontSize: '1rem',
    lineHeight: '1.6rem',
    opacity: 0.7,
    maxWidth: '80%'
  },
  movieListContainer: {
    position: 'relative',
    width: '100%'
  },
  navigationButtons: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: theme.spacing(2),
    zIndex: 10,
    display: 'flex',
    gap: theme.spacing(1)
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: theme.palette.common.white,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.05)'
    },
    '&:disabled': {
      opacity: 0.3,
      cursor: 'not-allowed'
    }
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    overflowY: 'hidden',
    WebkitOverflowScrolling: 'touch',
    marginTop: 0,
    cursor: 'grab',
    touchAction: 'pan-x',
    userSelect: 'none',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    '&:active': {
      cursor: 'grabbing'
    },
    paddingBottom: theme.spacing(2)
  },
  movieItem: {
    marginRight: theme.spacing(2),
    flexShrink: 0,
    width: '300px',
    '&:last-child': {
      marginRight: theme.spacing(4)
    }
  },
  // Responsive design
  [theme.breakpoints.down('md')]: {
    h2: {
      fontSize: '2.5rem',
      lineHeight: '2.8rem'
    },
    navigationButtons: {
      display: 'none' // Hide navigation buttons on smaller screens
    }
  },
  [theme.breakpoints.down('sm')]: {
    container: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    title: { 
      width: '100%', 
      textAlign: 'center',
      padding: theme.spacing(1)
    },
    fullHeight: { 
      minHeight: '60vh', 
      paddingTop: theme.spacing(4),
      flexDirection: 'column'
    },
    h2: {
      fontSize: '2rem',
      lineHeight: '2.2rem'
    },
    h4: {
      fontSize: '1rem'
    },
    body2: {
      fontSize: '0.9rem',
      maxWidth: '100%'
    },
    movieItem: {
      width: '280px',
      marginRight: theme.spacing(1)
    }
  },
  [theme.breakpoints.down('xs')]: {
    h2: {
      fontSize: '1.5rem',
      lineHeight: '1.8rem'
    },
    movieItem: {
      width: '250px'
    }
  }
});