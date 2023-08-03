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
  paymentMethodHeader: {
    color: theme.palette.text.dark,
    fontSize: "1.5rem",
    [theme.breakpoints.down("xs")]: {
      "& h1": {
        fontSize: "1.375rem",
      },
    },
  },
  paymentItemOuterDiv: {
    border: "1px solid #9E9E9E",
    borderRadius: 4,
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
    marginTop: theme.spacing(-2),
  },
  actionButtonCont: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    paddingTop: theme.spacing(3),
  },
  backButton: {
    width: 140,
    borderRadius: "3rem",
  },
  buttonGridItems: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      paddingBottom: theme.spacing(2),
    },
  },
  alertMessageOuterCont: {
    marginBottom: theme.spacing(4),
    maxWidth: 525,
  },
  dataSecure: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    textAlign: "center",
  },

  dataSecureImg: {
    width: "25px",
    margin: "auto",
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
});
