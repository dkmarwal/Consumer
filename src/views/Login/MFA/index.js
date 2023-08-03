import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Divider,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { AlertDialog } from "~/components/Dialogs";
import CitiLogo from "~/assets/images/citi-color-logo.svg";
import ResetPasswordVerifyDFA from "~/module/DFA/ResetPasswordVerifyDFA";
import { forgotPassword } from "~/redux/actions/user";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { verifyForgotPassword } from "~/redux/actions/DFA";
import Footer from "~/components/Footer";
import styles from "./../styles";
import config from "~/config";

class MFA extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      variant: null,
      alertMessage: null,
      notificationMsg: null,
      phoneNum: (state && state?.details?.phoneNumber) || null,
      selectedMode: (state && state?.details?.dfaType) || null,
      ccode: (state && state?.details?.phoneCountryCode) || null,
      details: (state && state?.details) || null, //Coming from valid verified page
      userName: (state && state?.userName) || null, //Coming from valid verified page
    };
  }

  componentDidMount = () => {
    //TODO: CAll sent OTP API handleResendCode, when there is need to send at page load
  };

  /*
    Use: Send OTP code to phone number
    */
  handleResendCode = async (data) => {
    const { userName } = this.state;
    const routeParam = (this.props.match.params && this.props.match.params.clientSlug) || "";
    this.setState(
      {
        variant: null,
        notificationMsg: null,
        selectedMode: data.selectedMode || null,
      },
      async () => {
        await this.props
          .dispatch(
            forgotPassword({ loginId: userName, dfaType: data.selectedMode, consumerSlugUrl: routeParam })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                variant: "error",
                notificationMsg: this.props.user.error || "",
              });
              return false;
            }

            this.setState({
              notificationMsg: null,
            });
          });
      }
    );
  };

  /*
    Use: Verify OTP code which was sent into phone number
    */
  handleVerifyOTP = (userCode) => {
    const { userName } = this.state;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) ||
      "";
    if (Boolean(userCode)) {
      this.setState(
        {
          variant: null,
          notificationMsg: null,
        },
        async () => {
          await this.props
            .dispatch(verifyForgotPassword(userName, userCode, routeParam))
            .then((response) => {
              if (!response) {
                this.setState({
                  variant: "error",
                  notificationMsg: this.props.DFA.error || "",
                });
                return false;
              }
              this.setState({
                alertMessage: this.props.DFA.verificationData || "",
              });
            });
        }
      );
    } else {
      this.setState({
        variant: "error",
        notificationMsg: this.props.t("dfa.error.verificationCodeRequired"),
      });
    }
  };

  closeNotification = () => {
    this.setState({
      variant: null,
      notificationMsg: null,
    });
  };

  hideAlertMessage = () => {
    this.setState(
      {
        alertMessage: null,
      },
      () => {
        const routeParam =
          (this.props.match.params && this.props.match.params.clientSlug) || "";
        this.props.history.push(`${config.baseName}/${routeParam}`);
      }
    );
  };

  render() {
    const { classes, user, t } = this.props;
    const {
      variant,
      notificationMsg,
      alertMessage,
      phoneNum,
      selectedMode,
      ccode,
      userName,
    } = this.state;
    const brandInfo = user?.brandInfo ?? {};
    const clientLogo = brandInfo.logo || null;

    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    if (!userName) {
      this.props.history.push(`${config.baseName}/${routeParam}`);
    }

    return (
      <Grid container justify="center" className={classes.root}>
        <Grid item xs={12} md={6} lg={6} className={classes.leftWrap}>
          <Box display="flex" mt={2}></Box>
        </Grid>
        <Grid item md={6} lg={6} className={classes.paper}>
          <Box display="flex" justifyContent="center">
            <Grid item xs md lg="7">
              <div className={classes.paperReset}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  className={classes.clientLogo}
                >
                  <Grid item xs={6} md={6} lg={6} className={classes.logoImg}>
                    <img src={CitiLogo} alt="Citi Logo" height="34" />
                  </Grid>
                  <Grid item xs={6} md={6} lg={6} className={classes.logoLabel}>
                    {clientLogo && (
                      <Box m={1}>
                        <Divider
                          orientation="vertical"
                          className={classes.headerDivider}
                        />
                      </Box>
                    )}
                    {clientLogo && (
                      <Box>
                        <img
                          src={clientLogo}
                          alt="client logo"
                          className={classes.imageAvatar || ""}
                          height="34"
                        />
                      </Box>
                    )}
                  </Grid>
                </Box>
                <Box display="flex" justifyContent="center" mt={2} mx={1}>
                  <Typography variant="h3" className="welcomeHeader" style={{wordBreak: "break-word"}}>
                  {this.props.user.brandInfo.login_welcome_msg}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  pt={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <ResetPasswordVerifyDFA
                    phoneNum={phoneNum}
                    selectedMode={selectedMode}
                    ccode={ccode}
                    handleVerifyOTP={this.handleVerifyOTP}
                    handleResendCode={this.handleResendCode}
                    notificationMsg={notificationMsg || ""}
                    variant={variant}
                  />
                </Box>
              </div>
            </Grid>
          </Box>
          <Box style={{ position: "absolute", bottom: "0px" }}>
            <Footer {...this.props} />
          </Box>
        </Grid>
        {/*notificationMsg && <Notification variant={variant} message={notificationMsg} handleClose={()=>this.closeNotification()} />*/}
        {alertMessage && this.renderAlertMessage("", alertMessage)}
      </Grid>
    );
  }

  renderAlertMessage = (title, message) => {
    return (
      <AlertDialog
        px={1.3}
        py={1.3}
        dialogClassName={"alert-dialoge-otp"}
        title={title}
        message={message}
        onConfirm={() => this.hideAlertMessage()}
      />
    );
  };
}

export default connect((state) => ({ ...state.user, ...state.DFA }))(
  compose(withTranslation("common"), withStyles(styles))(MFA)
);
