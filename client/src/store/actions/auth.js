import { 
  REGISTER_SUCCESS, 
  REGISTER_FAIL, 
  LOGIN_SUCCESS, 
  LOGIN_FAIL, 
  USER_LOADED, 
  AUTH_ERROR, 
  LOGOUT 
} from '../types/auth';

export const loadUser = () => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return dispatch({ type: AUTH_ERROR });
    }
    
    // API call to load user
    const res = await fetch('/api/auth/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await res.json();
    
    if (res.ok) {
      dispatch({ type: USER_LOADED, payload: data });
    } else {
      dispatch({ type: AUTH_ERROR, payload: data.message });
    }
  } catch (error) {
    dispatch({ type: AUTH_ERROR, payload: error.message });
  }
};

export const login = (credentials) => async dispatch => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await res.json();
    
    if (res.ok) {
      dispatch({ type: LOGIN_SUCCESS, payload: data });
    } else {
      dispatch({ type: LOGIN_FAIL, payload: data.message });
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error.message });
  }
};

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};