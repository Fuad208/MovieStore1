import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from '../types';
import { setAlert } from './alert';
import { setAuthHeaders, setUser, removeUser, isLoggedIn } from '../../utils';

export const uploadImage = (id, image) => async dispatch => {
  try {
    const data = new FormData();
    data.append('file', image);
    const url = `/users/photo/${id}`;
    const response = await fetch(url, {
      method: 'POST',
      body: data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    } else {
      dispatch(setAlert('Image Uploaded', 'success', 5000));
    }
    
    return responseData;
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    throw error;
  }
};

// Login user
export const login = (username, password) => async dispatch => {
  try {
    const url = '/users/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const responseData = await response.json();
    
    if (response.ok && responseData.user) {
      const { user } = responseData;
      setUser(user);
      dispatch({ type: LOGIN_SUCCESS, payload: responseData });
      dispatch(setAlert(`Welcome ${user.name}`, 'success', 5000));
    } else {
      dispatch({ type: LOGIN_FAIL });
      const errorMessage = responseData.error?.message || 'Login failed';
      dispatch(setAlert(errorMessage, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const facebookLogin = (userData) => async dispatch => {
  try {
    const { email, userID, name } = userData;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, userID, name })
    };
    const url = '/users/login/facebook';
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok && responseData.user) {
      const { user } = responseData;
      setUser(user);
      dispatch({ type: LOGIN_SUCCESS, payload: responseData });
      dispatch(setAlert(`Welcome ${user.name}`, 'success', 5000));
    } else {
      dispatch({ type: LOGIN_FAIL });
      const errorMessage = responseData.error?.message || 'Facebook login failed';
      dispatch(setAlert(errorMessage, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const googleLogin = ({ profileObj }) => async dispatch => {
  try {
    const { email, googleId, name } = profileObj;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, googleId, name })
    };
    const url = '/users/login/google';
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok && responseData.user) {
      const { user } = responseData;
      setUser(user);
      dispatch({ type: LOGIN_SUCCESS, payload: responseData });
      dispatch(setAlert(`Welcome ${user.name}`, 'success', 5000));
    } else {
      dispatch({ type: LOGIN_FAIL });
      const errorMessage = responseData.error?.message || 'Google login failed';
      dispatch(setAlert(errorMessage, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// Register user
export const register = ({
  name,
  username,
  email,
  phone,
  image,
  password
}) => async dispatch => {
  try {
    const url = '/users';
    const body = { name, username, email, phone, password };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const responseData = await response.json();
    
    if (response.ok && responseData.user) {
      const { user } = responseData;
      setUser(user);
      
      // Upload image if provided
      if (image) {
        try {
          await dispatch(uploadImage(user._id, image));
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
        }
      }
      
      dispatch({ type: REGISTER_SUCCESS, payload: responseData });
      dispatch(setAlert('Registration successful', 'success', 5000));
    } else {
      dispatch({ type: REGISTER_FAIL });
      const errorMessage = responseData.message || responseData.error?.message || 'Registration failed';
      dispatch(setAlert(errorMessage, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: REGISTER_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// Load user
export const loadUser = () => async dispatch => {
  if (!isLoggedIn()) return;
  
  try {
    const url = '/users/me';
    const response = await fetch(url, {
      method: 'GET',
      headers: setAuthHeaders()
    });
    
    const responseData = await response.json();
    
    if (response.ok && responseData.user) {
      const { user } = responseData;
      setUser(user);
      dispatch({ type: USER_LOADED, payload: responseData });
    } else {
      dispatch({ type: AUTH_ERROR });
    }
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Logout
export const logout = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/users/logout';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      removeUser();
      dispatch({ type: LOGOUT });
      dispatch(setAlert('Logout successful', 'success', 5000));
    } else {
      const responseData = await response.json();
      const errorMessage = responseData.error?.message || 'Logout failed';
      dispatch(setAlert(errorMessage, 'error', 5000));
    }
  } catch (error) {
    // Even if logout fails on server, clean up local state
    removeUser();
    dispatch({ type: LOGOUT });
    dispatch(setAlert('Logged out locally', 'warning', 5000));
  }
};
