import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button, TextField, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from '../../../../../components';

// Component styles
import styles from './styles';

class AccountDetails extends Component {
  state = {
    name: '',
    email: '',
    phone: '',
    password: '',
    loading: false,
    notification: null,
    errors: {}
  };

  componentDidMount() {
    const { name, email, phone } = this.props.user;
    this.setState({ name, email, phone });
  }

  componentDidUpdate(prevProps) {
    // Update state when user prop changes
    if (prevProps.user !== this.props.user) {
      const { name, email, phone } = this.props.user;
      this.setState({ name, email, phone });
    }
  }

  handleFieldChange = (field, value) => {
    this.setState({ 
      [field]: value,
      errors: { ...this.state.errors, [field]: null } // Clear error when user types
    });
  };

  validateForm = () => {
    const { name, email, phone } = this.state;
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (phone && !/^\d+$/.test(phone)) {
      errors.phone = 'Phone number must contain only digits';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  onUpdateUser = async () => {
    if (!this.validateForm()) {
      return;
    }

    this.setState({ loading: true });

    try {
      const { name, email, phone, password } = this.state;
      const token = localStorage.getItem('jwtToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      let body = { name: name.trim(), email: email.trim(), phone: phone.trim() };
      if (password) {
        body = { ...body, password };
      }

      const url = '/api/users/me'; // More specific API endpoint
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const user = await response.json();
      
      // Upload image if file exists
      if (this.props.file) {
        await this.props.uploadImage(user._id, this.props.file);
      }

      this.setState({ 
        notification: { type: 'success', message: 'Profile updated successfully' },
        password: '' // Clear password field after successful update
      });

    } catch (error) {
      console.error('Update user error:', error);
      this.setState({ 
        notification: { type: 'error', message: error.message || 'Failed to update profile' }
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleCloseNotification = () => {
    this.setState({ notification: null });
  };

  render() {
    const { classes, className } = this.props;
    const { name, phone, email, password, loading, notification, errors } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <>
        <Portlet className={rootClassName}>
          <PortletHeader>
            <PortletLabel
              subtitle="The information can be edited"
              title="Profile"
            />
          </PortletHeader>
          <PortletContent noPadding>
            <form autoComplete="off" noValidate>
              <div className={classes.field}>
                <TextField
                  className={classes.textField}
                  helperText={errors.name || "Please specify your full name"}
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
                  className={classes.textField}
                  helperText={errors.email || "Please enter a valid email address"}
                  label="Email Address"
                  margin="dense"
                  required
                  value={email}
                  variant="outlined"
                  error={!!errors.email}
                  onChange={event =>
                    this.handleFieldChange('email', event.target.value)
                  }
                />
              </div>
              <div className={classes.field}>
                <TextField
                  className={classes.textField}
                  helperText={errors.phone || "Enter your phone number"}
                  label="Phone Number"
                  margin="dense"
                  value={phone}
                  variant="outlined"
                  error={!!errors.phone}
                  onChange={event =>
                    this.handleFieldChange('phone', event.target.value)
                  }
                />
                <TextField
                  className={classes.textField}
                  helperText="Leave blank to keep current password"
                  label="New Password"
                  margin="dense"
                  type="password"
                  value={password}
                  variant="outlined"
                  onChange={event =>
                    this.handleFieldChange('password', event.target.value)
                  }
                />
              </div>
            </form>
          </PortletContent>
          <PortletFooter className={classes.portletFooter}>
            <Button
              color="primary"
              variant="contained"
              onClick={this.onUpdateUser}
              disabled={loading}>
              {loading ? 'Saving...' : 'Save details'}
            </Button>
          </PortletFooter>
        </Portlet>

        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={this.handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          {notification && (
            <Alert 
              onClose={this.handleCloseNotification} 
              severity={notification.type}
              variant="filled"
            >
              {notification.message}
            </Alert>
          )}
        </Snackbar>
      </>
    );
  }
}

AccountDetails.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  file: PropTypes.object,
  uploadImage: PropTypes.func
};

export default withStyles(styles)(AccountDetails);