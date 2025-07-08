import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, Grid } from '@material-ui/core';
import {
  TotalUsers,
  TotalCinemas,
  TotalMovies,
  TotalReservations,
  BestMovies,
  UsersByDevice
} from './components';
import {
  getUsers,
  getCinemas,
  getMovies,
  getReservations
} from '../../../store/actions';

const styles = theme => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing(4)
  }
});

class Dashboard extends Component {
  componentDidMount() {
    this.props.getUsers();
    this.props.getCinemas();
    this.props.getMovies();
    this.props.getReservations();
  }

  getBestMovies = (reservations = [], movies = [], total = 5) => {
    if (!reservations.length || !movies.length) return [];

    // Count reservations per movie
    const movieReservationCount = reservations.reduce((acc, reservation) => {
      if (reservation.movieId) {
        acc[reservation.movieId] = (acc[reservation.movieId] || 0) + 1;
      }
      return acc;
    }, {});

    // Convert to array and sort by count
    const movieCounts = Object.entries(movieReservationCount)
      .map(([movieId, count]) => ({ movieId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, total);

    // Map to include movie details
    return movieCounts.map(item => ({
      movie: movies.find(movie => movie._id === item.movieId),
      count: item.count
    })).filter(item => item.movie); // Filter out items where movie is not found
  };

  render() {
    const { classes, users = [], cinemas = [], movies = [], reservations = [] } = this.props;
    const bestMovies = this.getBestMovies(reservations, movies, 5);

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalUsers users={users.length} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalCinemas cinemas={cinemas.length} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalMovies movies={movies.length} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalReservations reservations={reservations.length} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <BestMovies bestMovies={bestMovies} />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <UsersByDevice />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({
  userState = { users: [] },
  cinemaState = { cinemas: [] },
  movieState = { movies: [] },
  reservationState = { reservations: [] }
}) => ({
  users: userState.users || [],
  cinemas: cinemaState.cinemas || [],
  movies: movieState.movies || [],
  reservations: reservationState.reservations || []
});

const mapDispatchToProps = {
  getUsers,
  getCinemas,
  getMovies,
  getReservations
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Dashboard));