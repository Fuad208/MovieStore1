import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Box } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import LoginForm from './components/LoginForm';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  grid: {
    height: '100vh',
    minHeight: '100vh'
  },
  bgWrapper: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    position: 'relative'
  },
  bg: {
    backgroundColor: theme.palette.common.neutral || '#1a1a1a',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(https://images.unsplash.com/photo-1489599811394-15c4b15e7cb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1
    }
  },
  bgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2
  },
  bgContent: {
    position: 'relative',
    zIndex: 3,
    textAlign: 'center',
    color: 'white',
    padding: theme.spacing(4)
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fafafa'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderBottom: '1px solid #e0e0e0'
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  backButton: {
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  },
  welcomeText: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2)
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.1rem'
  }
});

class Login extends Component {
  handleBack = () => {
    const { history } = this.props;
    
    // Check if there's a previous page to go back to
    if (window.history.length > 1) {
      history.goBack();
    } else {
      // If no previous page, go to home
      history.push('/');
    }
  };

  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          {/* Background Section */}
          <Grid className={classes.bgWrapper} item lg={5}>
            <div className={classes.bg}>
              <div className={classes.bgOverlay} />
              <div className={classes.bgContent}>
                <Typography variant="h3" className={classes.welcomeText}>
                  Welcome Back!
                </Typography>
                <Typography variant="body1" className={classes.subtitleText}>
                  Sign in to access your movie booking account and enjoy the latest films.
                </Typography>
              </div>
            </div>
          </Grid>
          
          {/* Content Section */}
          <Grid className={classes.content} item lg={7} xs={12}>
            <div className={classes.contentHeader}>
              <IconButton
                className={classes.backButton}
                onClick={this.handleBack}
                aria-label="Go back"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" style={{ marginLeft: 8 }}>
                Back
              </Typography>
            </div>
            
            <div className={classes.contentBody}>
              <LoginForm redirect />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Login.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);