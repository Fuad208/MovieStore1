export const sidebarStyles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2, 1)
  },
  listSubheader: {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
    padding: theme.spacing(1, 2),
    backgroundColor: 'transparent'
  },
  listItem: {
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.5, 0),
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    transition: theme.transitions.create(['background-color', 'border-left'], {
      duration: theme.transitions.duration.shortest
    }),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& $listItemIcon': {
        color: theme.palette.primary.main
      }
    }
  },
  activeListItem: {
    backgroundColor: theme.palette.action.selected,
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    '& $listItemText': {
      color: theme.palette.primary.main,
      fontWeight: 600
    },
    '& $listItemIcon': {
      color: theme.palette.primary.main
    }
  },
  listItemIcon: {
    minWidth: 40,
    color: theme.palette.text.secondary,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.shortest
    })
  },
  listItemText: {
    fontWeight: 500,
    color: theme.palette.text.primary,
    '& .MuiTypography-root': {
      fontSize: '0.875rem'
    }
  },
  listDivider: {
    margin: theme.spacing(2, 0),
    backgroundColor: theme.palette.divider
  }
});