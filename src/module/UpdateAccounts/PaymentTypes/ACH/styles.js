export const styles = (theme) => ({
  achInfoOuterContainer: {
    display: "flex",
    flexDirection: "row",
  },
  textFieldItem: {
    marginTop: theme.spacing(4),
    paddingRight: `20px !important`,
    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f44336 !important",
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.38) !important",
    },
    "& .MuiFormLabel-root.Mui-error": {
      color: "#E02020 !important",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(2),
      width: "100%",
    },
  },
  selectFieldItem: {
    marginTop: theme.spacing(4),
    paddingRight: `20px !important`,
  },
  lastSelectFieldItem: {
    width: "23%",
    marginTop: theme.spacing(4),
  },
  actionButtonCont: {
    display: "flex",
    width: "100%",
    justifyContent: "space-around",
    paddingTop: theme.spacing(4),

    marginBottom: theme.spacing(6),
  },
  shareButton: {
    width: 140,
    [theme.breakpoints.down("xs")]: {
      width: 115,
    },
    cursor: "pointer",
  },
  buttonGridItems: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginRight: theme.spacing(0),
      width: "100%",
    },
  },
  achInfoHeading: {
    fontSize: "1.5rem",
    color: theme.palette.text.dark,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.2rem",
    },
  },
  searchRoutingText: {
    color: "#008CE6",
    display: "flex",
    fontSize: "0.75rem",
    textDecoration: "underline",
  },
  bankNameItem: {
    marginTop: theme.spacing(1),
    paddingRight: `20px !important`,
  },

  authModal: {
    maxWidth: "756px",
    margin: "0 auto",
  },
  backButton: {
    width: 140,
    cursor: "pointer",
    marginRight: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      width: 115,
      marginRight: theme.spacing(2),
    },
  },
  achInfoNote: {
    textAlign: "justify",
    fontSize: "14px",
    color: "#2B2D30",
    marginTop: theme.spacing(1),
    width: "80%",
  },
  routingCodeDialog: {
    "& .MuiDialog-paper": {
      maxWidth: "860px !important",
      minWidth: "600px",
      borderRadius: "10px",
      [theme.breakpoints.down("xs")]: {
        minWidth: "90%",
        width: "100%",
        margin: "0px 16px !important",
      },
    },
  },
  alphaNumericTextField: {
    "& .MuiFormLabel-root.Mui-error": {
      color: "#f44336 !important",
    },
  },
});
