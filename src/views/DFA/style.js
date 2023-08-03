const styles = (theme) => ({
  container: {
    backgroundColor: theme.palette.background.main,
    padding: theme.spacing(2.5),
    position: "relative",
  },

  enrollWrapper: {
    [theme.breakpoints.down("xs")]: {
      width: "90%",
      margin: "16px auto",
    },
    [theme.breakpoints.down("sm")]: {
      width: "90%",
      margin: "16px auto",
    },

    width: "756px",
    padding: theme.spacing(2.5),
    borderRadius: "8px",
    margin: "20px auto",
    display: "flex",
    justifyContent: "center",
  },
  popupCloseBtn: {
    position: "absolute",
    cursor: "pointer",
    right: "20px",
    top: "20px",
  },

  keyIcon: {
    display: "block",
    margin: "30px auto 0",
  },
  BgContainerBlue: {
    backgroundColor: theme.palette.background.main,
    minHeight: "calc(100vh - 56px)",
    [theme.breakpoints.between("xs", "sm")]: {
      minHeight: "calc(100vh - 79px)",
    },
  },
});

export default styles;
