import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = (theme) => ({
  success: {
    backgroundColor: green[600],
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.error.main,
    },
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  warning: {
    backgroundColor: amber[700],
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: amber[800],
    },
  },
  icon: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  action: {
    paddingLeft: theme.spacing(1),
  },
  closeButton: {
    padding: theme.spacing(0.5),
    color: 'inherit',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
});

const SnackbarContentWrapper = React.memo((props) => {
  const { 
    classes, 
    className, 
    message, 
    variant, 
    onClose,
    action,
    showCloseButton = true,
    ...other 
  } = props;
  
  const Icon = variantIcon[variant];

  const handleClose = (event) => {
    if (onClose) {
      onClose(event);
    }
  };

  const actionContent = (
    <div className={classes.action}>
      {action}
      {showCloseButton && onClose && (
        <IconButton
          key="close"
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <div className={classes.content}>
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classes.icon} />
            {message}
          </span>
          {(action || (showCloseButton && onClose)) && actionContent}
        </div>
      }
      {...other}
    />
  );
});

SnackbarContentWrapper.displayName = 'SnackbarContentWrapper';

SnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  message: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
  onClose: PropTypes.func,
  action: PropTypes.node,
  showCloseButton: PropTypes.bool,
};

export default withStyles(styles)(SnackbarContentWrapper);