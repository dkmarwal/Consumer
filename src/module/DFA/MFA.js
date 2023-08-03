import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PhoneIcon from "@material-ui/icons/Phone";
import MessageIcon from "@material-ui/icons/Message";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import {
  preLoginDFA,
  verifyDFA,
  guestDFAVerify,
  postLoginDFA,
  consumerDetails,
  forgotPassDFA, forgotUsernameDFA,
} from "~/redux/actions/DFA";
import { login } from "~/redux/actions/user";
import { registerUser } from "~/redux/actions/consumerRegistration";
import config from "~/config";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import trim from "deep-trim-node";
import { updateSnackbar } from "~/redux/actions/consumerRegistration";
import Notification from "~/components/Notification";
import { StopTimer } from "~/config/entityTypes";

class MFA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: null,
      verificationErr: null,
      progress: 0,
      hasTimeUp: true,
      ctaDisabled: false,
      timer: null,
      showTimer: false,
      resendCta: true,
      typeDFA: null,
      alertType: "", //info/success/error/loading
      alertMessage: "",
      alertBox: false,
      btnDisabled: true,
      dfaSelectionScreen: true,
      isLoading: false,
    };
  }

  componentDidMount() {
    // const { isRegiteredUser } = this.props;
    // if (!isRegiteredUser) {
    //   this.setProgressBar();
    // }
  }

  generateOTP = () => {
    const { typeDFA } = this.state;
    const { MFAType, isProfileUpdate, resetCode, consumerSlugUrl, customerID } = this.props;
    switch (MFAType) {
      case "ForgotPassMFA":
        const forgotPassData = {
          dfaType: typeDFA,
          resetCode: resetCode
        };
        this.props
          .dispatch(forgotPassDFA(forgotPassData))
          .then((response) => {
            if (!response) {
              this.setState({
                hasTimeUp: true,
                ctaDisabled: false,
                resendCta: false,
                typeDFA: null,
                dfaSelectionScreen: true,
                // verificationErr: this.props.DFA.error,
                alertType: "error",
                alertMessage: this.props.DFA.error,
              });
              return false;
            } else {
              this.setState(
                {
                  dfaSelectionScreen: false,
                },
                () => {
                  this.setProgressBar();
                }
              );
            }
          });
        break;
      case "ForgotUsernameMFA":
        const forgotUsernameData = {
          customerId: customerID,
          consumerslugUrl: consumerSlugUrl,
          dfaType: typeDFA,
        }
        this.props
          .dispatch(forgotUsernameDFA(forgotUsernameData))
          .then((response) => {
            if (!response) {
              this.setState({
                hasTimeUp: true,
                ctaDisabled: false,
                resendCta: false,
                typeDFA: null,
                dfaSelectionScreen: true,
                // verificationErr: this.props.DFA.error,
                alertType: "error",
                alertMessage: this.props.DFA.error,
              });
              return false;
            } else {
              this.setState(
                {
                  dfaSelectionScreen: false,
                },
                () => {
                  this.setProgressBar();
                }
              );
            }
          });
        break;
      case "PostLoginMFA":
        const postLoginData = {
          dfaType: typeDFA,
        };
        this.props
          .dispatch(postLoginDFA(postLoginData, isProfileUpdate))
          .then((response) => {
            if (!response) {
              this.setState({
                hasTimeUp: true,
                ctaDisabled: false,
                resendCta: false,
                typeDFA: null,
                dfaSelectionScreen: true,
                // verificationErr: this.props.DFA.error,
                alertType: "error",
                alertMessage: this.props.DFA.error,
              });
              return false;
            } else {
              this.setState(
                {
                  dfaSelectionScreen: false,
                },
                () => {
                  this.setProgressBar();
                }
              );
            }
          });
        break;
      case "LoginMFA":
        const { loginId, password } = this.props;
        const data = {
          userName: loginId,
          password: password,
          portalTypeId: 5,
          dfaType: typeDFA,
        };
        this.props.dispatch(verifyDFA(data)).then((response) => {
          if (!response) {
            this.setState({
              hasTimeUp: true,
              ctaDisabled: false,
              resendCta: false,
              typeDFA: null,
              dfaSelectionScreen: true,
              // verificationErr: this.props.DFA.error,
              alertType: "error",
              alertMessage: this.props.DFA.error,
            });
            return false;
          } else {
            this.setState(
              {
                dfaSelectionScreen: false,
              },
              () => {
                this.setProgressBar();
              }
            );
          }
        });
        break;
      case "EnrollmentDFA":
      case "GuestDFA":
        const { token, takePhoneDuringEnrollment, phone } = this.props;
        const preLoginData = {
          token: token,
          portalTypeId: 5,
          dfaType: typeDFA,
          phone: takePhoneDuringEnrollment ? phone : null,
          phoneCountryCode: takePhoneDuringEnrollment ? "+1" : null
        };
        this.props.dispatch(preLoginDFA(preLoginData)).then((response) => {
          if (!response) {
            this.setState({
              hasTimeUp: true,
              ctaDisabled: false,
              resendCta: false,
              typeDFA: null,
              dfaSelectionScreen: true,
              // verificationErr: this.props.DFA.error,
              alertType: "error",
              alertMessage: this.props.DFA.error,
            });
            return false;
          } else {
            this.setState(
              {
                dfaSelectionScreen: false,
              },
              () => {
                this.setProgressBar();
              }
            );
          }
        });
        break;
      default:
        break;
    }
  };

  setProgressBar = () => {
    let { timer } = this.state;
    timer = setInterval(() => {
      const { progress } = this.state;
      if (progress < StopTimer) {
        this.setState({
          progress: progress + 1,
        });
      } else {
        clearInterval(timer);
        this.setState({
          hasTimeUp: true,
          ctaDisabled: false,
          resendCta: false,
        });
      }
    }, 1000);
  };

  handleChange = (e) => {
    const val = e.target.value;
    this.setState({
      otp: val,
      verificationErr: null,
      btnDisabled: val.length === 6 ? false : true,
    });
  };

  handleBtnClick = (e) => {
    const { id } = e.currentTarget;
    this.setState({ typeDFA: id });
  };
  handleGenerateOTP = () => {
    this.setState(
      {
        hasTimeUp: false,
        ctaDisabled: true,
        resendCta: true,
        progress: 0,
        showTimer: true,
        btnDisabled: true,
        otp: "",
      },
      () => {
        this.generateOTP();
      }
    );
  };
  getConsumerDetails = () => {
    this.props.dispatch(consumerDetails()).then((response) => {
      if (!response) {
        return false;
      }
      if (this.state.isLoading) {
        this.setState({
          isLoading: false,
        });
      }
      this.moveToNextScreen();
    });
  };
  moveToNextScreen = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    const consumerStatusId =
      this.props.DFA?.hasPymentTaken?.consumerStatusId || 0;

    if (consumerStatusId === 128) {
      this.props.history.push({
        pathname: `${config.baseName}/${routeParam}/paymentRegistration`,
        state: {
          isVerified: true,
        },
      });
    } else {
      this.props.history.push({
        pathname: `${config.baseName}/${routeParam}/dashboard`,
        state: {},
      });
    }
  };
  onSubmit = () => {
    const { otp } = this.state;
    const {
      userDetails,
      token,
      consumerSlugUrl,
      MFAType,
      isVerified,
      isOneTimePayment,
      clientName,
      paymentAmount,
      t,
    } = this.props;
    const isValid = this.validate();

    if (isValid) {
      switch (MFAType) {
        case "ForgotPassMFA":
        case "PostLoginMFA":
        case "ForgotUsernameMFA":
          this.props.onBtnClick(otp);
          break;
        case "LoginMFA":
          const { loginId, password } = this.props;
          const routeParam =
            (this.props.match.params && this.props.match.params.clientSlug) ||
            "";
          const creds = {
            userName: loginId,
            password: password,
            portalTypeId: 5,
            otp: otp,
            consumerSlugUrl: routeParam || "",
          };
          this.props.dispatch(login(creds)).then((response) => {
            if (!response) {
              this.props.handleNotification(
                this.props.user.error || t("dfa.error.somethingWentWrong"),
                "error"
              );
              return false;
            }
            this.getConsumerDetails();
          });
          break;
        case "EnrollmentDFA":
          const rParam =
            (this.props.match.params && this.props.match.params.clientSlug) ||
            "";
          this.setState(
            {
              // alertType: "loading",
              isLoading: true,
            },
            () => {
              this.props
                .dispatch(
                  registerUser({
                    token: token,
                    user: trim(userDetails),
                    consumerSlugUrl: consumerSlugUrl,
                    otp: otp,
                  })
                )
                .then(async (response) => {
                  if (!response) {
                    this.setState({
                      alertType: "error",
                      alertMessage: this.props.user.error,
                      isLoading: false,
                    });
                    this.props.handleNotification(
                      this.props.user.error ||
                      t("dfa.error.somethingWentWrong"),
                      "error"
                    );
                    return false;
                  } else {
                    this.props.dispatch(
                      updateSnackbar({
                        message: this.props.t("signUp.successfullyReg"),
                        severity: "success",
                        openSnackbar: true,
                      })
                    );
                    const creds = {
                      userName: userDetails.userName || "",
                      password: userDetails.newPassword || "",
                      portalTypeId: 5,
                      consumerSlugUrl: rParam || "",
                      isOnboarding: 1,
                    };
                    this.props.dispatch(login(creds)).then((response) => {
                      if (!response) {
                        this.props.handleNotification(
                          this.props.user.error ||
                          t("dfa.error.somethingWentWrong"),
                          "error"
                        );
                        return false;
                      }
                      this.getConsumerDetails();
                    });
                  }
                });
            }
          );
          break;
        case "GuestDFA":
          const rP =
            (this.props.match.params && this.props.match.params.clientSlug) ||
            "";
          this.setState(
            {
              // alertType: "loading",
              isLoading: true,
            },
            () => {
              this.props
                .dispatch(
                  guestDFAVerify({
                    token: token,
                    otp: otp,
                  })
                )
                .then((response) => {
                  if (!response) {
                    this.setState({
                      alertType: "error",
                      alertMessage: this.props.DFA.error,
                      isLoading: false,
                    });
                    this.props.handleNotification(
                      this.props.DFA.error || t("dfa.error.somethingWentWrong"),
                      "error"
                    );
                    return false;
                  }
                  //Redirect to the payment sharing page
                  this.props.history.push({
                    pathname: `${config.baseName}/${rP}/paymentRegistration`,
                    state: {
                      token: token,
                      isVerified: isVerified,
                      isOneTimePayment: isOneTimePayment,
                      clientName: clientName,
                      paymentAmount: paymentAmount,
                      consumerInfo: this.props.consumerInfo ?? {},
                    },
                  });
                });
            }
          );
          break;
        default:
          break;
      }
    }
  };

  validate = () => {
    const { t } = this.props;
    const { otp, typeDFA } = this.state;
    let valid = true,
      error = "";
    if (otp === null || (otp !== null && otp.toString().length === 0)) {
      error = t("dfa.error.verificationErr");
      valid = false;
    }
    if (typeDFA === null) {
      valid = false;
      error = t("dfa.error.dfaErr");
    }
    this.setState({
      verificationErr: error,
    });
    return valid;
  };
  render() {
    const { MFAType, classes, phoneNum, phoneCode, t } = this.props;
    const {
      otp,
      verificationErr,
      progress,
      hasTimeUp,
      showTimer,
      typeDFA,
      ctaDisabled,
      resendCta,
      alertMessage,
      alertType,
      btnDisabled,
      dfaSelectionScreen,
    } = this.state;

    return (
      <>
        {alertMessage && (
          <Notification
            variant={alertType}
            message={alertMessage}
            handleClose={() => {
              this.setState({
                alertMessage: null,
                alertType: null,
              });
            }}
          />
        )}
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="row"
          className={
            MFAType === "GuestDFA" || MFAType === "LoginMFA"
              ? classes.whilebg
              : [classes.fullHeight, classes.whilebg]
          }
        >
          <Grid
            justifyContent="center"
            alignItems="center"
            direction="row"
            xs={12}
          >
            <Grid item xs={12} md={12} lg={12}>
              <Box textAlign="center" px={{ xs: 1, md: 2, lg: 2 }}>
                <Box py={2}>
                  <img
                    src={require(`~/assets/icons/vpn_key.svg`)}
                    alt={"VPN KEY"}
                  />
                </Box>
                <Typography
                  variant="h1"
                  textAlign="center"
                  gutterBottom
                >
                  {t("dfa.message.twoStepVerification")}
                </Typography>
              </Box>
              {dfaSelectionScreen ? (
                <>
                  <Typography variant="h3" align="center" gutterBottom>
                    {t("dfa.message.MFAText")}
                  </Typography>
                  <Grid
                    container
                    spacing={2}
                    alignItem="center"
                    justifyContent="center"
                    className={classes.verifyBtnContainer}
                  >
                    <Grid
                      item
                      xs={this.props.i18n.language === "es" ? 12 : 5}
                      sm={this.props.i18n.language === "es" ? 5 : 3}
                      md={this.props.i18n.language === "es" ? 4 : 2}
                      lg={this.props.i18n.language === "es" ? 4 : 2}
                    >
                      <Button
                        //variant={typeDFA === "SMS" ? "contained" : "outlined"}
                        variant="text"
                        className={
                          typeDFA === "SMS" ? classes.btnSelected : classes.btn
                        }
                        id="SMS"
                        onClick={(e) => this.handleBtnClick(e)}
                      // disabled={ctaDisabled}
                      >
                        <MessageIcon /> {t("dfa.buttonLabel.sms")}
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={this.props.i18n.language === "es" ? 12 : 5}
                      sm={this.props.i18n.language === "es" ? 5 : 3}
                      md={2}
                      lg={2}
                    >
                      <Button
                        //  variant={typeDFA === "PHONE" ? "contained" : "outlined"}
                        variant="text"
                        className={
                          typeDFA === "PHONE"
                            ? classes.btnSelected
                            : classes.btn
                        }
                        id="PHONE"
                        onClick={(e) => this.handleBtnClick(e)}
                      // disabled={ctaDisabled}
                      >
                        <PhoneIcon /> {t("dfa.buttonLabel.call")}
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="center">
                    <Button
                      color="primary"
                      variant="contained"
                      className={classes.continueBtn}
                      disabled={typeDFA === null ? true : false}
                      onClick={() => this.handleGenerateOTP()}
                    >
                      {t("dfa.buttonLabel.send")}
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Typography variant="h3" align="center" gutterBottom>
                    <>
                      {`${t("dfa.message.enterCode")} ${phoneCode || ""} ${phoneNum && phoneNum.replace(/.(?=.{4})/g, "*") || ""
                        } `}
                    </>
                  </Typography>
                  <Box pt={2}>
                    <Grid
                      container
                      xs={12}
                      className={classes.verifyBtnContainer}
                    >
                      <Grid item xs={12} sm={6} md={6} lg={5}>
                        <TextField
                          required
                          id="otp"
                          label={t("dfa.label.verificationCode")}
                          variant="outlined"
                          color="primary"
                          value={otp}
                          fullWidth={true}
                          onChange={(e) => this.handleChange(e)}
                          autoComplete="off"
                          error={Boolean(verificationErr)}
                          helperText={verificationErr}
                          inputProps={{
                            maxLength: 6,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Box py={2}>
                      <Grid
                        container
                        xs={12}
                        className={classes.verifyBtnContainer}
                      >
                        {showTimer && hasTimeUp === false ? (
                          <Grid item xs={1}>
                            <Box
                              className={classes.progressBar}
                              alignItems="center"
                              alignContent="center"
                              display="flex"
                            >
                              <CircularProgress
                                variant="determinate"
                                value={progress * 0.66}
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
                          </Grid>
                        ) : null}

                        {typeDFA !== null && (
                          <Box py={0.5}>
                            {" "}
                            <Button
                              style={
                                hasTimeUp
                                  ? { marginLeft: 0 }
                                  : { marginLeft: 30 }
                              }
                              className={classes.resendBtn}
                              id="resend"
                              onClick={() => this.handleGenerateOTP()}
                              disabled={resendCta}
                            >
                              {t("paymentAuthentication.buttonLabel.resend")}
                            </Button>
                          </Box>
                        )}
                      </Grid>
                    </Box>
                  </Box>
                  <Grid container justifyContent="center">
                    {this.state.isLoading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        <Button
                          // color="primary"
                          variant="outlined"
                          className={classes.continueBtn}
                          disabled={ctaDisabled}
                          onClick={() =>
                            this.setState({ dfaSelectionScreen: true })
                          }
                        >
                          {t("dfa.buttonLabel.back")}
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          className={classes.continueBtn}
                          disabled={btnDisabled}
                          onClick={() => this.onSubmit()}
                        >
                          {t("dfa.buttonLabel.submit")}
                        </Button>
                      </>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.DFA,
}))(compose(withTranslation("common"), withStyles(styles))(MFA));
