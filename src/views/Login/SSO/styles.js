const styles = (theme) => ({
    payeePaymentMethodSelection:{
        minHeight:"calc(100vh - 112px)"
    },
    paymentRegCont: {
        borderRadius: ` ${theme.spacing(0.15)}rem`,
        background: theme.palette.common.white,
        margin: theme.spacing(4, 0),
        padding: "2rem 3.625rem 5rem",
        width: "auto",
        justifyContent:'center',
        textAlign:'center',
        [theme.breakpoints.between("xs", "sm")]: {
          margin: theme.spacing(2, 0),
          padding: theme.spacing(2),
        },
      },
      thankYouText:{
          color:theme.palette.text.light,
          fontSize:'1rem'
      }
})

export default styles;
