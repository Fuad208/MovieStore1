import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { List as ListIcon, Apps as AppsIcon } from '@material-ui/icons';
import styles from './styles';

const DisplayMode = props => {
  const { classes, className, mode, onChange, disabled } = props;

  const handleGridClick = useCallback(() => {
    if (!disabled && mode !== 'grid') {
      onChange('grid');
    }
  }, [disabled, mode, onChange]);

  const handleListClick = useCallback(() => {
    if (!disabled && mode !== 'list') {
      onChange('list');
    }
  }, [disabled, mode, onChange]);

  const rootClassName = classNames(classes.root, className, {
    [classes.disabled]: disabled
  });

  return (
    <div className={rootClassName}>
      <span
        className={classNames({
          [classes.option]: true,
          [classes.optionSelected]: mode === 'grid',
          [classes.optionDisabled]: disabled
        })}
        onClick={handleGridClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleGridClick();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Grid view"
        aria-pressed={mode === 'grid'}
      >
        <AppsIcon className={classes.displayIcon} />
      </span>
      <span className={classes.divider} />
      <span
        className={classNames({
          [classes.option]: true,
          [classes.optionSelected]: mode === 'list',
          [classes.optionDisabled]: disabled
        })}
        onClick={handleListClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleListClick();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="List view"
        aria-pressed={mode === 'list'}
      >
        <ListIcon className={classes.displayIcon} />
      </span>
    </div>
  );
};

DisplayMode.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['grid', 'list']).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

DisplayMode.defaultProps = {
  mode: 'grid',
  disabled: false
};

export default withStyles(styles)(DisplayMode);