const styles = (theme) => ({
  headerContainer: {
    display: "flex",
    padding: "0 1.2rem",
    height: "3.5rem",
    position: "fixed",
    top: "0px",
    width: "100%",
    alignItems: "center",
    zIndex: 999,
    boxSizing: "border-box",
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
    height: "97px",
    width: "98px",
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
    justifyContent: "center",
  },
  headerSmText: {
    alignItems: "center",
    display: "flex",
    color: "rgba(0,0,0,0.74)",
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
    flexGrow: 1,
    justifyContent: "flex-end",
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
      padding: " 0 10px 0 8px",
      fontSize: 13,
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
    maxWidth: "160px",
    height: "auto",
    maxHeight: "60px",
    background: "#f6f6f6",
  },
});

export default styles;
