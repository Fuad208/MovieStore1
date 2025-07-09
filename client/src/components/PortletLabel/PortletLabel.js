import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0, // Allows text to truncate
  },
  icon: {
    fontSize: '1.3rem',
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
  },
  textContainer: {
    display: 'flex',
    alignItems: 'baseline',
    minWidth: 0,
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  title: {
    fontWeight: 500,
    color: theme.palette.text.primary,
    minWidth: 0,
  },
  subtitle: {
    fontWeight: 400,
    color: theme.palette.text.secondary,
    minWidth: 0,
  },
  truncated: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  badge: {
    marginLeft: theme.spacing(1),
    flexShrink: 0,
  }
});

const PortletLabel = React.memo((props) => {
  const { 
    classes, 
    className, 
    icon, 
    title, 
    subtitle, 
    truncate = false,
    badge,
    titleVariant = 'h6',
    subtitleVariant = 'body2',
    ...rest 
  } = props;

  const rootClassName = classNames(classes.root, className);

  return (
    <div {...rest} className={rootClassName}>
      {icon && <span className={classes.icon}>{icon}</span>}
      <div className={classes.textContainer}>
        {title && (
          <Typography 
            className={classNames(classes.title, {
              [classes.truncated]: truncate
            })} 
            variant={titleVariant}
            component="h2"
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography 
            className={classNames(classes.subtitle, {
              [classes.truncated]: truncate
            })} 
            variant={subtitleVariant}
            component="span"
          >
            {subtitle}
          </Typography>
        )}
      </div>
      {badge && <div className={classes.badge}>{badge}</div>}
    </div>
  );
});

PortletLabel.displayName = 'PortletLabel';

PortletLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  icon: PropTypes.node,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  truncate: PropTypes.bool,
  badge: PropTypes.node,
  titleVariant: PropTypes.string,
  subtitleVariant: PropTypes.string,
};

export default withStyles(styles)(PortletLabel);