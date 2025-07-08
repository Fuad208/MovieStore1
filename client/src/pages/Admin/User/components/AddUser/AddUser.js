import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles, Typography } from '@material-ui/core';
import { Button, TextField, MenuItem } from '@material-ui/core';
import styles from './styles';

class AddUser extends Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    selectedUser: PropTypes.object,
    addUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    onClose: PropTypes.func
  };

  static defaultProps = {
    selectedUser: null,
    onClose: () => {}
  };

  state = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'guest',
    phone: '',
    errors: {}
  };

  componentDidMount() {
    this.populateForm();
  }

  componentDidUpdate(prevProps) {
    // Update form ketika selectedUser berubah
    if (prevProps.selectedUser !== this.props.selectedUser) {
      this.populateForm();
    }
  }

  populateForm = () => {
    if (this.props.selectedUser) {
      const {
        name = '',
        username = '',
        email = '',
        password = '',
        role = 'guest',
        phone = ''
      } = this.props.selectedUser;
      
      this.setState({
        name,
        username,
        email,
        password,
        role,
        phone,
        errors: {}
      });
    } else {
      // Reset form untuk user baru
      this.setState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'guest',
        phone: '',
        errors: {}
      });
    }
  };

  // Perbaikan: Menghapus handleChange yang tidak digunakan
  // dan memperbaiki handleFieldChange

  handleFieldChange = (field, value) => {
    this.setState(prevState => ({
      ...prevState,
      [field]: value,
      errors: {
        ...prevState.errors,
        [field]: '' // Clear error untuk field yang diubah
      }
    }));
  };

  validateForm = () => {
    const { name, username, email, password, role, phone } = this.state;
    const errors = {};

    if (!name.trim()) errors.name = 'Name is required';
    if (!username.trim()) errors.username = 'Username is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (!password.trim()) errors.password = 'Password is required';
    if (!role) errors.role = 'Role is required';
    if (!phone.trim()) errors.phone = 'Phone is required';

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  onAddUser = () => {
    if (!this.validateForm()) return;

    const user = {
      name: this.state.name.trim(),
      username: this.state.username.trim(),
      email: this.state.email.trim(),
      password: this.state.password,
      role: this.state.role,
      phone: this.state.phone.trim()
    };

    this.props.addUser(user);
    this.props.onClose();
  };

  onUpdateUser = () => {
    if (!this.validateForm()) return;

    const user = {
      name: this.state.name.trim(),
      username: this.state.username.trim(),
      email: this.state.email.trim(),
      password: this.state.password,
      role: this.state.role,
      phone: this.state.phone.trim()
    };

    this.props.updateUser(user, this.props.selectedUser._id);
    this.props.onClose();
  };

  render() {
    const { classes, className, selectedUser } = this.props;
    const { name, username, email, password, role, phone, errors } = this.state;

    const rootClassName = classNames(classes.root, className);
    const title = selectedUser ? 'Edit User' : 'Add User';
    const submitButton = selectedUser ? 'Update User' : 'Add User';
    const submitAction = selectedUser ? this.onUpdateUser : this.onAddUser;

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>
        <form autoComplete="off" noValidate>
          <div className={classes.field}>
            <TextField
              fullWidth
              className={classes.textField}
              helperText={errors.name || "Please specify the Full Name"}
              label="Full Name"
              margin="dense"
              required
              value={name}
              variant="outlined"
              error={!!errors.name}
              onChange={event =>
                this.handleFieldChange('name', event.target.value)
              }
            />
            <TextField
              fullWidth
              className={classes.textField}
              helperText={errors.username || ""}
              label="Username"
              margin="dense"
              required
              value={username}
              variant="outlined"
              error={!!errors.username}
              onChange={event =>
                this.handleFieldChange('username', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              fullWidth
              className={classes.textField}
              helperText={errors.email || ""}
              label="Email"
              margin="dense"
              required
              type="email"
              value={email}
              variant="outlined"
              error={!!errors.email}
              onChange={event =>
                this.handleFieldChange('email', event.target.value)
              }
            />
            <TextField
              fullWidth
              className={classes.textField}
              helperText={errors.password || ""}
              label="Password"
              margin="dense"
              required
              type="password"
              value={password}
              variant="outlined"
              error={!!errors.password}
              onChange={event =>
                this.handleFieldChange('password', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              fullWidth
              className={classes.textField}
              helperText={errors.phone || ""}
              label="Phone"
              margin="dense"
              required
              value={phone}
              variant="outlined"
              error={!!errors.phone}
              onChange={event =>
                this.handleFieldChange('phone', event.target.value)
              }
            />
            <TextField
              fullWidth
              select
              className={classes.textField}
              helperText={errors.role || "Admin or Guest"}
              label="Role"
              margin="dense"
              required
              value={role}
              variant="outlined"
              error={!!errors.role}
              onChange={event =>
                this.handleFieldChange('role', event.target.value)
              }
            >
              {['admin', 'guest'].map(roleOption => (
                <MenuItem key={`role-${roleOption}`} value={roleOption}>
                  {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </form>

        <Button
          className={classes.buttonFooter}
          color="primary"
          variant="contained"
          onClick={submitAction}
        >
          {submitButton}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(AddUser);