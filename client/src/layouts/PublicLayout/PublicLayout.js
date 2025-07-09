import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Navbar, Footer } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    color: theme.palette.common.white,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  main: {
    flex: 1,
    paddingTop: '80px', // Account for fixed navbar
    position: 'relative'
  }
}));

function PublicLayout({ children, withFooter = true }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Navbar />
      <Box component="main" className={classes.main}>
        {children}
      </Box>
      {withFooter && <Footer />}
    </div>
  );
}

export default PublicLayout;