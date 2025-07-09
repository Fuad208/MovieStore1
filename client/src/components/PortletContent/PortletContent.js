import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    padding: theme.spacing(3),
    flexGrow: 1,
    overflow: 'auto',
    minHeight: 0, // Allows content to shrink
  },
  noPadding: {
    padding: 0,
  },
  dense: {
    padding: theme.spacing(2),
  },
  scrollable: {
    overflow: 'auto',
    '-webkit-overflow-scrolling': 'touch', // Smooth scrolling on iOS
  }
});

const PortletContent = React.memo((props) => {
  const { 
    classes, 
    className, 
    children, 
    noPadding = false,
    dense = false,
    scrollable = true,
    ...rest 
  } = props;

  const rootClassName = classNames(
    classes.root,
    {
      [classes.noPadding]: noPadding,
      [classes.dense]: dense,
      [classes.scrollable]: scrollable,
    },
    className
  );

  return (
    <div {...rest} className={rootClassName}>
      {children}
    </div>
  );
});

PortletContent.displayName = 'PortletContent';

PortletContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  noPadding: PropTypes.bool,
  dense: PropTypes.bool,
  scrollable: PropTypes.bool,
};

export default withStyles(styles)(PortletContent);