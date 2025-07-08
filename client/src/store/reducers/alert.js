import { SET_ALERT, REMOVE_ALERT, CLEAR_ALERTS } from '../types';

const initialState = {
  alerts: [],
  showAlert: false
};

const setAlert = (state, { payload }) => {
  // Check if alert with same id already exists to prevent duplicates
  const existingAlert = state.alerts.find(alert => alert.id === payload.id);
  
  if (existingAlert) {
    return {
      ...state,
      alerts: state.alerts.map(alert => 
        alert.id === payload.id ? payload : alert
      ),
      showAlert: true
    };
  }
  
  return {
    ...state,
    alerts: [...state.alerts, payload],
    showAlert: true
  };
};

const removeAlert = (state, { payload }) => {
  const filteredAlerts = state.alerts.filter(alert => alert.id !== payload);
  
  return {
    ...state,
    alerts: filteredAlerts,
    showAlert: filteredAlerts.length > 0
  };
};

const clearAlerts = (state) => ({
  ...state,
  alerts: [],
  showAlert: false
});

export default function alertReducer(state = initialState, action) {
  const { type } = action;
  
  switch (type) {
    case SET_ALERT:
      return setAlert(state, action);
    case REMOVE_ALERT:
      return removeAlert(state, action);
    case CLEAR_ALERTS:
      return clearAlerts(state);
    default:
      return state;
  }
}