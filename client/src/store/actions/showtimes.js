import {
  TOGGLE_DIALOG,
  SELECT_SHOWTIMES,
  SELECT_ALL_SHOWTIMES,
  GET_SHOWTIMES,
  GET_SHOWTIMES_SUCCESS,
  GET_SHOWTIMES_FAILURE,
  ADD_SHOWTIME,
  UPDATE_SHOWTIME,
  DELETE_SHOWTIME,
  SET_LOADING
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

export const toggleDialog = () => ({ type: TOGGLE_DIALOG });

export const selectShowtime = (showtime) => ({
  type: SELECT_SHOWTIMES,
  payload: showtime
});

export const selectAllShowtimes = () => ({ type: SELECT_ALL_SHOWTIMES });

export const getShowtimes = () => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/showtimes`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const showtimes = await handleResponse(response);
    dispatch({ type: GET_SHOWTIMES_SUCCESS, payload: showtimes });
  } catch (error) {
    dispatch({ type: GET_SHOWTIMES_FAILURE, payload: error.message });
    dispatch(setAlert(error.message, 'error', 5000));
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const addShowtime = (showtime) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/showtimes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(showtime)
    });
    
    const data = await handleResponse(response);
    dispatch({ type: ADD_SHOWTIME, payload: data });
    dispatch(setAlert('Showtime created successfully', 'success', 5000));
    
    return { status: 'success', message: 'Showtime created successfully', data };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to create showtime. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const updateShowtime = (showtime, id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/showtimes/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(showtime)
    });
    
    const data = await handleResponse(response);
    dispatch({ type: UPDATE_SHOWTIME, payload: data });
    dispatch(setAlert('Showtime updated successfully', 'success', 5000));
    
    return { status: 'success', message: 'Showtime updated successfully', data };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to update showtime. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const deleteShowtime = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/showtimes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    await handleResponse(response);
    dispatch({ type: DELETE_SHOWTIME, payload: id });
    dispatch(setAlert('Showtime deleted successfully', 'success', 5000));
    
    return { status: 'success', message: 'Showtime deleted successfully' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to delete showtime. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};