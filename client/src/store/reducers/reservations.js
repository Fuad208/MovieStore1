import { GET_RESERVATIONS, GET_RESERVATION_SUGGESTED_SEATS } from '../types/reservations';

const initialState = {
  reservations: [],
  suggestedSeats: [],
  loading: false,
  error: null
};

const reservationsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_RESERVATIONS:
      return {
        ...state,
        reservations: Array.isArray(payload) ? payload : [],
        loading: false,
        error: null
      };
    
    case GET_RESERVATION_SUGGESTED_SEATS:
      return {
        ...state,
        suggestedSeats: Array.isArray(payload) ? payload : [],
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

export default reservationsReducer;