import React, { useEffect, useState, useCallback } from 'react';
import { 
  makeStyles, 
  Grid, 
  Typography, 
  CircularProgress, 
  Card, 
  CardContent, 
  Box,
  Button,
  Alert,
  Chip
} from '@material-ui/core';
import { 
  CheckCircle as CheckCircleIcon, 
  Error as ErrorIcon,
  EventSeat as EventSeatIcon,
  Movie as MovieIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2)
  },
  title: {
    fontSize: '3rem',
    lineHeight: '3rem',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
    '& .MuiCircularProgress-root': {
      marginBottom: theme.spacing(2)
    }
  },
  statusCard: {
    maxWidth: 600,
    margin: '0 auto',
    marginTop: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[8],
    overflow: 'hidden'
  },
  successCard: {
    borderLeft: `6px solid ${theme.palette.success.main}`,
    backgroundColor: theme.palette.success.light + '10'
  },
  errorCard: {
    borderLeft: `6px solid ${theme.palette.error.main}`,
    backgroundColor: theme.palette.error.light + '10'
  },
  statusIcon: {
    fontSize: '4rem',
    marginBottom: theme.spacing(2)
  },
  successIcon: {
    color: theme.palette.success.main
  },
  errorIcon: {
    color: theme.palette.error.main
  },
  statusContent: {
    textAlign: 'center',
    padding: theme.spacing(4)
  },
  statusMessage: {
    marginBottom: theme.spacing(3),
    fontSize: '1.2rem',
    fontWeight: 500
  },
  reservationDetails: {
    marginTop: theme.spacing(3),
    textAlign: 'left'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(1.5),
      color: theme.palette.primary.main
    }
  },
  detailText: {
    fontSize: '1rem',
    color: theme.palette.text.primary
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1)
  },
  retryButton: {
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(3),
    padding: theme.spacing(1.5, 4)
  },
  alert: {
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(1)
  },
  seatChip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText
  }
}));

function Checkin(props) {
  const classes = useStyles();
  const reservationId = props.match?.params?.reservationId;
  
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkinReservations = useCallback(async (id) => {
    if (!id) {
      setError('Invalid reservation ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('jwtToken');
      const url = `${process.env.REACT_APP_API_URL || ''}/reservations/checkin/${id}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reservationData = await response.json();
      
      if (reservationData && reservationData.id) {
        setReservation(reservationData);
      } else {
        throw new Error('Invalid reservation data received');
      }
      
    } catch (error) {
      console.error('Check-in error:', error);
      setError(error.message || 'Failed to check in. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reservationId) {
      checkinReservations(reservationId);
    } else {
      setError('No reservation ID provided');
      setLoading(false);
    }
  }, [reservationId, checkinReservations]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    checkinReservations(reservationId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  const renderLoadingState = () => (
    <Grid item xs={12}>
      <div className={classes.loadingContainer}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="textSecondary">
          Processing check-in...
        </Typography>
      </div>
    </Grid>
  );

  const renderSuccessState = () => (
    <Grid item xs={12}>
      <Card className={`${classes.statusCard} ${classes.successCard}`}>
        <CardContent className={classes.statusContent}>
          <CheckCircleIcon className={`${classes.statusIcon} ${classes.successIcon}`} />
          <Typography variant="h5" className={classes.statusMessage}>
            Check-in Successful! 🎉
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Welcome! Your reservation has been confirmed.
          </Typography>

          {reservation && (
            <Box className={classes.reservationDetails}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <div className={classes.detailItem}>
                    <PersonIcon />
                    <Typography className={classes.detailText}>
                      <span className={classes.detailLabel}>Guest:</span>
                      {reservation.username || reservation.guestName || 'N/A'}
                    </Typography>
                  </div>
                </Grid>

                {reservation.movieTitle && (
                  <Grid item xs={12} sm={6}>
                    <div className={classes.detailItem}>
                      <MovieIcon />
                      <Typography className={classes.detailText}>
                        <span className={classes.detailLabel}>Movie:</span>
                        {reservation.movieTitle}
                      </Typography>
                    </div>
                  </Grid>
                )}

                {reservation.showDate && (
                  <Grid item xs={12} sm={6}>
                    <div className={classes.detailItem}>
                      <ScheduleIcon />
                      <Typography className={classes.detailText}>
                        <span className={classes.detailLabel}>Date:</span>
                        {formatDate(reservation.showDate)}
                      </Typography>
                    </div>
                  </Grid>
                )}

                {reservation.showTime && (
                  <Grid item xs={12} sm={6}>
                    <div className={classes.detailItem}>
                      <ScheduleIcon />
                      <Typography className={classes.detailText}>
                        <span className={classes.detailLabel}>Time:</span>
                        {formatTime(reservation.showTime)}
                      </Typography>
                    </div>
                  </Grid>
                )}

                {reservation.seats && reservation.seats.length > 0 && (
                  <Grid item xs={12}>
                    <div className={classes.detailItem}>
                      <EventSeatIcon />
                      <Box>
                        <Typography className={classes.detailText}>
                          <span className={classes.detailLabel}>Seats:</span>
                        </Typography>
                        <Box mt={1}>
                          {reservation.seats.map((seat, index) => (
                            <Chip
                              key={index}
                              label={seat}
                              size="small"
                              className={classes.seatChip}
                            />
                          ))}
                        </Box>
                      </Box>
                    </div>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          <Alert severity="success" className={classes.alert}>
            Please proceed to the designated area. Enjoy your movie! 🍿
          </Alert>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderErrorState = () => (
    <Grid item xs={12}>
      <Card className={`${classes.statusCard} ${classes.errorCard}`}>
        <CardContent className={classes.statusContent}>
          <ErrorIcon className={`${classes.statusIcon} ${classes.errorIcon}`} />
          <Typography variant="h5" className={classes.statusMessage}>
            Check-in Failed
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {error || 'Something went wrong during check-in.'}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleRetry}
            className={classes.retryButton}
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Try Again'}
          </Button>

          <Alert severity="error" className={classes.alert}>
            If this problem persists, please contact customer support with reservation ID: {reservationId}
          </Alert>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h2">
            Check In
          </Typography>
        </Grid>

        {loading && renderLoadingState()}
        {!loading && !error && reservation && renderSuccessState()}
        {!loading && error && renderErrorState()}
      </Grid>
    </div>
  );
}

export default Checkin;