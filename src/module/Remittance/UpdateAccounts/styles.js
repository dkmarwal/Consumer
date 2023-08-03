export const styles = (theme) => ({
  remittanceContainer: {
    width: "100%",
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      textAlign: "left",
    },
  },
  remittanceFormatText: {
    fontSize: "12px",
    color: theme.palette.common.main,
    paddingLeft: theme.spacing(3.75),
    display: "flex",
  },
  remittanceCheckbox: {
    [theme.breakpoints.down("xs")]: {
      "& .MuiIconButton-root": {
        padding: "0 8px 0px 8px !important",
      },
      marginRight: 0,
    },
    "& .MuiFormControlLabel-label": {
      fontSize: "14px",
      color: theme.palette.common.black,
      display: "flex",
      alignItems: "center",
    },
    display: "flex",
    marginRight: '0',
  },
  remittanceOptions: {
    fontSize: "14px",
    color: theme.palette.common.dark,
  },
  emailTextField: {
    margin: theme.spacing(1, 0),
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  remittanceOptionsContainer: {
    flexDirection: "row",
    marginLeft: theme.spacing(3.75),
  },
});
