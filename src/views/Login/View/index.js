import React, { useRef } from "react";
import {
  Grid,
  Box,
  makeStyles,
  Link,
  Typography,
  Button,
  Tooltip,
} from "@material-ui/core";
import ReCAPTCHA from "react-google-recaptcha";
import config from "~/config";
import { withTranslation } from "react-i18next";
import CustomTextField from "~/components/Forms/CustomTextField";
import clsx from "clsx";
import { connect } from "react-redux";
import { compose } from "redux";

const useStyle = makeStyles((theme) => ({
  paper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    background: theme.palette.background.white,
    borderRadius: theme.spacing(1),
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(3),
    margin: theme.spacing(3, 0),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
      margin: theme.spacing(2, 0),
    },
  },
  heading: {
    paddingTop: 0,
    color: theme.palette.text.main,
    fontSize: 24,
    fontWeight: 400,
  },
  clientLogo: {
    display: "flex",
    justifyContent: "center",

    maxWidth: "240px",
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "190px",
    },
  },
  imageAvatar: {
    width: "100%",
    maxWidth: "120px",
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      maxWidth: 140,
      height: "auto",
      maxHeight: 50,
    },
  },

  logoImg: {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "20px",
    borderRight: "1px solid #ddd",
  },
  logoLabel: {
    display: "flex",
    justifyContent: "center",
    /*paddingLeft: "20px",*/
    alignItems: "flex-end",
    fontSize: 16,
    color: "rgba(0,0,0,0.74)",
    fontFamily: "'Roboto', Arial, Helvetica, sans-serif",
  },
  textField: {
    marginTop: "22px",
    [theme.breakpoints.down("xs")]: {
      marginTop: 16,
    },
  },
  blueBtn: {
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: "14px",
    padding: 8,
    minWidth: 140,
    boxShadow: "none",
  },
  aLink: {
    color: theme.palette.text.heading,
    fontSize: 14,
    marginTop: 10,
  },
  welcomeText: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
    },
    wordBreak: "break-word"
  },
}));

const LoginView = (props) => {
  const {
    validation,
    credentials,
    handleChange,
    handleRecaptcha,
    onSubmit,
    handleForgotPassword,
    handleRecoverUserName,
    error,
    buttonDisabled,
    brandInfo,
    routeParam,
    t,
  } = props;
  const classes = useStyle();

  const capRef = useRef(null);
  const handleSave = (event) => {
    if (event.keyCode === 13) {
      onSubmit();
    }
  };

  const { state } = (props && props.location) || {};

  const message =
    state && state.fromEnrollment
      ? this.props.t("login.view.fromEnrollment")
      : "";
  const clientLogo = brandInfo.logo || null;

  let isSSO = sessionStorage.getItem(`isSSO_${routeParam}`);

  return (
    <>
      <Grid item xs="11" sm="6" md="9" lg="8" xl="5">
        <div className={classes.paper}>
          <Box
            display="flex"
            width={1}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} md={12} lg={12} className={classes.logoLabel}>
              {clientLogo && (
                <Box>
                  <img
                    src={clientLogo}
                    className={classes.imageAvatar || ""}
                    height="34"
                    width="150"
                    alt="client logo"
                  />
                </Box>
              )}
            </Grid>
          </Box>
          <Box
            display="flex"
            width={1}
            justifyContent="center"
            mt={{ xs: 1, lg: 2 }}
            mx={1}
          >
            <Typography
              variant="h3"
              align="center"
              className={clsx("welcomeHeader", classes.welcomeText)}
            >
              {props.user.brandInfo.login_welcome_msg}
            </Typography>
          </Box>
          {!isSSO ? (
            <Box
              display="flex"
              pt={{ xs: 1, lg: 3 }}
              justifyContent="center"
              textAlign={"center"}
            >
              <Typography variant="body1" className={classes.heading}>
                {t("login.view.label.payeeLogin")}
              </Typography>
            </Box>
          ) : null}
          <Box p={0} width={1}>
            <CustomTextField
              error={validation.Email}
              helperText={validation.Email && t("login.view.error.Email")}
              fullWidth={true}
              autoComplete="off"
              value={(credentials && credentials.Email) || ""}
              name="Email"
              label={t("login.view.label.userName")}
              placeholder={t("login.view.label.userName")}
              onChange={(event) => handleChange("Email", event)}
              dir="horizontal"
              size="medium"
              variant="outlined"
              inputProps={{
                maxLength: 50,
                autocomplete: "new-password",
              }}
              className={classes.textField}
            />

            <Link
              className={classes.aLink}
              href="javascript:void(0)"
              onClick={() => handleRecoverUserName()}
            >
              {t("login.view.label.forgotUsername")}?
            </Link>

            <CustomTextField
              error={validation.Password}
              helperText={
                validation.Password
                  ? validation.Password === "Please enter password."
                    ? t("login.view.error.Password")
                    : validation.Password
                  : ""
              }
              fullWidth={true}
              autoComplete="off"
              value={(credentials && credentials.Password) || ""}
              label={t("login.view.label.password")}
              name="Password"
              placeholder={t("login.view.placeholder.password")}
              onChange={(event) => handleChange("Password", event)}
              onKeyDown={(event) => handleSave(event)}
              dir="horizontal"
              size="medium"
              type="password"
              variant="outlined"
              inputProps={{
                maxLength: 100,
                autocomplete: "new-password",
              }}
              showEyeIcon={true}
              className={classes.textField}
            />

            <Link
              className={classes.aLink}
              href="javascript:void(0)"
              onClick={() => handleForgotPassword()}
            >
              {t("login.view.label.forgotPassword")}?
            </Link>
            <Box mt={{ xs: 1.5, lg: 3 }}>
              {config.showCaptcha && (
                <ReCAPTCHA
                  className="g-recaptcha"
                  ref={capRef}
                  sitekey="6Ld6MKYZAAAAALnTmc5dxhHMr5FWc4IEVTAGZLa6"
                  onChange={handleRecaptcha}
                />
              )}
            </Box>
            {config.showCaptcha && validation && validation.recaptchaValue ? (
              <span
                style={{
                  color: "red",
                  fontFamily: "inherit",
                  paddingLeft: "16px",
                  fontWeight: "inherit",
                  fontSize: "0.75rem",
                }}
              >
                {validation &&
                  validation.recaptchaValue &&
                  t("login.view.error.recaptchaValue")}
              </span>
            ) : null}
            <Box>
              <Typography variant="subtitle1" color="error">
                {error}
              </Typography>
            </Box>
            <Box
              mt={{ xs: 3, lg: 3 }}
              display="flex"
              justifyContent="center"
              color="text.primary"
            >
              <Tooltip
                title={
                  message ? t(`login.view.notification.${message}`) : message
                }
                arrow
              >
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.blueBtn}
                  onClick={() => onSubmit()}
                  size="medium"
                  disabled={buttonDisabled}
                  title={
                    message ? t(`login.view.notification.${message}`) : message
                  }
                >
                  {t("login.view.label.signIn")}
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </div>
      </Grid>
    </>
  );
};

export default connect((state) => ({ ...state.user }))(
  compose(withTranslation("common"))(LoginView)
);
