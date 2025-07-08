import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, CircularProgress } from '@material-ui/core';
import styles from './styles';
import { UsersToolbar, UsersTable, AddUser } from './components';
import {
  getUsers,
  deleteUser,
  selectUser,
  selectAllUsers,
  toggleUserDialog,
  addUser,
  updateUser
} from '../../../store/actions';
import { ResponsiveDialog } from '../../../components';

class User extends Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    selectedUsers: PropTypes.array.isRequired,
    openDialog: PropTypes.bool.isRequired,
    getUsers: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    selectUser: PropTypes.func.isRequired,
    selectAllUsers: PropTypes.func.isRequired,
    toggleUserDialog: PropTypes.func.isRequired,
    addUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired
  };

  static defaultProps = {
    users: [],
    selectedUsers: [],
    openDialog: false
  };

  componentDidMount() {
    this.props.getUsers();
  }

  // Perbaikan: Menghapus method handleSelect yang tidak digunakan
  // dan menggunakan selectUser dari props

  handleDeleteUser = () => {
    const { selectedUsers, deleteUser } = this.props;
    if (selectedUsers.length > 0) {
      deleteUser(selectedUsers[0]);
    }
  };

  handleCloseDialog = () => {
    this.props.toggleUserDialog();
  };

  renderUsers() {
    const {
      classes,
      users,
      selectedUsers,
      selectUser,
      selectAllUsers
    } = this.props;

    if (!users || users.length === 0) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <UsersTable
        onSelect={selectUser}
        onSelectAll={selectAllUsers}
        users={users}
        selectedUsers={selectedUsers}
      />
    );
  }

  render() {
    const {
      classes,
      users,
      selectedUsers,
      openDialog,
      toggleUserDialog,
      addUser,
      updateUser
    } = this.props;

    return (
      <div className={classes.root}>
        <UsersToolbar
          users={users}
          selectedUsers={selectedUsers}
          toggleDialog={toggleUserDialog}
          deleteUser={this.handleDeleteUser}
        />
        <div className={classes.content}>
          {this.renderUsers()}
        </div>
        <ResponsiveDialog
          id="Add-user"
          open={openDialog}
          handleClose={this.handleCloseDialog}
        >
          <AddUser
            selectedUser={selectedUsers.length > 0 ? users.find(user => user._id === selectedUsers[0]) : null}
            addUser={addUser}
            updateUser={updateUser}
            onClose={this.handleCloseDialog}
          />
        </ResponsiveDialog>
      </div>
    );
  }
}

const mapStateToProps = ({ userState }) => ({
  users: userState.users || [],
  selectedUsers: userState.selectedUsers || [],
  openDialog: userState.openDialog || false
});

const mapDispatchToProps = {
  getUsers,
  selectUser,
  selectAllUsers,
  toggleUserDialog,
  addUser,
  updateUser,
  deleteUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(User));