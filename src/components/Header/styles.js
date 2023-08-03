const styles = (theme) => ({
  headerContainer: {
    display: "flex",
    height: "56px",
    position: "fixed",
    top: '0',
    width: "100vw",
    alignItems: "center",
    zIndex: 999,
    boxSizing: "border-box",
    boxShadow:
      "0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12), 0px 1px 5px rgba(0, 0, 0, 0.2);",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  userIconBg: {
    background: "#bdbdbd",
    borderRadius: "100%",
    color: "#fff",
    width: 35,
    height: 35,
    padding: "3px !important",
    display: "inline-block",
    textAlign: "center",
    transition: "fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    boxSizing: "border-box",
  },
  large: {
    height: 48,
    width: 48,
  },
  profileHeading: {
    color: "#0B1941",
    fontSize: "20px",
    textTransform: "capitalize",
  },
  profileEmail: {
    color: "rgba(0,0,0,0.6)",
    fontSize: "11px",
  },
  profileManage: {
    color: "#008CE6",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  toggleContainer: {
    width: "4.375rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  headerSmText: {
    alignItems: "center",
    display: "flex",
    fontSize: "16px",
    /*paddingLeft: "1.75rem",*/
    color: "#4C4C4C",
    fontFamily: `'Roboto', sans-serif`,
    fontWeight: 600,
  },
  citiLogo: {
    display: "flex",
  },
  incedoPayLogo: {
    display: "flex",
    borderLeft: "3px solid #979797",
  },
  rightNavContainer: {
    display: "flex",
    // flexGrow: 1,
    alignItems: "center",
  },
  rightNavIconContainer: {},
  rightNavDropdownContainer: {
    padding: "0",
  },
  headerMenuList: {
    display: "block",
    "& a": {
      lineHeight: "1.42857",
      padding: "0 10px  0 15px ",
      textDecoration: "none",
      cursor: "pointer",
    },
    "& svg": {
      verticalAlign: "middle",
    },
    "& span": {
      verticalAlign: "middle",
      padding: " 0 0 0 8px",
    },
  },
  headerMenu: {
    top: "40px !important",
  },
  alignBottom: {
    verticalAlign: "bottom",
  },
  headerDivider: {
    borderLeft: `1px solid ${theme.palette.border.main}`,
  },
  imageAvatar: {
    maxWidth: "120px",
    height: "auto",
    maxHeight: "40px",
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      objectFit: "contain",
      maxWidth: "90px",
      maxHeight: "40px",
    },
  },
  clientLogo: {
    maxWidth: "120px",
    maxHeight: "40px",
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      objectFit: "contain",
      maxWidth: "90px",
      maxHeight: "40px",
    },
  },
  nowrap: {
    flexWrap: "nowrap",
    alignItems: "center",
  },

  badgeIcon: {
    "& .MuiBadge-anchorOriginTopRightRectangle": {
      top: "5px",
      right: "5px",
    },
  },
});

export default styles;
