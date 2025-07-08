import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Button, 
  TextField, 
  Typography, 
  CircularProgress,
  Box,
  Divider,
  Alert
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { login, facebookLogin, googleLogin } from '../../../../store/actions';
import { history } from '../../../../utils';

const useStyles = makeStyles(theme => ({
  form: {
    paddingLeft: '100px',
    paddingRight: '100px',
    paddingBottom: '125px',
    flexBasis: '700px',
    maxWidth: '500px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingBottom: theme.spacing(4)
    }
  },
  title: {
    color: theme.palette.text.primary,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
    textAlign: 'center'
  },
  socialLogin: {
    margin: theme.spacing(3, 0)
  },
  socialButton: {
    width: '100%',
    height: 50,
    marginBottom: theme.spacing(2),
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: theme.spacing(1),
    fontSize: '0.95rem'
  },
  googleButton: {
    backgroundColor: '#fff',
    color: '#de5246',
    border: '1px solid #de5246',
    '&:hover': {
      backgroundColor: '#fafafa',
      borderColor: '#de5246'
    }
  },
  facebookButton: {
    backgroundColor: '#1877f2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#166fe5'
    }
  },
  divider: {
    margin: theme.spacing(3, 0),
    position: 'relative',
    '&::before': {
      content: '"or"',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fafafa',
      padding: theme.spacing(0, 2),
      color: theme.palette.text.secondary,
      fontSize: '0.875rem'
    }
  },
  fields: {
    marginTop: theme.spacing(2)
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1)
    }
  },
  loginButton: {
    marginTop: theme.spacing(2),
    width: '100%',
    height: 50,
    borderRadius: theme.spacing(1),
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem'
  },
  register: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  registerUrl: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textDecoration: 'none',
    marginLeft: theme.spacing(0.5),
    '&:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline'
    }
  },
  errorAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  }
}));

function LoginForm(props) {
  const { 
    login, 
    facebookLogin, 
    googleLogin, 
    isAuthenticated, 
    user, 
    redirect, 
    loading,
    error 
  } = props;
  
  const classes = useStyles();
  const [values, setValues] = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && redirect) {
      if (user && user.role === 'superadmin') {
        return history.push('/admin/dashboard');
      }
      return history.push('/');
    }
  }, [isAuthenticated, user, redirect]);

  const handleFieldChange = e => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!values.username.trim()) {
      errors.username = 'Username is required';
    } else if (values.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!values.password.trim()) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(values.username, values.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = (response) => {
    if (response.error) {
      console.error('Google login error:', response.error);
      return;
    }
    googleLogin(response);
  };

  const handleFacebookLogin = (response) => {
    if (response.status === 'unknown') {
      console.error('Facebook login was cancelled');
      return;
    }
    facebookLogin(response);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Typography className={classes.title} variant="h4">
        Sign In
      </Typography>
      
      <Typography className={classes.subtitle} variant="body1">
        Welcome back! Please sign in to your account.
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" className={classes.errorAlert}>
          {error}
        </Alert>
      )}

      {/* Social Login Section */}
      <div className={classes.socialLogin}>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id'}
          onSuccess={handleGoogleLogin}
          onFailure={handleGoogleLogin}
          cookiePolicy={'single_host_origin'}
          render={renderProps => (
            <Button
              className={`${classes.socialButton} ${classes.googleButton}`}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled || isSubmitting}
              variant="outlined"
            >
              Continue with Google
            </Button>
          )}
        />
        
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID || 'your-facebook-app-id'}
          fields="name,email,picture"
          callback={handleFacebookLogin}
          render={renderProps => (
            <Button
              className={`${classes.socialButton} ${classes.facebookButton}`}
              onClick={renderProps.onClick}
              disabled={isSubmitting}
              variant="contained"
            >
              Continue with Facebook
            </Button>
          )}
        />
      </div>

      <Divider className={classes.divider} />

      {/* Form Fields */}
      <div className={classes.fields}>
        <TextField
          className={classes.textField}
          label="Username"
          name="username"
          onChange={handleFieldChange}
          type="text"
          value={values.username}
          variant="outlined"
          error={!!fieldErrors.username}
          helperText={fieldErrors.username}
          disabled={isSubmitting}
          autoComplete="username"
        />
        
        <TextField
          className={classes.textField}
          label="Password"
          name="password"
          onChange={handleFieldChange}
          type="password"
          value={values.password}
          variant="outlined"
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
          disabled={isSubmitting}
          autoComplete="current-password"
        />
      </div>

      {/* Login Button */}
      <Button
        className={classes.loginButton}
        color="primary"
        type="submit"
        size="large"
        variant="contained"
        disabled={isSubmitting || loading}
      >
        {isSubmitting || loading ? (
          <Box className={classes.loadingContainer}>
            <CircularProgress size={24} color="inherit" />
            <Typography variant="body2" style={{ marginLeft: 8 }}>
              Signing in...
            </Typography>
          </Box>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Register Link */}
      <Typography className={classes.register} variant="body2">
        Don't have an account?
        <Link className={classes.registerUrl} to="/register">
          Create one here
        </Link>
      </Typography>
    </form>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated,
  user: state.authState.user,
  loading: state.authState.loading,
  error: state.authState.error
});

const mapDispatchToProps = {
  login,
  facebookLogin,
  googleLogin
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);