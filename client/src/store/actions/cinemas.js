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
export const selectCinema = (cinema) => ({
  type: SELECT_CINEMA,
  payload: cinema
});

export const clearSelectedCinema = () => ({
  type: CLEAR_SELECTED_CINEMA
});

export const getCinemas = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/cinemas?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const data = await handleResponse(response);
    dispatch({ type: GET_CINEMAS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_CINEMAS_FAILURE, payload: error.message });
    dispatch(setAlert(error.message, 'error', 5000));
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const getCinema = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/cinemas/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const cinema = await handleResponse(response);
    dispatch({ type: GET_CINEMA_SUCCESS, payload: cinema });
  } catch (error) {
    dispatch({ type: GET_CINEMA_FAILURE, payload: error.message });
    dispatch(setAlert(error.message, 'error', 5000));
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const addCinema = (cinema) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/cinemas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cinema)
    });
    
    const newCinema = await handleResponse(response);
    dispatch({ type: ADD_CINEMA, payload: newCinema });
    dispatch(setAlert('Cinema created successfully', 'success', 5000));
    
    return { status: 'success', message: 'Cinema created successfully', data: newCinema };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to create cinema. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const updateCinema = (cinema, id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/cinemas/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(cinema)
    });
    
    const updatedCinema = await handleResponse(response);
    dispatch({ type: UPDATE_CINEMA, payload: updatedCinema });
    dispatch(setAlert('Cinema updated successfully', 'success', 5000));
    
    return { status: 'success', message: 'Cinema updated successfully', data: updatedCinema };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to update cinema. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const deleteCinema = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/cinemas/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    await handleResponse(response);
    dispatch({ type: DELETE_CINEMA, payload: id });
    dispatch(setAlert('Cinema deleted successfully', 'success', 5000));
    
    return { status: 'success', message: 'Cinema deleted successfully' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to delete cinema. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};