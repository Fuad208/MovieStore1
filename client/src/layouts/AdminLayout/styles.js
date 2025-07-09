export default theme => ({
  topbar: {
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    right: 'auto',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  drawerPaper: {
    borderRight: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer,
    width: 271,
    top: theme.mixins.toolbar.minHeight || 64,
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight || 64}px)`,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '4px'
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.default
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.divider,
      borderRadius: '2px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.text.disabled
    }
  },
  sidebar: {
    width: 270
  },
  content: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    paddingTop: theme.spacing(12), // Account for fixed topbar
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
  },
  contentShift: {
    [theme.breakpoints.up('md')]: {
      marginLeft: 270,
      width: `calc(100% - 270px)`
    }
  },
  [theme.breakpoints.down('sm')]: {
    content: {
      padding: theme.spacing(2),
      paddingTop: theme.spacing(10)
    },
    contentShift: {
      marginLeft: 0,
      width: '100%'
    }
  }
});