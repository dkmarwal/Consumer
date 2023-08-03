import loader from "~/assets/images/loader.gif";
export const styles = (theme) => ({
  contentBackground: {
    backgroundColor: theme.palette.background.header,
    padding: theme.spacing(4, 4),
    borderRadius: "4px",
  },
  root: {
    width: "100%",
  },
  inputContainer: {
    padding: theme.spacing(1, 4),
  },
  // root: {
  //     // flexGrow: 1,
  // },
  // paper: {
  //     // padding: theme.spacing(2),
  //     textAlign: 'center',
  //     color: theme.palette.text.secondary,
  // },
  addFieldButton: {
    cursor: "pointer",
    borderRadius: "3px",
    padding: "8px",
  },
  floatRight: {
    float: "right",
    marginLeft: "10px",
  },
  floatLeft: {
    float: "left",
  },
  fullWidth: {
    width: "100%",
  },
  horizontalMargin: {
    margin: "10px 0",
  },
  saveButton: {
    width: "130px",
    margin: "-28px 0",
  },
  settingHeading: {
    fontWeight: "normal",
    fontSize: "20px",
    color: "#0B1941",
  },
  closeIcon: {
    cursor: "pointer",
  },
  loader: {
    background: `url(${loader}) center center no-repeat`,
  },
  contentBox:{
    "& ul":{
      paddingLeft: 40,
      margin: "1em 0"
    },
    "& ol":{
      paddingLeft: 40,
      margin: "1em 0"
    }
  }
});
