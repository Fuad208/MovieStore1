export default theme => ({
  root: {
    padding: theme.spacing(2)
  },
  title: { 
    marginBottom: theme.spacing(3),
    color: theme.palette.text.primary
  },
  field: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(2)
  },
  textField: {
    flex: 1,
    minWidth: 200
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`
  },
  buttonFooter: {
    minWidth: 120,
    height: 40
  },
  infoMessage: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.info.light,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.info.contrastText
  }
});