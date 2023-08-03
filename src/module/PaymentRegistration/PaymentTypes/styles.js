export const styles = (theme) => ({
  paymentItemOuterDiv: {
    padding: theme.spacing(1),

    [theme.breakpoints.down("xs")]: {
      margin: 0,
      padding: theme.spacing(2),
    },
  },
  parentHoverClass: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  ACH_Consumer: {
    width: 159.65,
    margin: "auto",
  },
  ACHInnerDiv: {
    width: 159.65,
    margin: "auto",
  },
  ACH: {
    margin: "auto",
    textAlign: "center",
    fontSize: 16,
    marginTop: theme.spacing(-2),
  },
  ZelleInnerDiv: {
    margin: "auto",
    position: "relative",
  },
  preferredPaymentIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    marginTop: "3px",
    marginRight: "3px",
  },

  paymentItemInnerDiv: {
    width: "100%",
  },
  lastPaymentType: {
    marginRight: theme.spacing(1.25),
  },

  paymentTimeText: {
    color: theme.palette.text.dark,
    fontSize: "12px",
    paddingLeft: theme.spacing(0.5),
  },
  paymentTimeTextDisabled: {
    color: theme.palette.text.disabledDark,
    fontSize: "12px",
    paddingLeft: theme.spacing(0.5),
  },
  hoverCheckBoxIcon: {
    display: "none",
  },
  paymentMethodImgCont: {
    height: "100%",
  },
  paymentMethodImg: {
    margin: "auto",
    maxWidth: "100%",
    height: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(0, 1),
    },
  },
  selectedPaymentMethodImg: {
    margin: "auto",
    maxWidth: "100%",
    height: 60,
  },
  selectedCheckboxIcon: {
    display: "flex",
    top: 2,
    position: "absolute",
    left: 2,
  },
  selectedPaymentItemOuterDiv: {
    border: `2px solid #008CE6`,
    boxShadow: "inset 0px 0px 20px -8px #77A4E5",
    borderRadius: "10px",
    background: theme.palette.common.white,
    height: 180,
    maxHeight: 220,
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      height: 140,
      maxHeight: 160,
    },
  },
  checkBtn: {
    color: theme.palette.secondary.main,
    fontSize: "14px",
  },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
  },
  dividerBorder: {
    borderBottom: "1px solid #ccc",
    width: "100%",
  },
  dividerContent: {
    padding: "0 10px 0 10px",
  },
  dividerOuterContainer: {
    display: "block",
  },
  preferredPaymentContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    marginTop: "-1px",
    marginRight: "-1px",
  },
  mostPreferredText: {
    color: "#9E9E9E",
    fontSize: "12px",
    //float: "right",
    marginTop: "-18px",
    textAlign: "right",
    fontStyle: "italic",
  },
  clickHereText: {
    color: "#CCCCCC",
  },
  checkMethodDisableText: {
    color: theme.palette.text.disabledDark,
    fontSize: "0.875rem",
    paddingTop: theme.spacing(0.5),
  },
  checkMethodActiveText: {
    color: theme.palette.text.dark,
    fontSize: "0.875rem",
    paddingTop: theme.spacing(0.5),
  },
  paymentMethodDesc: {
    fontSize: "1.5rem",
    textAlign:"center",
	//minHeight:"100px",
    color: theme.palette.text.dark,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
    },
	[theme.breakpoints.down("sm")]: {
     // minHeight: 0,
    },
    textTransform: "uppercase",
  },
  nonSelectedPaymentMethodsCont: {
    borderRadius: "0px 10px 10px 0px",
    height: "auto",
    [theme.breakpoints.between("xs", "md")]: {
      borderRadius: "10px",
    },
  },
  clearSelectionText: {
    color: "#008CE6",
    fontSize: "1rem",
    cursor: "pointer",
  },
  mobMarginLeft: {
    marginLeft: "-8px",
    [theme.breakpoints.down("xs")]: { marginLeft: 0, marginTop: 16 },
  },
  boxHeightFix: {
    height: 90,
    [theme.breakpoints.down("xs")]: {
      height: "100%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      height: 85,
    },
  },
});
