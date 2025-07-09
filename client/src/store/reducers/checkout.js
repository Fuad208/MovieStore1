import {
  SET_SELECTED_SEATS,
  SET_SUGGESTED_SEATS,
  SET_SELECTED_CINEMA,
  SET_SELECTED_DATE,
  SET_SELECTED_TIME,
  TOGGLE_LOGIN_POPUP,
  SHOW_INVITATION_FORM,
  SET_INVITATION,
  SET_QR_CODE,
  RESET_CHECKOUT
} from '../types/checkout';

const initialState = {
  selectedSeats: [],
  suggestedSeats: [],
  selectedCinema: null,
  selectedDate: null,
  selectedTime: null,
  showLoginPopup: false,
  showInvitationForm: false,
  invitation: null,
  qrCode: null,
  loading: false,
  error: null
};

const checkoutReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_SELECTED_SEATS:
      return {
        ...state,
        selectedSeats: Array.isArray(payload) ? payload : []
      };
    
    case SET_SUGGESTED_SEATS:
      return {
        ...state,
        suggestedSeats: Array.isArray(payload) ? payload : []
      };
    
    case SET_SELECTED_CINEMA:
      return {
        ...state,
        selectedCinema: payload
      };
    
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: payload
      };
    
    case SET_SELECTED_TIME:
      return {
        ...state,
        selectedTime: payload
      };
    
    case TOGGLE_LOGIN_POPUP:
      return {
        ...state,
        showLoginPopup: !state.showLoginPopup
      };
    
    case SHOW_INVITATION_FORM:
      return {
        ...state,
        showInvitationForm: payload
      };
    
    case SET_INVITATION:
      return {
        ...state,
        invitation: payload
      };
    
    case SET_QR_CODE:
      return {
        ...state,
        qrCode: payload
      };
    
    case RESET_CHECKOUT:
      return {
        ...initialState
      };
    
    default:
      return state;
  }
};

export default checkoutReducer;