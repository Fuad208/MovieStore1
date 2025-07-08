import {
  GET_MOVIES,
  GET_MOVIES_SUCCESS,
  GET_MOVIES_FAILURE,
  SELECT_MOVIE,
  GET_SUGGESTIONS,
  GET_SUGGESTIONS_SUCCESS,
  GET_SUGGESTIONS_FAILURE,
  ADD_MOVIE,
  UPDATE_MOVIE,
  DELETE_MOVIE,
  CLEAR_SELECTED_MOVIE,
  SET_LOADING,
  FILTER_MOVIES,
  CLEAR_MOVIE_FILTERS
} from '../types';

const initialState = {
  movies: [],
  randomMovie: null,
  latestMovies: [],
  nowShowing: [],
  comingSoon: [],
  selectedMovie: null,
  suggested: [],
  loading: false,
  error: null,
  filters: {
    genre: '',
    rating: '',
    searchTerm: ''
  },
  filteredMovies: [],
  totalCount: 0,
  currentPage: 1,
  hasMore: true
};

// Helper function to safely parse date
const parseDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Helper function to categorize movies
const categorizeMovies = (movies) => {
  if (!Array.isArray(movies) || movies.length === 0) {
    return {
      latestMovies: [],
      nowShowing: [],
      comingSoon: [],
      randomMovie: null
    };
  }

  const now = new Date();
  const validMovies = movies.filter(movie => movie && movie.releaseDate);

  // Latest movies (sorted by release date, most recent first)
  const latestMovies = [...validMovies]
    .sort((a, b) => {
      const dateA = parseDate(a.releaseDate);
      const dateB = parseDate(b.releaseDate);
      if (!dateA || !dateB) return 0;
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  // Now showing movies (between release date and end date)
  const nowShowing = validMovies.filter(movie => {
    const releaseDate = parseDate(movie.releaseDate);
    const endDate = parseDate(movie.endDate);
    
    if (!releaseDate) return false;
    
    const isAfterRelease = releaseDate <= now;
    const isBeforeEnd = !endDate || endDate >= now;
    
    return isAfterRelease && isBeforeEnd;
  });

  // Coming soon movies (release date is in the future)
  const comingSoon = validMovies.filter(movie => {
    const releaseDate = parseDate(movie.releaseDate);
    return releaseDate && releaseDate > now;
  });

  // Random movie
  const randomMovie = movies.length > 0
    ? movies[Math.floor(Math.random() * movies.length)]
    : null;

  return {
    latestMovies,
    nowShowing,
    comingSoon,
    randomMovie
  };
};

// Helper function to apply filters
const applyFilters = (movies, filters) => {
  if (!Array.isArray(movies)) return [];
  
  return movies.filter(movie => {
    if (!movie) return false;
    
    // Genre filter
    if (filters.genre && movie.genre !== filters.genre) {
      return false;
    }
    
    // Rating filter
    if (filters.rating && movie.rating !== filters.rating) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const title = (movie.title || '').toLowerCase();
      const description = (movie.description || '').toLowerCase();
      
      if (!title.includes(searchTerm) && !description.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
};

const setLoading = (state, loading) => ({
  ...state,
  loading,
  error: loading ? null : state.error
});

const getMoviesSuccess = (state, payload) => {
  const movies = Array.isArray(payload) ? payload : (payload.movies || []);
  const { latestMovies, nowShowing, comingSoon, randomMovie } = categorizeMovies(movies);
  
  return {
    ...state,
    movies,
    latestMovies,
    nowShowing,
    comingSoon,
    randomMovie,
    filteredMovies: applyFilters(movies, state.filters),
    totalCount: payload.totalCount || movies.length,
    currentPage: payload.currentPage || 1,
    hasMore: payload.hasMore !== undefined ? payload.hasMore : true,
    loading: false,
    error: null
  };
};

const getMoviesFailure = (state, error) => ({
  ...state,
  loading: false,
  error: error || 'Failed to fetch movies'
});

const selectMovie = (state, movie) => ({
  ...state,
  selectedMovie: movie,
  error: null
});

const clearSelectedMovie = (state) => ({
  ...state,
  selectedMovie: null
});

const getSuggestionsSuccess = (state, suggestions) => ({
  ...state,
  suggested: Array.isArray(suggestions) ? suggestions : [],
  loading: false,
  error: null
});

const getSuggestionsFailure = (state, error) => ({
  ...state,
  suggested: [],
  loading: false,
  error: error || 'Failed to fetch suggestions'
});

const addMovie = (state, newMovie) => {
  const updatedMovies = [...state.movies, newMovie];
  const { latestMovies, nowShowing, comingSoon, randomMovie } = categorizeMovies(updatedMovies);
  
  return {
    ...state,
    movies: updatedMovies,
    latestMovies,
    nowShowing,
    comingSoon,
    randomMovie,
    filteredMovies: applyFilters(updatedMovies, state.filters),
    totalCount: state.totalCount + 1,
    loading: false,
    error: null
  };
};

const updateMovie = (state, updatedMovie) => {
  const updatedMovies = state.movies.map(movie =>
    movie.id === updatedMovie.id ? updatedMovie : movie
  );
  const { latestMovies, nowShowing, comingSoon, randomMovie } = categorizeMovies(updatedMovies);
  
  return {
    ...state,
    movies: updatedMovies,
    latestMovies,
    nowShowing,
    comingSoon,
    randomMovie,
    filteredMovies: applyFilters(updatedMovies, state.filters),
    selectedMovie: state.selectedMovie?.id === updatedMovie.id 
      ? updatedMovie 
      : state.selectedMovie,
    loading: false,
    error: null
  };
};

const deleteMovie = (state, movieId) => {
  const updatedMovies = state.movies.filter(movie => movie.id !== movieId);
  const { latestMovies, nowShowing, comingSoon, randomMovie } = categorizeMovies(updatedMovies);
  
  return {
    ...state,
    movies: updatedMovies,
    latestMovies,
    nowShowing,
    comingSoon,
    randomMovie,
    filteredMovies: applyFilters(updatedMovies, state.filters),
    selectedMovie: state.selectedMovie?.id === movieId 
      ? null 
      : state.selectedMovie,
    totalCount: Math.max(0, state.totalCount - 1),
    loading: false,
    error: null
  };
};

const filterMovies = (state, filters) => {
  const newFilters = { ...state.filters, ...filters };
  
  return {
    ...state,
    filters: newFilters,
    filteredMovies: applyFilters(state.movies, newFilters)
  };
};

const clearMovieFilters = (state) => ({
  ...state,
  filters: initialState.filters,
  filteredMovies: state.movies
});

const moviesReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LOADING:
      return setLoading(state, payload);
      
    case GET_MOVIES:
    case GET_MOVIES_SUCCESS:
      return getMoviesSuccess(state, payload);
      
    case GET_MOVIES_FAILURE:
      return getMoviesFailure(state, payload);
      
    case SELECT_MOVIE:
      return selectMovie(state, payload);
      
    case CLEAR_SELECTED_MOVIE:
      return clearSelectedMovie(state);
      
    case GET_SUGGESTIONS:
    case GET_SUGGESTIONS_SUCCESS:
      return getSuggestionsSuccess(state, payload);
      
    case GET_SUGGESTIONS_FAILURE:
      return getSuggestionsFailure(state, payload);
      
    case ADD_MOVIE:
      return addMovie(state, payload);
      
    case UPDATE_MOVIE:
      return updateMovie(state, payload);
      
    case DELETE_MOVIE:
      return deleteMovie(state, payload);
      
    case FILTER_MOVIES:
      return filterMovies(state, payload);
      
    case CLEAR_MOVIE_FILTERS:
      return clearMovieFilters(state);
      
    default:
      return state;
  }
};

export default moviesReducer;