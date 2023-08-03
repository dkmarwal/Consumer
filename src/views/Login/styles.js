import bgImage from "~/assets/images/login-bg-final.png";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    background: `url(${bgImage}) no-repeat 0px 0px`,
    backgroundPosition: "right",
    minHeight: "calc(100vh - 112px)",
    backgroundSize: "contain",
    display: "flex",
    alignItems: "center",
    marginTop: "56px",
    position: "relative",
    "& .MuiTextField-root": {
      width: "100%",
    },

    [theme.breakpoints.only("xs")]: {
      minHeight: "calc(100vh - 130px)",
      background: "none",
    },
    [theme.breakpoints.only("sm")]: {
      minHeight: "calc(100vh - 135px)",
      background: "none",
    },
  },
  paper: {
    width: "100%",
    paddingTop: "0px",
    backgroundColor: "#fff",
    margin: theme.spacing(3, 0),
  },
  recoverUsernamePaper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    background: theme.palette.background.white,
    borderRadius: theme.spacing(1),
    alignItems: "center",
    flexDirection: "column",
    margin: theme.spacing(3, 0),
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
    },
  },
  paperReset: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  resetPasswordPaper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    background: theme.palette.background.white,
    borderRadius: theme.spacing(1),
    alignItems: "center",
    flexDirection: "column",
    margin: theme.spacing(3, 0),
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
    },
  },
  leftWrap: {
    background: `url(${bgImage}) no-repeat 0 0`,
    backgroundSize: "cover",
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  startupContainer: {
    background: "#fff",
  },
  startupHeading: {
    marginLeft: "2em",
    "& h3": {
      color: "#fff",
      marginTop: "2em",
      fontSize: "26px",
      lineHeight: "1.2",
      fontWeight: 500,
    },
    "& p": {
      color: "#fff",
      fontSize: "1.4em",
      marginTop: "1.1em",
      textAlign: "left",
      margin: "0 0 10px",
    },
  },
  updatePasswordModal: {
    position: "absolute",
    width: "40%",
    left: "30%",
    top: "20%",
    outline: "none",
    padding: "3.125rem 0rem",
    borderRadius: "0 !important",
    overflowY: "auto",
    maxHeight: "350px",
  },
  textField: {
    height: "1.75rem",
  },
  heading: {
    paddingTop: 0,
    color: theme.palette.text.main,
    fontSize: 26,
    fontWeight: 400,
  },
  welcomeText:{
    [theme.breakpoints.down("xs")]: {
     fontSize:'1rem'
    },
    textAlign: "center",
    wordBreak: "break-word"
  },
  clientLogo: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  logoImg: {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "20px",
    borderRight: "1px solid #ddd",
  },
  logoLabel: {
    display: "flex",
    justifyContent: "center",
    /*paddingLeft: "20px",*/
    alignItems: "flex-end",
    fontSize: 16,
    color: "rgba(0,0,0,0.74)",
    fontFamily: "'Roboto', Arial, Helvetica, sans-serif",
  },
  listItemsTooltip: {
    fontSize: "12px",
    lineHeight: "16px",
    color: "#4F4F4F",
    marginTop: theme.spacing(-2),
    marginBottom: theme.spacing(-1.5),
  },
  passExpSave: {
    padding: theme.spacing(1.25, 6),
  },
  passwordTextField: {
    fontSize: "14px",
  },
  selectDropDown: {
    "& .MuiMenu-list": {
      [theme.breakpoints.down("xs")]: {
        maxHeight: 200,
      },
      maxHeight: 350,
    },
  },
  imageAvatar: {
    width: "100%",
    maxWidth: "120px",
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      maxWidth: 140,
      height: "auto",
      maxHeight: 50,
    },
  },
  optionQuestionLenght: {
    "& .MuiSelect-select .MuiBox-root ": {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
  },
});

export default styles;
