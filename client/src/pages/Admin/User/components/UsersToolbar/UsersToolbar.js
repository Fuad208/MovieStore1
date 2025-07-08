import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from '@material-ui/icons';
import styles from './styles';

const UsersToolbar = props => {
  const { classes, className, toggleDialog, selectedUsers, deleteUser } = props;
  const rootClassName = classNames(classes.root, className);

  const handleDeleteClick = () => {
    if (selectedUsers.length > 0) {
      // Bisa ditambahkan konfirmasi dialog di sini
      if (window.confirm('Are you sure you want to delete the selected user(s)?')) {
        deleteUser();
      }
    }
  };

  return (
    <div className={rootClassName}>
      <div className={classes.row}>
        <div className={classes.actions}>
          {selectedUsers.length > 0 && (
            <Tooltip title="Delete selected user(s)">
              <IconButton 
                className={classes.deleteButton} 
                onClick={handleDeleteClick}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <Button
            onClick={toggleDialog}
            color="primary"
            size="small"
            variant="contained"
            startIcon={selectedUsers.length === 1 ? <EditIcon /> : <AddIcon />}
          >
            {selectedUsers.length === 1 ? 'Edit User' : 'Add User'}
          </Button>
        </div>
      </div>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  selectedUsers: PropTypes.array.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
};

UsersToolbar.defaultProps = {
  selectedUsers: []
};

export default withStyles(styles)(UsersToolbar);