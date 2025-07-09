import { CHECKOUT_TYPES } from '../types/checkout';

const initialState = {
  selectedSeats: [],
  suggestedSeats: [],
  selectedCinema: null,
  selectedDate: null,
  selectedTime: null,
  selectedMovie: null,
  showLoginPopup: false,
  showInvitationForm: false,
  invitation: null,
  qrCode: null,
  loading: false,
  error: null,
  checkoutComplete: false
};

const checkoutReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CHECKOUT_TYPES.SET_SELECTED_SEATS:
      return {
        ...state,
        selectedSeats: Array.isArray(payload) ? payload : []
      };
    
    case CHECKOUT_TYPES.CLEAR_SELECTED_SEATS:
      return {
        ...state,
        selectedSeats: []
      };
    
    case CHECKOUT_TYPES.SET_SUGGESTED_SEATS:
      return {
        ...state,
        suggestedSeats: Array.isArray(payload) ? payload : []
      };
    
    case CHECKOUT_TYPES.SET_SELECTED_CINEMA:
      return {
        ...state,
        selectedCinema: payload
      };
    
    case CHECKOUT_TYPES.SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: payload
      };
    
    case CHECKOUT_TYPES.SET_SELECTED_TIME:
      return {
        ...state,
        selectedTime: payload
      };
    
    case CHECKOUT_TYPES.SET_SELECTED_MOVIE:
      return {
        ...state,
        selectedMovie: payload
      };
    
    case CHECKOUT_TYPES.SET_LOGIN_POPUP:
      return {
        ...state,
        showLoginPopup: payload
      };
    
    case CHECKOUT_TYPES.TOGGLE_LOGIN_POPUP:
      return {
        ...state,
        showLoginPopup: !state.showLoginPopup
      };
    
    case CHECKOUT_TYPES.SHOW_INVITATION_FORM:
      return {
        ...state,
        showInvitationForm: payload
      };
    
    case CHECKOUT_TYPES.HIDE_INVITATION_FORM:
      return {
        ...state,
        showInvitationForm: false
      };
    
    case CHECKOUT_TYPES.SET_INVITATION:
      return {
        ...state,
        invitation: payload
      };
    
    case CHECKOUT_TYPES.CLEAR_INVITATION:
      return {
        ...state,
        invitation: null
      };
    
    case CHECKOUT_TYPES.SET_QR_CODE:
      return {
        ...state,
        qrCode: payload
      };
    
    case CHECKOUT_TYPES.CLEAR_QR_CODE:
      return {
        ...state,
        qrCode: null
      };
    
    case CHECKOUT_TYPES.CHECKOUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case CHECKOUT_TYPES.CHECKOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        checkoutComplete: true,
        qrCode: payload.qrCode || null
      };
    
    case CHECKOUT_TYPES.CHECKOUT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    
    case CHECKOUT_TYPES.SET_CHECKOUT_LOADING:
      return {
        ...state,
        loading: payload
      };
    
    case CHECKOUT_TYPES.SET_CHECKOUT_ERROR:
      return {
        ...state,
        error: payload
      };
    
    case CHECKOUT_TYPES.CLEAR_CHECKOUT_ERROR:
      return {
        ...state,
        error: null
      };
    
    case CHECKOUT_TYPES.RESET_CHECKOUT:
      return {
        ...initialState
      };
    
    default:
      return state;
  }
};

export default checkoutReducer;