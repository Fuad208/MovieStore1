// BookingPage.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Grid, Container, Box } from '@material-ui/core';
import jsPDF from 'jspdf';

import {
  getMovie,
  getCinemasUserModeling,
  getCinema,
  getCinemas,
  getShowtimes,
  getReservations,
  getSuggestedReservationSeats,
  setSelectedSeats,
  setSelectedCinema,
  setSelectedDate,
  setSelectedTime,
  setInvitation,
  toggleLoginPopup,
  showInvitationForm,
  resetCheckout,
  setAlert,
  addReservation,
  setSuggestedSeats,
  setQRCode
} from '../../../store/actions';

import { ResponsiveDialog } from '../../../components';
import LoginForm from '../Login/components/LoginForm';
import styles from './styles';
import MovieInfo from './components/MovieInfo/MovieInfo';
import BookingForm from './components/BookingForm/BookingForm';
import BookingSeats from './components/BookingSeats/BookingSeats';
import BookingCheckout from './components/BookingCheckout/BookingCheckout';
import BookingInvitation from './components/BookingInvitation/BookingInvitation';

class BookingPage extends Component {
  didSetSuggestion = false;

  componentDidMount() {
    const {
      user,
      match,
      getMovie,
      getCinemas,
      getCinemasUserModeling,
      getShowtimes,
      getReservations,
      getSuggestedReservationSeats
    } = this.props;

    // Pastikan movie ID ada
    if (match?.params?.id) {
      getMovie(match.params.id);
    }
    
    // Load cinemas berdasarkan user status
    if (user?.username) {
      getCinemasUserModeling(user.username);
      getSuggestedReservationSeats(user.username);
    } else {
      getCinemas();
    }
    
    getShowtimes();
    getReservations();
  }

  componentDidUpdate(prevProps) {
    const { selectedCinema, selectedDate, getCinema } = this.props;
    
    // Update cinema data ketika cinema atau date berubah
    if (selectedCinema && (
      prevProps.selectedCinema !== selectedCinema ||
      prevProps.selectedDate !== selectedDate
    )) {
      getCinema(selectedCinema);
    }
  }

  jsPdfGenerator = () => {
    const { movie, cinema, selectedDate, selectedTime, QRCode } = this.props;
    
    // Validasi data sebelum generate PDF
    if (!movie || !cinema || !selectedDate || !selectedTime) {
      this.props.setAlert('Data tidak lengkap untuk membuat PDF', 'error');
      return;
    }

    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(movie.title, 20, 20);
      doc.setFontSize(16);
      doc.text(cinema.name, 20, 30);
      doc.text(`Date: ${new Date(selectedDate).toLocaleDateString()} - Time: ${selectedTime}`, 20, 40);
      
      // Tambahkan QR Code jika tersedia
      if (QRCode) {
        doc.addImage(QRCode, 'JPEG', 15, 50, 160, 160);
      }
      
      doc.save(`${movie.title}-${cinema.name}.pdf`);
    } catch (error) {
      this.props.setAlert('Gagal membuat PDF', 'error');
      console.error('PDF generation error:', error);
    }
  };

  onSelectSeat = (row, seat) => {
    const { selectedSeats, setSelectedSeats } = this.props;

    if (!Array.isArray(selectedSeats)) {
      setSelectedSeats([[row, seat]]);
      return;
    }

    const isAlreadySelected = selectedSeats.some(([r, s]) => r === row && s === seat);
    const updatedSelectedSeats = isAlreadySelected
      ? selectedSeats.filter(([r, s]) => !(r === row && s === seat))
      : [...selectedSeats, [row, seat]];

    setSelectedSeats(updatedSelectedSeats);
  };

  checkout = async () => {
    const {
      selectedSeats,
      isAuth,
      toggleLoginPopup,
      addReservation,
      setQRCode,
      getReservations,
      showInvitationForm,
      movie,
      cinema,
      selectedDate,
      selectedTime,
      user,
      setAlert
    } = this.props;

    // Validasi kursi dipilih
    if (!selectedSeats || !selectedSeats.length) {
      setAlert('Silakan pilih kursi terlebih dahulu.', 'error');
      return;
    }

    // Validasi user login
    if (!isAuth) {
      toggleLoginPopup();
      return;
    }

    // Validasi data lengkap
    const startAt = Array.isArray(selectedTime) ? selectedTime[0] : selectedTime;
    if (!user?.username || !user?.phone || !startAt || !movie?._id || !cinema?._id) {
      setAlert('Data profil atau booking belum lengkap.', 'error');
      return;
    }

    const payload = {
      username: user.username,
      phone: user.phone,
      movieId: movie._id,
      cinemaIds: cinema._id,
      date: selectedDate,
      startAt,
      seats: selectedSeats,
      ticketPrice: cinema.ticketPrice || 0,
      total: selectedSeats.length * (cinema.ticketPrice || 0)
    };

    try {
      const res = await addReservation(payload);
      if (res?.status === 'success') {
        if (res.data?.QRCode) {
          setQRCode(res.data.QRCode);
        }
        await getReservations();
        showInvitationForm();
        setAlert('Booking berhasil!', 'success');
      } else {
        setAlert(`Booking gagal: ${res?.message || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      setAlert(`Terjadi kesalahan sistem: ${err.message}`, 'error');
      console.error('Checkout error:', err);
    }
  };

  onFilterCinema = () => {
    const { cinemas, showtimes, selectedCinema, selectedTime } = this.props;
    const initialReturn = { uniqueCinemas: [], uniqueTimes: [] };
    
    if (!showtimes || !Array.isArray(showtimes) || !cinemas || !Array.isArray(cinemas)) {
      return initialReturn;
    }

    // Filter unique cinemas berdasarkan selected time
    const uniqueCinemasId = [...new Set(
      showtimes
        .filter(showtime => selectedTime ? showtime.startAt === selectedTime : true)
        .map(showtime => showtime.cinemaIds)
        .filter(Boolean)
    )];

    const uniqueCinemas = cinemas.filter(cinema => uniqueCinemasId.includes(cinema._id));

    // Filter unique times berdasarkan selected cinema
    const uniqueTimes = [...new Set(
      showtimes
        .filter(showtime => selectedCinema ? selectedCinema === showtime.cinemaIds : true)
        .map(showtime => showtime.startAt)
        .filter(Boolean)
    )].sort((a, b) => {
      // Improved time sorting
      const timeA = new Date(`1970/01/01 ${a}`);
      const timeB = new Date(`1970/01/01 ${b}`);
      return timeA - timeB;
    });

    return { uniqueCinemas, uniqueTimes };
  };

  onGetReservedSeats = () => {
    const { reservations, cinema, selectedDate, selectedTime } = this.props;
    
    if (!cinema?.seats || !Array.isArray(cinema.seats) || !reservations || !Array.isArray(reservations)) {
      return [];
    }

    // Deep clone seats array
    const newSeats = cinema.seats.map(row => 
      Array.isArray(row) ? [...row] : []
    );

    // Filter reservations untuk tanggal dan waktu yang dipilih
    const relevantReservations = reservations.filter(r => {
      if (!r.date || !r.startAt || !selectedDate || !selectedTime) return false;
      
      const reservationDate = new Date(r.date).toLocaleDateString();
      const selectedDateStr = new Date(selectedDate).toLocaleDateString();
      
      return reservationDate === selectedDateStr && r.startAt === selectedTime;
    });

    // Mark reserved seats
    relevantReservations.forEach(reservation => {
      if (reservation.seats && Array.isArray(reservation.seats)) {
        reservation.seats.forEach(([row, seat]) => {
          if (newSeats[row] && newSeats[row][seat] !== undefined) {
            newSeats[row][seat] = 1; // Mark as reserved
          }
        });
      }
    });

    return newSeats;
  };

  render() {
    const {
      classes,
      user,
      movie,
      cinema,
      showtimes,
      selectedSeats,
      selectedCinema,
      selectedDate,
      selectedTime,
      showLoginPopup,
      toggleLoginPopup,
      showInvitation,
      invitations,
      setInvitation,
      resetCheckout,
      setSelectedCinema,
      setSelectedDate,
      setSelectedTime,
      setSelectedSeats
    } = this.props;

    const { uniqueCinemas, uniqueTimes } = this.onFilterCinema();
    const seats = this.onGetReservedSeats();
    const seatsAvailable = seats.length > 0 
      ? seats.flat().filter(seat => seat === 0).length 
      : 0;

    return (
      <Container maxWidth="xl" className={classes.container}>
        <Grid container spacing={2} style={{ height: '100%' }}>
          <MovieInfo movie={movie} />
          <Grid item lg={9} xs={12} md={12}>
            <BookingForm
              cinemas={uniqueCinemas}
              times={uniqueTimes}
              showtimes={showtimes || []}
              selectedCinema={selectedCinema}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onChangeCinema={e => setSelectedCinema(e.target.value)}
              onChangeDate={date => setSelectedDate(date)}
              onChangeTime={e => setSelectedTime(e.target.value)}
              onSeatSelected={setSelectedSeats}
              seats={seats}
              onSelectSeat={this.onSelectSeat}
            />
            
            {showInvitation && selectedSeats && selectedSeats.length > 0 ? (
              <BookingInvitation
                selectedSeats={selectedSeats}
                sendInvitations={this.sendInvitations}
                ignore={resetCheckout}
                invitations={invitations || {}}
                onSetInvitation={setInvitation}
                onDownloadPDF={this.jsPdfGenerator}
              />
            ) : cinema && selectedCinema && selectedTime ? (
              <BookingCheckout
                user={user}
                ticketPrice={cinema.ticketPrice || 0}
                seatsAvailable={seatsAvailable}
                selectedSeats={selectedSeats ? selectedSeats.length : 0}
                onBookSeats={this.checkout}
              />
            ) : (
              <Box textAlign="center" color="white" mt={2}>
                <p>Pilih cinema, tanggal, dan waktu untuk melanjutkan booking</p>
              </Box>
            )}
          </Grid>
        </Grid>

        <ResponsiveDialog
          id="login-dialog"
          open={showLoginPopup || false}
          handleClose={() => toggleLoginPopup()}
          maxWidth="sm"
        >
          <LoginForm />
        </ResponsiveDialog>
      </Container>
    );
  }
}

BookingPage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = ({
  authState,
  movieState,
  cinemaState,
  showtimeState,
  reservationState,
  checkoutState
}, ownProps) => ({
  isAuth: authState?.isAuthenticated || false,
  user: authState?.user || null,
  movie: movieState?.selectedMovie || null,
  cinema: cinemaState?.selectedCinema || null,
  cinemas: cinemaState?.cinemas || [],
  showtimes: showtimeState?.showtimes?.filter(s => 
    s.movieId === ownProps.match?.params?.id
  ) || [],
  reservations: reservationState?.reservations || [],
  selectedSeats: checkoutState?.selectedSeats || [],
  suggestedSeat: checkoutState?.suggestedSeat || null,
  selectedCinema: checkoutState?.selectedCinema || '',
  selectedDate: checkoutState?.selectedDate || null,
  selectedTime: checkoutState?.selectedTime || '',
  showLoginPopup: checkoutState?.showLoginPopup || false,
  showInvitation: checkoutState?.showInvitation || false,
  invitations: checkoutState?.invitations || {},
  QRCode: checkoutState?.QRCode || null,
  suggestedSeats: reservationState?.suggestedSeats || []
});

export default connect(mapStateToProps, {
  getMovie,
  getCinema,
  getCinemasUserModeling,
  getCinemas,
  getShowtimes,
  getReservations,
  getSuggestedReservationSeats,
  addReservation,
  setSelectedSeats,
  setSuggestedSeats,
  setSelectedCinema,
  setSelectedDate,
  setSelectedTime,
  setInvitation,
  toggleLoginPopup,
  showInvitationForm,
  resetCheckout,
  setAlert,
  setQRCode
})(withStyles(styles)(BookingPage));