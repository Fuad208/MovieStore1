import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    display: 'flex',
    minHeight: theme.spacing(8),
    justifyContent: 'space-between',
    padding: theme.spacing(0, 3),
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(['box-shadow'], {
      duration: theme.transitions.duration.short,
    }),
  },
  noDivider: {
    borderBottom: 'none',
  },
  noPadding: {
    padding: 0,
  },
  dense: {
    minHeight: theme.spacing(6),
    padding: theme.spacing(0, 2),
  },
  elevated: {
    boxShadow: theme.shadows[1],
  },
  sticky: {
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.appBar - 1,
  }
});

const PortletHeader = React.memo((props) => {
  const { 
    classes, 
    className, 
    noDivider = false,
    noPadding = false,
    dense = false,
    elevated = false,
    sticky = false,
    children, 
    ...rest 
  } = props;

  const rootClassName = classNames(
    classes.root,
    {
      [classes.noDivider]: noDivider,
      [classes.noPadding]: noPadding,
      [classes.dense]: dense,
      [classes.elevated]: elevated,
      [classes.sticky]: sticky,
    },
    className
  );

  return (
    <div {...rest} className={rootClassName}>
      {children}
    </div>
  );
});

PortletHeader.displayName = 'PortletHeader';

PortletHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  noDivider: PropTypes.bool,
  noPadding: PropTypes.bool,
  dense: PropTypes.bool,
  elevated: PropTypes.bool,
  sticky: PropTypes.bool,
};

export default withStyles(styles)(PortletHeader);