// client/src/layouts/AdminLayout/components/Footer/Footer.js
import React from 'react';
import { Divider, Typography, Link, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 'auto',
    padding: theme.spacing(3, 4),
    background: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      textAlign: 'center'
    }
  },
  copyright: {
    fontWeight: 500
  },
  links: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: theme.spacing(1)
    }
  }
}));

const Footer = () => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className={classes.root}>
      <div className={classes.content}>
        <Typography className={classes.copyright} variant="body2">
          © {currentYear} Movie Store. All rights reserved.
        </Typography>
        
        <div className={classes.links}>
          <Typography variant="caption" color="textSecondary">
            Created with purpose
          </Typography>
          <Typography variant="caption" color="textSecondary">
            |
          </Typography>
          <Link 
            href="https://github.com/charangajjala" 
            target="_blank" 
            rel="noopener noreferrer"
            variant="caption"
            color="primary"
          >
            GitHub
          </Link>
        </div>
      </div>
    </Box>
  );
};

export default Footer;