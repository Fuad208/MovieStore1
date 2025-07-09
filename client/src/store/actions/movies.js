import { GET_MOVIES, SELECT_MOVIE, GET_SUGGESTIONS } from '../types/movies';

export const getMovies = () => async dispatch => {
  try {
    const res = await fetch('/api/movies');
    const data = await res.json();
    
    if (res.ok) {
      dispatch({ type: GET_MOVIES, payload: data });
    } else {
      console.error('Failed to fetch movies:', data.message);
    }
  } catch (error) {
    console.error('Error fetching movies:', error.message);
  }
};

export const selectMovie = (movie) => ({
  type: SELECT_MOVIE,
  payload: movie
});

export const getMovieSuggestions = (query) => async dispatch => {
  try {
    const res = await fetch(`/api/movies/suggestions?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    
    if (res.ok) {
      dispatch({ type: GET_SUGGESTIONS, payload: data });
    } else {
      console.error('Failed to fetch suggestions:', data.message);
    }
  } catch (error) {
    console.error('Error fetching suggestions:', error.message);
  }
};