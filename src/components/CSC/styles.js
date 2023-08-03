export const styles = (theme) => ({
    contentBackground: {
      backgroundColor: theme.palette.background.header,
      padding: theme.spacing(4, 4),
      borderRadius: "4px",
    },
    inputContainer: {
      padding: theme.spacing(1, 4),
    },
    addFieldButton: {
      cursor: "pointer",
      borderRadius: "3px",
      padding: "8px"
    },
    floatRight: {
      float: "right",
      marginLeft:"10px"
    },
    floatLeft: {
      float: "left"
    },
    fullWidth: {
      width: "100%"
    },
    horizontalMargin: {
      margin: "10px 0"
    },
    saveButton: {
      width: "130px",
      margin: "-28px 0"
    },
    settingHeading: {
      fontWeight: "normal",
      fontSize: "20px",
      color: "#0B1941"
    },
    selectDropDown:{
      '& .MuiMenu-list':{
        maxHeight:290
      }
    },
    textFieldStyle:{
      '& .MuiFormLabel-root.Mui-error':{
        color:'#f44336 !important'
      }
    }
  });
