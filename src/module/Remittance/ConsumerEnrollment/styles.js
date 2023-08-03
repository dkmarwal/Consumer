export const styles = (theme) => ({
  remittanceContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  remittanceFormatText: {
    fontSize: "12px",
    color: theme.palette.common.main,
    paddingLeft: theme.spacing(3.75),
  },
  remittanceCheckbox: {    
    [theme.breakpoints.down("xs")]: { width: "auto" },
    verticalAlign: "baseline",
    "& .MuiIconButton-root": {
      padding: "0 8px 0px 8px !important",
    },
    "& .MuiFormControlLabel-label": {
      fontSize: "14px",
      color: theme.palette.common.black,
      display: "flex",
      alignItems: "center",
    },
    marginRight:'0',
  },
  remittanceOptions: {
    fontSize: "14px",
    color: theme.palette.common.dark,
  },
  emailTextField: {
    paddingTop: theme.spacing(2),
    width: "100%",
    "& .MuiTextField-root": {
      display: "flex",      
    },
  },
  remittanceOptionsContainer: {
    flexDirection: "row",
    marginLeft: theme.spacing(3.75),
  },
});
