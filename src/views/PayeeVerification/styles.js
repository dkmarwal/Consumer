const styles = (theme) => ({
  fixedHeaderGutter: {
    paddingTop: "56px",
  },
  welcomeCardBg: {
    background: theme.palette.background.main,
   
  },
  payeeVerificationForm :{
      minHeight:"calc(100vh - 112px)",
      
  },
  backdrop: { zIndex: theme.zIndex.drawer + 1, color: "#fff" },
});

export default styles;