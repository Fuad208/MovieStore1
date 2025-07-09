import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Input, InputAdornment, IconButton } from '@material-ui/core';
import { Search as SearchIcon, Clear as ClearIcon } from '@material-ui/icons';
import styles from './styles';

const SearchInput = props => {
  const { 
    classes, 
    className, 
    onChange, 
    onDebouncedChange,
    debounceDelay = 300,
    value: controlledValue,
    style,
    placeholder = 'Search...',
    clearable = true,
    disabled = false,
    ...rest 
  } = props;

  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Debounced change handler
  const debouncedOnChange = useCallback((newValue) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (onDebouncedChange) {
        onDebouncedChange(newValue);
      }
    }, debounceDelay);
  }, [onDebouncedChange, debounceDelay]);

  // Handle input change
  const handleChange = useCallback((event) => {
    const newValue = event.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }

    // Call immediate onChange if provided
    if (onChange) {
      onChange(event);
    }

    // Call debounced onChange
    debouncedOnChange(newValue);
  }, [isControlled, onChange, debouncedOnChange]);

  // Handle clear
  const handleClear = useCallback(() => {
    const syntheticEvent = {
      target: { value: '' },
      currentTarget: { value: '' }
    };

    if (!isControlled) {
      setInternalValue('');
    }

    if (onChange) {
      onChange(syntheticEvent);
    }

    if (onDebouncedChange) {
      onDebouncedChange('');
    }

    // Focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isControlled, onChange, onDebouncedChange]);

  // Handle focus/blur
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Update internal value if controlled value changes
  useEffect(() => {
    if (isControlled) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue, isControlled]);

  const rootClassName = classNames(
    classes.root, 
    className,
    {
      [classes.focused]: isFocused,
      [classes.disabled]: disabled
    }
  );

  const showClearButton = clearable && value.length > 0 && !disabled;

  return (
    <div className={rootClassName} style={style}>
      <SearchIcon className={classes.icon} />
      <Input
        {...rest}
        ref={inputRef}
        className={classes.input}
        disableUnderline
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        endAdornment={
          showClearButton && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                className={classes.clearButton}
                aria-label="Clear search"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }
      />
    </div>
  );
};

SearchInput.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onDebouncedChange: PropTypes.func,
  debounceDelay: PropTypes.number,
  value: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool
};

export default withStyles(styles)(SearchInput);