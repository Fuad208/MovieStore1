export default theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100vh'
  },
  grid: {
    height: '100%'
  },
  bgWrapper: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  bg: {
    backgroundColor: theme.palette.common.neutral || theme.palette.grey[300],
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    opacity: 0.5
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(2), // Fixed typo: paddingBototm -> paddingBottom
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  backButton: {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: '100px',
    paddingRight: '100px',
    paddingBottom: '125px',
    flexBasis: '700px',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    color: theme.palette.common.contrastText || theme.palette.text.primary,
    marginTop: theme.spacing(3),
    fontWeight: 600
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5)
  },
  fields: {
    marginTop: theme.spacing(5)
  },
  textField: {
    width: '100%',
    '& + &': {
      marginTop: theme.spacing(2)
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main
      }
    }
  },
  upload: {
    width: '100%',
    marginTop: theme.spacing(2)
  },
  policy: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  policyText: {
    display: 'inline',
    color: theme.palette.text.secondary
  },
  policyUrl: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.primary.main,
      textDecoration: 'underline'
    }
  },
  progress: {
    display: 'block',
    marginTop: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  registerButton: {
    marginTop: theme.spacing(3),
    width: '100%',
    height: '48px',
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[4]
    },
    '&:disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled
    }
  },
  login: {
    marginTop: theme.spacing(3),
    color: theme.palette.text.secondary,
    textAlign: 'center'
  },
  loginUrl: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline'
    }
  },
  fieldError: {
    color: theme.palette.error.main || theme.palette.danger?.main || '#f44336',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
    fontSize: '0.875rem'
  },
  submitError: {
    color: theme.palette.error.main || theme.palette.danger?.main || '#f44336',
    textAlign: 'center',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.error.light || 'rgba(244, 67, 54, 0.1)',
    borderRadius: '4px',
    fontSize: '0.875rem'
  }
});