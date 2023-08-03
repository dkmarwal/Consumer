import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText, Modal, MenuItem,
  CircularProgress,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styles from "./../styles";
import { resetPassword, fetchSecurityQuestions, fetchSecurityQuestion } from "~/redux/actions/user";
import Notification from "~/components/Notification";
import Footer from "~/components/Footer";
import config from "~/config";
import CustomTextField from "~/components/Forms/CustomTextField";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import { updateLanguage } from "~/redux/actions/user";
import Cookies from "universal-cookie";
import clsx from 'clsx'
import MFA from "~/module/DFA/MFA";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: false,
      buttonDisabled: true,
      confirmPassword: null,
      password: null,
      securityQuestionId: null,
      selectedQuestion: "",
      securityAnswer: null,
      securityQuestionList: null,
      error: null,
      validation: {},
      selectedSecurityQuestion: "",
      gotoLogin: false,
      langAnchorEl: null,
      anchorEl: null,
      langMenuOpen: false,
      alertType: "success", //info/success/error/loading
      alertMessage: null,
      showMFA: false,
      phoneNum: "",
      phoneCode: "",
      otp: null
    };
  }

  componentDidMount = async() => {
	await this.fetchSecurityQuestion();
    this.fetchSQList();
    
  };

  moveToLogin = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    this.props.history.push(`${config.baseName}/${routeParam}`);
  };

  handleToggle = (event) => {
    this.setState({
      menuOpen: !this.state.menuOpen,
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      menuOpen: false,
      anchorEl: null,
    });
  };

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
          //API call to change user selected language
          this.props
            .dispatch(updateLanguage({ locale: langCode }))
            .then((response) => {
              if (!response) {
                return false;
              }
              this.props.i18n.changeLanguage(langCode);
              sessionStorage.setItem(`@consumerLocaleLang_${routeParam}`, this.props.i18n.language);
              this.setState({
                langMenuOpen: false,
              });
              window.location.reload();
            });
        }
      );
    } else {
      this.props.i18n.changeLanguage(langCode);
      sessionStorage.setItem(`@consumerLocaleLang_${routeParam}`, this.props.i18n.language);
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

    fetchSecurityQuestion = () => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const resetCode = params.get('resetCode');
        this.props.dispatch(fetchSecurityQuestion(resetCode)).then((response) => {
            if (!response) {
                this.setState({
                    error: this.props.user.error,
                    alertMessageCallbackType: null,
                    isLoading: false,
                });
                return false;
            }

            this.setState({
                isLoading: false,
                securityQuestionId: this.props?.user?.securityQuestionId || null
            })
        });
    }

  fetchSQList = () => {
	const {securityQuestionId} =  this.state;
    this.props.dispatch(fetchSecurityQuestions()).then((response) => {
      if (!response) {
        this.setState({
          error: this.props.user.error,
          alertMessageCallbackType: null,
          isLoading: false,
        });
        return false;
      }
      const selectedQuestionobj = this.props.user.securityQuestionList.find((item) => item.questionId == securityQuestionId)
      this.setState({
        isLoading: false,
        securityQuestionList: this.props.user.securityQuestionList,
        selectedQuestion: typeof (selectedQuestionobj) !== "undefined" ? selectedQuestionobj["question"] : ""
      });
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validateInput = () => {
    const { password, confirmPassword, securityQuestionId, securityAnswer } = this.state;
    let valid = true;
    let validation = {};

    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!password || !re.test(password.trim())) {
      validation["password"] = this.props.t(
        "login.resetPassword.error.password"
      );
      valid = false;
    }
    /*if (!password || password.length < 8 || password.length > 20) {
      validation["password"] = "Password should be minimum 8 characters";
      valid = false;
    }*/
    if (
      !confirmPassword ||
      confirmPassword !== password ||
      confirmPassword.length === 0
    ) {
      validation["confirmPassword"] = this.props.t(
        "login.resetPassword.error.confirmPassword"
      );
      valid = false;
    }

    if (!securityQuestionId || securityQuestionId === 0) {
      validation["securityQuestionId"] = true;
      valid = false;
    }
    if (!securityAnswer || securityAnswer.length === 0) {
      validation["securityAnswer"] = "Security answer is required";
      valid = false;
    }
    if (
      !securityAnswer ||
      (securityAnswer.length > 0 && securityAnswer.length < 6)
    ) {
      validation["securityAnswer"] =
        "Security answer should be minimum 6 characters is required";
      valid = false;
    }
    this.setState({ validation: { ...validation }, error: null });
    return valid;
  };

  getQueryVar = (key) => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) === key) {
        return decodeURIComponent(pair[1]);
      }
    }
  };
  onSubmit = async (otp) => {
    const isValid = this.validateInput();
    if (isValid) {
      this.setState(
        {
          progress: true,
          error: null,
        },
        async () => {
          const { password, securityQuestionId, securityAnswer } = this.state;
          const token = this.getQueryVar("resetCode");
          const routeParam =
            (this.props.match.params && this.props.match.params.clientSlug) || "";
          this.props
            .dispatch(
              resetPassword({
                password,
                securityQuestionId,
                securityAnswer,
                token: token,
                otp: otp
              })
            )
            .then((response) => {
              if (response.error) {
                if (response.data === "redirect") {
                  this.setState({
                    error: response.message,
                    progress: false,
                    message: response.message,
                    successDialogEnabled: true,
                    variant: "error",
                    //gotoLogin: true, //FSINPAYB2B-10348: commented this line
                  });
                  return false;
                }
                this.setState({
                  error: response.message,
                  progress: false,
                  message: response.message,
                  successDialogEnabled: true,
                  variant: "error",
                });
                return false;
              }
              // Checking for Forgot Password MFA : FSINPAYB2B-11675
              if (response?.data?.isMFAForgotPasswordRequired === 1) {
                this.setState({
                  phoneCode: response?.data?.phoneCountryCode,
                  phoneNum: response?.data?.phoneNumber,
                  showMFA: true,
                })
              } else {
                this.setState({
                  progress: false,
                  buttonDisabled: true,
                  error: null,
                  message: this.props.user.error,
                  variant: "success",
                  alertMessage: this.props.user.error,
                  successDialogEnabled: true,
                  showMFA: false
                }, () => {
                  setTimeout(() => { this.props.history.push(`${config.baseName}/${routeParam}`) }, 10000)
                });
              }

              // this.props.history.push(`${config.baseName}/`);
            });
        }
      );
    }
  };

  render() {
    const {
      password,
      confirmPassword,
      validation,
      successDialogEnabled,
      variant,
      message,
      gotoLogin, showMFA, phoneNum, phoneCode, securityQuestionId, securityQuestionList, securityAnswer, selectedQuestion
    } = this.state;
    const { classes, t, user } = this.props;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    const brandInfo = user?.brandInfo ?? {};
    const clientLogo = brandInfo.logo || null;
    return (
      <>
        <Modal open={showMFA} onClose={() => this.setState({ showMFA: false })}>
          <MFA
            onBtnClick={(otp) => {

              this.onSubmit(otp);
            }}
            onCancelClick={() => this.setState({ showMFA: false })}
            phoneNum={phoneNum}
            phoneCode={phoneCode}
            MFAType={"ForgotPassMFA"}
            resetCode={this.getQueryVar("resetCode")}
          />
        </Modal>
        <Box
          bgcolor="secondary.main"
          alignItems="center"
          display="flex"
          height={1}
        >
          <Grid container className={classes.root}>
            <Grid item xs={12} md={6} lg={5}>
              <Box display="flex" justifyContent="center">
                <Grid item xs="11" sm="6" md="9" lg="8" xl="5">
                  <div className={classes.resetPasswordPaper}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box bgcolor="white">
                        <Grid item lg={12} className={classes.logoLabel}>
                          {clientLogo && (
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              width={1}
                            >
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
                    </Box>
                    <Box display="flex" justifyContent="center" mt={2} mx={1}>
                      <Typography
                        variant="h3"
                        align="center"
                        className={clsx("welcomeHeader", classes.welcomeText)}
                      >
                        
                        {this.props.user.brandInfo.login_welcome_msg}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      width={1}
                    >
                      <Box display="flex" pt={2} justifyContent="center">
                        <Typography variant="body1" className={classes.heading}>
                          {t("login.resetPassword.label.resetPassword")}
                        </Typography>
                      </Box>
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={11} lg={11}>
                            {" "}
                            <CustomTextField
                              required
                              error={validation && validation.password}
                              name="password"
                              id="password"
                              placeholder={t(
                                "login.resetPassword.label.password"
                              )}
                              label={t(
                                "login.resetPassword.label.password"
                              )}
                              type="password"
                              value={password}
                              onChange={this.handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              helperText={
                                validation &&
                                validation.password &&
                                t("login.resetPassword.error.password")
                              }
                              // tooltipProps={tooltipObj}
                              showEyeIcon={true}
                              inputProps={{
                                autocomplete: "new-password",
                                minLength: 8
                              }}
                            />{" "}
                          </Grid>
                          <Grid item xs={1} lg={1} style={{ position: 'relative' }}>
                            <Box mt={2}
                              width={0.05}
                              display="flex"
                              position="absolute"
                              left={{ xs: "8%", }}
                            >
                              <LightTooltip
                                title={
                                  <>
                                    <Typography>
                                      {t(
                                        "signUp.passwordTooltip.passwordRequirements"
                                      )}
                                    </Typography>
                                    <List>
                                      <ListItem
                                        className={classes.listItemsTooltip}
                                      >
                                        <ListItemText>
                                          <span style={{ paddingRight: "4px" }}>
                                            {"\u2022"}
                                          </span>
                                          {t("signUp.passwordTooltip.point1")}
                                        </ListItemText>
                                      </ListItem>
                                      <ListItem
                                        className={classes.listItemsTooltip}
                                      >
                                        <ListItemText>
                                          <span style={{ paddingRight: "4px" }}>
                                            {"\u2022"}
                                          </span>
                                          {t("signUp.passwordTooltip.point2")}
                                        </ListItemText>
                                      </ListItem>
                                      <ListItem
                                        className={classes.listItemsTooltip}
                                      >
                                        <ListItemText>
                                          <span style={{ paddingRight: "4px" }}>
                                            {"\u2022"}
                                          </span>
                                          {t("signUp.passwordTooltip.point3")}
                                        </ListItemText>
                                      </ListItem>
                                      <ListItem
                                        className={classes.listItemsTooltip}
                                      >
                                        <ListItemText>
                                          <span style={{ paddingRight: "4px" }}>
                                            {"\u2022"}
                                          </span>
                                          {t("signUp.passwordTooltip.point4")}
                                        </ListItemText>
                                      </ListItem>
                                      <ListItem
                                        className={classes.listItemsTooltip}
                                      >
                                        <ListItemText>
                                          <span style={{ paddingRight: "4px" }}>
                                            {"\u2022"}
                                          </span>
                                          {t("signUp.passwordTooltip.point5")}
                                        </ListItemText>
                                      </ListItem>
                                    </List>
                                  </>
                                }
                                placement="right"
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={11} lg={11}>
                            <CustomTextField
                              required
                              error={validation && validation.confirmPassword}
                              helperText={
                                validation &&
                                validation.confirmPassword &&
                                t("login.resetPassword.error.confirmPassword")
                              }
                              name="confirmPassword"
                              id="confirmPassword"
                              placeholder={t(
                                "login.resetPassword.label.confirmPassword"
                              )}
                              label={t(
                                "login.resetPassword.label.confirmPassword"
                              )}
                              type="password"
                              value={confirmPassword}
                              onChange={this.handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              showEyeIcon={true}
                              inputProps={{
                                autocomplete: "new-password",
                                minLength: 8
                              }}
                            />
                          </Grid>
                          <Grid item xs={11} lg={11}>
                            <CustomTextField
                              disabled={true}
                              label={t("login.resetPassword.label.securityQuestionId")}
                              required
                              error={validation && validation.securityQuestionId}
                              helperText={
                                validation &&
                                validation.securityQuestionId &&
                                t("login.resetPassword.error.securityQuestionId")
                              }
                              title={selectedQuestion || ""}
                              fullWidth={true}
                              select
                              value={securityQuestionId || ""}
                              autoComplete="off"
                              variant="outlined"
                              name="securityQuestionId"
                              onChange={this.handleChange}
                              isSelect={true}
                            >
                              {securityQuestionList ? (
                                securityQuestionList.map((option) => (
                                  <MenuItem
                                    key={option.questionId}
                                    value={option.questionId}
                                  >
                                    {option.question}
                                  </MenuItem>
                                ))
                              ) : (
                                <Box
                                  width="100px"
                                  display="flex"
                                  mt={1.875}
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <CircularProgress color="primary" />
                                </Box>
                              )}
                            </CustomTextField>
                          </Grid>
                          <Grid item xs={11} lg={11}>
                            <CustomTextField
                              required
                              error={validation && validation.securityAnswer}
                              helperText={
                                validation && validation.securityAnswer
                                  ? securityAnswer && securityAnswer.length === 0
                                    ? t("login.resetPassword.error.empty_securityAnswer")
                                    : t("login.passwordExpired.error.securityAnswer")
                                  : ""
                              }
                              name="securityAnswer"
                              id="securityAnswer"
                              placeholder={t("login.resetPassword.label.securityAnswer")}
                              label={t("login.resetPassword.label.securityAnswer")}
                              type="password"
                              variant="outlined"
                              value={securityAnswer}
                              onChange={this.handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{ minLength: 6 }}
                            />
                          </Grid>
                        </Grid>
                        <Box
                          justifyContent="center"
                          display="flex"
                          alignItems="center"
                          width="170px"
                          mx="auto"
                          mt={2}
                        >
                          <Button
                            disabled={variant === "success"}
                            variant="contained"
                            color="primary"
                            onClick={() => this.onSubmit(null)}
                            size="medium"
                            fullWidth
                          >
                            {t("login.resetPassword.label.save")}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </div>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Footer {...this.props} />
        </Box>
        {successDialogEnabled && (
          <Notification
            variant={variant}
            message={message}
            handleClose={() => {
              this.setState({ successDialogEnabled: false });
              if (variant === "success") {
                this.props.history.push(`${config.baseName}/${routeParam}`);
              }
              if (gotoLogin == true) {
                this.props.history.push(
                  `${config.baseName}/${routeParam}/forgot-password`
                );
              }
            }}
          />
        )}
      </>
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  compose(withTranslation("common"), withStyles(styles))(ResetPassword)
);
