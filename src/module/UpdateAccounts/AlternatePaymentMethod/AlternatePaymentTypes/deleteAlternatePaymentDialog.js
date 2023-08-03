import React from "react";
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogContentText,
  Box,
  DialogActions,
  Button,
  makeStyles,
} from "@material-ui/core";
import DeleteInfo from "~/assets/icons/delete_alert_info.svg";
import { compose } from "redux";
import { withTranslation } from "react-i18next";

const customStyle = makeStyles((theme) => ({
  flagcontainer: {
    alignContent: "center",
    display: "flex",
  },
  flag: {
    height: "2em !important",
    width: "2em !important",
    borderRadius: "50%",
  },
  header: {
    // backgroundColor: "#CCE4FF",
    padding: "10px 16px",
  },
  headerPadding: {
    padding: "0px 16px",
  },
  headerLabel: {
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
  headerInput: {
    width: "95%",
    border: "none",
    fontSize: "12px",
    padding: "5px",
    borderRadius: "4px 4px 0 0",
    fontFamily: '"Interstate", Arial, Helvetica, sans-serif',
  },
  headerInputNew: {
    width: "50px",
    border: "none",
    fontSize: "12px",
    padding: "5px",
    borderRadius: "4px 4px 0 0",
    fontFamily: '"Interstate", Arial, Helvetica, sans-serif',
  },

  headerInputShort: {
    border: "none",
    fontSize: "12px",
    padding: "5px",
    maxWidth: "20%",
    marginRight: "10px",
    borderRadius: "4px 4px 0 0",
  },
  headerInputLong: {
    border: "none",
    fontSize: "12px",
    padding: "5px",
    width: "90%",
    marginLeft: 8,
    borderRadius: "4px 4px 0 0",
  },
  paymentMethodImgCont: {
    position: "relative",
    minHeight: "163px",
  },
  paymentMethodImg: {
    width: "100%",
    height: "50%",
    position: "absolute",
    bottom: "0%",
    right: "0%",
    background: "#FFFFFF",
    borderRadius: "4px",
    padding: "8px 0px",
  },
  mainContainer: {
    padding: "40px",
    borderRadius: "10px",
    [theme.breakpoints.down("xs")]: {
      padding: 8,
      "& .MuiDialog-paper": {
        margin: 0,
      },
    },
    // maxWidth: "750px !important"
  },
  title: {
    display: "flex",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "28px",
  },
  ContentText: {
    color: "#4C4C4C",
    fontSize: 14,
  },
  backButton: {
    width: 140,
    cursor: "pointer",
  },
  shareButton: {
    padding: "5px 15px",
    cursor: "pointer",
    width: 140,
  },
  pxSpace: {
    margin: theme.spacing(0, 1),
  },
  ptSpace: {
    paddingTop: theme.spacing(2),
    wordBreak: "break-all",
  },
  addAlternateContainer: {
    textAlign: "justify",
    padding: "16px 44px",
  },
  addAlternateButton: {
    marginTop: theme.spacing(2),
  },
  addAlternateText: {
    color: theme.palette.text.dark,
    fontSize: "0.875rem",
  },
  cardContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}));

const DeleteAlternatePaymentDialog = (props) => {
  const {
    open,
    handleDialogClose,
    t,
    handleDelete,
    handleCancel,
    deleteConfirmationText,
  } = props;
  const customClasses = customStyle();
  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      className={customClasses.mainContainer}
    >
      <Box p={{ xs: 0, lg: 2 }} style={{ width: "auto" }} textAlign="center">
        <DialogTitle className={customClasses.title}>
          <img src={DeleteInfo} alt="info" />
          <Typography className={customClasses.titleText}>
            {t("dashboard.heading.removeAlternatePayment")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className={customClasses.ContentText}>
            {deleteConfirmationText}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={customClasses.title}>
          <Button
            className={customClasses.shareButton}
            onClick={() => handleDelete()}
            variant="outlined"
            color="primary"
          >
            {t("dashboard.heading.confirmRemove")}
          </Button>
          <Button
            className={customClasses.backButton}
            variant="contained"
            color="primary"
            onClick={() => handleCancel(false)}
          >
            {t("dashboard.heading.cancel")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default compose(withTranslation("common"))(DeleteAlternatePaymentDialog);
