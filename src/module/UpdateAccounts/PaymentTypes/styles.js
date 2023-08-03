export const styles = (theme) => ({
  paymentItemOuterDiv: {
    padding: theme.spacing(1),

    [theme.breakpoints.down("xs")]: {
      margin: 0,
      padding: theme.spacing(0),
    },
  },
  parentHoverClass: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  selectedPaymentMethodImg: {
    margin: "auto",
    maxWidth: "100%",
    height: 60,
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
  paymentTypesCont: {
    minHeight: 168,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paymentItemInnerDiv: {
    // position: "relative",
    width: "100%",
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
    borderBottom: "1px dashed #ccc",
    width: "100%",
  },
  dividerContent: {
    padding: "0 10px 0 10px",
  },
  paymentMethodDesc: {
    fontSize: "1.5rem",
	textAlign:"center",
    color: theme.palette.primary.dark,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
    },
    textTransform: "uppercase",
  },
  paymentMethodHeadingItem: {
    textAlign: "center",
  },
  paymentMethodHeading: {
    fontSize: "1rem",
    color: theme.palette.text.dark,
  },
  mobMarginLeft: {
    marginLeft: "-8px",
    [theme.breakpoints.down("xs")]: { marginLeft: 0, marginTop: 24 },
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
  nonSelectedPaymentMethodsCont: {
    borderRadius: "0px 10px 10px 0px",
    height: "auto",
    [theme.breakpoints.down("xs")]: {
      borderRadius: "10px !important",
      height: "64px !important",
    },
  },
});
