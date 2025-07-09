import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    padding: theme.spacing(1, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: theme.spacing(6),
  },
  noDivider: {
    borderTop: 'none',
  },
  dense: {
    padding: theme.spacing(0.5, 1),
    minHeight: theme.spacing(4),
  },
  centered: {
    justifyContent: 'center',
  },
  left: {
    justifyContent: 'flex-start',
  },
  right: {
    justifyContent: 'flex-end',
  }
});

const PortletFooter = React.memo((props) => {
  const { 
    classes, 
    className, 
    noDivider = false,
    dense = false,
    alignment = 'between',
    children, 
    ...rest 
  } = props;

  const rootClassName = classNames(
    classes.root,
    {
      [classes.noDivider]: noDivider,
      [classes.dense]: dense,
      [classes.centered]: alignment === 'center',
      [classes.left]: alignment === 'left',
      [classes.right]: alignment === 'right',
    },
    className
  );

  return (
    <div {...rest} className={rootClassName}>
      {children}
    </div>
  );
});

PortletFooter.displayName = 'PortletFooter';

PortletFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  noDivider: PropTypes.bool,
  dense: PropTypes.bool,
  alignment: PropTypes.oneOf(['left', 'center', 'right', 'between']),
};

export default withStyles(styles)(PortletFooter);