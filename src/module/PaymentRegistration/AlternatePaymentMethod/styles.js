export const styles = (theme) => ({
  paymentRegCont: {
    borderRadius: ` ${theme.spacing(0.15)}rem`,
    background: theme.palette.common.white,
    margin: theme.spacing(4, 0),
    padding: "1rem 3.625rem",
    width: "auto",
    [theme.breakpoints.between("xs", "sm")]: {
      margin: theme.spacing(2, 0),
      padding: theme.spacing(2),
    },
  },
  alternatePMContent: {
    borderRadius: theme.spacing(1),
    background: theme.palette.common.white,
    width: "auto",
    paddingBottom: theme.spacing(3),
    minHeight: 264,
  },
  paymentMethodHeader: {
    color: theme.palette.text.dark,
    fontSize: "1.5rem",
    [theme.breakpoints.down("xs")]: {
      "& h1": {
        fontSize: "1.375rem",
      },
    },
  },
  clearSelection: {
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
  linkBtn: {
    color: "#2D9CDB",
    fontSize: theme.spacing(2),
    '&.MuiButton-root:hover':{
      background:'transparent'
    }

  },
  alternateShareButton: {
    width: 180,
    cursor: "pointer",
  },
  alternateSubHeading: {
    fontSize: "1rem",
    color: theme.palette.common.black,
    paddingTop: theme.spacing(2),
  },
  dataSecure: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      marginRight: "-54px",
    },

    [theme.breakpoints.up("lg")]: {
      marginRight: "-75px",
    }
  },

  dataSecureImg: {
    width: "25px",
    margin: "0 auto",
    [theme.breakpoints.down("xs")]: {
      margin: "auto",
      width: "17px",
    },
  },

  dataSecureText: {
    fontSize: "12px",
    color: "#8F9EC3",
    marginTop: "5px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 9,
      textAlign: "center",
      display: "inline-block",
      wordWrap: "break-word",
    },
  },
  actionBtn:{
      marginTop: "16px"
  }
});
