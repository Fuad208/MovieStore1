export const topbarStyles = theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    height: theme.mixins.toolbar.minHeight || 64,
    zIndex: theme.zIndex.appBar
  },
  toolbar: {
    minHeight: 'auto',
    width: '100%',
    paddingLeft: 0,
    paddingRight: theme.spacing(2)
  },
  brandWrapper: {
    background: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 271,
    height: '100%',
    padding: theme.spacing(0, 2),
    flexShrink: 0
  },
  logo: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: 1,
    color: theme.palette.primary.contrastText,
    textDecoration: 'none'
  },
  title: {
    marginLeft: theme.spacing(3),
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  menuButton: {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  },
  actions: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  notificationsButton: {
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '0.875rem'
  }
});