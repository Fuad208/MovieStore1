import React from 'react';
import {
  Grid,
  Box,
  TextField,
  MenuItem,
  Typography
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import BookingSeats from '../BookingSeats/BookingSeats';

export default function BookingForm(props) {
  const {
    cinemas,
    showtimes,
    selectedCinema,
    onChangeCinema,
    selectedDate,
    onChangeDate,
    times,
    selectedTime,
    onChangeTime,
    seats,
    onSelectSeat
  } = props;

  // Cari showtime berdasarkan cinema yang dipilih
  const showtime = showtimes && Array.isArray(showtimes) 
    ? showtimes.find(showtime => showtime.cinemaIds === selectedCinema)
    : null;

  // Jika tidak ada cinema tersedia, tampilkan pesan
  if (!cinemas || !Array.isArray(cinemas) || !cinemas.length) {
    return (
      <Box
        display="flex"
        width={1}
        height={1}
        alignItems="center"
        justifyContent="center"
        minHeight="200px">
        <Typography align="center" variant="h5" color="textSecondary">
          No Cinema Available.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Dropdown Cinema */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          select
          value={selectedCinema || ''}
          label="Select Cinema"
          variant="outlined"
          onChange={onChangeCinema}
          disabled={!cinemas.length}>
          {cinemas.map(cinema => (
            <MenuItem key={cinema._id} value={cinema._id}>
              {cinema.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Tanggal Tersedia */}
      {showtime && (
        <Grid item xs={12} sm={6} md={4}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              inputVariant="outlined"
              margin="none"
              fullWidth
              id="start-date"
              label="Start Date"
              format="MM/DD/YYYY"
              minDate={new Date(showtime.startDate)}
              maxDate={new Date(showtime.endDate)}
              value={selectedDate}
              onChange={(date) => onChangeDate(date ? date.toDate() : null)}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
              error={false}
              helperText={null}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      )}

      {/* Waktu tersedia */}
      {selectedDate && Array.isArray(times) && times.length > 0 && (
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            select
            value={selectedTime || ''}
            label="Select Time"
            variant="outlined"
            onChange={onChangeTime}>
            {times.map((time, index) => (
              <MenuItem key={`${time}-${index}`} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      )}

      {/* Tampilan tempat duduk */}
      {selectedTime && seats && Array.isArray(seats) && seats.length > 0 && (
        <Grid item xs={12}>
          <Box mt={3}>
            <Typography variant="h6" gutterBottom style={{ color: '#fff' }}>
              Select Your Seats
            </Typography>
            <BookingSeats
              seats={seats}
              onSelectSeat={onSelectSeat}
            />
          </Box>
        </Grid>
      )}

      {/* Pesan jika belum ada data seats */}
      {selectedTime && (!seats || !Array.isArray(seats) || seats.length === 0) && (
        <Grid item xs={12}>
          <Box mt={3} textAlign="center">
            <Typography variant="body1" color="textSecondary">
              Seat information not available for selected time.
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}