// HomePage.js
import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withStyles,
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  CircularProgress
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
  getMovies,
  getShowtimes,
  getMovieSuggestion
} from '../../../store/actions';
import { AttachMoney, EventSeat } from '@material-ui/icons';
import styles from './styles';

class HomePage extends Component {
  state = {
    loading: false,
    error: null
  };

  componentDidMount() {
    this.fetchInitialData();
  }

  componentDidUpdate(prevProps) {
    // Fetch movie suggestions when user logs in
    if (this.props.user !== prevProps.user && this.props.user) {
      this.fetchMovieSuggestion();
    }
  }

  fetchInitialData = async () => {
    const {
      movies,
      showtimes,
      suggested,
      getMovies,
      getShowtimes,
      user
    } = this.props;

    try {
      this.setState({ loading: true, error: null });
      
      // Fetch movies if not already loaded
      if (!movies.length) {
        await getMovies();
      }
      
      // Fetch showtimes if not already loaded
      if (!showtimes.length) {
        await getShowtimes();
      }
      
      // Fetch movie suggestions if user is logged in and suggestions not loaded
      if (user && !suggested.length) {
        await this.fetchMovieSuggestion();
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      this.setState({ error: 'Failed to load data. Please try again.' });
    } finally {
      this.setState({ loading: false });
    }
  };

  fetchMovieSuggestion = async () => {
    const { user, getMovieSuggestion } = this.props;
    
    if (user && user.username) {
      try {
        await getMovieSuggestion(user.username);
      } catch (error) {
        console.error('Error fetching movie suggestions:', error);
      }
    }
  };

  formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  handleBookingClick = (movieId) => {
    // Add any additional logic here if needed before navigation
    console.log(`Booking tickets for movie: ${movieId}`);
  };

  renderMovieCard = (movie) => {
    const { classes } = this.props;
    
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
        <Paper
          elevation={3}
          className={classes.card}
          style={{
            background: '#1e1e2f',
            borderRadius: 12,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <div
            style={{
              height: '200px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2a2a3a'
            }}
          >
            <img
              src={
                movie.image ||
                'https://via.placeholder.com/300x200.png?text=Movie+Poster'
              }
              alt={movie.title || 'Movie poster'}
              className={classes.cardImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200.png?text=No+Image';
              }}
            />
          </div>
          
          <Box p={2} className={classes.cardContent} style={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              style={{ 
                color: 'white',
                fontWeight: 'bold',
                minHeight: '32px'
              }}
            >
              {movie.title || 'Untitled Movie'}
            </Typography>
            
            <Typography
              variant="body2"
              style={{ 
                color: '#ccc', 
                marginBottom: 12,
                minHeight: '40px',
                lineHeight: 1.4
              }}
            >
              {movie.description 
                ? `${movie.description.slice(0, 80)}${movie.description.length > 80 ? '...' : ''}`
                : 'No description available.'
              }
            </Typography>
            
            <Box display="flex" alignItems="center" mb={1}>
              <AttachMoney style={{ color: '#4caf50', fontSize: '18px' }} />
              <Typography
                style={{ color: '#ccc', marginLeft: 8, fontWeight: '500' }}
                variant="body2"
              >
                {movie.price ? this.formatPrice(movie.price) : 'Rp 50.000'}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={2}>
              <EventSeat style={{ color: '#2196f3', fontSize: '18px' }} />
              <Typography
                style={{ color: '#ccc', marginLeft: 8 }}
                variant="body2"
              >
                {movie.availableSeats || 100} seats available
              </Typography>
            </Box>
            
            <Box mt="auto">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                component={Link}
                to={`/booking/${movie._id}`}
                onClick={() => this.handleBookingClick(movie._id)}
                style={{
                  backgroundColor: '#3f51b5',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '10px 0',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '14px'
                }}
                disabled={movie.availableSeats === 0}
              >
                {movie.availableSeats === 0 ? 'Sold Out' : 'Buy Tickets'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    );
  };

  render() {
    const { classes, movies, user, suggested } = this.props;
    const { loading, error } = this.state;

    return (
      <Fragment>
        <Box className={classes.root}>
          {/* User Suggestions Section */}
          {user && suggested && suggested.length > 0 && (
            <Box mb={4}>
              <Typography
                variant="h5"
                style={{ margin: '20px 0', color: 'white' }}
              >
                Recommended for You
              </Typography>
              <Grid container spacing={3}>
                {suggested.slice(0, 4).map(movie => this.renderMovieCard(movie))}
              </Grid>
            </Box>
          )}

          {/* All Movies Section */}
          <Typography
            variant="h5"
            style={{ margin: '20px 0', color: 'white' }}
          >
            All Movies
          </Typography>

          {/* Loading State */}
          {loading && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress style={{ color: '#3f51b5' }} />
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Box my={4}>
              <Typography variant="body1" style={{ color: '#f44336' }}>
                {error}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={this.fetchInitialData}
                style={{ marginTop: '10px' }}
              >
                Retry
              </Button>
            </Box>
          )}

          {/* Movies Grid */}
          {!loading && !error && (
            <Grid container spacing={3}>
              {movies.length > 0 ? (
                movies.map(movie => this.renderMovieCard(movie))
              ) : (
                <Grid item xs={12}>
                  <Box textAlign="center" py={4}>
                    <Typography variant="h6" style={{ color: '#ccc' }}>
                      No movies available at the moment.
                    </Typography>
                    <Typography variant="body2" style={{ color: '#999', marginTop: '8px' }}>
                      Please check back later for new releases.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  movies: PropTypes.array.isRequired,
  showtimes: PropTypes.array.isRequired,
  suggested: PropTypes.array.isRequired,
  user: PropTypes.object,
  getMovies: PropTypes.func.isRequired,
  getShowtimes: PropTypes.func.isRequired,
  getMovieSuggestion: PropTypes.func.isRequired
};

HomePage.defaultProps = {
  movies: [],
  showtimes: [],
  suggested: [],
  user: null
};

const mapStateToProps = ({ movieState, showtimeState, authState }) => ({
  movies: movieState.movies || [],
  showtimes: showtimeState.showtimes || [],
  suggested: movieState.suggested || [],
  user: authState.user
});

const mapDispatchToProps = {
  getMovies,
  getShowtimes,
  getMovieSuggestion
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(HomePage));