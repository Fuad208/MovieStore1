import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { 
  makeStyles, 
  Grid, 
  Typography, 
  CircularProgress, 
  Box,
  Container,
  Paper,
  Chip,
  Button
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Movie, Refresh, ArrowBack } from '@material-ui/icons';
import ResponsiveMovieCard from '../components/ResponsiveMovieCard/ResponsiveMovieCard';
import { getMovies } from '../../../store/actions';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(8)
  },
  container: {
    maxWidth: '1200px'
  },
  header: {
    marginBottom: theme.spacing(4),
    textAlign: 'center'
  },
  title: {
    fontSize: '3rem',
    lineHeight: '3.5rem',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: theme.spacing(2),
    color: '#ffffff',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
      lineHeight: '2.5rem'
    }
  },
  subtitle: {
    color: '#cccccc',
    marginBottom: theme.spacing(3),
    fontSize: '1.1rem'
  },
  categoryChip: {
    backgroundColor: '#3f51b5',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(2)
  },
  moviesGrid: {
    marginTop: theme.spacing(3)
  },
  movieItem: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2)
    }
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    flexDirection: 'column'
  },
  loadingText: {
    marginTop: theme.spacing(2),
    color: '#cccccc'
  },
  errorContainer: {
    textAlign: 'center',
    padding: theme.spacing(4),
    backgroundColor: '#1a1a1a',
    borderRadius: theme.spacing(2),
    border: '1px solid #333'
  },
  errorIcon: {
    fontSize: '4rem',
    color: '#f44336',
    marginBottom: theme.spacing(2)
  },
  errorTitle: {
    color: '#ffffff',
    marginBottom: theme.spacing(2),
    fontWeight: 'bold'
  },
  errorMessage: {
    color: '#cccccc',
    marginBottom: theme.spacing(3)
  },
  retryButton: {
    backgroundColor: '#3f51b5',
    color: 'white',
    '&:hover': {
      backgroundColor: '#303f9f'
    }
  },
  backButton: {
    backgroundColor: '#666',
    color: 'white',
    marginLeft: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#555'
    }
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(6),
    backgroundColor: '#1a1a1a',
    borderRadius: theme.spacing(2),
    border: '1px solid #333'
  },
  emptyIcon: {
    fontSize: '5rem',
    color: '#666',
    marginBottom: theme.spacing(2)
  },
  emptyTitle: {
    color: '#ffffff',
    marginBottom: theme.spacing(2),
    fontWeight: 'bold'
  },
  emptyMessage: {
    color: '#cccccc',
    marginBottom: theme.spacing(3)
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3)
  },
  statItem: {
    backgroundColor: '#1a1a1a',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0, 1),
    textAlign: 'center',
    minWidth: '120px',
    border: '1px solid #333'
  },
  statNumber: {
    color: '#3f51b5',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  statLabel: {
    color: '#cccccc',
    fontSize: '0.875rem'
  }
}));

// Valid categories configuration
const VALID_CATEGORIES = {
  nowShowing: {
    title: 'Now Showing',
    description: 'Movies currently playing in theaters',
    icon: '🎬'
  },
  comingSoon: {
    title: 'Coming Soon',
    description: 'Upcoming movies to watch out for',
    icon: '🔜'
  }
};

function MovieCategoryPage(props) {
  const { movies, getMovies, loading, error, history } = props;
  const category = props.match.params.category;
  const classes = useStyles();
  
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Memoized category info
  const categoryInfo = useMemo(() => {
    return VALID_CATEGORIES[category] || null;
  }, [category]);
  
  // Memoized filtered movies
  const filteredMovies = useMemo(() => {
    if (!movies || !Array.isArray(movies)) return [];
    return movies.filter(movie => movie && movie._id);
  }, [movies]);

  useEffect(() => {
    if (categoryInfo && (!movies || movies.length === 0)) {
      fetchMovies();
    }
  }, [category, categoryInfo]);

  const fetchMovies = async () => {
    if (!categoryInfo) return;
    
    try {
      setIsRetrying(true);
      await getMovies();
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleRetry = () => {
    fetchMovies();
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push('/');
    }
  };

  // Invalid category
  if (!categoryInfo) {
    return (
      <div className={classes.root}>
        <Container className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className={classes.errorContainer}>
                <Movie className={classes.errorIcon} />
                <Typography variant="h4" className={classes.errorTitle}>
                  Category Not Found
                </Typography>
                <Typography variant="body1" className={classes.errorMessage}>
                  The category "{category}" does not exist.
                </Typography>
                <Typography variant="body2" className={classes.errorMessage}>
                  Available categories: {Object.keys(VALID_CATEGORIES).join(', ')}
                </Typography>
                <Button
                  variant="contained"
                  className={classes.backButton}
                  onClick={handleGoBack}
                  startIcon={<ArrowBack />}
                >
                  Go Back
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }

  // Loading state
  if (loading || isRetrying) {
    return (
      <div className={classes.root}>
        <Container className={classes.container}>
          <div className={classes.loadingContainer}>
            <CircularProgress size={60} style={{ color: '#3f51b5' }} />
            <Typography variant="h6" className={classes.loadingText}>
              {isRetrying ? 'Retrying...' : 'Loading movies...'}
            </Typography>
          </div>
        </Container>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={classes.root}>
        <Container className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className={classes.errorContainer}>
                <Movie className={classes.errorIcon} />
                <Typography variant="h4" className={classes.errorTitle}>
                  Something went wrong
                </Typography>
                <Typography variant="body1" className={classes.errorMessage}>
                  {error || 'Failed to load movies. Please try again.'}
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    className={classes.retryButton}
                    onClick={handleRetry}
                    startIcon={<Refresh />}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.backButton}
                    onClick={handleGoBack}
                    startIcon={<ArrowBack />}
                  >
                    Go Back
                  </Button>
                </Box>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
            <div className={classes.header}>
              <Chip
                label={categoryInfo.icon + ' ' + categoryInfo.title}
                className={classes.categoryChip}
              />
              <Typography variant="h2" className={classes.title}>
                {categoryInfo.title}
              </Typography>
              <Typography variant="body1" className={classes.subtitle}>
                {categoryInfo.description}
              </Typography>
            </div>
          </Grid>

          {/* Stats Section */}
          {filteredMovies.length > 0 && (
            <Grid item xs={12}>
              <div className={classes.statsContainer}>
                <div className={classes.statItem}>
                  <Typography className={classes.statNumber}>
                    {filteredMovies.length}
                  </Typography>
                  <Typography className={classes.statLabel}>
                    {filteredMovies.length === 1 ? 'Movie' : 'Movies'}
                  </Typography>
                </div>
              </div>
            </Grid>
          )}

          {/* Movies Grid */}
          <Grid item xs={12}>
            {filteredMovies.length > 0 ? (
              <Grid container spacing={3} className={classes.moviesGrid}>
                {filteredMovies.map((movie, index) => (
                  <Grid 
                    key={movie._id || index} 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    lg={3}
                    className={classes.movieItem}
                  >
                    <ResponsiveMovieCard movie={movie} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <div className={classes.emptyState}>
                <Movie className={classes.emptyIcon} />
                <Typography variant="h5" className={classes.emptyTitle}>
                  No movies found
                </Typography>
                <Typography variant="body1" className={classes.emptyMessage}>
                  There are no movies in the "{categoryInfo.title}" category at the moment.
                </Typography>
                <Typography variant="body2" className={classes.emptyMessage}>
                  Please check back later for new releases.
                </Typography>
                <Button
                  variant="contained"
                  className={classes.retryButton}
                  onClick={handleRetry}
                  startIcon={<Refresh />}
                >
                  Refresh
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

const mapStateToProps = ({ movieState }, ownProps) => {
  const category = ownProps.match.params.category;
  return {
    movies: movieState[category] || [],
    loading: movieState.loading || false,
    error: movieState.error || null
  };
};

const mapDispatchToProps = { getMovies };

export default connect(mapStateToProps, mapDispatchToProps)(MovieCategoryPage);