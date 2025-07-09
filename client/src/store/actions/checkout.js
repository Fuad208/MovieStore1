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

export const setSelectedSeats = (seats) => ({
  type: SET_SELECTED_SEATS,
  payload: seats
});

export const setSuggestedSeats = (seats) => ({
  type: SET_SUGGESTED_SEATS,
  payload: seats
});

export const setSelectedCinema = (cinema) => ({
  type: SET_SELECTED_CINEMA,
  payload: cinema
});

export const setSelectedDate = (date) => ({
  type: SET_SELECTED_DATE,
  payload: date
});

export const setSelectedTime = (time) => ({
  type: SET_SELECTED_TIME,
  payload: time
});

export const toggleLoginPopup = () => ({
  type: TOGGLE_LOGIN_POPUP
});

export const showInvitationForm = (show) => ({
  type: SHOW_INVITATION_FORM,
  payload: show
});

export const setInvitation = (invitation) => ({
  type: SET_INVITATION,
  payload: invitation
});

export const setQRCode = (qrCode) => ({
  type: SET_QR_CODE,
  payload: qrCode
});

export const resetCheckout = () => ({
  type: RESET_CHECKOUT
});