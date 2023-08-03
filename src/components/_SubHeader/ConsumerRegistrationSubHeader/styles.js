export const styles = (theme) => ({
  subHeaderContainer: {
    //boxShadow:
    //  "0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)",
    //background: theme.palette.common.white,
    minHeight: 70,
    position: "relative",
    top: "2px",
    display: "flex",
    justifyContent: "center",
  },
  stepDetailText: {
    fontSize: theme.spacing(3),
    color: theme.palette.primary.main,
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.spacing(2),
    },
  },
  subHeaderItem: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(4),
    height: theme.spacing(9),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1, 2),
    },
  },
  amountTransfer: {
    fontSize: 34,
  },
});
