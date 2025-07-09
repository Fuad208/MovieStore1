import { SET_ALERT, REMOVE_ALERT } from '../types/alert';

export const setAlert = (message, alertType = 'info', timeout = 5000) => dispatch => {
  const id = Math.random().toString(36).substr(2, 9);
  
  dispatch({
    type: SET_ALERT,
    payload: { id, message, alertType }
  });
  
  setTimeout(() => {
    dispatch({ type: REMOVE_ALERT, payload: id });
  }, timeout);
};

export const removeAlert = (id) => ({
  type: REMOVE_ALERT,
  payload: id
});