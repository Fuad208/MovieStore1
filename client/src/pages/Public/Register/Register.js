import React, { Component } from 'react';
import { connect } from 'react-redux';
import { register } from '../../../store/actions';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
  CircularProgress
} from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import styles from './styles';
import FileUpload from '../../../components/FileUpload/FileUpload';

class Register extends Component {
  state = {
    values: {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      image: null,
      policy: false
    },
    errors: {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: ''
    },
    isSubmitting: false
  };

  componentDidUpdate(prevProps) {
    const { isAuthenticated, history, error } = this.props;
    
    if (prevProps.isAuthenticated !== isAuthenticated && isAuthenticated) {
      history.push('/');
    }

    // Handle registration errors
    if (prevProps.error !== error && error) {
      this.setState({ isSubmitting: false });
    }
  }

  handleBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  validateField = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!value || value.trim().length < 2) {
          error = 'Name must be at least 2 characters long';
        }
        break;
      case 'username':
        if (!value || value.trim().length < 3) {
          error = 'Username must be at least 3 characters long';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, and underscores';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!value || value.trim().length < 10) {
          error = 'Phone number must be at least 10 digits';
        } else if (!/^\+?[\d\s-()]+$/.test(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
      case 'password':
        if (!value || value.length < 6) {
          error = 'Password must be at least 6 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  handleFieldChange = (field, value) => {
    const error = this.validateField(field, value);
    
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        [field]: value
      },
      errors: {
        ...prevState.errors,
        [field]: error
      }
    }));
  };

  validateForm = () => {
    const { values } = this.state;
    const errors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(values).forEach(field => {
      if (field !== 'image' && field !== 'policy') {
        const error = this.validateField(field, values[field]);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      }
    });

    // Check policy agreement
    if (!values.policy) {
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  };

  handleRegister = async () => {
    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true });

    try {
      const { values } = this.state;
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(values).forEach(key => {
        if (key === 'image' && values[key]) {
          formData.append(key, values[key]);
        } else if (key !== 'image') {
          formData.append(key, values[key]);
        }
      });

      await this.props.register(formData);
    } catch (error) {
      console.error('Registration error:', error);
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    const { classes, error } = this.props;
    const { values, errors, isSubmitting } = this.state;

    const isValid = values.policy && 
      Object.values(errors).every(error => !error) &&
      Object.entries(values).every(([key, value]) => {
        if (key === 'image' || key === 'policy') return true;
        return value && value.toString().trim().length > 0;
      });

    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          <Grid className={classes.bgWrapper} item lg={5}>
            <div className={classes.bg} />
          </Grid>
          <Grid className={classes.content} item lg={7} xs={12}>
            <div className={classes.content}>
              <div className={classes.contentHeader}>
                <IconButton
                  className={classes.backButton}
                  onClick={this.handleBack}
                  disabled={isSubmitting}>
                  <ArrowBackIcon />
                </IconButton>
              </div>
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography className={classes.title} variant="h2">
                    Create new account
                  </Typography>
                  <Typography className={classes.subtitle} variant="body1">
                    Use your email to create new account... it's free.
                  </Typography>
                  
                  {error && (
                    <Typography className={classes.submitError} variant="body2">
                      {error}
                    </Typography>
                  )}

                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="Full name"
                      name="name"
                      value={values.name}
                      onChange={event =>
                        this.handleFieldChange('name', event.target.value)
                      }
                      variant="outlined"
                      error={!!errors.name}
                      helperText={errors.name}
                      disabled={isSubmitting}
                    />
                    <TextField
                      className={classes.textField}
                      label="User name"
                      name="username"
                      value={values.username}
                      onChange={event =>
                        this.handleFieldChange('username', event.target.value)
                      }
                      variant="outlined"
                      error={!!errors.username}
                      helperText={errors.username}
                      disabled={isSubmitting}
                    />
                    <TextField
                      className={classes.textField}
                      label="Email address"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={event =>
                        this.handleFieldChange('email', event.target.value)
                      }
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email}
                      disabled={isSubmitting}
                    />
                    <TextField
                      className={classes.textField}
                      label="Mobile Phone"
                      name="phone"
                      value={values.phone}
                      variant="outlined"
                      onChange={event =>
                        this.handleFieldChange('phone', event.target.value)
                      }
                      error={!!errors.phone}
                      helperText={errors.phone}
                      disabled={isSubmitting}
                    />
                    <TextField
                      className={classes.textField}
                      label="Password"
                      type="password"
                      value={values.password}
                      variant="outlined"
                      onChange={event =>
                        this.handleFieldChange('password', event.target.value)
                      }
                      error={!!errors.password}
                      helperText={errors.password}
                      disabled={isSubmitting}
                    />
                    <FileUpload
                      className={classes.upload}
                      file={values.image}
                      onUpload={event => {
                        const file = event.target.files[0];
                        this.handleFieldChange('image', file);
                      }}
                      disabled={isSubmitting}
                    />
                    <div className={classes.policy}>
                      <Checkbox
                        checked={values.policy}
                        className={classes.policyCheckbox}
                        color="primary"
                        name="policy"
                        onChange={() =>
                          this.handleFieldChange('policy', !values.policy)
                        }
                        disabled={isSubmitting}
                      />
                      <Typography
                        className={classes.policyText}
                        variant="body1">
                        I have read the &nbsp;
                        <Link className={classes.policyUrl} to="#">
                          Terms and Conditions
                        </Link>
                        .
                      </Typography>
                    </div>
                  </div>

                  <Button
                    className={classes.registerButton}
                    color="primary"
                    disabled={!isValid || isSubmitting}
                    onClick={this.handleRegister}
                    size="large"
                    variant="contained">
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                        &nbsp; Registering...
                      </>
                    ) : (
                      'Register now'
                    )}
                  </Button>

                  <Typography className={classes.login} variant="body1">
                    Have an account?{' '}
                    <Link 
                      className={classes.loginUrl} 
                      to="/login"
                      style={{ pointerEvents: isSubmitting ? 'none' : 'auto' }}>
                      Login
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Register.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.string
};

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated,
  error: state.authState.error
});

export default withStyles(styles)(
  connect(mapStateToProps, { register })(Register)
);