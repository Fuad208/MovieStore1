import { ALERT_TYPES } from '../types/alert';

// Enhanced alert action with better ID generation and cleanup
export const setAlert = (message, alertType = 'info', timeout = 5000) => dispatch => {
  // Use timestamp + random for better uniqueness
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  dispatch({
    type: ALERT_TYPES.SET_ALERT,
    payload: { id, message, alertType, timestamp: Date.now() }
  });
  
  if (timeout > 0) {
    setTimeout(() => {
      dispatch(removeAlert(id));
    }, timeout);
  }
};

export const removeAlert = (id) => ({
  type: ALERT_TYPES.REMOVE_ALERT,
  payload: id
});

export const clearAllAlerts = () => ({
  type: ALERT_TYPES.CLEAR_ALL_ALERTS
});
