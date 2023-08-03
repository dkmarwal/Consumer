const styles = (theme) => ({
  mainContainer: {
    minHeight: "calc(100vh - 56px)",
    [theme.breakpoints.down("xs")]: {
      minHeight: "calc(100vh - 111px)",
    },
  },
  container: {
    marginTop: "56px",
  },
  subHeaderClass: {
    position: "relative",
    top: "-10px",
    left: "12px",
    fontSize: "22px",
  },
});
export default styles;
