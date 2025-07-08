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
import { setAlert } from './alert';

// Base URL for API calls
const BASE_URL = process.env.REACT_APP_API_URL || '';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Action creators
export const selectMovie = (movie) => ({
  type: SELECT_MOVIE,
  payload: movie
});

export const clearSelectedMovie = () => ({
  type: CLEAR_SELECTED_MOVIE
});

export const filterMovies = (filters) => ({
  type: FILTER_MOVIES,
  payload: filters
});

export const clearMovieFilters = () => ({
  type: CLEAR_MOVIE_FILTERS
});

export const getMovies = (page = 1, limit = 10, filters = {}) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    const response = await fetch(`${BASE_URL}/movies?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const data = await handleResponse(response);
    dispatch({ type: GET_MOVIES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_MOVIES_FAILURE, payload: error.message });
    dispatch(setAlert(error.message, 'error', 5000));
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const getMovie = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/movies/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const movie = await handleResponse(response);
    dispatch(selectMovie(movie));
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const addMovie = (movie) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/movies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(movie)
    });
    
    const newMovie = await handleResponse(response);
    dispatch({ type: ADD_MOVIE, payload: newMovie });
    dispatch(setAlert('Movie created successfully', 'success', 5000));
    
    return { status: 'success', message: 'Movie created successfully', data: newMovie };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to create movie. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const updateMovie = (movie, id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/movies/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(movie)
    });
    
    const updatedMovie = await handleResponse(response);
    dispatch({ type: UPDATE_MOVIE, payload: updatedMovie });
    dispatch(setAlert('Movie updated successfully', 'success', 5000));
    
    return { status: 'success', message: 'Movie updated successfully', data: updatedMovie };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to update movie. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const deleteMovie = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    await handleResponse(response);
    dispatch({ type: DELETE_MOVIE, payload: id });
    dispatch(setAlert('Movie deleted successfully', 'success', 5000));
    
    return { status: 'success', message: 'Movie deleted successfully' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to delete movie. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const getMovieSuggestions = (userId, preferences = {}) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const queryParams = new URLSearchParams({
      userId: userId.toString(),
      ...preferences
    });
    
    const response = await fetch(`${BASE_URL}/movies/suggestions?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const suggestions = await handleResponse(response);
    dispatch({ type: GET_SUGGESTIONS_SUCCESS, payload: suggestions });
  } catch (error) {
    dispatch({ type: GET_SUGGESTIONS_FAILURE, payload: error.message });
    dispatch(setAlert(error.message, 'error', 5000));
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

// Search movies by title or description
export const searchMovies = (searchTerm) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/movies/search?q=${encodeURIComponent(searchTerm)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const movies = await handleResponse(response);
    dispatch({ type: GET_MOVIES_SUCCESS, payload: movies });
  } catch (error) {
    dispatch({ type: GET_MOVIES_FAILURE, payload: error.message });
    dispatch(setAlert(error.message, 'error', 5000));
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

// Get movies by category (nowShowing, comingSoon, latest)
export const getMoviesByCategory = (category) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/movies/category/${category}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const movies = await handleResponse(response);
    dispatch({ type: GET_MOVIES_SUCCESS, payload: movies });
  } catch (error) {
    dispatch({ type: GET_MOVIES_FAILURE, payload: error.message });
    dispatch(setAlert(error.message, 'error', 5000));
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};