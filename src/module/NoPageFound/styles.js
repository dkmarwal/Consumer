import NoPageBg from "~/assets/icons/page404.svg";

export const styles = (theme) => ({
  paymentRegCont: {
    borderRadius: theme.spacing(1),
    background: theme.palette.common.white,
    marginTop: theme.spacing(4),
    marginLeft: '30px',
    marginRight: '30px',
    width: 'auto',
    marginBottom: '30px',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    height: "calc(100vh - 118px)",
    [theme.breakpoints.down("xs")]: {
      padding: "10px 0px",
      height: "auto",
  },
  },
  paymentHeading: {
    width: "100%",
    margin: "auto",
    fontSize: '1.5rem',
    [theme.breakpoints.down("xs")]: {
      fontSize: '1rem',
  },
  },
  paymentMethodHeader: {
    color: theme.palette.common.black,
    fontSize: theme.spacing(2),
  },
  ctnBtn: {
    color: "#008CE6",
    cursor: "pointer"
  },
  root: {
    paddingTop: "56px",
  },
  NoPageBg: {
    background: `url(${NoPageBg}) no-repeat 0px 0px`,
    width:'100%',
    height: '100%',
    backgroundSize: "contain",
    backgroundPosition: "center",
    margin: '30px auto',
    [theme.breakpoints.down("md")]: {
      margin: '10px auto',
  },
  [theme.breakpoints.down("xs")]: {
    minHeight: 200,
},
  },
  pageNotFoundTxt: {
    fontSize: '1rem',
    [theme.breakpoints.down("md")]: {
      padding: "0px 30px",
  },
    [theme.breakpoints.down("xs")]: {
        fontSize: '12px',
    },
  }
});
