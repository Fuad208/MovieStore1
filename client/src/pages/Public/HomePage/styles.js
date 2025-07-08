export default theme => ({
  root: {
    marginTop: theme.spacing(12),
    padding: theme.spacing(4),
    color: 'white',
    minHeight: '100vh',
    backgroundColor: '#121212'
  },
  card: {
    background: 'linear-gradient(135deg, #1e1e2f 0%, #2a2a3a 100%)',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    color: 'white',
    transition: 'all 0.3s ease-in-out',
    border: '1px solid #333',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      borderColor: '#3f51b5'
    }
  },
  cardImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  cardContent: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  movieTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    fontSize: '1.1rem',
    lineHeight: 1.2
  },
  movieDescription: {
    color: '#ccc',
    marginBottom: theme.spacing(2),
    lineHeight: 1.4,
    fontSize: '0.875rem'
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  priceIcon: {
    color: '#4caf50',
    fontSize: '18px',
    marginRight: theme.spacing(1)
  },
  priceText: {
    color: '#ccc',
    fontWeight: '500'
  },
  seatContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  seatIcon: {
    color: '#2196f3',
    fontSize: '18px',
    marginRight: theme.spacing(1)
  },
  seatText: {
    color: '#ccc'
  },
  bookingButton: {
    backgroundColor: '#3f51b5',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px 0',
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '14px',
    marginTop: 'auto',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#303f9f'
    },
    '&:disabled': {
      backgroundColor: '#666',
      color: '#999'
    }
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4)
  },
  errorContainer: {
    textAlign: 'center',
    padding: theme.spacing(4)
  },
  errorText: {
    color: '#f44336',
    marginBottom: theme.spacing(2)
  },
  retryButton: {
    backgroundColor: '#3f51b5',
    color: 'white',
    '&:hover': {
      backgroundColor: '#303f9f'
    }
  },
  emptyStateContainer: {
    textAlign: 'center',
    padding: theme.spacing(6)
  },
  emptyStateTitle: {
    color: '#ccc',
    marginBottom: theme.spacing(1)
  },
  emptyStateSubtitle: {
    color: '#999'
  },
  sectionTitle: {
    color: 'white',
    marginBottom: theme.spacing(3),
    fontWeight: 'bold'
  },
  recommendationsSection: {
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    borderBottom: '1px solid #333'
  }
});