import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';

const styles = theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  title: {
    paddingRight: theme.spacing(6) // Make room for close button
  },
  actions: {
    padding: theme.spacing(1, 3, 2)
  }
});

const ResponsiveDialog = ({
  classes,
  id,
  title = '',
  contentText,
  children,
  open,
  onClose,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
  actions,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  keepMounted = false,
  scroll = 'paper',
  ...other
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = useCallback((event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') {
      return;
    }
    if (onClose) {
      onClose(event, reason);
    }
  }, [disableBackdropClick, disableEscapeKeyDown, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && open && !disableEscapeKeyDown) {
        handleClose(event, 'escapeKeyDown');
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open, handleClose, disableEscapeKeyDown]);

  const defaultActions = (
    <Button onClick={handleClose} color="primary" autoFocus>
      Close
    </Button>
  );

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
      aria-labelledby={id}
      keepMounted={keepMounted}
      scroll={scroll}
      {...other}
    >
      {title && (
        <DialogTitle id={id} className={classes.title}>
          {title}
          {showCloseButton && (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      
      <DialogContent>
        {contentText && (
          <DialogContentText>
            {contentText}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      
      <DialogActions className={classes.actions}>
        {actions || defaultActions}
      </DialogActions>
    </Dialog>
  );
};

ResponsiveDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  contentText: PropTypes.string,
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  actions: PropTypes.node,
  disableBackdropClick: PropTypes.bool,
  disableEscapeKeyDown: PropTypes.bool,
  keepMounted: PropTypes.bool,
  scroll: PropTypes.oneOf(['body', 'paper'])
};

export default withStyles(styles)(ResponsiveDialog);