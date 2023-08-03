import React from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const customStyle = makeStyles((theme) => ({
  mainContainer: {
    padding: "40px",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  title: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: theme.spacing(0),
  },
  titleText: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "28px",
    color: theme.palette.text.dark,
  },
  ContentText: {
    color: "#353535",
    fontSize: 14,
  },
  okButton: {
    padding: "5px 15px",
    cursor: "pointer",
    width: 140,
  },
}));

const SuccessDialog = (props) => {
  const {
    open,
    handleDialogClose,
    dialogTitle,
    dialogText,
    buttonName,
    dialogIcon,
  } = props;
  const customClasses = customStyle();
  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      className={customClasses.mainContainer}
    >
      <Box p={2} textAlign="center">
        <DialogTitle className={customClasses.title}>
          <img src={dialogIcon} alt="info" style={{ height: "30px" }} />
          <Typography className={customClasses.titleText}>
            {dialogTitle}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box p={{ xs: 0, lg: "8px 57px" }} textAlign="center">
            <DialogContentText className={customClasses.ContentText}>
              {dialogText}
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions className={customClasses.title}>
          <Button
            className={customClasses.okButton}
            onClick={() => handleDialogClose()}
            variant="contained"
            color="primary"
          >
            {buttonName}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
export default SuccessDialog;
