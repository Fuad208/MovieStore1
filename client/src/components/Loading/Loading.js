import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.common.black,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  progress: {
    marginBottom: theme.spacing(2),
  },
  text: {
    fontSize: '1.2rem',
    fontWeight: 300,
  }
}));

const Loading = React.memo(({ message = 'Loading...', size = 60 }) => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <CircularProgress 
        className={classes.progress} 
        size={size} 
        color="primary" 
      />
      <Typography className={classes.text} variant="h6">
        {message}
      </Typography>
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;