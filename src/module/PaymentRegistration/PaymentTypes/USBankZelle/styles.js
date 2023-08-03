export const styles = (theme) => ({
  container: {
    padding: "30px 0 30px 0",
    backgroundColor: "#fff",
    "& h1": {
      fontSize: "16px",
      color: "#000",
      padding: "0 0 30px 0",
    },
  },
  zelleForm: {
    float: "left",
    width: "100%",
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(0),
    "& .MuiTextField-root": {
      width: "96%",
      margin: "0 4% 0 0",
      "& .MuiInputLabel-shrink": {
        backgroundColor: "#fff",
      },
    },
    "& .MuiFormControl-root": {
      width: "96%",
      margin: "0 4% 0 0",
      "& .MuiInputLabel-shrink": {
        backgroundColor: "#fff",
      },
    },
    "& .countyCode": {
      width: "100px",
    },
    "& .MuiGrid-item": {
      width: "auto",
      display: "inline-block",
    },
    "& .phoneNumber": {
      width: "300px",
      margin: "0",
      "& input": {
        padding: "19.5px",
      },
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.38) !important",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.38) !important",
    },
  },
  BtnContainer: {
    textAlign: "center",
    display: "block",
    width: "100%",
    margin: "24px 0 0",
    "& button": {
      margin: "0 10px",
      padding: "6px 35px",
      cursor: "pointer",
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
  zelleHeading: {
    fontSize: "1.5rem",
    marginRight: theme.spacing(2),
    color: theme.palette.text.dark,
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.2rem",
    },
  },
  shareButton: {
    width: 140,
    cursor: "pointer !important",
  },
  headingCont: {
    display: "flex",
    alignItems: "flex-start",
    marginTop: theme.spacing(2),
  },
  note: {
    fontSize: "14px",
    fontStyle: "italic",
    "& span": {
    fontWeight: "bold"
    }
  }
});
