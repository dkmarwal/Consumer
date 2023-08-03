const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    margin: "32px 48px",
    padding: "18px",
    textAlign: "left",
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  heading: {
    fontSize: "1.5rem",
    color: theme.palette.text.dark,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.2rem",
    },
  },
  addressHeading: {
    fontSize: "18px",
    color: theme.palette.common.dark,
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  inputLabel: {
    margin: ".5rem 0",
    color: "#76777b",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "25px",
    display: "block",
    marginBottom: 0,
  },
  fieldset: {
    width: "100%",
    "& .MuiFormLabel-root.Mui-error": {
      color: "#f44336 !important",
    },
  },
  gridContainers: {
    margin: "15px 0",
    padding: "0px 10px",
  },
  gridPadding: {
    padding: "20px 0 40px",
  },
  legend: {
    width: "auto",
    padding: "5px",
    fontSize: "16px",
    lineHeight: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  gridMArgin: {
    marginBottom: "20px",
  },
  gridItem: {
    padding: "16px 0",
  },
  panelHeading: {
    padding: "5px 0px",
    marginTop: "10px",
    fontSize: "12px",
    fontWeight: 400,
  },
  pageHeader: {
    borderBottom: "0px",
    padding: "0px 0px 15px 0px",
    letterSpacing: "1px",
    fontSize: "24px",
    color: "#243d7d",
  },
  mandatory: {
    color: "#ff0000",
  },
  importText: {
    margin: "40px 0px 5px 0px",
  },
  shareButton: {
    width: 140,
    cursor: "pointer !important",
  },
  authModal: {
    maxWidth: "756px",
    margin: "0 auto",
    [theme.breakpoints.down("xs")]: {
      width: "90%",
      margin: "0 auto",
    },
  },
  headingCont: {
    display: "flex",
    alignItems: "flex-start",
    marginTop: theme.spacing(2),
  },
});

export default styles;
