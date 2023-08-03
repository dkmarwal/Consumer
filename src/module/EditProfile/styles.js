export const styles = (theme) => ({
  profileTabContainer: {
    width: "100%",
    alignItems: "center",
    borderRadius: theme.spacing(1),
    background: theme.palette.common.white,
    padding: theme.spacing(3, 0),
    boxSizing: "border-box",
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
    },
  },
  optionQuestionLenght: {
    "& .MuiSelect-select .MuiBox-root ": {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
  },
  mobHeight: {
    [theme.breakpoints.down("xs")]: {
      maxHeight: "240px",
    },
  },

  marginClass: {
    margin: '2px 0px',
  },

  headingIconContainer: {
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },

  profileDetailHeading: {
    paddingBottom: theme.spacing(1),
    color: "#2B2D30",
    fontSize: "16px",
  },

  profileTextFieldItem: {
    padding: theme.spacing(2, 0),
  },

  profileTextFieldItemPass: {
    padding: theme.spacing(2, 0),
    display: "flex",
    justifyContent: "space-between",
  },

  profileTextFieldNewPassContainer: {
    display: "flex",
    justifyContent: "space-between",
  },

  changePassContainer: {
    paddingTop: "15px",
  },

  changePass: {
    color: theme.palette.text.heading,
  },

  userNameContainer: {
    display: "flex",
    justifyContent: "space-between",
  },

  profileTextFieldItemNewPass: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  deleteProfileText: {
    color: "#4C4C4C",
    paddingLeft: theme.spacing(1),
  },

  lightTooltip: {
    marginTop: "30px",
    marginLeft: "6px",
  },

  cancelButton: {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    fontSize: "16px",
    padding: theme.spacing(1, 5),
    marginBottom: theme.spacing(1),
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
  },

  saveButton: {
    padding: theme.spacing(1, 5),
    marginBottom: theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  listItemsTooltip: {
    fontSize: "12px",
    lineHeight: "16px",
    color: "#4F4F4F",
    marginTop: theme.spacing(-2),
    marginBottom: theme.spacing(-1.5),
  },
});
