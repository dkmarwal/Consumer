const styles = (theme) => ({
  fixedHeaderGutter: {
    paddingTop: "56px",
  },
  container: {
    background: theme.palette.background.main,
  },
  containerBg: {
    background: theme.palette.background.main,
    minHeight:"calc(100vh - 56px)",
  },
  payeePaymentMethodSelection:{
      minHeight:"calc(100vh - 320px)",
  }
});

export default styles;