export default theme => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1]
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5)
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  deleteButton: {
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.light + '20'
    }
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
});