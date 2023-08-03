export const styles = (theme) => ({
  checkInfoOuterContainer: {
    display: "flex",
    flexDirection: "row",
  },
  textFieldItem: {
    marginTop: theme.spacing(4),
    "& .MuiFormLabel-root.Mui-error": {
      color: "#f44336 !important",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
    },
  },
  actionButtonCont: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    paddingTop: theme.spacing(4),
    alignItems: "center",
  },
  checkShareButton: {
    width: 140,
    cursor: "pointer !important",
  },
  buttonGridItems: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  checkInfoHeading: {
    fontSize: "1.5rem",
    color: theme.palette.text.dark,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.2rem",
    },
  },
  checkInfoOuterCont: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(0),
    },
  },
  authModal: {
    maxWidth: "756px",
    margin: "0 auto",
    [theme.breakpoints.down("xs")]: {
      width: "90%",
      margin: "0 auto",
    },
  },
  linkBtn: {
    color: "#008CE6",
    fontSize: theme.spacing(2),
  },
  headingCont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
});
