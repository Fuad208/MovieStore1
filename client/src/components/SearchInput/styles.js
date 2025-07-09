export default theme => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.common.neutral || theme.palette.divider}`,
    borderRadius: '4px',
    display: 'flex',
    flexBasis: '420px',
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      borderColor: theme.palette.primary.main
    }
  },
  focused: {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
  },
  disabled: {
    backgroundColor: theme.palette.action.disabledBackground,
    borderColor: theme.palette.action.disabled,
    opacity: 0.6,
    '&:hover': {
      borderColor: theme.palette.action.disabled
    }
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    transition: 'color 0.2s ease-in-out',
    '$focused &': {
      color: theme.palette.primary.main
    }
  },
  input: {
    flexGrow: 1,
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '-0.05px',
    '& input': {
      '&::placeholder': {
        color: theme.palette.text.secondary,
        opacity: 1
      }
    }
  },
  clearButton: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.action.hover
    }
  }
});