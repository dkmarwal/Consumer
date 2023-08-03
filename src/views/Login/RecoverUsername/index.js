import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import AlertBox from "~/components/Alerts/AlertBox";
import {
  fetchSecurityQuestions, recoverCustomerID,
  fetchConsumerSecurityDetails,
} from "~/redux/actions/user";
import {
  Grid,
  TextField,
  Box,
  Typography,
  Button,
  MenuItem,
  CircularProgress,
  withStyles, Modal,
} from "@material-ui/core";
import Notification from "~/components/Notification";
import clsx from 'clsx'
import { withTranslation } from "react-i18next";
import styles from "./../styles";
import MFA from "~/module/DFA/MFA";

class RecoverUsername extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      // email: null,
      customerID: null,
      securityAnswer: null,
      validation: {},
      alertType: "success", //info/success/error/loading
      alertMessage: null,
      errorMessage: null,
      securityQuestionList: [],
      securityQuestionId: "",
      alertBox: false,
      message: "",
      showMFA: false,
      phoneNum: "",
      phoneCode: "",
      otp: null,
      displaySecurityQues: false,
      selectedQuestion: "",
      disableConsumerId: false
    };
  }

  componentDidMount = () => {
    this.fetchSQList();
  };

  fetchSQList = () => {
    this.props.dispatch(fetchSecurityQuestions()).then((response) => {
      if (!response) {
        this.setState({
          errorMessage: this.props.user.error,
        });
        return false;
      }
      this.setState({
        securityQuestionList: this.props.user.securityQuestionList,
        errorMessage: null,
      });
    });
  };

  postRecoverCustomerID = (otp) => {
    const { customerID, securityQuestionId, securityAnswer } = this.state;
    const routeParam = (this.props.match.params && this.props.match.params.clientSlug) || "";
    const customerData = {
      customerId: customerID,
      securityQuestionIdProvided: securityQuestionId || undefined,
      securityAnswer: securityAnswer || undefined,
      consumerSlugUrl: routeParam || null,
      otp: otp || undefined
    };
    this.props.dispatch(recoverCustomerID(customerData)).then((response) => {
      if (response.error) {
        this.setState({
          errorMessage: this.props.user.error,
          alertMessage: null,
        });
        return false;
      }
      // Checking for Forgot Username MFA : FSINPAYB2B-12144
      if (response?.data?.isMFAForgotUsernameRequired === 1) {
        this.setState({
          phoneCode: response?.data?.phoneCountryCode,
          phoneNum: response?.data?.phone,
          showMFA: true,
        })
      } else {
        this.setState({
          errorMessage: null,
          alertMessage: this.props.user.message,
          showMFA: false
        });
      }

    });
  };
  validateId = (val) => {
    const { brandInfo } = this.props;
    const showSecurityDetails = brandInfo?.showSecurityQuestionForReset === 0 ? false : true;
    const { customerID } = this.state;
    const custLabel = brandInfo.customerIdLabel || this.props.t(
      "login.recoverUsername.placeholder.customerID"
    );
    let validation = {};
    if (!customerID || (customerID && customerID.trim() === "")) {
      validation["customerID"] = this.props.t("login.recoverUsername.error.customerID", { CustomerID: custLabel });
      this.setState({ validation: { ...validation } });
      return false;
    }
    const routeParam = (this.props.match.params && this.props.match.params.clientSlug) || "";
    const customerData = {
      customerId: val,
      consumerSlugUrl: routeParam || null,
    };
    this.props.dispatch(fetchConsumerSecurityDetails(customerData)).then((response) => {
      if (!response) {
        this.setState({
          errorMessage: this.props.user.error,
          alertMessage: null,
        });
        return false;
      }
      const selectedID = this?.props?.user?.securityInfo?.securityQuestionId || "",
        selectedQuestionobj = this.props.user.securityQuestionList.find((item) => item.questionId == selectedID);
      this.setState({
        securityQuestionId: selectedID,
        selectedQuestion: typeof (selectedQuestionobj) !== "undefined" ? selectedQuestionobj["question"] : "",
        displaySecurityQues: showSecurityDetails ? true : false,
        validation: {},
        disableConsumerId: true
      });
    });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  validateForm = () => {
    const { customerID, securityQuestionId, securityAnswer } = this.state;
    const { brandInfo } = this.props;
    const showSecurityDetails = brandInfo?.showSecurityQuestionForReset === 0 ? false : true;
    const custLabel = brandInfo.customerIdLabel || this.props.t(
      "login.recoverUsername.placeholder.customerID"
    );
    let valid = true;
    let validation = {};

    if (!customerID || (customerID && customerID.trim() === "")) {
      validation["customerID"] = this.props.t("login.recoverUsername.error.customerID", { CustomerID: custLabel });
      valid = false;
    }

    if (showSecurityDetails &&
      (!securityQuestionId ||
        (securityQuestionId && securityQuestionId === 0))
    ) {
      validation["securityQuestionId"] = this.props.t(
        "login.recoverUsername.error.securityQuestionId"
      );
      valid = false;
    }
    if (showSecurityDetails &&
      (!securityAnswer ||
        (securityAnswer &&
          securityAnswer.trim().length > 0 &&
          securityAnswer.trim().length < 6))
    ) {
      validation["securityAnswer"] = this.props.t(
        "login.recoverUsername.error.securityAnswer"
      );
      valid = false;
    }

    this.setState({ validation: { ...validation } });
    return valid;
  };

  moveToLogin = () => {
    this.props.onCancel();
    //this.setState({ errorMessage: null, alertMessage: null });
  };

  onSubmit = (otp) => {
    const valid = this.validateForm();
    if (valid) {
      this.postRecoverCustomerID(otp);
    }
  };

  resetNotification = () => {
    this.setState({
      errorMessage: null,
    });
  };

  render() {
    const {
      validation,
      securityQuestionList,
      securityQuestionId,
      customerID,
      alertType,
      securityAnswer,
      alertMessage,
      errorMessage, showMFA, phoneNum, phoneCode, displaySecurityQues, disableConsumerId, selectedQuestion,
    } = this.state;
    const { onCancel, brandInfo, classes, t } = this.props;
    const showSecurityDetails = brandInfo?.showSecurityQuestionForReset === 0 ? false : true;
    const clientLogo = brandInfo.logo || null;
    const routeParam = (this.props.match.params && this.props.match.params.clientSlug) || "";
    const custLabel = brandInfo.customerIdLabel || t(
      "login.recoverUsername.placeholder.customerID"
    );
    return (
      <>
        <Modal open={showMFA} onClose={() => this.setState({ showMFA: false })}>
          <MFA
            onBtnClick={(otp) => this.onSubmit(otp)}
            onCancelClick={() => this.setState({ showMFA: false })}
            phoneNum={phoneNum}
            phoneCode={phoneCode}
            customerID={customerID}
            consumerSlugUrl={routeParam || null}
            MFAType={"ForgotUsernameMFA"}
          />
        </Modal>
        <Grid item xs="11" sm="6" md="9" lg="8" xl="5">
          <div className={classes.recoverUsernamePaper}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Grid item xs={12} md={12} lg={12} className={classes.logoLabel}>
                {clientLogo && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width={1}
                  >
                    <img
                      src={clientLogo}
                      className={classes.imageAvatar || ""}
                      height="34"
                      alt="client logo"
                    />
                  </Box>
                )}
              </Grid>
            </Box>
            <Box display="flex" justifyContent="center" mt={2} mx={1}>
              <Typography variant="h3" align="center" className={clsx("welcomeHeader", classes.welcomeText)}>
                {this.props.user.brandInfo.login_welcome_msg}
              </Typography>
            </Box>
            <Box display="flex" pt={3} pb={2} justifyContent="center" textAlign={"center"} >
              <Typography variant="body1" className={classes.heading}>
                {t("login.recoverUsername.label.fogotUsername")}
              </Typography>
            </Box>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth={true}
                  required
                  error={validation && validation.customerID}
                  helperText={validation && validation.customerID}
                  autoComplete="off"
                  value={customerID || ""}
                  name="customerID"
                  placeholder={custLabel}
                  onChange={this.handleChange}
                  dir="horizontal"
                  size="medium"
                  variant="outlined"
                  inputProps={{
                    maxLength: 50,
                    autocomplete: "new-password",
                  }}
                  label={custLabel}
                  disabled={disableConsumerId}
                />
              </Grid>
              {displaySecurityQues && <>
                <Grid item xs={12}>
                  <TextField
                    label={t(
                      "login.recoverUsername.placeholder.securityQuestionId"
                    )}
                    required
                    error={validation && validation.securityQuestionId}
                    helperText={validation && validation.securityQuestionId}
                    fullWidth={true}
                    select
                    value={securityQuestionId}
                    title={selectedQuestion || ""}
                    SelectProps={{
                      MenuProps: { className: classes.selectDropDown },
                      // classes: {nativeInput: classes.optionQuestionLenght}
                    }}
                    classes={{ root: classes.optionQuestionLenght }}
                    autoComplete="off"
                    variant="outlined"
                    name="securityQuestionId"
                    onChange={this.handleChange}
                    disabled={true}
                  >
                    {securityQuestionList ? (
                      securityQuestionList.map((option) => (
                        <MenuItem
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
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    autoComplete="off"
                    error={validation && validation.securityAnswer}
                    helperText={
                      validation && validation.securityAnswer
                        ? !securityAnswer
                          ? t("login.recoverUsername.error.empty_securityAnswer")
                          : t("login.recoverUsername.error.securityAnswer")
                        : ""
                    }
                    name="securityAnswer"
                    id="securityAnswer"
                    placeholder={t(
                      "login.recoverUsername.placeholder.securityAnswer"
                    )}
                    label={t("login.recoverUsername.placeholder.securityAnswer")}
                    type="password"
                    variant="outlined"
                    value={securityAnswer || ""}
                    onChange={this.handleChange}
                    inputProps={{ minLength: 6, autocomplete: "new-password" }}
                  />
                </Grid>
              </>}
            </Grid>
            <Grid
              container
              style={{ marginTop: "8px" }}
              justifyContent="center"
              spacing={2}
            >
              <Grid item xs={5} sm={4} md={4} lg={5}>
                <Button variant="outlined" onClick={() => onCancel()} fullWidth>
                  {t("login.buttonLabel.cancel")}
                </Button>
              </Grid>
              <Grid item xs={5} sm={4} md={4} lg={5}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => showSecurityDetails && !displaySecurityQues ? this.validateId(customerID) : this.onSubmit()}
                >
                  {t("login.buttonLabel.submit")}
                </Button>
              </Grid>
            </Grid>
          </div>
        </Grid>

        {alertMessage && (
          <AlertBox
            heading={t("login.recoverUsername.label.alertBoxHeading")}
            text={alertMessage}
            icon={alertType}
            open={alertMessage}
            handleClose={() => this.moveToLogin()}
          />
        )}

        {errorMessage ? (
          <Notification
            variant="error"
            message={errorMessage}
            handleClose={() => this.resetNotification()}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}

export default connect((state) => ({ ...state.user, ...state.DFA }))(
  compose(withTranslation("common"), withStyles(styles))(RecoverUsername)
);
