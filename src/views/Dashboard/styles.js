const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#fff",
    "& .MuiTextField-root": {
      width: "100%",
    },
    height: "100vh",
  },
  heading: {
    paddingTop: 0,
    color: "#0c2074",
    fontWeight: 500,
    padding: "35px 80px",
    fontSize: "40px",
  },
  title: {
    height: "43px",
    width: "538px",
    color: "rgba(11,25,65,0.87)",
    fontSize: "34px",
    letterSpacing: 0,
    lineHeight: "36px",
  },
  h1: {
    fontWeight: 400,
    fontSize: 24,
    color: theme.palette.primary.main,
  },
  headingNew: {
    fontWeight: 500,
    fontSize: 24,
    color: "#002D43",
    width: "100%",
    margin: 0,
    padding: 23,
    lineHeight: "normal",
  },

  h2: {
    fontWeight: 400,
    fontSize: "22px",
  },
  textAttention: {
    fontWeight: 400,
    fontSize: 20,
    color: "#202020",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#002D72",
    marginRight: 5,
    display: "inline-block",
  },

  textNum: {
    fontWeight: 700,
    fontSize: 24,
    color: "rgba(0,0,0,0.87)",
  },
  subHeading: {
    fontWeight: 400,
    fontSize: "14px",
    color: "#4C4C4C",
    margin: "5px 0",
  },
  flagContainer: {
    fontWeight: 500,
    display: "flex",
    position: "relative",
    lineHeight: "42px",
    color: "#7F7F7F",
    cursor: "pointer",
    alignItems: "center",
  },
  tabContainer: {
    border: "1px solid #e6e6e6",
    borderRadius: "6px",
    padding: 2,
    width: 320,
    display: "flex",
    justifyContent: "space-between",
    boxSizing: "content-box",
  },
  tab: {
    padding: 5,
    borderRadius: 4,
    color: "#0B1941",
    fontSize: 16,
    width: "50%",
    textAlign: "center",
  },
  expansionBtn: {
    boxShadow: "0 1px 1px 0 rgba(0,0,0,0.14), 0 0 3px 0 rgba(0,0,0,0.2)",
    borderRadius: "110px",
    margin: "0 0px 11px 0",
    width: "28px",
    height: "28px",
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
  },
  arrowsColor: {
    width: 24,
    color: "#7F7F7F",
  },
  expansionCards: {
    position: "relative",
    paddingBottom: "200px",
    boxShadow:
      "0 6px 10px 0 rgba(0,0,0,0.07), 0 1px 18px 0 rgba(0,0,0,0.06), 0 3px 5px -1px rgba(0,0,0,0.1)",
  },
  bgBlur: {
    position: "absolute",
    bottom: 0,
    background: `linear-gradient(0deg, rgba(255,255,255,1) 55%, rgba(255,255,255,0.5298494397759104) 100%)`,
    height: "70px",
    width: "100%",
    zIndex: 3,
  },
  link: {
    color: theme.palette.secondary.main, //008CE6
    marginRight: "2px",
    textDecoration: "underline !important",
  },
  iconContainer: { width: 21 },
  icon: {
    height: "21px",
    width: "21px",
    backgroundColor: "#F6F6F6",
    borderRadius: "76px",
    padding: "3px",
    color: "#53565A",
    fontSize: 8,
    position: "relative",
    top: "7px",
    margin: "0 10px 0 0",
  },
  circleText: {
    height: "20px",
    width: "20px",
    backgroundColor: "#F6F6F6",
    borderRadius: "76px",
    color: theme.palette.primary.main, //0B1941
    margin: "3px 10px 0 0",
    display: "table",
    textAlign: "center",
    fontSize: 8,
    fontWeight: "bold",
    lineHeight: "20px",
  },
  text16: {
    fontSize: 16,
    margin: "8px 0",
  },
  percentage: {
    margin: "11px 0",
    display: "block",
    fontWeight: 500,
    color: "#282828",
    fontSize: "11px",
  },
  paymentText: {
    color: theme.palette.secondary.main, //008CE6
    textDecoration: "underline",
  },
  authModal: {
    maxWidth: "756px",
    margin: "0 auto",
  },
});

export default styles;
