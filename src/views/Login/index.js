import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Paper, Box, Modal } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { AlertDialog } from "~/components/Dialogs";
import {
  verifyUser,
  setNewPassword,
  forgotPassword,
  login,
} from "~/redux/actions/user";
import styles from "./styles";
import LoginView from "./View/";
import ForgotPassword from "./ForgotPassword/";
import RecoverUsername from "./RecoverUsername";
import FirstLogin from "./FirstLogin/";
import { consumerDetails } from "~/redux/actions/DFA";
import config from "~/config";
import PasswordExpired from "./PasswordExpired";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { updateLanguage } from "~/redux/actions/user";
import Footer from "~/components/Footer";
import Cookies from "universal-cookie";
import SuccessDialog from "~/components/Dialogs/successDialog";
import StepDoneIcon from "~/assets/icons/Step_Done_main.svg";
import SSOLogout from "./SSO";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginProgress: false,
      buttonDisabled: false, //commented to be true in case of recaptcha is there
      showUpdatePasswordModal: false,
      loginId: null,
      password: null,
      forgotPasswordView: this.props.forgotPasswordView,
      recoverUsernameView: this.props.recoverUsernameView,
      isVerified: !config.showCaptcha, //needs to be false in case of recaptcha is there
      error: null,
      validation: {},
      alertType: "success",
      alertMessage: null,
      alertMessageCallbackType: null,
      showResetModal: false,
      showForgotPasswordMsg: null,
      langAnchorEl: null,
      anchorEl: null,
      langMenuOpen: false,
      alertMessageOTP: null,
      alertTitle: null,
    };
    this.handleRecaptcha = this.handleRecaptcha.bind(this);
  }

  componentDidMount = () => {
    if (this.props.user.isLoggedIn) {
      this.props.dispatch(consumerDetails());
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user.isLoggedIn) {
      if (nextProps.user.info.isFirstLogin) {
      } else {
        const routeParam =
          (nextProps.match.params && nextProps.match.params.clientSlug) || "";
        const language =
          sessionStorage.getItem(`@consumerLocaleLang_${routeParam}`) || "en";

        if (config.willTranslate && nextProps.user.info.locale !== language) {
          nextProps
            .dispatch(updateLanguage({ locale: language }))
            .then((response) => {
              if (!response) {
                return false;
              }
              nextProps.i18n.changeLanguage(language);
            });
        }

        const { isLoggedIn } = nextProps.user;
        if (isLoggedIn && nextProps?.DFA?.hasPymentTaken) {
          const consumerStatusId =
            nextProps?.DFA?.hasPymentTaken?.consumerStatusId || 0;
          if (consumerStatusId === 128) {
            //Redirect to payment registration page is status id is 128
            nextProps.history.push({
              pathname: `${config.baseName}/${routeParam}/paymentRegistration`,
              state: {
                isVerified: true,
              },
            });
          } else {
            nextProps.history.push(
              `${config.baseName}/${routeParam}/dashboard`
            );
          }
        } else return null;
      }
    }
    return null;
  }

  handleLangToggle = (event) => {
    this.setState({
      langMenuOpen: !this.state.langMenuOpen,
      langAnchorEl: event.currentTarget,
    });
  };

  handleLangClose = () => {
    this.setState({
      langMenuOpen: false,
      langAnchorEl: null,
    });
  };

  handleLanguageChange = (event, langCode) => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    const { isLoggedIn } = this.props.user;
    if (isLoggedIn) {
      this.setState(
        {
          langMenuOpen: false,
        },
        () => {
          // API call to change user selected language
          this.props
            .dispatch(updateLanguage({ locale: langCode }))
            .then((response) => {
              if (!response) {
                return false;
              }
              this.props.i18n.changeLanguage(langCode);
              sessionStorage.setItem(`@consumerLocaleLang_${routeParam}`);
              this.setState({
                langMenuOpen: false,
              });
              window.location.reload();
            });
        }
      );
    } else {
      this.props.i18n.changeLanguage(langCode);
      sessionStorage.setItem(
        `@consumerLocaleLang_${routeParam}`,
        this.props.i18n.language
      );
      this.setState({
        langMenuOpen: false,
      });
      window.location.reload();
    }
  };

  handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      this.setState({
        langMenuOpen: false,
      });
    }
  };

  handleRecaptcha = (value) => {
    const recaptchaValue = value;
    if (recaptchaValue.length === 0) {
      this.setState({ isVerified: false });
    } else {
      this.setState({ isVerified: true });
    }
    if (recaptchaValue.length === 0) {
      this.setState({
        error: null,
      });
    } else {
      this.setState({
        error: null,
      });
    }
  };
  resetRecaptcha = () => {
    window.grecaptcha && window.grecaptcha.reset();
  };

  handleChange = (field, event, position) => {
    const { isVerified } = this.state;
    switch (field) {
      case "Email":
        this.setState({ loginId: event.target.value });
        break;
      case "Password":
        this.setState({ password: event.target.value });
        break;
      default:
        break;
    }

    if (isVerified) {
      this.setState({
        error: null,
      });
    } else {
      this.setState({
        error: null,
      });
    }
  };

  hideAlertMessage = () => {
    const { forgotPasswordView, recoverUsernameView } = this.state;

    if (forgotPasswordView || recoverUsernameView) {
      const routeParam =
        (this.props.match.params && this.props.match.params.clientSlug) || "";
      this.props.history.push(`${config.baseName}/${routeParam}`);
    }
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
      forgotPasswordView: false,
      showForgotPasswordMsg: null,
      alertTitle: null,
    });
  };

  validateForm = () => {
    const { loginId, password, isVerified } = this.state;

    let valid = true;
    let validation = {};

    if (!loginId || (loginId && loginId.trim() === "")) {
      validation["Email"] = this.props.t("login.error.Email");
      valid = false;
    }

    if (!password || (password && password.trim() === "")) {
      validation["Password"] = this.props.t("login.error.Password");
      valid = false;
    }

    if (!isVerified && config.showCaptcha) {
      validation["recaptchaValue"] = this.props.t("login.error.recaptchaValue");
      valid = false;
    }

    this.setState({ validation: { ...validation } });
    return valid;
  };

  processLogin = (event) => {
    const { loginId, password, loginProgress, isVerified } = this.state;

    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    const valid = this.validateForm();
    if (!valid) {
      return false;
    }

    if (config?.showCaptcha && !isVerified) {
      return false;
    }

    if (loginId && password && !loginProgress) {
      this.setState(
        {
          loginProgress: true,
          error: null,
        },
        async () => {
          const creds = {
            userName: loginId,
            password: password,
            portalTypeId: 5,
            consumerSlugUrl: routeParam || "",
          };
          await this.props.dispatch(verifyUser(creds)).then((response) => {
            if (!response) {
              const { user } = this.props;
              if (user && user["data"] && user.data["isResetPassword"]) {
                this.setState({
                  showForgotPasswordMsg: this.props.user.error || "",
                  loginProgress: false,
                  isVerified: false,
                });
                return false;
              }

              if (user && user["data"] && user.data["isExpired"]) {
                this.setState({ showResetModal: true, isVerified: false });
              }
              this.setState({
                validation: { Password: this.props.user.error || "" },
                isVerified: false, //bug:FSINPAYB2B-9470
				loginProgress: false,
              });
              this.resetRecaptcha();
              return false;
            }
            const { user } = this.props;
            const routeParam =
              (this.props.match.params && this.props.match.params.clientSlug) ||
              "";
            const creds = {
              userName: loginId,
              password: password,
              portalTypeId: 5,
              otp: null,
              consumerSlugUrl: routeParam || "",
            };
            if (
              user &&
              user.dfaDetails &&
              user.dfaDetails.isMFALoginRequired === 1
            ) {
              this.props.history.push({
                pathname: `${config.baseName}/${routeParam}/dfa`,
                state: {
                  loginId: loginId,
                  password: password,
                  dfaDetails: user && user.dfaDetails,
                  isVerified: true,
                },
              });
            } else {
              this.props.dispatch(login(creds)).then((response) => {
                if (!response) {
                  this.props.handleNotification(
                    this.props.user.error ||
                    this.props.t("dfa.error.somethingWentWrong"),
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
    }
  };
  getConsumerDetails = () => {
    this.props.dispatch(consumerDetails()).then((response) => {
      if (!response) {
        return false;
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
  processReset = ({ password, securityQuestionId, securityAnswer }) => {
    const resetData = {
      userName: this.props.user.info.userName,
      password: password,
      securityQuestionId: securityQuestionId,
      securityAnswer: securityAnswer,
    };

    return this.props.dispatch(setNewPassword(resetData));
  };

  handleOTPAlertMessage = () => {
    const { loginId } = this.state;
    this.setState(
      {
        alertMessageOTP: null,
        validation: {},
        error: null,
      },
      () => {
        const routeParam =
          (this.props.match.params && this.props.match.params.clientSlug) || "";
        const { passwordChangeInfo } = this.props.user;
        this.props.history.push({
          pathname: `${config.baseName}/${routeParam}/mfa`,
          state: {
            details: passwordChangeInfo,
            userName: loginId || null,
          },
        });
      }
    );
  };

  handleForgotPassword = () => {
    this.setState({
      forgotPasswordView: true,
      loginId: null,
      validation: {},
      error: null,
      showForgotPasswordMsg: null,
    });
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    this.props.history.push(`${config.baseName}/${routeParam}/forgot-password`);
  };

  handleRecoverUserName = () => {
    this.setState({
      recoverUsernameView: true,
      validation: {},
      error: null,
    });
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    this.props.history.push(
      `${config.baseName}/${routeParam}/recover-username`
    );
  };

  onCancel = () => {
    this.setState({
      forgotPasswordView: false,
      recoverUsernameView: false,
      validation: {},
      error: null,
      showForgotPasswordMsg: null,
      showResetModal: false
    });
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    this.props.history.push(`${config.baseName}/${routeParam}`);
  };

  processForgotPassword = () => {
    const { loginId } = this.state;
    const routeParam = (this.props.match.params && this.props.match.params.clientSlug) || "";
    if (loginId && loginId.trim() !== "") {
      this.setState(
        {
          loginProgress: true,
          validation: {},
          error: null,
        },
        async () => {
          await this.props
            .dispatch(forgotPassword({ loginId, consumerSlugUrl: routeParam }))
            .then((response) => {
              if (!response) {
                this.setState({
                  //error: this.props.user.error,
                  validation: { Email: this.props.user.error || "" },
                  loginProgress: false,
                });

                return false;
              }

              const { passwordChangeInfo } = this.props.user;
              if (
                passwordChangeInfo &&
                passwordChangeInfo?.isPasswordMfaRequired
              ) {
                this.setState({
                  alertMessageOTP: this.props.t(
                    "login.notification.alertMessageOTP"
                  ),
                  error: null,
                });
              } else {
                this.setState({
                  loginProgress: false,
                  error: null,
                  alertType: "success",
                  alertMessage:
                    passwordChangeInfo?.message ??
                    this.props.t(
                      "login.notification.Reset password link sent to your email successfully"
                    ),
                  alertTitle: this.props.t(
                    "login.notification.resetPasswordLink"
                  ),
                  alertMessageCallbackType: null,
                });
              }
            });
        }
      );
    } else {
      this.setState({
        validation: { Email: this.props.t("login.error.Email") },
      });
    }
  };

  processRecoverUsername = () => {
    //alert("working");
  };

  render() {
    const {
      loginId,
      password,
      forgotPasswordView,
      recoverUsernameView,
      showUpdatePasswordModal,
      alertMessage,
      alertMessageCallbackType,
      buttonDisabled,
      loginProgress,
      error,
      validation,
      showResetModal,
      showForgotPasswordMsg,
      alertMessageOTP,
      alertTitle,
    } = this.state;
    const { classes, user } = this.props;
    const brandInfo = user?.brandInfo ?? {};
    const showLoginView = this.props.user.isLoggedIn;
    const routeParam = (this.props.match.params && this.props.match.params.clientSlug) || "";
    let isSSO = sessionStorage.getItem(`isSSO_${routeParam}`);
    if (showLoginView) return null;
    if (!routeParam) return null;

    return (
      <>
        {isSSO == true || isSSO == "true" ? (
          <Box alignItems="center" bgcolor="secondary.main" display="flex">
            <SSOLogout />
          </Box>
        ) : (
          <Box
            bgcolor="secondary.main"
            alignItems="center"
            display="flex"
            height={1}
          >
            <Grid container className={classes.root}>
              <Grid item xs={12} md={6} lg={5}>
                {/*config.willTranslate && (
              <Grid item style={{ textAlign: "right", marginRight: 20 }}>
                <Box className={classes.rightNavContainer}>
                  <Box p={1} className={classes.rightNavIconContainer}>
                    <Button
                      ref={langAnchorEl}
                      aria-controls={
                        langMenuOpen ? "menu-list-grow" : undefined
                      }
                      aria-haspopup="true"
                      variant="text"
                      onClick={this.handleLangToggle}
                    >
                      {this.props.i18n.language &&
                        this.props.i18n.language.toUpperCase()}
                      <ArrowDropDownIcon />
                    </Button>
                    <Popper
                      open={langMenuOpen}
                      anchorEl={langAnchorEl}
                      role={undefined}
                      transition
                      disablePortal
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin:
                              placement === "bottom"
                                ? "center top"
                                : "center bottom",
                          }}
                        >
                          <Paper>
                            <ClickAwayListener
                              onClickAway={this.handleLangClose}
                            >
                              <MenuList
                                autoFocusItem={langMenuOpen}
                                id="menu-list-grow"
                                onKeyDown={this.handleListKeyDown}
                              >
                                {user.slList &&
                                  user.slList.map((lang, index) => (
                                    <MenuItem
                                      key={`${lang}-${index}`}
                                      value={lang.code}
                                      onClick={(event) =>
                                        this.handleLanguageChange(
                                          event,
                                          lang.code
                                        )
                                      }
                                    >
                                      {`${
                                        lang.description
                                      } (${lang.code.toUpperCase()})`}
                                    </MenuItem>
                                  ))}
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </Box>
                </Box>
              </Grid>
                                      )*/}
                {showResetModal ? (
                  <PasswordExpired
                    userName={loginId}
                    history={this.props.history}
                    getConsumerDetails={this.getConsumerDetails}
                    onCancel={this.onCancel}
                    {...this.props}
                  />
                ) : (
                  <Box display="flex" justifyContent="center" w={1}>
                    {forgotPasswordView ? (
                      <ForgotPassword
                        credentials={{ Email: loginId }}
                        handleChange={this.handleChange}
                        onSubmit={this.processForgotPassword}
                        onCancel={this.onCancel}
                        updateProgress={loginProgress}
                        error={error}
                        validation={validation}
                        buttonDisabled={buttonDisabled}
                        brandInfo={brandInfo}
                      />
                    ) : recoverUsernameView ? (
                      <RecoverUsername
                        brandInfo={brandInfo}
                        onCancel={this.onCancel}
                        history={this.props.history}
                        {...this.props}
                      />
                    ) : !showLoginView ? (
                      <LoginView
                        credentials={{ Email: loginId, Password: password }}
                        handleChange={this.handleChange}
                        onSubmit={this.processLogin}
                        handleForgotPassword={this.handleForgotPassword}
                        handleRecoverUserName={this.handleRecoverUserName}
                        handleRecaptcha={this.handleRecaptcha}
                        updateProgress={loginProgress}
                        error={error}
                        validation={validation}
                        buttonDisabled={buttonDisabled}
                        brandInfo={brandInfo}
                        routeParam={routeParam}
                      />
                    ) : null}
                  </Box>
                )}
              </Grid>
              {/* <Grid item xs={12} md={6} lg={6} className={classes.leftWrap}>
              <Box display="flex" mt={2}></Box>
            </Grid> */}

              {alertMessage &&
                this.renderAlertMessage(
                  alertTitle ?? "",
                  alertMessage,
                  alertMessageCallbackType
                )}
              {alertMessageOTP &&
                this.renderOTPAlertMessage("", alertMessageOTP)}
              {showForgotPasswordMsg &&
                this.showForgotPasswordAlertMessage(
                  alertTitle ?? "",
                  showForgotPasswordMsg,
                  alertMessageCallbackType
                )}
            </Grid>

            <Modal open={showUpdatePasswordModal} onClose={() => null}>
              <Paper className="update-password-modal-container">
                <Grid container justify="center">
                  <Grid item sm={6} xs={12}>
                    <FirstLogin
                      error={this.props.user.error}
                      processReset={this.processReset}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Modal>
          </Box>
        )}

        {/* <Box> */}
        <Footer {...this.props} />
        {/* </Box> */}
      </>
    );
  }

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <SuccessDialog
        open={Boolean(message)}
        dialogText={message}
        dialogIcon={StepDoneIcon}
        dialogTitle={title}
        buttonName={this.props.t("updatedAccounts.buttonLabel.okay")}
        handleDialogClose={() => {
          this.hideAlertMessage();
        }}
      />
    );
  };

  showForgotPasswordAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => this.handleForgotPassword()}
      />
    );
  };

  renderOTPAlertMessage = (title, message) => {
    return (
      <AlertDialog
        px={1.3}
        py={1.3}
        dialogClassName={"alert-dialoge-otp"}
        title={title}
        message={message}
        onConfirm={() => this.handleOTPAlertMessage()}
      />
    );
  };
}

export default connect((state) => ({ ...state.user, ...state.DFA }))(
  compose(withTranslation("common"), withStyles(styles))(Login)
);
