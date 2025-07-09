import { AUTH_TYPES } from '../types/auth';
import { setAlert } from './alert';

// Enhanced token management
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const setTokenInStorage = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

const removeTokenFromStorage = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

const getTokenFromStorage = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

// Enhanced API helper
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getTokenFromStorage();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }
  
  return response.json();
};

export const loadUser = () => async dispatch => {
  dispatch({ type: AUTH_TYPES.USER_LOADING });
  
  try {
    const token = getTokenFromStorage();
    if (!token) {
      return dispatch({ type: AUTH_TYPES.AUTH_ERROR, payload: 'No token found' });
    }
    
    const data = await makeAuthenticatedRequest('/api/auth/user');
    dispatch({ type: AUTH_TYPES.USER_LOADED, payload: data });
  } catch (error) {
    dispatch({ type: AUTH_TYPES.AUTH_ERROR, payload: error.message });
    removeTokenFromStorage();
  }
};

export const register = (userData) => async dispatch => {
  dispatch({ type: AUTH_TYPES.REGISTER_REQUEST });
  
  try {
    const data = await makeAuthenticatedRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (data.token) {
      setTokenInStorage(data.token);
    }
    
    dispatch({ type: AUTH_TYPES.REGISTER_SUCCESS, payload: data });
    dispatch(setAlert('Registration successful!', 'success'));
    
    return { success: true, data };
  } catch (error) {
    dispatch({ type: AUTH_TYPES.REGISTER_FAIL, payload: error.message });
    dispatch(setAlert(error.message, 'error'));
    return { success: false, error: error.message };
  }
};

export const login = (credentials) => async dispatch => {
  dispatch({ type: AUTH_TYPES.LOGIN_REQUEST });
  
  try {
    const data = await makeAuthenticatedRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (data.token) {
      setTokenInStorage(data.token);
    }
    
    dispatch({ type: AUTH_TYPES.LOGIN_SUCCESS, payload: data });
    dispatch(setAlert('Login successful!', 'success'));
    
    return { success: true, data };
  } catch (error) {
    dispatch({ type: AUTH_TYPES.LOGIN_FAIL, payload: error.message });
    dispatch(setAlert(error.message, 'error'));
    return { success: false, error: error.message };
  }
};

export const refreshToken = () => async dispatch => {
  dispatch({ type: AUTH_TYPES.TOKEN_REFRESH_REQUEST });
  
  try {
    const data = await makeAuthenticatedRequest('/api/auth/refresh');
    
    if (data.token) {
      setTokenInStorage(data.token);
    }
    
    dispatch({ type: AUTH_TYPES.TOKEN_REFRESH_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    dispatch({ type: AUTH_TYPES.TOKEN_REFRESH_FAIL, payload: error.message });
    dispatch(logout());
    return { success: false, error: error.message };
  }
};

export const logout = () => dispatch => {
  removeTokenFromStorage();
  dispatch({ type: AUTH_TYPES.LOGOUT });
  dispatch(setAlert('Logged out successfully', 'info'));
};

export const clearAuthError = () => ({
  type: AUTH_TYPES.CLEAR_AUTH_ERROR
});
