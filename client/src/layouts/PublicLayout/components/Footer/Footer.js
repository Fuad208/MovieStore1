import React from 'react';
import { 
  Box, 
  Container, 
  Divider, 
  Typography, 
  Link, 
  Grid,
  IconButton,
  useTheme
} from '@material-ui/core';
import { 
  GitHub as GitHubIcon, 
  LinkedIn as LinkedInIcon, 
  Email as EmailIcon 
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    marginTop: 'auto',
    padding: theme.spacing(6, 0, 3),
    borderTop: `1px solid ${theme.palette.divider}`
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing(0, 2)
  },
  section: {
    marginBottom: theme.spacing(4)
  },
  brandSection: {
    textAlign: 'center',
    marginBottom: theme.spacing(4)
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1)
  },
  tagline: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    fontStyle: 'italic'
  },
  linksSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(4),
    flexWrap: 'wrap'
  },
  linkGroup: {
    textAlign: 'center'
  },
  linkGroupTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary
  },
  footerLink: {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    fontSize: '0.9rem',
    display: 'block',
    marginBottom: theme.spacing(0.5),
    transition: 'color 0.2s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline'
    }
  },
  socialSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4)
  },
  socialLink: {
    color: theme.palette.text.secondary,
    transition: 'color 0.2s ease, transform 0.2s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      transform: 'translateY(-2px)'
    }
  },
  bottomSection: {
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(3),
    textAlign: 'center'
  },
  copyright: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1)
  },
  credits: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary
  },
  creditsLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));

const footerLinks = {
  movies: [
    { label: 'Now Showing', path: '/movie/category/nowShowing' },
    { label: 'Coming Soon', path: '/movie/category/comingSoon' },
    { label: 'Top Rated', path: '/movie/category/topRated' },
    { label: 'Genres', path: '/genres' }
  ],
  cinemas: [
    { label: 'Find Cinemas', path: '/cinemas' },
    { label: 'Book Tickets', path: '/booking' },
    { label: 'Showtimes', path: '/showtimes' }
  ],
  account: [
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/register' },
    { label: 'My Account', path: '/mydashboard' }
  ],
  help: [
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' }
  ]
};

const socialLinks = [
  { 
    icon: GitHubIcon, 
    url: 'https://github.com/charangajjala',
    label: 'GitHub'
  },
  { 
    icon: LinkedInIcon, 
    url: 'https://linkedin.com/in/charangajjala',
    label: 'LinkedIn'
  },
  { 
    icon: EmailIcon, 
    url: 'mailto:contact@moviestore.com',
    label: 'Email'
  }
];

function Footer() {
  const classes = useStyles();
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className={classes.footer}>
      <Container className={classes.container}>
        {/* Brand Section */}
        <Box className={classes.brandSection}>
          <Typography variant="h5" className={classes.brand}>
            Movie Store
          </Typography>
          <Typography variant="body2" className={classes.tagline}>
            Your ultimate destination for movie entertainment
          </Typography>
        </Box>

        {/* Links Section */}
        <Box className={classes.linksSection}>
          {Object.entries(footerLinks).map(([category, links]) => (
            <Box key={category} className={classes.linkGroup}>
              <Typography variant="h6" className={classes.linkGroupTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Typography>
              {links.map(link => (
                <Link 
                  key={link.path}
                  href={link.path}
                  className={classes.footerLink}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          ))}
        </Box>

        {/* Social Media Section */}
        <Box className={classes.socialSection}>
          {socialLinks.map(({ icon: Icon, url, label }) => (
            <IconButton
              key={label}
              component="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.socialLink}
              aria-label={label}
            >
              <Icon />
            </IconButton>
          ))}
        </Box>

        {/* Bottom Section */}
        <Box className={classes.bottomSection}>
          <Typography variant="body2" className={classes.copyright}>
            © {currentYear} Movie Store. All rights reserved.
          </Typography>
          <Typography variant="caption" className={classes.credits}>
            Developed with ❤️ by{' '}
            <Link 
              href="https://github.com/charangajjala" 
              target="_blank" 
              rel="noopener noreferrer"
              className={classes.creditsLink}
            >
              Charan, Hari & Sreeram
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;