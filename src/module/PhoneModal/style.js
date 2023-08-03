const styles = (theme) => ({
  fullHeight: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  DFAContainer: {
    textAlign: "center",
    background: theme.palette.common.white,
    width: "auto",
    alignItems: "center",
    maxWidth: 960,
    borderRadius: theme.spacing(1.2),
    [theme.breakpoints.down("xs")]: {
      margin: 16,
    },
    [theme.breakpoints.between("sm", "md")]: {
      margin: 16,
      maxWidth: 600,
    },
    margin: "0 auto",
    "& h1": {
      display: "block",
      clear: "both",
      width: "100%",
      // padding: "0 0 20px",
      color: theme.palette.text.dark,
      fontSize: "22px",
    },
    "& h3": {
      display: "block",
      clear: "both",
      width: "100%",
      padding: "20px 0 5px 15%",
      color: theme.palette.text.light,
      fontSize: "16px",
      textAlign: "left",
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(1, 2.5),
      },
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(2.5),
        textAlign: "center",
      },
    },
    "& h6": {
      display: "block",
      clear: "both",
      width: "100%",
      padding: "10px 0 25px 15%",
      color: "#4C4C4C",
      fontSize: "12px",
      fontStyle: "italic",
      boxSizing: "border-box",
      textAlign: "left",
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(1, 2),
      },
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(1, 2),
        textAlign: "center",
      },
    },
  },

  discTxt: {
    display: "block",
    clear: "both",
    width: "100%",
    padding: "0 0 25px",
    color: "#4C4C4C",
    fontSize: "16px",
  },

  phoneBox: {
    float: "left",
    width: "100%",
    textAlign: "center",
    "& .MuiFormControl-root": {
      width: "70%",
      margin: "0 auto",
    },
    "& .countyCode": {
      width: "100px",
      margin: "0 0 0 100px",
      float: "left",
    },
    "& .phoneNumber": {
      width: "400px",
      float: "left",
      margin: "0 0 0 60px",
    },
  },

  verificationBox: {
    float: "left",
    width: "100%",
    textAlign: "center",
    "& .MuiFormControl-root": {
      width: "33%",
      margin: "0 0 0 15%",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "0 5%",
      },
      [theme.breakpoints.up("sm")]: {
        width: "50%",
        margin: "0 auto",
      },
    },
  },

  btnContainer: {
    textAlign: "left",
  },

  skipBtn: {
    color: "#008CE6",
    fontSize: "14px",
    padding: "0",
    margin: "5px 0 0 30%",
    fontWeight: "400",
    "&:hover": {
      background: "none",
    },
    "& .MuiTouchRipple-root": {
      display: "none !important",
    },
  },

  btn: {
    fontWeight: "400",
    border: "none !important",
    "& svg": {
      fontSize: "18px",
      margin: "0 5px",
    },
    color: theme.palette.text.dark,
    borderRadius: 6,
  },

  btnSelected: {
    color: theme.palette.text.dark,
    border: "none !important",
    "& svg": {
      fontSize: "18px",
      margin: "0 5px",
    },
    background: "#F2F2F2",
    "&:hover": {
      background: "#F2F2F2 !important",
    },
    borderRadius: 6,
  },
  verifyBtnContainer: {
    margin: "25px 90px",
    [theme.breakpoints.down("xs")]: {
      margin: "0 auto",
      width: "90%",
      justifyContent: "center",
      alignItems: 'center'
    },
    [theme.breakpoints.up("sm")]: {
      margin: "0 auto",
      width: "90%",
      justifyContent: "center",
      alignItems: 'center'
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

  otherNumberBtn: {
    display: "block",
    boxSizing: "border-box",
    padding: "20px 0 0 15%",
    textDecoration: "underline",
    textAlign: "left",
    color: "#008CE6",
    fontSize: "14px",
    cursor: "pointer",
  },

  continueBtn: {
    margin: "2rem 1rem",
    padding: "5px 24px",
    minWidth: "158px",
    // border: "1px solid #2B2D30",
    [theme.breakpoints.down("xs")]: {
      width: "auto",

      margin: theme.spacing(2),
    },
    [theme.breakpoints.only("sm")]: {
      padding: "5px 20px",
      margin: theme.spacing(2),
      // margin: "20px auto",
    },
  },
  smsButton: {
    borderRadius: "6px",
    background: "#F2F2F2",
    "&:hover": {
      background: "#F2F2F2",
    },
  },
  continueOTPBtn: {
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: "14px",
    padding: 8,
    minWidth: 140,
    boxShadow: "none",
  },
  heading: {
    paddingTop: 0,
    color: "#0B1941",
    fontSize: 26,
    fontWeight: 400,
  },
  ResetPasswordDFAContainer: {
    textAlign: "center",
    float: "left",
    background: theme.palette.common.white,
    width: "auto",
    alignItems: "center",
    borderRadius: theme.spacing(1),
    "& h1": {
      display: "block",
      clear: "both",
      width: "100%",
      padding: "0 0 20px",
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
      textAlign: "left",
    },
    "& h6": {
      display: "block",
      clear: "both",
      width: "100%",
      padding: "10px 0 25px 15%",
      color: "#4C4C4C",
      fontSize: "12px",
      fontStyle: "italic",
      boxSizing: "border-box",
      textAlign: "left",
    },
  },
  ResetVerificationBox: {
    float: "left",
    width: "100%",
    textAlign: "center",
  },
  resetCallBtn: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "400",
    "& svg": {
      fontSize: "18px",
      margin: "0 5px 0 5px",
    },
  },
  resetCallBtnUnselected: {
    color: "#0B1941",
    fontSize: "14px",
    fontWeight: "400",
    "& svg": {
      fontSize: "18px",
      margin: "0 5px 0 5px",
    },
  },
  resetMsgBtn: {
    color: "#fff",
    fontSize: "14px",
    margin: "0 15px 0 10px",
    fontWeight: "400",
    "& svg": {
      fontSize: "18px",
      margin: "0 5px 0 5px",
    },
  },
  resetMsgBtnUnselected: {
    color: "#0B1941",
    fontSize: "14px",
    margin: "0 15px 0 10px",
    fontWeight: "400",
    "& svg": {
      fontSize: "18px",
      margin: "0 5px 0 5px",
    },
  },
  resetPasswordProgressBar: {
    position: "absolute",
    display: "inline-flex",
    "& .MuiCircularProgress-colorPrimary": {
      color: "#ED8853",
    },
    "& .MuiTypography-caption": {
      color: "#ED8853",
      fontSize: "15px",
    },
  },
  verifyDFAText: {
    color: theme.palette.primary.main,
  },
  dfaIcon: {
    paddingRight: theme.spacing(1),
  },
  resendBtn: {
    color: "#008CE6",
    marginLeft: "10px",
  },
  whilebg: {
    background: "#fff",
    display: "flex",
    maxWidth: 768,
    minWidth: 300,
    justifyContent: "center",
    borderRadius: 10,
    [theme.breakpoints.between("xs", "sm")]: {
      width: "90%",
      textAlign: "center",
      padding: 16,
    },
  },
});

export default styles;
