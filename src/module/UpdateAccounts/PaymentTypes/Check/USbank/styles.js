export const styles = (theme) => ({
  checkInfoOuterContainer: {
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
  },
  textFieldItem: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(0),
      width: "100%",
    },
    "& .MuiFormLabel-root.Mui-error": {
      color: "#f44336 !important",
    },
    "& .MuiSelect-outlined.MuiSelect-outlined": {
      display: "flex",
    },
  },
  actionButtonCont: {
    display: "flex",
    width: "100%",
    justifyContent: "space-around",
    paddingTop: theme.spacing(3),

    [theme.breakpoints.down("xs")]: {
      marginRight: theme.spacing(0),
      width: "100%",
    },
    marginBottom: theme.spacing(6),
  },
  shareButton: {
    width: 140,
    cursor: "pointer !important",
  },
  buttonGridItems: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginRight: theme.spacing(0),
      width: "100%",
    },
  },
  checkInfoHeading: {
    fontSize: "1.5rem",
    color: theme.palette.text.dark,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.2rem",
    },
  },
  checkInfoOuterCont: {
    marginBottom: theme.spacing(8),
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: "100%",
    },
  },
  authModal: {
    maxWidth: "756px",
    margin: "0 auto",
  },
  backButton: {
    width: 140,
    cursor: "pointer",
    marginRight: theme.spacing(4),
  },
  checkInfoNote: {
    textAlign: "justify",
    fontSize: "14px",
    color: "#2B2D30",
    marginTop: theme.spacing(1),
    width: "80%",
  },
  checkHeadingContainer: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
  },
});
