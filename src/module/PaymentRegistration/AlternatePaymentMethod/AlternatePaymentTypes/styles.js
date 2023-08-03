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
  paymentItemInnerDiv: {
    width: "100%",
  },
  paymentTypesCont: {
    justifyContent: "center",
  },
  paymentItemOuterCont: {
    height: 126,
    width: "auto",
    marginRight: theme.spacing(2.5),
    marginTop: theme.spacing(3.5),
    display: "flex",
  },
  selectedCheckboxIcon: {
    display: "flex",
    position: "absolute",
  },
  hoverCheckBoxIcon: {
    display: "none",
  },
  paymentMethodImgCont: {
    height: "100%",
  },
  selectedPaymentMethodImg: {
    margin: "auto",
    maxWidth: "100%",
    height: 60,
  },
  paymentMethodDesc: {
    fontSize: "1.5rem",
    textAlign: "center",
    color: theme.palette.primary.dark,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
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
  paymentMethodImg: {
    margin: "auto",
    maxWidth: "100%",
    padding: theme.spacing(0, 0, 0, 1),
    height: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(0, 1),
    },
  },
  dividerLine: {
    height: "100%",
    display: "inline-block",
    border: "1px dashed #CCCCCC",
  },
  actionButtonCont: {
    display: "flex",
    width: "100%",
    justifyContent: "space-around",
    paddingTop: theme.spacing(4),
  },
  buttonGridItems: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  preferText: {
    fontSize: theme.spacing(2),
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
