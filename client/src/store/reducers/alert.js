import { ALERT_TYPES } from '../types/alert';

const initialState = {
  alerts: []
};

const alertReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ALERT_TYPES.SET_ALERT:
      // Prevent duplicate alerts
      const existingAlert = state.alerts.find(alert => 
        alert.message === payload.message && alert.alertType === payload.alertType
      );
      
      if (existingAlert) {
        return state;
      }
      
      return {
        ...state,
        alerts: [...state.alerts, payload]
      };
    
    case ALERT_TYPES.REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== payload)
      };
    
    case ALERT_TYPES.CLEAR_ALL_ALERTS:
      return {
        ...state,
        alerts: []
      };
    
    default:
      return state;
  }
};

export default alertReducer;