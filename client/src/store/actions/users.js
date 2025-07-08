import {
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
  TOGGLE_USER_DIALOG,
  SELECT_USER,
  SELECT_ALL_USERS,
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
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data._message || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  return data;
};

export const toggleUserDialog = () => ({ type: TOGGLE_USER_DIALOG });

export const selectUser = (user) => ({
  type: SELECT_USER,
  payload: user
});

export const selectAllUsers = () => ({ type: SELECT_ALL_USERS });

export const getUsers = () => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const users = await handleResponse(response);
    dispatch({ type: GET_USERS_SUCCESS, payload: users });
  } catch (error) {
    dispatch({ type: GET_USERS_FAILURE, payload: error.message });
    dispatch(setAlert(error.message, 'error', 5000));
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const addUser = (user) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(user)
    });
    
    const data = await handleResponse(response);
    const newUser = data.user || data;
    
    dispatch({ type: ADD_USER, payload: newUser });
    dispatch(setAlert('User created successfully', 'success', 5000));
    
    return { status: 'success', message: 'User created successfully', data: newUser };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to create user. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const updateUser = (user, id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(user)
    });
    
    const data = await handleResponse(response);
    const updatedUser = data.user || data;
    
    dispatch({ type: UPDATE_USER, payload: updatedUser });
    dispatch(setAlert('User updated successfully', 'success', 5000));
    
    return { status: 'success', message: 'User updated successfully', data: updatedUser };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to update user. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    await handleResponse(response);
    dispatch({ type: DELETE_USER, payload: id });
    dispatch(setAlert('User deleted successfully', 'success', 5000));
    
    return { status: 'success', message: 'User deleted successfully' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Failed to delete user. Please try again.'
    };
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};