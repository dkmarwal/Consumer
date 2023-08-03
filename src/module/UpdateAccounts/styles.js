export const styles = (theme) => ({
  paymentRegCont: {
    boxShadow:
      "0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12), 0px 3px 5px -1px rgba(0, 0, 0, 0.2)",
    borderRadius: theme.spacing(1),
    background: theme.palette.common.white,
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    width: "auto",
    marginBottom: theme.spacing(12.5),
    paddingLeft: theme.spacing(1.75),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    minHeight: 264,
  },
  paymentMethodHeader: {
    color: theme.palette.common.black,
    fontSize: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  paymentItemOuterDiv: {
    width: 193,
    border: "1px solid #9E9E9E",
    borderRadius: 4,
    height: 110,
    display: "flex",
  },
  ACH_Consumer: {
    width: 159.65,
    margin: "auto",
  },
  paymentItemInnerDiv: {
    width: 159.65,
    margin: "auto",
  },
  ACH: {
    margin: "auto",
    textAlign: "center",
    fontSize: 16,
  },
  actionButtonCont: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(5),
  },
  backButton: {
    width: 140,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  shareButton: {
    width: 140,
    cursor: "auto",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  buttonGridItems: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  alertMessageOuterCont: {
    marginBottom: theme.spacing(4),
    maxWidth: 525,
  },
  paymentPopup: {
    "& .centerDialog": {
      height: "auto",
      maxHeight: "inherit",
      overflow: "hidden",
      minHeight: "auto",
      borderRadius: "8px 8px 0 0",
      bottom: "inherit",
    },
    "& .alert-dialog-message": {
      maxHeight: "400px",
      overflow: "auto",
      height: "auto",
    },
    "& .heading": {
      fontSize: "1.375rem",
      boxShadow: "none",
      marginBottom: "0",
      color: theme.palette.text.dark,
      fontWeight: 400,
      [theme.breakpoints.down("xs")]: {
        padding: 16,
      },
      "& span": {
        fontSize: "1.375rem",
        lineHeight: "20px",
        [theme.breakpoints.down("sm")]: { textAlign: "left", lineHeight: "28px" },
      },
    },
    "& .dialogConten": {
      padding: "0",
    },
    "& .dataSecure": {
      [theme.breakpoints.only("xs")]: {
          marginRight: "-15px",
        },
    },
    "& .MuiDialogContent-root": {
      padding: "0px 24px 0",
    },
  },
  dividerOuterContainer: {
    display: "block",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(2, 0),
    },
    "& .MuiDivider-root": {
      borderBottom: `1px dashed ${theme.palette.text.disabledDark}`,
    },
  },
  backdrop: { zIndex: theme.zIndex.drawer + 1, color: "#fff" },
});
