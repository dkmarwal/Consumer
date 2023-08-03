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
    color: theme.palette.text.dark,
    fontSize: "1.375rem",
  },
  clearSelection: {
    fontSize: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: 0,
    color: theme.palette.secondary.main,
  },
  linkBtn: {
    color: theme.palette.secondary.main,
    fontSize: theme.spacing(2),
  },
  alternateShareButton: {
    background: "#CCCCCC",
    borderRadius: theme.spacing(0.75),
    color: theme.palette.common.white,
    width: 200,
    cursor: "pointer",
  },
  noteContent: {
    marginBottom: "16px",
  },
  noteText: {
    fontFamily: "Interstate",
    fontStyle: "italic",
    fontWeight: "normal",
    fontSize: "12px",
    lineHeight: "16px",
    color: "#9E9E9E",
  },
  buttonGridItems: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  actionButtonCont: {
    display: "flex",
    width: "100%",
    textAlign: "center",
    justifyContent: "space-around",
    paddingTop: theme.spacing(4),
    //marginTop: theme.spacing(1),
    marginBottom: theme.spacing(5),
  },
  backButton: {
    width: 140,
    cursor: "pointer",
    marginRight: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      width: 118,
      marginRight: theme.spacing(2),
    },
  },
  shareButton: {
    color: theme.palette.common.white,
    width: 140,
    [theme.breakpoints.down("xs")]: {
      width: 118,
    },
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.primary.main,
    },
  },
  disabledShareButton: {
    background: "#CCCCCC",
    color: "#FFFFFF !important",
    width: 140,
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.primary.main,
    },
  },
});
