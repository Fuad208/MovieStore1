import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'inline-block',
    borderRadius: '50%',
    flexGrow: 0,
    flexShrink: 0,
    position: 'relative',
    transition: theme.transitions.create(['transform', 'box-shadow'], {
      duration: theme.transitions.duration.short,
    }),
  },
  animated: {
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.1)',
    },
  },
  pulsing: {
    animation: '$pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '50%': {
      transform: 'scale(1.05)',
      opacity: 0.8,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  xs: {
    height: theme.spacing(0.75),
    width: theme.spacing(0.75),
  },
  sm: {
    height: theme.spacing(1),
    width: theme.spacing(1),
  },
  md: {
    height: theme.spacing(1.5),
    width: theme.spacing(1.5),
  },
  lg: {
    height: theme.spacing(2),
    width: theme.spacing(2),
  },
  xl: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  // Color variants with fallback for missing theme colors
  neutral: {
    backgroundColor: theme.palette.grey[500],
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
  },
  info: {
    backgroundColor: theme.palette.info?.main || theme.palette.primary.main,
  },
  warning: {
    backgroundColor: theme.palette.warning?.main || '#ff9800',
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  success: {
    backgroundColor: theme.palette.success?.main || '#4caf50',
  },
  // Additional status colors
  online: {
    backgroundColor: '#4caf50',
  },
  offline: {
    backgroundColor: '#f44336',
  },
  away: {
    backgroundColor: '#ff9800',
  },
  busy: {
    backgroundColor: '#e91e63',
  },
});

const Status = React.memo((props) => {
  const { 
    classes, 
    className, 
    size = 'md', 
    color = 'neutral',
    animated = false,
    pulsing = false,
    tooltip,
    ...rest 
  } = props;

  const rootClassName = classNames(
    classes.root,
    {
      [classes[size]]: size,
      [classes[color]]: color,
      [classes.animated]: animated,
      [classes.pulsing]: pulsing,
    },
    className
  );

  const statusElement = (
    <span 
      {...rest} 
      className={rootClassName}
      role="status"
      aria-label={tooltip || `Status: ${color}`}
    />
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="top">
        {statusElement}
      </Tooltip>
    );
  }

  return statusElement;
});

Status.displayName = 'Status';

Status.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    'neutral',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'online',
    'offline',
    'away',
    'busy',
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  animated: PropTypes.bool,
  pulsing: PropTypes.bool,
  tooltip: PropTypes.string,
};

export default withStyles(styles)(Status);