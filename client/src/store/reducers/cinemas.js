import {
  GET_CINEMAS,
  GET_CINEMA,
  SELECT_CINEMA,
  CREATE_CINEMA
} from '../types/cinemas';

const initialState = {
  cinemas: [],
  selectedCinema: null,
  currentCinema: null,
  loading: false,
  error: null
};

const cinemasReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_CINEMAS:
      return {
        ...state,
        cinemas: Array.isArray(payload) ? payload : [],
        loading: false,
        error: null
      };
    
    case GET_CINEMA:
      return {
        ...state,
        currentCinema: payload,
        loading: false,
        error: null
      };
    
    case SELECT_CINEMA:
      return {
        ...state,
        selectedCinema: payload
      };
    
    case CREATE_CINEMA:
      return {
        ...state,
        cinemas: [...state.cinemas, payload],
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

export default cinemasReducer;