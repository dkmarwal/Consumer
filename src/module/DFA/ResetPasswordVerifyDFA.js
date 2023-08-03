import { Grid, Typography } from "@material-ui/core";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PhoneIcon from "@material-ui/icons/Phone";
import MessageIcon from "@material-ui/icons/Message";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import AlertMessage from "~/components/AlertMessage";
import { compose } from "redux";
import { withTranslation } from "react-i18next";

class ResetPasswordVerifyDFA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verificationCode: null,
      progress: 0,
      hasTimeUp: false,
      timer: null,
      validation: {},
    };
  }

  componentDidMount() {
    this.setProgressBar();
  }

  setProgressBar = () => {
    let { timer } = this.state;
    timer = setInterval(() => {
      const { progress } = this.state;
      if (progress < 60) {
        this.setState({
          progress: progress + 1,
        });
      } else {
        clearInterval(timer);
        this.setState({
          hasTimeUp: true,
        });
      }
    }, 1000);
  };

  handleChange = (e) => {
    this.setState({
      verificationCode: e.target.value,
      validation: {},
    });
  };

  validateForm = () => {
    const { verificationCode } = this.state;
    const { t } = this.props;
    let valid = true;
    let validation = {};
    if (!verificationCode || verificationCode.trim() === "") {
      validation["verificationCode"] = t("dfa.error.verificationCodeRequired");
      valid = false;
    }

    this.setState({ validation: { ...validation } });
    return valid;
  };

  handleTryOther = () => {
    const { timer } = this.state;
    clearInterval(timer);
    this.setState(
      {
        hasTimeUp: false,
      },
      () => {
        this.props.tryOtherNo(true);
      }
    );
  };

  handleResendCode = (e, selectedMode) => {
    this.setState(
      {
        hasTimeUp: false,
        progress: 0,
      },
      async () => {
        const { phoneNum, ccode } = this.props;
        await this.props.handleResendCode({
          phoneNumber: phoneNum,
          selectedMode: selectedMode,
          ccode: ccode,
        });

        this.setProgressBar();
      }
    );
  };

  handleVerifyCode = async () => {
    const { verificationCode } = this.state;
    const valid = this.validateForm();
    if (!valid) {
      return false;
    }

    await this.props.handleVerifyOTP(verificationCode);
  };

  handleStopTimer = () => {
    const { notificationMsg } = this.props;
    if (notificationMsg) {
      this.setState({
        hasTimeUp: true,
        progress: 60,
      });
    } else {
      this.setProgressBar();
    }
  };

  render() {
    const {
      classes,
      phoneNum,
      selectedMode,
      ccode,
      notificationMsg,
      variant = "error",
      t,
    } = this.props;
    const { validation, verificationCode, progress, hasTimeUp } = this.state;

    return (
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        spacing={2}
      >
        <Grid container item md justifyContent="center">
          <VpnKeyIcon color="primary" />
        </Grid>
        {notificationMsg && (
          <AlertMessage
            alertType={variant}
            alertTitleMsg={`${notificationMsg}`}
          />
        )}
        <Grid item md justifyContent="center">
          <Typography
            variant="body1"
            align="center"
            className={classes.heading}
          >
            {t("dfa.message.verificationCode")}
          </Typography>
        </Grid>
        <Grid item md justifyContent="center">
          <Typography variant="subtitle1" align="left">
            {`${t("dfa.message.enterCode")} ${ccode || ""} ${
              (phoneNum && phoneNum.replace(/.(?=.{4})/g, "*")) || ""
            } `}
          </Typography>
        </Grid>
        <Grid item justifyContent="center" alignItems="center">
          <Box justifyContent="center" alignItems="center">
            <Button
              variant={selectedMode === "PHONE" ? "contained" : "outlined"}
              color="primary"
              className={
                selectedMode === "PHONE"
                  ? classes.resetCallBtn
                  : classes.resetCallBtnUnselected
              }
              onClick={(e) => this.handleResendCode(e, "PHONE")}
              disabled={hasTimeUp ? false : true}
            >
              <PhoneIcon /> {t("dfa.buttonLabel.call")}
            </Button>

            <Button
              variant={selectedMode === "SMS" ? "contained" : "outlined"}
              color="primary"
              className={
                selectedMode === "SMS"
                  ? classes.resetMsgBtn
                  : classes.resetMsgBtnUnselected
              }
              onClick={(e) => this.handleResendCode(e, "SMS")}
              disabled={hasTimeUp ? false : true}
            >
              <MessageIcon /> {t("dfa.buttonLabel.resendSms")}
            </Button>

            {hasTimeUp === false ? (
              <Box className={classes.resetPasswordProgressBar}>
                <CircularProgress
                  variant="determinate"
                  value={progress * 1.67}
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="textSecondary"
                  >
                    {progress}
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Grid>
        <Grid item md justifyContent="center">
          <Typography variant="subtitle2" align="left">
            {t("dfa.message.retryAfter60")}
          </Typography>
        </Grid>
        <Grid item md={9} lg={9}>
          <TextField
            required
            id="verificationCode"
            label={t("dfa.label.verificationCode")}
            variant="outlined"
            color="secondary"
            value={verificationCode}
            onChange={(e) => this.handleChange(e)}
            size="small"
            autoComplete="off"
            error={validation.verificationCode || false}
            helperText={validation.verificationCode || ""}
            inputProps={{
              maxLength: 10,
            }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className={classes.continueOTPBtn}
            size="medium"
            onClick={() => this.handleVerifyCode()}
          >
            {t("dfa.buttonLabel.submit")}
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withTranslation("common"),
  withStyles(styles)
)(ResetPasswordVerifyDFA);
