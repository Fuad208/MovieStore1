export default theme => ({
  root: {
    flexGrow: 0,
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: '5px',
    display: 'inline-flex',
    border: `1px solid ${theme.palette.border || theme.palette.divider}`,
    transition: 'opacity 0.2s ease-in-out'
  },
  disabled: {
    opacity: 0.6,
    pointerEvents: 'none'
  },
  option: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&:focus': {
      outline: 'none',
      backgroundColor: theme.palette.action.hover,
      boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`
    }
  },
  optionSelected: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.background.default
    }
  },
  optionDisabled: {
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  },
  divider: {
    width: '1px',
    backgroundColor: theme.palette.divider
  },
  displayIcon: {
    fontSize: '1.2rem',
    transition: 'transform 0.2s ease-in-out',
    '$option:hover &': {
      transform: 'scale(1.1)'
    }
  }
});