const styles = (theme) => ({
    root: {
      height: "100%",
      background: theme.palette.background.main,
      paddingBottom: "60px",
    },
    optionQuestionLenght: {
      "& .MuiSelect-select .MuiBox-root ": {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
      },
    },
    selectDropDown: {
      "& .MuiMenu-list": {
        [theme.breakpoints.down("xs")]: {
          maxHeight: 200,
        },
        maxHeight: 350,
      },
    },
    guestLink: {
      cursor: "pointer",
      color: theme.palette.text.heading,
      fontSize: "1rem",
    },
    leftDivider: {
      marginRight: theme.spacing(2),
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
    primaryTextColor: {
      color: theme.palette.text.main,
    },
    textFieldInfo: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
    },
    infoIcon: {
      display: "flex",
      justifyContent: "flex-end",
    },
    listItemsTooltip: {
      fontSize: "12px",
      lineHeight: "16px",
      color: "#4F4F4F",
      marginTop: theme.spacing(-2),
      marginBottom: theme.spacing(-1.5),
    },
    tooltipBase: {
      background: theme.palette.common.white,
    },
    backdrop: { zIndex: theme.zIndex.drawer + 1, color: "#fff" },
    mobHeight: {
      [theme.breakpoints.down("xs")]: {
        maxHeight: "240px",
      },
    },
    mobAlignment: {
      display: "flex",
      [theme.breakpoints.down("xs")]: {
        display: "grid",
        width: "100%",
      },
    },
    guestUserBtn: {
      margin: "16px 0px",
      [theme.breakpoints.down("sm")]: {
        marginTop: 16,
        marginBottom: 0,
      },
    },
    toolTipMobAdjustment: {
      [theme.breakpoints.down("sm")]: {
        marginLeft: "-8px",
      },
    },
    getStartedButton: {
      minWidth: '9.75rem',
    },
  });
  
  export default styles;
  