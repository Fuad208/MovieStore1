import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_LOADING
} from '../types';

const getInitialState = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    token,
    isAuthenticated: token ? true : null,
    loading: false,
    user: null,
    error: null
  };
};

const initialState = getInitialState();

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  
  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
        error: null
      };
      
    case USER_LOADED:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
      
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      // Store token in localStorage
      if (payload.token) {
        localStorage.setItem('jwtToken', payload.token);
      }
      
      return {
        ...state,
        token: payload.token,
        user: payload.user || null,
        isAuthenticated: true,
        loading: false,
        error: null
      };
      
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      localStorage.removeItem('jwtToken');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: payload || 'Authentication failed'
      };
      
    case AUTH_ERROR:
      localStorage.removeItem('jwtToken');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: payload || 'Authentication error'
      };
      
    case LOGOUT:
      localStorage.removeItem('jwtToken');
      return {
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: null
      };
      
    default:
      return state;
  }
};

export default authReducer;