import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(1),
  },
  cardContainer: {
    margin: theme.spacing(1),
    justifyContent: "flex-start"
  },
  popper: {
    zIndex: theme.zIndex.modal + 10,
  },
  buttonGroup: {
    marginBottom: `-${theme.spacing(3)}px`,
    marginRight: `-${theme.spacing(10)}px`,
    boxShadow: 'none',
  },
  input: {
    fontSize: '0.88rem',
  },
  card: {
    borderStyle: 'solid',
    borderColor: theme.palette.grey[400],
    borderWidth: theme.spacing(0.02),
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.palette.grey[50],
    margin: theme.spacing(0.5),
    marginLeft: theme.spacing(2),
    minWidth: '40vh'
  },
}))

export default useStyles
