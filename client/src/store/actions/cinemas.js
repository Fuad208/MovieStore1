import { CINEMA_TYPES } from '../types/cinemas';
import { setAlert } from './alert';
import { makeApiRequest } from '../utils/api';

export const selectCinema = (cinema) => ({
  type: CINEMA_TYPES.SELECT_CINEMA,
  payload: cinema
});

export const clearSelectedCinema = () => ({
  type: CINEMA_TYPES.CLEAR_SELECTED_CINEMA
});

export const setCinemasLoading = (loading) => ({
  type: CINEMA_TYPES.SET_CINEMAS_LOADING,
  payload: loading
});

export const setCinemaError = (error) => ({
  type: CINEMA_TYPES.SET_CINEMA_ERROR,
  payload: error
});

export const clearCinemaError = () => ({
  type: CINEMA_TYPES.CLEAR_CINEMA_ERROR
});

export const getCinemas = (params = {}) => async dispatch => {
  dispatch({ type: CINEMA_TYPES.GET_CINEMAS_REQUEST });
  
  try {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/cinemas${queryParams ? `?${queryParams}` : ''}`;
    
    const data = await makeApiRequest(endpoint);
    dispatch({ type: CINEMA_TYPES.GET_CINEMAS_SUCCESS, payload: data });
    
    return { success: true, data };
  } catch (error) {
    dispatch({ type: CINEMA_TYPES.GET_CINEMAS_FAIL, payload: error.message });
    dispatch(setAlert(error.message, 'error'));
    return { success: false, error: error.message };
  }
};

export const getCinema = (id) => async dispatch => {
  dispatch({ type: CINEMA_TYPES.GET_CINEMA_REQUEST });
  
  try {
    const data = await makeApiRequest(`/cinemas/${id}`);
    dispatch({ type: CINEMA_TYPES.GET_CINEMA_SUCCESS, payload: data });
    
    return { success: true, data };
  } catch (error) {
    dispatch({ type: CINEMA_TYPES.GET_CINEMA_FAIL, payload: error.message });
    dispatch(setAlert(error.message, 'error'));
    return { success: false, error: error.message };
  }
};

export const createCinema = (cinemaData) => async dispatch => {
  dispatch({ type: CINEMA_TYPES.CREATE_CINEMA_REQUEST });
  
  try {
    const data = await makeApiRequest('/cinemas', {
      method: 'POST',
      body: JSON.stringify(cinemaData)
    });
    
    dispatch({ type: CINEMA_TYPES.CREATE_CINEMA_SUCCESS, payload: data });
    dispatch(setAlert('Cinema created successfully', 'success'));
    
    return { success: true, data };
  } catch (error) {
    dispatch({ type: CINEMA_TYPES.CREATE_CINEMA_FAIL, payload: error.message });
    dispatch(setAlert(error.message, 'error'));
    return { success: false, error: error.message };
  }
};

export const updateCinema = (id, cinemaData) => async dispatch => {
  dispatch({ type: CINEMA_TYPES.UPDATE_CINEMA_REQUEST });
  
  try {
    const data = await makeApiRequest(`/cinemas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(cinemaData)
    });
    
    dispatch({ type: CINEMA_TYPES.UPDATE_CINEMA_SUCCESS, payload: data });
    dispatch(setAlert('Cinema updated successfully', 'success'));
    
    return { success: true, data };
  } catch (error) {
    dispatch({ type: CINEMA_TYPES.UPDATE_CINEMA_FAIL, payload: error.message });
    dispatch(setAlert(error.message, 'error'));
    return { success: false, error: error.message };
  }
};

export const deleteCinema = (id) => async dispatch => {
  dispatch({ type: CINEMA_TYPES.DELETE_CINEMA_REQUEST });
  
  try {
    await makeApiRequest(`/cinemas/${id}`, { method: 'DELETE' });
    dispatch({ type: CINEMA_TYPES.DELETE_CINEMA_SUCCESS, payload: id });
    dispatch(setAlert('Cinema deleted successfully', 'success'));
    
    return { success: true };
  } catch (error) {
    dispatch({ type: CINEMA_TYPES.DELETE_CINEMA_FAIL, payload: error.message });
    dispatch(setAlert(error.message, 'error'));
    return { success: false, error: error.message };
  }
};

export const searchCinemas = (query) => ({
  type: CINEMA_TYPES.SEARCH_CINEMAS,
  payload: query
});

export const filterCinemas = (filters) => ({
  type: CINEMA_TYPES.FILTER_CINEMAS,
  payload: filters
});

export const clearCinemaFilters = () => ({
  type: CINEMA_TYPES.CLEAR_CINEMA_FILTERS
});
