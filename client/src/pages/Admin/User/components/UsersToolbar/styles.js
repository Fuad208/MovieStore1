export default theme => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    justifyContent: 'space-between'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginLeft: 'auto'
  },
  deleteButton: {
    color: theme.palette.error?.main || '#f44336',
    '&:hover': {
      backgroundColor: theme.palette.error?.light || 'rgba(244, 67, 54, 0.08)'
    }
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
});