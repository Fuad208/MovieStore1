import {
  GET_MOVIES,
  SELECT_MOVIE,
  GET_SUGGESTIONS
} from '../types/movies';

const initialState = {
  movies: [],
  selectedMovie: null,
  suggestions: [],
  loading: false,
  error: null
};

const moviesReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MOVIES:
      return {
        ...state,
        movies: Array.isArray(payload) ? payload : [],
        loading: false,
        error: null
      };
    
    case SELECT_MOVIE:
      return {
        ...state,
        selectedMovie: payload
      };
    
    case GET_SUGGESTIONS:
      return {
        ...state,
        suggestions: Array.isArray(payload) ? payload : [],
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

export default moviesReducer;