import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, Grid, Button, Box, CircularProgress } from '@material-ui/core';
import { Paper } from '../../../../../components';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3)
  },
  paper: { 
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3]
  },
  gridContainer: {
    marginTop: theme.spacing(4)
  },
  successInfo: { 
    margin: theme.spacing(3),
    color: theme.palette.success.main,
    fontWeight: 500
  },
  ignoreButton: {
    marginLeft: theme.spacing(3)
  },
  downloadButton: {
    marginBottom: theme.spacing(3),
    minWidth: '200px',
    height: '48px'
  },
  seatLabel: {
    fontWeight: 'bold',
    color: theme.palette.primary.main
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3)
  },
  emailField: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  }
}));

const convertToAlphabet = value => (value + 10).toString(36).toUpperCase();

export default function BookingInvitation(props) {
  const classes = useStyles();
  const {
    selectedSeats = [],
    sendInvitations,
    ignore,
    invitations = {},
    onSetInvitation,
    onDownloadPDF,
    loading = false
  } = props;

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const notValidInvitations = !Object.keys(invitations).length || 
    selectedSeats.some(seat => {
      const seatKey = `${convertToAlphabet(seat[0])}-${seat[1]}`;
      return !invitations[seatKey] || !isValidEmail(invitations[seatKey]);
    });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleDownloadPDF = async () => {
    if (onDownloadPDF) {
      setIsDownloading(true);
      try {
        await onDownloadPDF();
      } catch (error) {
        console.error('Error downloading PDF:', error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleSendInvitations = async () => {
    if (sendInvitations && !notValidInvitations) {
      setIsSending(true);
      try {
        await sendInvitations();
      } catch (error) {
        console.error('Error sending invitations:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleIgnore = () => {
    if (ignore) {
      ignore();
    }
  };

  const handleEmailChange = (event) => {
    if (onSetInvitation) {
      onSetInvitation(event);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h4" align="center" gutterBottom>
          Guest Invitation
        </Typography>
        
        <Typography
          className={classes.successInfo}
          variant="body1"
          align="center"
        >
          🎉 You have successfully booked your seats!
        </Typography>

        <Box width={1} textAlign="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={classes.downloadButton}
            startIcon={isDownloading ? <CircularProgress size={20} /> : null}
          >
            {isDownloading ? 'Downloading...' : 'Download Pass'}
          </Button>
        </Box>

        {/* Uncomment this section if you want to enable email invitations */}
        {selectedSeats.length > 0 && (
          <Grid className={classes.gridContainer} container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Send Invitations to Guests
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Enter email addresses for each seat to send invitation passes
              </Typography>
            </Grid>
            
            {selectedSeats.map((seat, index) => {
              const seatKey = `${convertToAlphabet(seat[0])}-${seat[1]}`;
              const currentEmail = invitations[seatKey] || '';
              const isEmailValid = !currentEmail || isValidEmail(currentEmail);
              
              return (
                <Grid item xs={12} md={6} lg={4} key={`seat-${index}`}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name={seatKey}
                    helperText={
                      !isEmailValid 
                        ? 'Please enter a valid email address'
                        : `Invitation for Row ${convertToAlphabet(seat[0])}, Seat ${seat[1]}`
                    }
                    error={!isEmailValid}
                    margin="dense"
                    value={currentEmail}
                    variant="outlined"
                    onChange={handleEmailChange}
                    className={classes.emailField}
                    placeholder="guest@example.com"
                    type="email"
                  />
                  <Typography variant="caption" className={classes.seatLabel}>
                    Row {convertToAlphabet(seat[0])} - Seat {seat[1]}
                  </Typography>
                </Grid>
              );
            })}
            
            <Grid item xs={12}>
              <Box className={classes.buttonContainer}>
                <Button
                  disabled={notValidInvitations || isSending}
                  color="primary"
                  variant="contained"
                  onClick={handleSendInvitations}
                  startIcon={isSending ? <CircularProgress size={20} /> : null}
                >
                  {isSending ? 'Sending...' : 'Send Invitations'}
                </Button>
                
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={handleIgnore}
                  disabled={isSending}
                >
                  Skip Invitations
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>
    </div>
  );
}