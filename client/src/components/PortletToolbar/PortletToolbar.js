import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minWidth: 0,
  },
  left: {
    justifyContent: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
  right: {
    justifyContent: 'flex-end',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  dense: {
    gap: theme.spacing(0.5),
  },
  wrap: {
    flexWrap: 'wrap',
  }
});

const PortletToolbar = React.memo((props) => {
  const { 
    classes, 
    className, 
    children, 
    alignment = 'right',
    dense = false,
    wrap = false,
    ...rest 
  } = props;

  const rootClassName = classNames(
    classes.root,
    {
      [classes.left]: alignment === 'left',
      [classes.center]: alignment === 'center',
      [classes.right]: alignment === 'right',
      [classes.spaceBetween]: alignment === 'space-between',
      [classes.spaceAround]: alignment === 'space-around',
      [classes.dense]: dense,
      [classes.wrap]: wrap,
    },
    className
  );

  return (
    <div {...rest} className={rootClassName}>
      {children}
    </div>
  );
});

PortletToolbar.displayName = 'PortletToolbar';

PortletToolbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  alignment: PropTypes.oneOf(['left', 'center', 'right', 'space-between', 'space-around']),
  dense: PropTypes.bool,
  wrap: PropTypes.bool,
};

export default withStyles(styles)(PortletToolbar);