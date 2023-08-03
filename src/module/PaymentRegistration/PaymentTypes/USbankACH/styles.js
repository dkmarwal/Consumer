export const styles = (theme) => ({
  achInfoOuterContainer: {
    display: 'flex',
    flexDirection: 'row',
  },

  actionButtonCont: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    alignItems: 'center',
  },
  shareButton: {
    width: 140,
    cursor: 'pointer',
  },
  connectionButton: {
    width: 200,
    cursor: 'pointer',
  },
  buttonGridItems: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  achInfoHeading: {
    fontSize: '1.5rem',
    color: theme.palette.text.dark,
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem',
    },
  },
  connectionHeading: {
    fontSize: '1.5rem',
    color: theme.palette.text.dark,
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem',
    },
  },
  eyeIcon: {
    color: '#4c4c4c',
    cursor: 'pointer',
  },
  searchRoutingText: {
    color: '#008CE6',
    display: 'flex',
    fontSize: '0.75rem',
    paddingTop: theme.spacing(0.5),
    textDecoration: 'underline',
  },
  bankNameItem: {
    marginTop: theme.spacing(1),
    paddingRight: `20px !important`,
  },
  authModal: {
    maxWidth: '756px',
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      width: '90%',
      margin: '0 auto',
    },
  },
  linkBtn: {
    color: '#008CE6',
    fontSize: theme.spacing(2),
  },
  alphaNumericTextField: {
    '& .MuiFormLabel-root.Mui-error': {
      color: '#f44336 !important',
    },
    '& .MuiFormLabel-root.Mui-disabled':{
      color:'rgba(0, 0, 0, 0.38) !important'
    },
    "& .MuiInputBase-input.Mui-disabled":{
      color:"rgba(0, 0, 0, 0.38)"
    }
  },
  routingCodeDialog: {
    '& .MuiDialog-paper': {
      maxWidth: '860px !important',
      minWidth: '600px',
      borderRadius: '10px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '90%',
        width: '100%',
        margin: '0px 16px !important',
      },
    },
  },
  backdrop: { zIndex: theme.zIndex.drawer + 1, color: '#fff' },
  dialogTitleRoot: {
    padding: '0px 16px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dialogTitleAccountList: {
    padding: '16px 16px',
    paddingLeft: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogContentRoot: {
    padding: '0px 24px',
    overflowY:'hidden',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  dialogContentAccountList: {
    border: '1px solid #000',
    padding: '8px 16px',
    margin: '8px',
  },
  dialogMX: {
    // '& .MuiDialog-container':{
    //   height:'90%'
    // },
    '& .MuiDialog-paper': {
      minHeight: 300,
    },
  },
  dialogMXLoading: {
    '& .MuiDialog-paper': {
      height: 300,
    },
  },
  dialogActionsButton: {
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    overflowY:'hidden'
  },
  circularProgressClass: {
    width: '100% !important',
    display: 'inline-flex',
    justifyContent: 'center',
  },
});
