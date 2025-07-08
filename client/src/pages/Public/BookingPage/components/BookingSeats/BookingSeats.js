import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
  },
  screen: {
    width: '100%',
    height: 4,
    backgroundColor: '#fff',
    marginBottom: theme.spacing(3),
    borderRadius: 2,
    position: 'relative',
    '&::after': {
      content: '"SCREEN"',
      position: 'absolute',
      top: -25,
      left: '50%',
      transform: 'translateX(-50%)',
      color: '#fff',
      fontSize: 12,
      fontWeight: 600,
    }
  },
  seatsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  rowLabel: {
    color: '#fff',
    width: 30,
    marginRight: theme.spacing(1),
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 14,
  },
  seat: {
    cursor: 'pointer',
    color: '#fff',
    borderRadius: 4,
    padding: theme.spacing(0.5),
    margin: theme.spacing(0.25),
    fontWeight: 600,
    fontSize: 10,
    textAlign: 'center',
    minWidth: 28,
    minHeight: 28,
    border: '1px solid transparent',
    transition: 'all 0.3s ease',
    '&:hover': {
      opacity: 0.8,
      transform: 'scale(1.05)',
    },
  },
  seatDisabled: {
    cursor: 'not-allowed',
    '&:hover': {
      opacity: 1,
      transform: 'none',
    },
  },
  hiddenSeat: {
    visibility: 'hidden',
    margin: theme.spacing(0.25),
    minWidth: 28,
    minHeight: 28,
  },
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    color: '#eee',
    marginTop: theme.spacing(3),
    gap: theme.spacing(2),
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(0.5),
  },
  legendBox: {
    width: 16,
    height: 16,
    marginRight: theme.spacing(1),
    borderRadius: 2,
    border: '1px solid #ccc',
  },
}));

const getSeatColor = status => {
  switch (status) {
    case 0: return '#6c757d';        // Available (gray)
    case 1: return '#dc3545';        // Reserved (red)
    case 2: return '#28a745';        // Selected (green)
    case 3: return '#007bff';        // Recommended (blue)
    default: return '#6c757d';
  }
};

const getSeatStatus = status => {
  switch (status) {
    case 0: return 'available';
    case 1: return 'reserved';
    case 2: return 'selected';
    case 3: return 'recommended';
    default: return 'available';
  }
};

const convertToAlphabet = (index) => {
  return String.fromCharCode(65 + index); // A, B, C, etc.
};

export default function BookingSeats({ seats = [], onSelectSeat }) {
  const classes = useStyles();

  // Validasi input seats
  const isValidSeats = Array.isArray(seats) && seats.length > 0;

  if (!isValidSeats) {
    return (
      <Box className={classes.container}>
        <Typography align="center" color="textSecondary">
          Seat information not available.
        </Typography>
      </Box>
    );
  }

  // Handle seat click
  const handleSeatClick = (rowIndex, seatIndex, seatStatus) => {
    // Jangan bisa klik jika kursi sudah reserved
    if (seatStatus === 1) return;
    
    if (onSelectSeat) {
      onSelectSeat(rowIndex, seatIndex);
    }
  };

  return (
    <Box className={classes.container}>
      {/* Screen indicator */}
      <Box className={classes.screen} />
      
      {/* Seats layout */}
      <Box className={classes.seatsContainer}>
        {seats.map((row, rowIndex) => {
          if (!Array.isArray(row)) return null;
          
          const rowLabel = convertToAlphabet(rowIndex);
          
          return (
            <div key={`row-${rowIndex}`} className={classes.row}>
              <div className={classes.rowLabel}>{rowLabel}</div>
              {row.map((seatStatus, seatIndex) => {
                // Null berarti tidak ada kursi (gang/jalan)
                if (seatStatus === null || seatStatus === undefined) {
                  return (
                    <div key={`seat-${rowIndex}-${seatIndex}`} className={classes.hiddenSeat}>
                      -
                    </div>
                  );
                }

                const seatNumber = seatIndex + 1;
                const seatColor = getSeatColor(seatStatus);
                const seatStatusText = getSeatStatus(seatStatus);
                const isClickable = seatStatus !== 1; // Reserved seats are not clickable
                
                return (
                  <Box
                    key={`seat-${rowIndex}-${seatIndex}`}
                    className={`${classes.seat} ${!isClickable ? classes.seatDisabled : ''}`}
                    style={{ 
                      backgroundColor: seatColor,
                      borderColor: seatStatus === 2 ? '#28a745' : 'transparent'
                    }}
                    onClick={() => handleSeatClick(rowIndex, seatIndex, seatStatus)}
                    title={`${rowLabel}${seatNumber} - ${seatStatusText}`}
                  >
                    {seatNumber}
                  </Box>
                );
              })}
            </div>
          );
        })}
      </Box>

      {/* Legend */}
      <Box className={classes.legendContainer}>
        <div className={classes.legendItem}>
          <div className={classes.legendBox} style={{ backgroundColor: '#6c757d' }} />
          <Typography variant="caption">Available</Typography>
        </div>
        <div className={classes.legendItem}>
          <div className={classes.legendBox} style={{ backgroundColor: '#dc3545' }} />
          <Typography variant="caption">Reserved</Typography>
        </div>
        <div className={classes.legendItem}>
          <div className={classes.legendBox} style={{ backgroundColor: '#28a745' }} />
          <Typography variant="caption">Selected</Typography>
        </div>
        <div className={classes.legendItem}>
          <div className={classes.legendBox} style={{ backgroundColor: '#007bff' }} />
          <Typography variant="caption">Recommended</Typography>
        </div>
      </Box>
    </Box>
  );
}