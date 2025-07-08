import {
  SET_SELECTED_SEATS,
  SET_SELECTED_CINEMA,
  SET_SELECTED_DATE,
  SET_SELECTED_TIME,
  TOGGLE_LOGIN_POPUP,
  SHOW_INVITATION_FORM,
  RESET_CHECKOUT,
  SET_INVITATION,
  SET_SUGGESTED_SEATS,
  SET_QR_CODE,
  CLEAR_SELECTED_SEATS,
  CLEAR_SUGGESTED_SEATS
} from '../types';

const initialState = {
  selectedSeats: [],
  suggestedSeats: [],
  selectedCinema: null,
  selectedDate: null,
  selectedTime: null,
  showLoginPopup: false,
  showInvitation: false,
  invitations: {},
  QRCode: null,
  loading: false,
  error: null
};

// Helper function to check if seat exists in array
const seatExists = (seats, targetSeat) => {
  return seats.some(seat => 
    seat.row === targetSeat.row && 
    seat.number === targetSeat.number
  );
};

const setSelectedSeats = (state, seat) => {
  const exists = seatExists(state.selectedSeats, seat);
  
  return {
    ...state,
    selectedSeats: exists
      ? state.selectedSeats.filter(s => 
          !(s.row === seat.row && s.number === seat.number)
        )
      : [...state.selectedSeats, seat],
    error: null
  };
};

const setSuggestedSeats = (state, seats) => {
  // Ensure seats is an array
  const seatsArray = Array.isArray(seats) ? seats : [seats];
  
  return {
    ...state,
    suggestedSeats: seatsArray,
    error: null
  };
};

const setSelectedCinema = (state, selectedCinema) => ({
  ...state,
  selectedCinema,
  error: null
});

const setSelectedDate = (state, selectedDate) => ({
  ...state,
  selectedDate,
  error: null
});

const setSelectedTime = (state, selectedTime) => ({
  ...state,
  selectedTime,
  error: null
});

const setInvitation = (state, event) => {
  const { name, value } = event.target || event;
  
  return {
    ...state,
    invitations: {
      ...state.invitations,
      [name]: value
    },
    error: null
  };
};

const setQRCode = (state, QRCode) => ({
  ...state,
  QRCode,
  error: null
});

const toggleLoginPopup = (state) => ({
  ...state,
  showLoginPopup: !state.showLoginPopup
});

const showInvitationForm = (state) => ({
  ...state,
  showInvitation: !state.showInvitation
});

const clearSelectedSeats = (state) => ({
  ...state,
  selectedSeats: []
});

const clearSuggestedSeats = (state) => ({
  ...state,
  suggestedSeats: []
});

const resetCheckout = () => ({
  ...initialState
});

const checkoutReducer = (state = initialState, action) => {
  const { type, payload } = action;
  
  switch (type) {
    case SET_SELECTED_SEATS:
      return setSelectedSeats(state, payload);
      
    case SET_SUGGESTED_SEATS:
      return setSuggestedSeats(state, payload);
      
    case SET_SELECTED_CINEMA:
      return setSelectedCinema(state, payload);
      
    case SET_SELECTED_DATE:
      return setSelectedDate(state, payload);
      
    case SET_SELECTED_TIME:
      return setSelectedTime(state, payload);
      
    case SET_INVITATION:
      return setInvitation(state, payload);
      
    case SET_QR_CODE:
      return setQRCode(state, payload);
      
    case TOGGLE_LOGIN_POPUP:
      return toggleLoginPopup(state);
      
    case SHOW_INVITATION_FORM:
      return showInvitationForm(state);
      
    case CLEAR_SELECTED_SEATS:
      return clearSelectedSeats(state);
      
    case CLEAR_SUGGESTED_SEATS:
      return clearSuggestedSeats(state);
      
    case RESET_CHECKOUT:
      return resetCheckout();
      
    default:
      return state;
  }
};

export default checkoutReducer;