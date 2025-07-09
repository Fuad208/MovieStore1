import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CustomizedSnackbar from '../CustomizedSnackbar/';

const TimedAlert = ({ alert, onClose, autoHideDuration = 6000 }) => {
  const [open, setOpen] = useState(true);

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    if (onClose) {
      onClose(alert.id);
    }
  }, [alert.id, onClose]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      handleClose(null, 'timeout');
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [open, autoHideDuration, handleClose]);

  // Don't render if already closed
  if (!open) return null;

  return (
    <CustomizedSnackbar
      isOpen={open}
      vertical="top"
      horizontal="right"
      variant={alert.alertType}
      message={alert.msg}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
    />
  );
};

TimedAlert.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired,
    alertType: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired
  }).isRequired,
  onClose: PropTypes.func,
  autoHideDuration: PropTypes.number
};

const Alert = ({ alerts, onCloseAlert }) => {
  // Filter out any invalid alerts
  const validAlerts = alerts.filter(alert => 
    alert && alert.id && alert.msg && alert.alertType
  );

  if (validAlerts.length === 0) {
    return null;
  }

  return (
    <>
      {validAlerts.map((alert) => (
        <TimedAlert 
          key={`alert-${alert.id}`} 
          alert={alert} 
          onClose={onCloseAlert}
        />
      ))}
    </>
  );
};

Alert.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired,
    alertType: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired
  })).isRequired,
  onCloseAlert: PropTypes.func
};

Alert.defaultProps = {
  alerts: []
};

const mapStateToProps = (state) => ({
  alerts: state.alertState?.alerts || []
});

const mapDispatchToProps = (dispatch) => ({
  onCloseAlert: (alertId) => dispatch({ type: 'REMOVE_ALERT', payload: alertId })
});

export default connect(mapStateToProps, mapDispatchToProps)(Alert);