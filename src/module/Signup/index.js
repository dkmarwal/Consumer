import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Button,
  MenuItem,
  Link,
  withStyles,
  Grid,
  TextField as SelectMenuTextField,
  List,
  ListItem,
  ListItemText,
  Backdrop, Modal,
} from "@material-ui/core";
import WhiteCard from "../../components/WhiteCard";
import { withTranslation } from "react-i18next";
import trim from "deep-trim-node";
import TextField from "~/components/Forms/TextField";
import CustomTextField from "~/components/Forms/CustomTextField";
import AlertMessage from "~/components/AlertMessage";
import Notification from "~/components/Notification";
import config from "~/config";
import { consumerDetails } from "~/redux/actions/DFA";
import { fetchSecurityQuestions, login } from "~/redux/actions/user";
import {
  registerUser,
  verifyUsername,
  updateSnackbar
} from "~/redux/actions/consumerRegistration";
import styles from "./styles";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import AlertBox from "~/components/Alerts/AlertBox";
import Phone from "~/components/TextBox/Phone";
import PhoneModal from "~/module/PhoneModal";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      isLoading: false,
      user: {},
      validation: {},
      alertType: "info", //info/success/error/loading
      alertMessage: "",
      btnDisabled: false,
      securityQuestionList: [],
      token: (state && state.token) || null,
      isVerified: (state && state.isVerified) || false,
      isOneTimePayment: (state && state.isOneTimePayment) || false,
      showSSN: (state && state.showSSN) || false,
      alertBox: false,
      consumerInfo: (state && state.consumerInfo) || {},
      showTooltip: false,
      takePhoneDuringEnrollment: (state && state.takePhoneDuringEnrollment) || false,
      openPhoneModal: false
    };
  }

  componentDidMount = () => {
    this.fetchSQList();
  };

  fetchSQList = () => {
    this.props.dispatch(fetchSecurityQuestions()).then((response) => {
      if (!response) {
        this.setState({
          alertMessage: this.props.user.error,
        });
        return false;
      }
      this.setState({
        securityQuestionList: this.props.user.securityQuestionList,
      });
    });
  };

  validateForm = () => {
    const { user, showSSN, takePhoneDuringEnrollment } = this.state;
    const { isPayeeChoicePortal } = this.props.user;
    let valid = true;
    let validationErr = {};
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

    if (!user || !user.userName || user.userName.trim() === "") {
      validationErr["userName"] = this.props.t(
        "signUp.user.error.userNameRequired"
      );
      valid = false;
    } else {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (
        user.userName &&
        user.userName.trim().length > 0 &&
        re.test(user.userName.trim().toLowerCase())
      ) {
        validationErr["userName"] = this.props.t(
          "signUp.user.error.userNameNotEmail"
        );
        valid = false;
      }
      if (
        user.userName &&
        user.userName.trim().length > 0 &&
        user.userName.trim().length < 8
      ) {
        validationErr["userName"] = this.props.t("signUp.user.error.userName");
        valid = false;
      }
    }

    if (
      !user ||
      !user.newPassword ||
      (user.newPassword && user.newPassword.trim() === "")
    ) {
      validationErr["password"] = this.props.t("signUp.user.error.password");
      valid = false;
    }

    if (user && user.newPassword && !re.test(user.newPassword.trim())) {
      validationErr["password"] = this.props.t("signUp.user.error.password");
      valid = false;
    }

    if (!user || !user.confirmPassword || user.confirmPassword.trim() === "") {
      validationErr["confirmPassword"] = this.props.t(
        "signUp.user.error.confirmPasswordRequired"
      );
      valid = false;
    }
    if (user && user.newPassword !== user.confirmPassword) {
      validationErr["confirmPassword"] = this.props.t(
        "signUp.user.error.confirmPassword"
      );
      valid = false;
    }

    if (
      !user ||
      !user.securityQuestionId ||
      (user.securityQuestionId && user.securityQuestionId === 0)
    ) {
      validationErr["securityQuestionId"] = this.props.t(
        "signUp.user.error.securityQuestionId"
      );
      valid = false;
    }
    if (!user?.securityAnswer) {
      validationErr["securityAnswer"] = this.props.t(
        "signUp.user.error.securityAnswerReq"
      );
      valid = false;
    } else if (
      user.securityAnswer &&
      user.securityAnswer.trim().length > 0 &&
      user.securityAnswer.trim().length < 6
    ) {
      validationErr["securityAnswer"] = this.props.t(
        "signUp.user.error.securityAnswer"
      );
      valid = false;
    }

    if (
      showSSN &&
      (!user ||
        !user.ssnNumber ||
        (user.ssnNumber && user.ssnNumber.trim() === "") ||
        user.ssnNumber.trim().length !== 9)
    ) {
      validationErr["ssnNumber"] = this.props.t("signUp.user.error.ssnNumber");
      valid = false;
    }
    if (
      takePhoneDuringEnrollment &&
      (!user ||
        !user.phone ||
        (user.phone && user.phone.trim() === "") ||
        user.phone.trim().length !== 10)
    ) {
      if(isPayeeChoicePortal){ 
        if (user?.phone?.toString().trim().length !== 10) {
        validationErr["phone"] = this.props.t("signUp.user.error.phoneLength");
      }}
      else{ if (!user.phone || !user.phone?.trim()?.length) {
        validationErr["phone"] = this.props.t("signUp.user.error.phoneNumber");
      } else if (user?.phone?.toString().trim().length !== 10) {
        validationErr["phone"] = this.props.t("signUp.user.error.phoneLength");
      }}
      valid = false;
    }
    this.setState({ validation: validationErr });
    return { valid, validationErr };
  };

  handleChange = (field, event) => {
    const { user } = this.state;
    const newUserDetail = { ...user };

    switch (field) {
      case "userName":
        const userName = event.target.value.replace(/[^A-Za-z0-9-,_.@]/g, "");
        newUserDetail[field] = userName;
        break;
      case "securityAnswer":
        const securityAnswer = event.target.value.replace(/[^A-Za-z0-9]/g, "");
        newUserDetail[field] = securityAnswer;
        break;
      case "ssnNumber":
        const ssnNumber = event.target.value.replace(/[^0-9]/g, "");
        newUserDetail[field] = ssnNumber;
        break;
      case "phone":
        const phoneValue = event.target.value;
        newUserDetail["phone"] = phoneValue.phone;
        break;
      default:
        newUserDetail[field] = event.target.value;
        break;
    }

    this.setState({ user: { ...newUserDetail } });
  };

  hideAlertMessage = () => {
    this.setState({ alertMessage: "", alertType: "info" });
  };

  handleAlertClose = () => {
    this.setState(
      {
        alertBox: false,
      },
      () => {
        this.moveToNextScreen();
      }
    );
  };
  getConsumerDetails = () => {
    this.props.dispatch(consumerDetails()).then((response) => {
      if (!response) {
        return false;
      }
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
  renderInfo = () => {
    const { alertType, alertMessage } = this.state;
    switch (alertType) {
      case "error":
        return (
          <AlertMessage
            alertType="error"
            alertTitleMsg={`WARNING: ${alertMessage}`}
          />
        );
      case "loading":
        return (
          <Backdrop className={this.props.classes.backdrop} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        );
      default:
        return (
          <Typography variant="body2">
            {this.props.t("signUp.registerYourself")}
          </Typography>
        );
    }
  };
  handleGuestSubmit = () => {
    const { takePhoneDuringEnrollment } = this.state;
    if (takePhoneDuringEnrollment) {
      this.setState({
        openPhoneModal: true
      })
    } else {
      this.handleGuest();
    }
  }
  handleGuest = () => {
    const { token, isOneTimePayment, consumerInfo, takePhoneDuringEnrollment, user } = this.state;
    if (consumerInfo?.isMFARegistrationRequired === 1) {
      this.setState(
        {
          alertBox: false,
        },
        () => {
          const routeParam =
            (this.props.match.params && this.props.match.params.clientSlug) ||
            "";
          this.props.history.push({
            pathname: `${config.baseName}/${routeParam}/dfa`,
            state: {
              token: token,
              isVerified: true,
              isOneTimePayment: isOneTimePayment,
              clientName: this.props.location.state.clientName,
              paymentAmount: this.props.location.state.paymentAmount,
              consumerSlugUrl: routeParam,
              consumerInfo: consumerInfo,
              isGuestUser: true,
              takePhoneDuringEnrollment: takePhoneDuringEnrollment,
              phone: (user?.phone) || ""
            },
          });
        }
      );
    } else {
      const routeParam =
        (this.props.match.params && this.props.match.params.clientSlug) || "";
      //Redirect to the payment sharing page
      this.props.history.push({
        pathname: `${config.baseName}/${routeParam}/paymentRegistration`,
        state: {
          token: token,
          isVerified: true,
          isOneTimePayment: isOneTimePayment,
          clientName: this.props.location.state.clientName,
          paymentAmount: this.props.location.state.paymentAmount,
          consumerInfo: this.state.consumerInfo,
        },
      });
    }
  };

  handleSubmit = () => {
    let { user, token, consumerInfo, takePhoneDuringEnrollment } = this.state;
    const valid = this.validateForm();
    if (!valid.valid) {
      return false;
    }

    if (this.props.paymentRegistration?.isUsernameValid?.error) {
      this.setState({
        validation: {
          ...valid.validationErr,
          userName: this.props.paymentRegistration.isUsernameValid.error,
        },
      });
      return false;
    }
    if (consumerInfo?.isMFARegistrationRequired === 1) {
      this.setState(
        {
          alertBox: false,
        },
        () => {
          const routeParam =
            (this.props.match.params && this.props.match.params.clientSlug) ||
            "";
          this.props.history.push({
            pathname: `${config.baseName}/${routeParam}/dfa`,
            state: {
              loginId: this.state.user.userName,
              password: this.state.user.newPassword,
              dfaDetails: this.props.user?.dfaDetails,
              clientName: this.props.location.state.clientName,
              paymentAmount: this.props.location.state.paymentAmount,
              token: token,
              user: trim(user),
              consumerSlugUrl: routeParam,
              consumerInfo: consumerInfo,
              isVerified: true,
              takePhoneDuringEnrollment: takePhoneDuringEnrollment,
              phone: (user?.phone) || ""
            },
          });
        }
      );
    } else {
      const routeParam =
        (this.props.match.params && this.props.match.params.clientSlug) || "";

      this.setState(
        {
          alertType: "loading",
          btnDisabled: true,
        },
        () => {
          this.props
            .dispatch(
              registerUser({
                token: token,
                user: trim(user),
                consumerSlugUrl: routeParam,
                otp: null,
              })
            )
            .then(async (response) => {
              if (!response) {
                this.setState({
                  alertType: "error",
                  alertMessage: this.props.user.error,
                  btnDisabled: false,
                });
                return false;
              }
              this.props.dispatch(
                updateSnackbar({
                  message: this.props.t("signUp.successfullyReg"),
                  severity: "success",
                  openSnackbar: true,
                })
              );

              const routeParam =
                (this.props.match.params &&
                  this.props.match.params.clientSlug) ||
                "";
              const creds = {
                userName: this.state.user.userName,
                password: this.state.user.newPassword,
                portalTypeId: 5,
                consumerSlugUrl: routeParam || "",
                isOnboarding: 1,
              };
              this.props.dispatch(login(creds)).then((response) => {
                if (!response) {
                  this.setState({
                    alertType: "error",
                    alertMessage: this.props.user.error,
                    btnDisabled: false,
                  });
                  return false;
                }
                this.getConsumerDetails();
              });
            });
        }
      );
    }
  };

  handleBlurUsername = () => {
    this.props.dispatch(verifyUsername(this.state.user.userName));
  };

  render() {
    const {
      validation,
      securityQuestionList,
      user,
      btnDisabled,
      isVerified,
      isOneTimePayment,
      showSSN,
      alertBox,
      alertMessage,
      alertType,
      takePhoneDuringEnrollment,
      openPhoneModal,
      consumerInfo
    } = this.state;
    const { classes, t } = this.props;
    const { isPayeeChoicePortal } = this.props.user;
    const payeeMesssage = this.renderInfo();
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";

    if (!isVerified) {
      this.props.history.push(`${config.baseName}/${routeParam}/nopagefound`);
    }

    return (
      <Container maxWidth="lg">
        {openPhoneModal && (
          <Modal
            open={openPhoneModal}
            onClose={() => this.setState({ openPhoneModal: false })}
          >
            <PhoneModal
              onBtnClick={(phone) => {
                const { user } = this.state;
                const newUserDetail = { ...user };
                newUserDetail["phone"] = phone;
                this.setState(
                  {
                    showMFA: false,
                    user: { ...newUserDetail }
                  },
                  () => {
                    this.handleGuest();
                  }
                );
              }}
              canCloseModal={isPayeeChoicePortal && true}
              onCancelClick={() => this.setState({ openPhoneModal: false })}
              takePhoneDuringEnrollment={takePhoneDuringEnrollment}
            />
          </Modal>
        )}
        <Box mt={{ xs: 2, md: 4, lg: 4, xl: 4 }} mb={{ md: 4, lg: 4, xl: 4 }}>
          <WhiteCard
            margin="2rem 0 1rem 0"
            padding="1.5rem 4rem 1.5rem 7rem"
            mobMar="1.5rem 0 1rem 0"
          >
            <Box display="flex" mt={{ xs: 0, lg: 1, xl: 1 }} mb={0}>
              <Typography variant="h1" className={classes.primaryTextColor}>
                {t("signUp.payeeRegistration")}
              </Typography>
            </Box>
            <Box
              display="flex"
              mt={2}
              mb={{ xs: 2, lg: 4, xl: 3 }}
              mr={{ xs: 2, lg: 0, xl: 0 }}
              alignItems="center"
            >
              {payeeMesssage}
            </Box>
            {/*content starts here*/}
            {alertBox && (
              <AlertBox
                heading={this.props.t("signUp.registrationComplete")}
                text={alertMessage}
                icon={alertType}
                open={alertBox}
                handleClose={() => this.handleAlertClose()}
                buttonText={t("signUp.buttonLabel.continue")}
              />
            )}

            <Grid container spacing={2}>
              <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                <input
                  type="email"
                  name="userName"
                  style={{ display: "none" }}
                />
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  style={{ display: "none" }}
                />
                <TextField
                  required
                  label={t("signUp.user.label.userName")}
                  error={validation.userName}
                  helperText={validation.userName || ""}
                  fullWidth={true}
                  autoFocus={false}
                  autoComplete="off"
                  variant="outlined"
                  value={(user && user.userName) || ""}
                  name="userName"
                  onChange={(event) => this.handleChange("userName", event)}
                  inputProps={{
                    maxLength: 50,
                    autocomplete: "new-password",
                  }}
                  onBlur={() => this.handleBlurUsername()}
                />
              </Grid>
              <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                <Box mt={2} className={classes.toolTipMobAdjustment}>
                  <LightTooltip
                    title={
                      <List>
                        <ListItem className={classes.listItemsTooltip}>
                          <ListItemText>
                            <span style={{ paddingRight: "4px" }}>
                              {"\u2022"}
                            </span>
                            {t("signUp.usernameTooltip.point1")}
                          </ListItemText>
                        </ListItem>
                        <ListItem className={classes.listItemsTooltip}>
                          <ListItemText>
                            <span style={{ paddingRight: "4px" }}>
                              {"\u2022"}
                            </span>
                            {t("signUp.usernameTooltip.point2")}
                          </ListItemText>
                        </ListItem>
                        <ListItem className={classes.listItemsTooltip}>
                          <ListItemText>
                            <span style={{ paddingRight: "4px" }}>
                              {"\u2022"}
                            </span>
                            {t("signUp.usernameTooltip.point3")}
                          </ListItemText>
                        </ListItem>
                      </List>
                    }
                    placement="top-end"
                  />
                </Box>
              </Grid>

              <Grid item xs={11} sm md lg xl>
                {" "}
                <CustomTextField
                  required
                  label={t("signUp.user.label.password")}
                  error={validation.password}
                  helperText={validation.password || ""}
                  fullWidth={true}
                  autoFocus={false}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onDrag={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  variant="outlined"
                  value={(user && user.newPassword) || ""}
                  name="newPassword"
                  type="password"
                  onChange={(event) => this.handleChange("newPassword", event)}
                  showEyeIcon={true}
                  inputProps={{
                    autocomplete: "new-password",
                  }}
                />
              </Grid>
              <Grid item xs sm md lg xl>
                <CustomTextField
                  required
                  label={t("signUp.user.label.confirmPassword")}
                  error={validation.confirmPassword}
                  helperText={validation.confirmPassword || ""}
                  fullWidth={true}
                  autoFocus={false}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onDrag={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  variant="outlined"
                  value={(user && user.confirmPassword) || ""}
                  name="confirmPassword"
                  type="password"
                  onChange={(event) =>
                    this.handleChange("confirmPassword", event)
                  }
                  showEyeIcon={true}
                  inputProps={{
                    autocomplete: "new-password",
                  }}
                />
              </Grid>

              <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                <Box mt={2} className={classes.toolTipMobAdjustment}>
                  <LightTooltip
                    title={
                      <>
                        <Typography>
                          {t("signUp.passwordTooltip.passwordRequirements")}
                        </Typography>
                        <List>
                          <ListItem className={classes.listItemsTooltip}>
                            <ListItemText>
                              <span style={{ paddingRight: "4px" }}>
                                {"\u2022"}
                              </span>
                              {t("signUp.passwordTooltip.point1")}
                            </ListItemText>
                          </ListItem>
                          <ListItem className={classes.listItemsTooltip}>
                            <ListItemText>
                              <span style={{ paddingRight: "4px" }}>
                                {"\u2022"}
                              </span>
                              {t("signUp.passwordTooltip.point2")}
                            </ListItemText>
                          </ListItem>
                          <ListItem className={classes.listItemsTooltip}>
                            <ListItemText>
                              <span style={{ paddingRight: "4px" }}>
                                {"\u2022"}
                              </span>
                              {t("signUp.passwordTooltip.point3")}
                            </ListItemText>
                          </ListItem>
                          <ListItem className={classes.listItemsTooltip}>
                            <ListItemText>
                              <span style={{ paddingRight: "4px" }}>
                                {"\u2022"}
                              </span>
                              {t("signUp.passwordTooltip.point4")}
                            </ListItemText>
                          </ListItem>
                          <ListItem className={classes.listItemsTooltip}>
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
                    placement="top-end"
                  />
                </Box>
              </Grid>

              <Grid item xs={11} sm={11}>
                <SelectMenuTextField
                  required
                  color="secondary"
                  error={validation.securityQuestionId}
                  helperText={validation.securityQuestionId || ""}
                  select
                  SelectProps={{
                    MenuProps: {
                      classes: {
                        paper: classes.mobHeight,
                        list: classes.mobWidth,
                      },
                    },
                  }}
                  classes={{ root: classes.optionQuestionLenght }}
                  value={(user && user.securityQuestionId) || ""}
                  name="securityQuestionId"
                  label={t("signUp.user.label.securityQuestion")}
                  variant="outlined"
                  fullWidth
                  onChange={(event) =>
                    this.handleChange("securityQuestionId", event)
                  }
                  dir="horizontal"
                >
                  {securityQuestionList ? (
                    securityQuestionList.map((option) => (
                      <MenuItem
                        // className={classes.mobHeight}
                        key={option.questionId}
                        value={option.questionId}
                      >
                        <Box component="div" whiteSpace="normal">
                          {option.question}
                        </Box>
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
                </SelectMenuTextField>
              </Grid>

              <Grid item xs={11} sm={11}>
                <TextField
                  label={t("signUp.user.label.securityAnswer")}
                  error={validation.securityAnswer}
                  required
                  helperText={validation.securityAnswer || ""}
                  value={(user && user.securityAnswer) || ""}
                  name="securityAnswer"
                  variant="outlined"
                  type="password"
                  fullWidth
                  onChange={(event) =>
                    this.handleChange("securityAnswer", event)
                  }
                  dir="horizontal"
                  inputProps={{
                    maxLength: 100,
                    autocomplete: "new-password",
                  }}
                />
              </Grid>

              {showSSN ? (
                <>
                  <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                    <CustomTextField
                      required
                      label={t("signUp.user.label.ssnNumber")}
                      error={validation.ssnNumber}
                      helperText={validation.ssnNumber || ""}
                      value={(user && user.ssnNumber) || ""}
                      name="ssnNumber"
                      variant="outlined"
                      fullWidth
                      onChange={(event) =>
                        this.handleChange("ssnNumber", event)
                      }
                      dir="horizontal"
                      inputProps={{
                        maxLength: 9,
                      }}
                      showEyeIcon={true}
                    />
                  </Grid>

                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                    <Box mt={2} className={classes.toolTipMobAdjustment}>
                      <LightTooltip
                        title={
                          <>
                            <Typography>{t("signUp.ssnTooltip")}</Typography>
                          </>
                        }
                        placement="top-end"
                      />
                    </Box>
                  </Grid>
                </>
              ) : null}
              {takePhoneDuringEnrollment ? (
                <>
                  <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>

                    <Phone
                      error={validation.phone}
                      helperText={validation.phone}
                      required={Boolean(isPayeeChoicePortal)}
                      id="phone"
                      name="phone"
                      value={(user && user.phone) || ""}
                      prefixCcode="+1"
                      onChange={(e) => this.handleChange("phone", e)}
                    />
                  </Grid>
                </>
              ) : null}
              <Grid
                container
                item
                spacing={2}
                justifyContent="center"
                className={classes.guestUserBtn}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    disabled={btnDisabled}
                    onClick={() => this.handleSubmit()}
                  >
                    {t("signUp.buttonLabel.register")}
                  </Button>
                </Grid>
                {isOneTimePayment && (!isPayeeChoicePortal || (isPayeeChoicePortal && !consumerInfo?.isPreEnrolled)) ? (
                  <Grid
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="secondary"
                      style={{
                        minWidth: "165px",
                        textDecoration: "none",
                      }}
                    >
                      <Link
                        style={{ textDecoration: "none" }}
                        className={classes.guestLink}
                        onClick={this.handleGuestSubmit}
                      >
                        {t("signUp.buttonLabel.continueAsGuest")}
                      </Link>
                    </Typography>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </WhiteCard>
        </Box>
        {/*content ends here*/}
      </Container>
    );
  }
  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.hideAlertMessage}
      />
    );
  };
}

export default connect((state) => ({
  ...state.user,
  ...state.DFA,
  ...state.paymentRegistration,
}))(compose(withTranslation("common"), withStyles(styles))(Signup));
