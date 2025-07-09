import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from '../SnackbarContentWrapper/SnackbarContentWrapper';

const CustomizedSnackbar = React.memo((props) => {
  const {
    isOpen,
    vertical = 'top',
    horizontal = 'center',
    variant = 'info',
    message = '',
    onClose,
    autoHideDuration = 3000,
  } = props;

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose && onClose(event, reason);
  }, [onClose]);

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={isOpen}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
    >
      <SnackbarContentWrapper
        onClose={handleClose}
        variant={variant}
        message={message}
      />
    </Snackbar>
  );
});

CustomizedSnackbar.displayName = 'CustomizedSnackbar';

CustomizedSnackbar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  vertical: PropTypes.oneOf(['top', 'bottom']),
  horizontal: PropTypes.oneOf(['left', 'center', 'right']),
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  autoHideDuration: PropTypes.number,
};

export default CustomizedSnackbar;