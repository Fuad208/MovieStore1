import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Paper } from '../../../../components';
import { EventSeat, AttachMoney } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    paddingBottom: theme.spacing(2),
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    }
  },
  imageWrapper: {
    height: '200px',
    margin: '0 auto',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  details: { 
    padding: theme.spacing(3),
    minHeight: '120px'
  },
  name: {
    fontSize: '18px',
    lineHeight: '21px',
    marginTop: theme.spacing(1),
    textTransform: 'capitalize',
    fontWeight: 600,
    color: theme.palette.text.primary
  },
  city: {
    lineHeight: '16px',
    height: 'auto',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    fontSize: '14px'
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  },
  eventIcon: {
    color: theme.palette.primary.main,
    fontSize: '20px'
  },
  eventText: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontWeight: 500
  },
  priceHighlight: {
    color: theme.palette.primary.main,
    fontWeight: 'bold'
  },
  // Responsive design
  [theme.breakpoints.down('sm')]: {
    imageWrapper: {
      height: '150px'
    },
    name: {
      fontSize: '16px',
      lineHeight: '19px'
    },
    details: {
      padding: theme.spacing(2),
      minHeight: '100px'
    },
    stats: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  }
}));

function CinemaCard(props) {
  const classes = useStyles(props);
  const { className, cinema, onCinemaClick } = props;
  
  // Validate cinema data
  if (!cinema) {
    return null;
  }

  const cinemaImage = cinema.image || 'https://source.unsplash.com/featured/?cinema,theater';

  const handleCinemaClick = () => {
    console.log('Cinema card clicked:', cinema.name);
    if (onCinemaClick && typeof onCinemaClick === 'function') {
      onCinemaClick(cinema);
    }
  };

  const rootClassName = classNames(classes.root, className);

  return (
    <Paper className={rootClassName} onClick={handleCinemaClick}>
      <div className={classes.imageWrapper}>
        <img
          alt={`${cinema.name} cinema`}
          className={classes.image}
          src={cinemaImage}
          onError={(e) => {
            e.target.src = 'https://source.unsplash.com/featured/?cinema,theater';
          }}
        />
      </div>
      <div className={classes.details}>
        <Typography className={classes.name} variant="h5">
          {cinema.name || 'Unknown Cinema'}
        </Typography>
        <Typography className={classes.city} variant="body2">
          {cinema.city || 'Unknown City'}
        </Typography>
      </div>
      <div className={classes.stats}>
        <AttachMoney className={classes.eventIcon} />
        <Typography className={classes.eventText} variant="body2">
          <span className={classes.priceHighlight}>
            {cinema.ticketPrice || 'N/A'}
          </span>
          <span>&euro;</span> per movie
        </Typography>
      </div>
      <div className={classes.stats}>
        <EventSeat className={classes.eventIcon} />
        <Typography className={classes.eventText} variant="body2">
          <span className={classes.priceHighlight}>
            {cinema.seatsAvailable || 0}
          </span> seats available
        </Typography>
      </div>
    </Paper>
  );
}

export default CinemaCard;