import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { 
  makeStyles, 
  Grid, 
  Typography, 
  Container, 
  CircularProgress, 
  Box, 
  Alert,
  Skeleton,
  TextField,
  InputAdornment,
  Chip,
  Button
} from '@material-ui/core';
import { 
  Search as SearchIcon, 
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon
} from '@material-ui/icons';
import { getCinemas } from '../../../store/actions';
import CinemaCard from '../components/CinemaCard/CinemaCard';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    paddingBottom: theme.spacing(4)
  },
  title: {
    fontSize: '3rem',
    lineHeight: '3rem',
    textAlign: 'center',
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    [theme.breakpoints.down('md')]: {
      fontSize: '2.5rem',
      marginTop: theme.spacing(6)
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
      marginTop: theme.spacing(4)
    }
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    color: theme.palette.text.secondary,
    fontSize: '1.2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
      marginBottom: theme.spacing(3)
    }
  },
  filterSection: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[2]
  },
  searchField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(3)
    }
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'stretch'
    }
  },
  filterChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  viewToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    '& .MuiCircularProgress-root': {
      marginBottom: theme.spacing(2)
    }
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '400px',
    justifyContent: 'center'
  },
  retryButton: {
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(3)
  },
  cinemasGrid: {
    marginTop: theme.spacing(2)
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    gap: theme.spacing(2),
    flexWrap: 'wrap'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(8),
    color: theme.palette.text.secondary
  },
  listView: {
    '& .MuiGrid-item': {
      marginBottom: theme.spacing(2)
    }
  }
}));

function CinemasPage(props) {
  const classes = useStyles();
  const { cinemas = [], getCinemas, loading = false, error = null } = props;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [localLoading, setLocalLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch cinemas on component mount
  useEffect(() => {
    const fetchCinemas = async () => {
      if (!cinemas.length && !loading) {
        setLocalLoading(true);
        try {
          await getCinemas();
        } catch (err) {
          console.error('Error fetching cinemas:', err);
        } finally {
          setLocalLoading(false);
        }
      }
    };

    fetchCinemas();
  }, [cinemas.length, getCinemas, loading]);

  // Filter cinemas based on search and city
  const filteredCinemas = React.useMemo(() => {
    let filtered = cinemas || [];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(cinema => 
        cinema.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cinema.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cinema.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(cinema => 
        cinema.city?.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    return filtered;
  }, [cinemas, searchTerm, selectedCity]);

  // Get unique cities for filter
  const cities = React.useMemo(() => {
    const citySet = new Set();
    cinemas.forEach(cinema => {
      if (cinema.city) {
        citySet.add(cinema.city);
      }
    });
    return Array.from(citySet).sort();
  }, [cinemas]);

  const handleRetry = useCallback(async () => {
    setRetryCount(prev => prev + 1);
    setLocalLoading(true);
    try {
      await getCinemas();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setLocalLoading(false);
    }
  }, [getCinemas]);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleCityFilter = useCallback((city) => {
    setSelectedCity(city);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCity('all');
  }, []);

  const renderSkeletons = () => (
    <Grid container spacing={2}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
        <Grid key={item} item xs={12} md={4} lg={3}>
          <Box p={2}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={20} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const renderLoadingState = () => (
    <div className={classes.loadingContainer}>
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="textSecondary">
        Loading cinemas...
      </Typography>
    </div>
  );

  const renderErrorState = () => (
    <div className={classes.errorContainer}>
      <Alert severity="error" style={{ marginBottom: 16 }}>
        {error || 'Failed to load cinemas. Please try again.'}
      </Alert>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRetry}
        disabled={localLoading}
        className={classes.retryButton}
        startIcon={<RefreshIcon />}
      >
        {localLoading ? 'Retrying...' : 'Try Again'}
      </Button>
    </div>
  );

  const renderEmptyState = () => (
    <div className={classes.emptyState}>
      <Typography variant="h5" gutterBottom>
        {searchTerm || selectedCity !== 'all' ? 'No cinemas found' : 'No cinemas available'}
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        {searchTerm || selectedCity !== 'all' 
          ? 'Try adjusting your search or filter criteria.'
          : 'Cinemas will be displayed here once available.'
        }
      </Typography>
      {(searchTerm || selectedCity !== 'all') && (
        <Button
          variant="outlined"
          color="primary"
          onClick={clearFilters}
          style={{ marginTop: 16 }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  const renderCinemasGrid = () => (
    <Grid 
      container 
      spacing={2} 
      className={`${classes.cinemasGrid} ${viewMode === 'list' ? classes.listView : ''}`}
    >
      {filteredCinemas.map(cinema => (
        <Grid 
          key={cinema._id || cinema.id} 
          item 
          xs={12} 
          md={viewMode === 'list' ? 12 : 4} 
          lg={viewMode === 'list' ? 12 : 3}
        >
          <CinemaCard cinema={cinema} viewMode={viewMode} />
        </Grid>
      ))}
    </Grid>
  );

  const isLoading = loading || localLoading;
  const showError = error && !isLoading;
  const showEmpty = !isLoading && !showError && filteredCinemas.length === 0;
  const showContent = !isLoading && !showError && filteredCinemas.length > 0;

  return (
    <div className={classes.root}>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography className={classes.title} variant="h2">
              Our Cinemas
            </Typography>
            <Typography className={classes.subtitle} variant="body1">
              Discover the best movie experiences at our premium cinema locations
            </Typography>
          </Grid>

          {/* Filters */}
          {!isLoading && !showError && (
            <Grid item xs={12}>
              <Box className={classes.filterSection}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search cinemas by name, address, or city..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={classes.searchField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <div className={classes.filterRow}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Filter by City:
                    </Typography>
                    <div className={classes.filterChips}>
                      <Chip
                        label="All Cities"
                        onClick={() => handleCityFilter('all')}
                        color={selectedCity === 'all' ? 'primary' : 'default'}
                        variant={selectedCity === 'all' ? 'default' : 'outlined'}
                      />
                      {cities.map(city => (
                        <Chip
                          key={city}
                          label={city}
                          onClick={() => handleCityFilter(city)}
                          color={selectedCity === city ? 'primary' : 'default'}
                          variant={selectedCity === city ? 'default' : 'outlined'}
                          icon={<LocationIcon />}
                        />
                      ))}
                    </div>
                  </Box>

                  <div className={classes.viewToggle}>
                    <Button
                      size="small"
                      variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('grid')}
                      startIcon={<ViewModuleIcon />}
                    >
                      Grid
                    </Button>
                    <Button
                      size="small"
                      variant={viewMode === 'list' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('list')}
                      startIcon={<ViewListIcon />}
                    >
                      List
                    </Button>
                  </div>
                </div>
              </Box>
            </Grid>
          )}

          {/* Stats */}
          {showContent && (
            <Grid item xs={12}>
              <div className={classes.statsContainer}>
                <div className={classes.statItem}>
                  <Typography variant="body2">
                    Showing {filteredCinemas.length} of {cinemas.length} cinemas
                  </Typography>
                </div>
                {cities.length > 0 && (
                  <div className={classes.statItem}>
                    <LocationIcon fontSize="small" />
                    <Typography variant="body2">
                      {cities.length} cities
                    </Typography>
                  </div>
                )}
              </div>
            </Grid>
          )}

          {/* Content */}
          <Grid item xs={12}>
            {isLoading && renderLoadingState()}
            {showError && renderErrorState()}
            {showEmpty && renderEmptyState()}
            {showContent && renderCinemasGrid()}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => ({
  cinemas: state.cinemaState?.cinemas || [],
  loading: state.cinemaState?.loading || false,
  error: state.cinemaState?.error || null
});

const mapDispatchToProps = { getCinemas };

export default connect(mapStateToProps, mapDispatchToProps)(CinemasPage);