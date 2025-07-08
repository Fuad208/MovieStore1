import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
    backgroundColor: 'rgb(18, 20, 24)',
    borderRadius: theme.spacing(1),
    overflow: 'hidden'
  },
  bannerTitle: {
    fontSize: theme.spacing(1.4),
    textTransform: 'uppercase',
    color: 'rgb(93, 93, 97)',
    marginBottom: theme.spacing(1),
    fontWeight: 500
  },
  bannerContent: {
    fontSize: theme.spacing(2),
    textTransform: 'capitalize',
    color: theme.palette.common.white,
    fontWeight: 600
  },
  contentSection: {
    padding: theme.spacing(2.5),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3)
    }
  },
  checkoutSection: {
    color: 'rgb(120, 205, 4)',
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100px'
  },
  checkoutButton: {
    fontSize: theme.spacing(1.8),
    fontWeight: 'bold',
    height: '100%',
    minHeight: '60px',
    '&:disabled': {
      color: 'rgba(120, 205, 4, 0.3)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  },
  priceHighlight: {
    color: 'rgb(120, 205, 4)',
    fontWeight: 'bold'
  },
  [theme.breakpoints.down('sm')]: {
    hideOnSmall: {
      display: 'none'
    },
    bannerTitle: {
      fontSize: theme.spacing(1.2)
    },
    bannerContent: {
      fontSize: theme.spacing(1.6)
    }
  }
}));

export default function BookingCheckout(props) {
  const classes = useStyles();
  const {
    user,
    ticketPrice = 0,
    selectedSeats = 0,
    seatsAvailable = 0,
    onBookSeats,
    loading = false
  } = props;

  const totalPrice = ticketPrice * selectedSeats;
  const isBookingDisabled = selectedSeats <= 0 || loading;

  const handleBookSeats = () => {
    if (onBookSeats && !isBookingDisabled) {
      onBookSeats();
    }
  };

  return (
    <Box className={classes.container}>
      <Grid container>
        <Grid item xs={8} md={10}>
          <Grid container spacing={3} className={classes.contentSection}>
            {user && user.name && (
              <Grid item className={classes.hideOnSmall}>
                <Typography className={classes.bannerTitle}>Name</Typography>
                <Typography className={classes.bannerContent}>
                  {user.name}
                </Typography>
              </Grid>
            )}
            
            <Grid item>
              <Typography className={classes.bannerTitle}>Tickets</Typography>
              <Typography className={classes.bannerContent}>
                {selectedSeats > 0 ? `${selectedSeats} tickets` : '0 tickets'}
              </Typography>
            </Grid>
            
            <Grid item>
              <Typography className={classes.bannerTitle}>Price</Typography>
              <Typography className={`${classes.bannerContent} ${classes.priceHighlight}`}>
                €{totalPrice.toFixed(2)}
              </Typography>
            </Grid>

            {seatsAvailable > 0 && (
              <Grid item className={classes.hideOnSmall}>
                <Typography className={classes.bannerTitle}>Available</Typography>
                <Typography className={classes.bannerContent}>
                  {seatsAvailable} seats
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        
        <Grid item xs={4} md={2} className={classes.checkoutSection}>
          <Button
            color="inherit"
            fullWidth
            disabled={isBookingDisabled}
            onClick={handleBookSeats}
            className={classes.checkoutButton}
            variant="contained"
          >
            {loading ? 'Processing...' : 'Checkout'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}