export const styles = (theme) => ({
  paymentRegCont: {
    borderRadius: theme.spacing(1),
    background: theme.palette.common.white,

    margin: "auto",
    marginTop: "24px !important",
    padding: "20px 10px",
    [theme.breakpoints.between("xs", "sm")]: {
      width: "90%",
      minHeight: "auto",
      margin: "auto",
    },
    minHeight: 264,
  },
  verifyBtnContainer: {
    margin: "25px 90px",
    [theme.breakpoints.down("xs")]: {
      margin: "0 auto",
      width: "100%",
      justifyContent: "center",
    },
    [theme.breakpoints.up("sm")]: {
      margin: "0 auto",
      width: "90%",
      justifyContent: "center",
    },
  },
  btn: {
    fontSize: "16px",
    margin: "0 15px 0 0",
    padding: "6px 20px",
    fontWeight: "400",
    border: "none !important",
    "& svg": {
      fontSize: "18px",
      margin: "0 5px",
    },
    color: theme.palette.text.dark,
    borderRadius: "6px",
  },

  btnSelected: {
    color: theme.palette.text.dark,
    fontSize: "16px",
    margin: "0 15px 0 0",
    padding: "6px 20px",
    fontWeight: "400",
    border: "1px solid #F2F2F2",
    "& svg": {
      fontSize: "18px",
      margin: "0 5px",
    },
    background: "#F2F2F2",
    "&:hover": {
      background: "#F2F2F2 !important",
    },
    borderRadius: "6px",
  },
  resendBtn: {
    color: "#008CE6",
  },
  paymentHeading: {
    margin: "auto",
    padding: 8,
    [theme.breakpoints.down("xs")]: {
      padding: 8,
    },
  },
  paymentTextDesc: {
    color: "#4C4C4C",
  },
  paymentMethodHeader: {
    color: theme.palette.common.black,
    fontSize: theme.spacing(2),
  },
  ctnBtn: {
    color: "#008CE6",
    cursor: "pointer",
  },
  shareButton: {
    width: "158px",
    cursor: "pointer",
  },
  continueBtn: {
    padding: "5px 24px",
    [theme.breakpoints.down("xs")]: {
      width: "auto",
    },
    [theme.breakpoints.only("sm")]: {
      padding: "5px 20px",
    },
  },
  rootContainer: {
    textAlign: "center",
    width: "100%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    "& h1": {
      display: "block",
      clear: "both",
      width: "100%",
      color: theme.palette.text.dark,
      fontSize: "22px",
    },
    "& h3": {
      display: "block",
      clear: "both",
      width: "100%",
      padding: "20px 0 5px 15%",
      color: "#4C4C4C",
      fontSize: "16px",
      textAlign: "center",
    },
    "& h6": {
      display: "block",
      clear: "both",
      width: "100%",
      color: "#4C4C4C",
      fontSize: "12px",
      fontStyle: "italic",
      boxSizing: "border-box",
      textAlign: "center",
    },
  },
  nonCDMContainer: {
    textAlign: "center",
    width: "100%",
    "& h1": {
      display: "block",
      clear: "both",
      width: "100%",
      color: "#0B1941",
      fontSize: "22px",
    },
    "& h3": {
      display: "block",
      clear: "both",
      width: "100%",
      padding: "20px 0 5px 15%",
      color: "#4C4C4C",
      fontSize: "16px",
      textAlign: "center",
    },
    "& h6": {
      display: "block",
      clear: "both",
      width: "100%",
      color: "#4C4C4C",
      fontSize: "12px",
      fontStyle: "italic",
      boxSizing: "border-box",
      textAlign: "center",
    },
  },
  progressBar: {
    position: "relative",
    display: "inline-flex",
    margin: "5px",
    "& .MuiCircularProgress-colorPrimary": {
      color: "#ED8853",
    },
    "& .MuiTypography-caption": {
      color: "#ED8853",
      fontSize: "15px",
    },
  },
  errorBox: {
    fontSize: "12px",
    color: "#E02020",
  },
  codeBox: {
    color: theme.palette.text.light,
  },
  paymentCheckbox: {
    fontSize: "16px",
    color: theme.palette.text.dark,
  },
  backdrop: { zIndex: theme.zIndex.drawer + 1, color: "#fff" },
  closeButton: {
    position: "absolute",
    top: "12px",
    right: 0,
  },
});
