import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Grid, Typography, Container } from '@material-ui/core';
import { getMovies, getReservations, getCinemas } from '../../../store/actions';
import { MyReservationTable } from './components';
import Account from '../../Admin/Account';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '3rem',
    lineHeight: '3rem',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(3)
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  noReservations: {
    textAlign: 'center',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    color: theme.palette.text.secondary
  },
  [theme.breakpoints.down('sm')]: {
    title: {
      fontSize: '2rem',
      lineHeight: '2rem',
      marginTop: theme.spacing(8)
    },
    fullWidth: { width: '100%' }
  }
}));

function MyDashboard(props) {
  const {
    user,
    reservations,
    movies,
    cinemas,
    getMovies,
    getReservations,
    getCinemas
  } = props;

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getMovies(),
          getReservations(),
          getCinemas()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [getMovies, getReservations, getCinemas]);

  // Memoize filtered reservations to prevent unnecessary re-renders
  const myReservations = useMemo(() => {
    if (!user || !user.username || !Array.isArray(reservations)) {
      return [];
    }
    return reservations.filter(
      reservation => reservation.username === user.username
    );
  }, [reservations, user]);

  const hasReservations = myReservations.length > 0;

  return (
    <Container className={classes.container}>
      <Grid container spacing={3}>
        {hasReservations ? (
          <>
            <Grid item xs={12}>
              <Typography
                className={classes.title}
                variant="h2"
                color="inherit">
                My Reservations
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <MyReservationTable
                reservations={myReservations}
                movies={movies || []}
                cinemas={cinemas || []}
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Typography
              className={classes.noReservations}
              variant="h6"
              color="textSecondary">
              You don't have any reservations yet.
            </Typography>
          </Grid>
        )}
        
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h2" color="inherit">
            My Account
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Account />
        </Grid>
      </Grid>
    </Container>
  );
}

const mapStateToProps = ({
  authState,
  movieState,
  reservationState,
  cinemaState
}) => ({
  user: authState.user,
  movies: movieState.movies,
  reservations: reservationState.reservations,
  cinemas: cinemaState.cinemas
});

const mapDispatchToProps = { getMovies, getReservations, getCinemas };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyDashboard);