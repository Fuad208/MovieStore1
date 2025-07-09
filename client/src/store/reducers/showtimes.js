import {
  GET_SHOWTIMES,
  TOGGLE_DIALOG,
  SELECT_SHOWTIMES,
  SELECT_ALL_SHOWTIMES,
  DELETE_SHOWTIME,
  CLEAR_SELECTED_SHOWTIMES
} from '../types/showtimes';

const initialState = {
  showtimes: [],
  selectedShowtimes: [],
  openDialog: false,
  loading: false,
  error: null
};

// Helper function for toggle selection logic
const toggleItemInArray = (array, item) => {
  const index = array.indexOf(item);
  
  if (index === -1) {
    return [...array, item];
  }
  
  return array.filter((_, i) => i !== index);
};

const showtimesReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_SHOWTIMES:
      return {
        ...state,
        showtimes: Array.isArray(payload) ? payload : [],
        loading: false,
        error: null
      };
    
    case TOGGLE_DIALOG:
      return {
        ...state,
        openDialog: !state.openDialog
      };
    
    case SELECT_SHOWTIMES:
      return {
        ...state,
        selectedShowtimes: toggleItemInArray(state.selectedShowtimes, payload)
      };
    
    case SELECT_ALL_SHOWTIMES:
      return {
        ...state,
        selectedShowtimes: state.selectedShowtimes.length === state.showtimes.length
          ? []
          : state.showtimes.map(showtime => showtime._id)
      };
    
    case DELETE_SHOWTIME:
      return {
        ...state,
        showtimes: state.showtimes.filter(showtime => showtime._id !== payload),
        selectedShowtimes: state.selectedShowtimes.filter(id => id !== payload)
      };
    
    case CLEAR_SELECTED_SHOWTIMES:
      return {
        ...state,
        selectedShowtimes: []
      };
    
    default:
      return state;
  }
};

export default showtimesReducer;