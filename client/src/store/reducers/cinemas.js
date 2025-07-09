import { CINEMA_TYPES } from '../types/cinemas';

const initialState = {
  cinemas: [],
  selectedCinema: null,
  currentCinema: null,
  loading: false,
  error: null,
  searchQuery: '',
  filters: {},
  pagination: {
    current: 1,
    total: 0,
    pageSize: 10
  }
};

const cinemasReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CINEMA_TYPES.GET_CINEMAS_REQUEST:
    case CINEMA_TYPES.GET_CINEMA_REQUEST:
    case CINEMA_TYPES.CREATE_CINEMA_REQUEST:
    case CINEMA_TYPES.UPDATE_CINEMA_REQUEST:
    case CINEMA_TYPES.DELETE_CINEMA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case CINEMA_TYPES.GET_CINEMAS_SUCCESS:
      return {
        ...state,
        cinemas: Array.isArray(payload.cinemas) ? payload.cinemas : payload,
        pagination: payload.pagination || state.pagination,
        loading: false,
        error: null
      };
    
    case CINEMA_TYPES.GET_CINEMA_SUCCESS:
      return {
        ...state,
        currentCinema: payload,
        loading: false,
        error: null
      };
    
    case CINEMA_TYPES.CREATE_CINEMA_SUCCESS:
      return {
        ...state,
        cinemas: [...state.cinemas, payload],
        loading: false,
        error: null
      };
    
    case CINEMA_TYPES.UPDATE_CINEMA_SUCCESS:
      return {
        ...state,
        cinemas: state.cinemas.map(cinema =>
          cinema._id === payload._id ? { ...cinema, ...payload } : cinema
        ),
        currentCinema: state.currentCinema && state.currentCinema._id === payload._id
          ? { ...state.currentCinema, ...payload }
          : state.currentCinema,
        loading: false,
        error: null
      };
    
    case CINEMA_TYPES.DELETE_CINEMA_SUCCESS:
      return {
        ...state,
        cinemas: state.cinemas.filter(cinema => cinema._id !== payload),
        selectedCinema: state.selectedCinema && state.selectedCinema._id === payload
          ? null
          : state.selectedCinema,
        currentCinema: state.currentCinema && state.currentCinema._id === payload
          ? null
          : state.currentCinema,
        loading: false,
        error: null
      };
    
    case CINEMA_TYPES.GET_CINEMAS_FAIL:
    case CINEMA_TYPES.GET_CINEMA_FAIL:
    case CINEMA_TYPES.CREATE_CINEMA_FAIL:
    case CINEMA_TYPES.UPDATE_CINEMA_FAIL:
    case CINEMA_TYPES.DELETE_CINEMA_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    
    case CINEMA_TYPES.SELECT_CINEMA:
      return {
        ...state,
        selectedCinema: payload
      };
    
    case CINEMA_TYPES.CLEAR_SELECTED_CINEMA:
      return {
        ...state,
        selectedCinema: null
      };
    
    case CINEMA_TYPES.SEARCH_CINEMAS:
      return {
        ...state,
        searchQuery: payload
      };
    
    case CINEMA_TYPES.FILTER_CINEMAS:
      return {
        ...state,
        filters: { ...state.filters, ...payload }
      };
    
    case CINEMA_TYPES.CLEAR_CINEMA_FILTERS:
      return {
        ...state,
        filters: {},
        searchQuery: ''
      };
    
    case CINEMA_TYPES.SET_CINEMAS_LOADING:
      return {
        ...state,
        loading: payload
      };
    
    case CINEMA_TYPES.SET_CINEMA_ERROR:
      return {
        ...state,
        error: payload
      };
    
    case CINEMA_TYPES.CLEAR_CINEMA_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export default cinemasReducer;