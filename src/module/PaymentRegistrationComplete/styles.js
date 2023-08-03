export const styles = (theme) => ({
  paymentRegCont: {
    borderRadius: theme.spacing(1),
    background: theme.palette.common.white,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight:"calc(80vh - 56px)",
    margin: theme.spacing(4, 2, 2, 0),
  },
  paymentHeading: {
    width: "55%",
    margin: "auto",
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
    borderRadius: theme.spacing(100),
    cursor: "pointer",
  },
  thankYouText: {
    color: theme.palette.text.dark,
    fontSize: "2.125rem",
  },
  guestImage: {
    marginBottom: theme.spacing(3),
    maxHeight: "168px",
  },
  paymentDetails: {
    color: theme.palette.text.light,
    lineHeight: "32px",
    fontWeight: 400,
  },
  paymentRefId: {
    color: theme.palette.text.dark,
    fontWeight: 700,
    lineHeight: "32px",
  },
});
