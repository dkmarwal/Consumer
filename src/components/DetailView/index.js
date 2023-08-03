import React from "react";
import {
  Box,
  makeStyles,
  Dialog,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 768,
    margin: 0,
    padding: "0px 16px",
    backgroundColor: theme.palette.background.active,
    zIndex: 1,
    marginBottom: "10px",
    overflowY: "auto !important",
    height: "100%",
    [theme.breakpoints.down("xs")]: {
      minWidth: "100%",
    },
  },
  paper: {
    width: "100%",
    paddingTop: "16px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    alignContent: "flex-start",
    padding: "0px 12px",
    boxShadow: "0 4px 6px -6px grey",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
      padding: 0,
    },
  },
  checkBox: {
    "& span": {
      color: "#000000",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.6,
    },
  },
  heading: {
    paddingTop: 0,
    color: "#002D43",
    fontSize: 24,
    lineHeight: "24px",
    fontWeight: "500",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      fontSize: 18,
    },
  },
  DialogTitle: {
    padding: "8px 0px 5px 0px",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
}));

function DetailView(props) {
  const classes = useStyles();
  const { open, handleClose, children, t } = props;

  return (
    <Dialog
      maxWidth="md"
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.DialogTitle}>
        <Box display="flex" width="100%" justifyContent="flex-end">
          <IconButton
            aria-label="Close"
            title={t("dialogs.buttonLabel.close")}
            component="span"
            onClick={() => handleClose()}
          >
            <CloseIcon variant="contained" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        style={{ overflow: "hidden" }}
        className={classes.root}
        hidden={!open}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
export default withTranslation("common")(DetailView);
