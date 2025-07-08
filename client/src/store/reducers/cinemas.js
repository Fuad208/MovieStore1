import {
  GET_CINEMAS,
  GET_CINEMAS_SUCCESS,
  GET_CINEMAS_FAILURE,
  GET_CINEMA,
  GET_CINEMA_SUCCESS,
  GET_CINEMA_FAILURE,
  ADD_CINEMA,
  UPDATE_CINEMA,
  DELETE_CINEMA,
  SELECT_CINEMA,
  CLEAR_SELECTED_CINEMA,
  SET_LOADING
} from '../types';

const initialState = {
  cinemas: [],
  selectedCinema: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  hasMore: true
};

const setLoading = (state, loading) => ({
  ...state,
  loading,
  error: loading ? null : state.error
});

const getCinemasSuccess = (state, payload) => {
  const { cinemas, totalCount, currentPage, hasMore } = payload;
  
  return {
    ...state,
    cinemas: Array.isArray(cinemas) ? cinemas : (Array.isArray(payload) ? payload : []),
    totalCount: totalCount || (Array.isArray(payload) ? payload.length : 0),
    currentPage: currentPage || 1,
    hasMore: hasMore !== undefined ? hasMore : true,
    loading: false,
    error: null
  };
};

const getCinemasFailure = (state, error) => ({
  ...state,
  loading: false,
  error: error || 'Failed to fetch cinemas'
});

const getCinemaSuccess = (state, cinema) => ({
  ...state,
  selectedCinema: cinema,
  loading: false,
  error: null
});

const getCinemaFailure = (state, error) => ({
  ...state,
  selectedCinema: null,
  loading: false,
  error: error || 'Failed to fetch cinema'
});

const addCinema = (state, newCinema) => ({
  ...state,
  cinemas: [...state.cinemas, newCinema],
  totalCount: state.totalCount + 1,
  loading: false,
  error: null
});

const updateCinema = (state, updatedCinema) => ({
  ...state,
  cinemas: state.cinemas.map(cinema =>
    cinema.id === updatedCinema.id ? updatedCinema : cinema
  ),
  selectedCinema: state.selectedCinema?.id === updatedCinema.id 
    ? updatedCinema 
    : state.selectedCinema,
  loading: false,
  error: null
});

const deleteCinema = (state, cinemaId) => ({
  ...state,
  cinemas: state.cinemas.filter(cinema => cinema.id !== cinemaId),
  selectedCinema: state.selectedCinema?.id === cinemaId 
    ? null 
    : state.selectedCinema,
  totalCount: Math.max(0, state.totalCount - 1),
  loading: false,
  error: null
});

const selectCinema = (state, cinema) => ({
  ...state,
  selectedCinema: cinema,
  error: null
});

const clearSelectedCinema = (state) => ({
  ...state,
  selectedCinema: null
});

const cinemasReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LOADING:
      return setLoading(state, payload);
      
    case GET_CINEMAS:
    case GET_CINEMAS_SUCCESS:
      return getCinemasSuccess(state, payload);
      
    case GET_CINEMAS_FAILURE:
      return getCinemasFailure(state, payload);
      
    case GET_CINEMA:
    case GET_CINEMA_SUCCESS:
      return getCinemaSuccess(state, payload);
      
    case GET_CINEMA_FAILURE:
      return getCinemaFailure(state, payload);
      
    case ADD_CINEMA:
      return addCinema(state, payload);
      
    case UPDATE_CINEMA:
      return updateCinema(state, payload);
      
    case DELETE_CINEMA:
      return deleteCinema(state, payload);
      
    case SELECT_CINEMA:
      return selectCinema(state, payload);
      
    case CLEAR_SELECTED_CINEMA:
      return clearSelectedCinema(state);
      
    default:
      return state;
  }
};

export default cinemasReducer;