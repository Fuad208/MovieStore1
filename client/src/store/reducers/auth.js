import { AUTH_TYPES } from '../types/auth';

const getInitialToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    return null;
  }
};

const initialState = {
  token: getInitialToken(),
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case AUTH_TYPES.USER_LOADING:
    case AUTH_TYPES.REGISTER_REQUEST:
    case AUTH_TYPES.LOGIN_REQUEST:
    case AUTH_TYPES.TOKEN_REFRESH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AUTH_TYPES.USER_LOADED:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_TYPES.REGISTER_SUCCESS:
    case AUTH_TYPES.LOGIN_SUCCESS:
    case AUTH_TYPES.TOKEN_REFRESH_SUCCESS:
      return {
        ...state,
        token: payload.token || state.token,
        user: payload.user || state.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_TYPES.REGISTER_FAIL:
    case AUTH_TYPES.LOGIN_FAIL:
    case AUTH_TYPES.AUTH_ERROR:
    case AUTH_TYPES.TOKEN_REFRESH_FAIL:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: payload
      };
    
    case AUTH_TYPES.LOGOUT:
      return {
        ...initialState,
        token: null,
        loading: false
      };
    
    case AUTH_TYPES.CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export default authReducer;