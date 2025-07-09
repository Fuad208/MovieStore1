import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '../Paper';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0, // Allows flex children to shrink
    backgroundColor: theme.palette.background.paper,
  },
  fullHeight: {
    height: '100%',
  }
});

const Portlet = React.memo((props) => {
  const { 
    classes, 
    className, 
    children, 
    fullHeight = false,
    ...rest 
  } = props;
  
  const rootClassName = classNames(
    classes.root,
    {
      [classes.fullHeight]: fullHeight,
    },
    className
  );

  return (
    <Paper
      {...rest}
      className={rootClassName}
      elevation={0}
      outlined
      squared={false}
    >
      {children}
    </Paper>
  );
});

Portlet.displayName = 'Portlet';

Portlet.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  fullHeight: PropTypes.bool,
};

export default withStyles(styles)(Portlet);