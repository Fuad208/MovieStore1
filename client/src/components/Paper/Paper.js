import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const styles = theme => ({
  root: {
    borderRadius: theme.spacing(0.5),
    maxWidth: '100%',
    border: 0,
    boxShadow: '0 10px 40px 0 rgba(16, 36, 94, 0.2)',
    transition: theme.transitions.create(['box-shadow', 'transform'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      boxShadow: '0 15px 50px 0 rgba(16, 36, 94, 0.3)',
      transform: 'translateY(-2px)',
    }
  },
  squared: {
    borderRadius: 0,
  },
  outlined: {
    border: `1px solid ${theme.palette.divider}`,
  },
  elevated: {
    boxShadow: theme.shadows[4],
  }
});

const CustomPaper = React.memo((props) => {
  const { 
    classes, 
    className, 
    outlined = true, 
    squared = false, 
    elevated = false,
    children, 
    ...rest 
  } = props;

  const rootClassName = classNames(
    classes.root,
    {
      [classes.squared]: squared,
      [classes.outlined]: outlined,
      [classes.elevated]: elevated,
    },
    className
  );

  return (
    <Paper {...rest} className={rootClassName} elevation={0}>
      {children}
    </Paper>
  );
});

CustomPaper.displayName = 'CustomPaper';

CustomPaper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  elevation: PropTypes.number,
  outlined: PropTypes.bool,
  squared: PropTypes.bool,
  elevated: PropTypes.bool,
};

export default withStyles(styles)(CustomPaper);