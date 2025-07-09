import { CHECKOUT_TYPES } from '../types/checkout';
import { setAlert } from './alert';

// Enhanced checkout actions with validation
export const setSelectedSeats = (seats) => {
  if (!Array.isArray(seats)) {
    console.warn('setSelectedSeats: Expected array, got:', typeof seats);
    seats = [];
  }
  
  return {
    type: CHECKOUT_TYPES.SET_SELECTED_SEATS,
    payload: seats
  };
};

export const clearSelectedSeats = () => ({
  type: CHECKOUT_TYPES.CLEAR_SELECTED_SEATS
});

export const setSuggestedSeats = (seats) => ({
  type: CHECKOUT_TYPES.SET_SUGGESTED_SEATS,
  payload: Array.isArray(seats) ? seats : []
});

export const setSelectedCinema = (cinema) => ({
  type: CHECKOUT_TYPES.SET_SELECTED_CINEMA,
  payload: cinema
});

export const setSelectedDate = (date) => ({
  type: CHECKOUT_TYPES.SET_SELECTED_DATE,
  payload: date
});

export const setSelectedTime = (time) => ({
  type: CHECKOUT_TYPES.SET_SELECTED_TIME,
  payload: time
});

export const setSelectedMovie = (movie) => ({
  type: CHECKOUT_TYPES.SET_SELECTED_MOVIE,
  payload: movie
});

export const setLoginPopup = (show) => ({
  type: CHECKOUT_TYPES.SET_LOGIN_POPUP,
  payload: show
});

export const toggleLoginPopup = () => ({
  type: CHECKOUT_TYPES.TOGGLE_LOGIN_POPUP
});

export const showInvitationForm = (show = true) => ({
  type: CHECKOUT_TYPES.SHOW_INVITATION_FORM,
  payload: show
});

export const hideInvitationForm = () => ({
  type: CHECKOUT_TYPES.HIDE_INVITATION_FORM
});

export const setInvitation = (invitation) => ({
  type: CHECKOUT_TYPES.SET_INVITATION,
  payload: invitation
});

export const clearInvitation = () => ({
  type: CHECKOUT_TYPES.CLEAR_INVITATION
});

export const setQRCode = (qrCode) => ({
  type: CHECKOUT_TYPES.SET_QR_CODE,
  payload: qrCode
});

export const clearQRCode = () => ({
  type: CHECKOUT_TYPES.CLEAR_QR_CODE
});

export const setCheckoutLoading = (loading) => ({
  type: CHECKOUT_TYPES.SET_CHECKOUT_LOADING,
  payload: loading
});

export const setCheckoutError = (error) => ({
  type: CHECKOUT_TYPES.SET_CHECKOUT_ERROR,
  payload: error
});

export const clearCheckoutError = () => ({
  type: CHECKOUT_TYPES.CLEAR_CHECKOUT_ERROR
});

// Enhanced checkout process
export const processCheckout = (checkoutData) => async dispatch => {
  dispatch({ type: CHECKOUT_TYPES.CHECKOUT_REQUEST });
  
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getTokenFromStorage()}`
      },
      body: JSON.stringify(checkoutData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Checkout failed');
    }
    
    const data = await response.json();
    dispatch({ type: CHECKOUT_TYPES.CHECKOUT_SUCCESS, payload: data });
    dispatch(setAlert('Booking successful!', 'success'));
    
    return { success: true, data };
  } catch (error) {
    dispatch({ type: CHECKOUT_TYPES.CHECKOUT_FAIL, payload: error.message });
    dispatch(setAlert(error.message, 'error'));
    return { success: false, error: error.message };
  }
};

export const resetCheckout = () => ({
  type: CHECKOUT_TYPES.RESET_CHECKOUT
});