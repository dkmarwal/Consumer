import React from "react";
import {
  Button,
  Grid,
  Box,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  IconButton,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import { ReactComponent as BellIcon } from "~/assets/icons/notiBell.svg";
import CloseIcon from "@material-ui/icons/Close";
import "./styles.scss";
import { useTranslation, withTranslation } from "react-i18next";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import DataSecure from "~/assets/images/dataSecure.svg";

export function AlertDialog(props) {
  const { t } = useTranslation("common");
  const {
    dialogClassName = "",
    title,
    message,
    onConfirm,
    px = 8,
    py = 8,
    open = true,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={dialogClassName || ""}
    >
      <Box py={py} px={px}>
        {title && (
          <DialogTitle className="alert-dialog-title dialogTitle">
            {title}
          </DialogTitle>
        )}
        {message && (
          <DialogContent className="alert-dialog-message">
            <Box color="primary.main" mb={2} width={1}>
              <div className="dialogConten">{message}</div>
            </Box>
          </DialogContent>
        )}
        <DialogActions className="alert-dialog-btn">
          <Grid container justify="center">
            <Button variant="contained" onClick={onConfirm} color="primary">
              {t("dialogs.UserExistConfirmDialog.label.ok")}
            </Button>
          </Grid>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
function paymentMethodDialog(props) {
  const {
    dialogClassName = "",
    height,
    onConfirm,
    open = true,
    showButton,
    alignSide,
    width,
    btnDisabled = false,
    title,
    isDataSecure = false,
    t,
  } = props;
  const mobileQ = window.matchMedia("(min-width: 600px)");
  const tabletQ = window.matchMedia("(min-width: 1023px)");

  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 0, width: "600px" }}
      className={` ${dialogClassName || ""}`}
      scroll="paper"
    >
      <Box
        style={
          !mobileQ.matches
            ? { width: "calc(100% - 24px)" }
            : !tabletQ.matches
            ? { width: "calc(100% - 32px)" }
            : { width: width || "630px", height }
        }
        className={`${alignSide ? "sideDialog" : "centerDialog"}`}
      >
        <div className="heading">
          <span className="dialogTitle">{title}</span>
          <div className="dataSecure">
            {isDataSecure && (
              <img
                src={DataSecure}
                className="dataSecureImg"
                alt="Data Secure"
              />
            )}
            <span className="dataSecureText">
              {t("dialogs.dataSecureText")}
            </span>
          </div>
        </div>
        <DialogContent className="alert-dialog-message">
          <DialogContentText>
            <Box color="primary.main" mb={2} width={1}>
              <Box className="dialogConten">{props.children}</Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        {showButton && (
          <DialogActions>
            <Grid container justify="center">
              <Grid item xs={props.i18n.language === "fr" ? 4 : 3}>
                <Button
                  disabled={btnDisabled}
                  variant="contained"
                  fullWidth="true"
                  onClick={onConfirm}
                  color="primary"
                  autoFocus
                >
                  {t("dialogs.buttonLabel.close")}
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        )}
      </Box>
    </Dialog>
  );
}

export const PaymentMethodDialog =
  withTranslation("common")(paymentMethodDialog);

export function CustomDialog(props) {
  const { t } = useTranslation("common");
  const {
    dialogClassName = "",
    onClose,
    open,
    btnDisabled,
    showBtn,
    showCloseIcon,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={dialogClassName || ""}
    >
      {(showCloseIcon || showBtn) && (
        <Box display={"flex"} position="absolute" right={5} top={5} justifyContent="flex-end" zIndex="modal">
           <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
         
      )}
      {/* {(showCloseIcon ||showBtn ) && (
        <span
          style={{
            position: 'absolute',
            right: 5,
            top: 5,
          }}
        >
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </span>
      )} */}
      <Box>
        <DialogContent className="alert-dialog-messaged">
          <Box color="primary.main" mb={2}>
            {props.children}
          </Box>
        </DialogContent>
        {showBtn && (
          <DialogActions>
            <Grid container justifyContent="center">
              <Grid item xs={4} lg={4} justifyContent="center">
                <Button
                  disabled={btnDisabled}
                  style={
                    btnDisabled
                      ? {
                          opacity: 0.5,
                          pointerEvents: "none",
                          cursor: "not-allowed",
                        }
                      : {}
                  }
                  variant="contained"
                  fullWidth="true"
                  onClick={onClose}
                  color="primary"
                  autoFocus
                >
                  {t("dialogs.UserExistConfirmDialog.label.ok")}
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        )}
      </Box>
    </Dialog>
  );
}

export function NoitificationDialog(props) {
  const { t } = useTranslation("common");
  const {
    dialogClassName = "",
    title,
    onConfirm,
    open = true,
    showButton,
    alignSide,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 0 }}
      className={`${dialogClassName || ""}`}
    >
      <div className={`${alignSide ? "notificationSideDialog" : ""}`}>
        <Grid container className="heading" justify="space-between">
          <Grid item xs={2}>
            <BellIcon />
          </Grid>
          <Grid item xs>
            <Typography variant="h2">{title}</Typography>
          </Grid>
          <Grid item xs={2}>
            {" "}
            <IconButton onClick={onConfirm}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
        <Box style={{ padding: 0 }} width={1}>
          {/* {title && <DialogTitle className="alert-dialog-title dialogTitle">{title}</DialogTitle>} */}
          <DialogContent className="alert-dialog-message">
            <Box color="primary.main" m={1} width={1}>
              {props.children}
            </Box>
          </DialogContent>
          {showButton && (
            <DialogActions>
              <Grid container justify="center">
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    fullWidth="true"
                    onClick={onConfirm}
                    color="primary"
                    autoFocus
                  >
                    {t("dialogs.UserExistConfirmDialog.label.ok")}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          )}
        </Box>
      </div>
    </Dialog>
  );
}

export function IdleTimeOutModal(props) {
  const { t } = useTranslation("common");
  const { title, message, onConfirm, open = true } = props;
  return (
    <div id="mainDialogs">
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box py={6} px={6}>
          <DialogTitle className="dialogTitle">{title}</DialogTitle>
          <DialogContent>
            <div className="dialogConten">{message}</div>
          </DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button variant="contained" onClick={onConfirm} color="primary">
              {t("dialogs.UserExistConfirmDialog.label.yes")}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}

export function CustomSideDialog(props) {
  const { t } = useTranslation("common");
  const {
    dialogClassName = "",
    title,
    onConfirm,
    open = true,
    showButton,
    alignSide,
    icon,
    onClose,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 0 }}
      className={`${dialogClassName || ""}`}
    >
      <div className={`${alignSide ? "customSideDialog" : ""}`}>
        <Grid container className="heading">
          {icon && (
            <Grid xs={1} item container alignItems="center">
              <img
                src={require(`~/assets/icons/${icon}.svg`)}
                alt={"Icon"}
                className="imgIcon"
              />
            </Grid>
          )}
          <Grid item container xs={8} alignItems="center">
            <Typography variant="h2">{title}</Typography>
          </Grid>
          <Grid item xs={3} container justify="flex-end">
            {" "}
            <IconButton onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
        <Box p={0}>
          {/* {title && <DialogTitle className="alert-dialog-title dialogTitle">{title}</DialogTitle>} */}
          <DialogContent
            className="alert-dialog-message"
            style={{ height: "100%" }}
          >
            <Box color="primary.main" m={1}>
              {props.children}
            </Box>
          </DialogContent>
          {showButton && (
            <DialogActions>
              <Grid container justify="center">
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    fullWidth="true"
                    onClick={onConfirm}
                    color="primary"
                    autoFocus
                  >
                    {t("dialogs.UserExistConfirmDialog.label.ok")}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          )}
        </Box>
      </div>
    </Dialog>
  );
}

// Customized Dialogs with close icon
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    "& .MuiTypography-h1": {
      fontWeight: 700,
      fontSize: 28,
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const DialogHeading = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h1">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export function TimeoutDialog(props) {
  const { open, handleClose, msgText, dialogIcon = null } = props;
  return (
    <>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xs"
      >
        <DialogHeading id="customized-dialog-title" onClose={handleClose}>
          <Box textAlign="center">
            {dialogIcon ? (
              <img
                src={dialogIcon}
                alt="Step Done"
                style={{ marginTop: "16px" }}
              />
            ) : (
              <InfoOutlinedIcon fontSize="large" htmlColor="#33C3A4" />
            )}
          </Box>
        </DialogHeading>
        <DialogContent
          style={{ padding: "8px 80px", color: "#2B2D30", fontSize: "16px" }}
        >
          <Box textAlign="center" pb={3}>
            {msgText}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
