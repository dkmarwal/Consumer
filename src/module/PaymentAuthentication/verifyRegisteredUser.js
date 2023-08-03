import React, { Component } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Checkbox,
  IconButton,
} from "@material-ui/core";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  genereatePaymentOTP,
  verifyPaymentOTP,
} from "~/redux/actions/paymentAuthentication";
import CheckBoxChecked from "~/assets/icons/payment_checked.svg";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CloseIcon from "@material-ui/icons/Close";
import SuccessDialog from "~/components/Dialogs/successDialog";
import StepDoneIcon from "~/assets/icons/Step_Done_main.svg";
import VerifyOTP from "./VerifyOTP";
import {
  paymentMethodIds,
  paymentMethodsTimeSpan,
} from "~/config/paymentMethods";
import Notification from "~/components/Notification";
import { StopTimer } from "~/config/entityTypes";

class VerifyRegisteredUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      errCode: null,
      progress: 0,
      hasTimeUp: true,
      timer: null,
      showThankYouPage: false,
      paymentsData: [],
      typeDFA: null,
      ctaDisabled: false,
      resendCta: true,
      paymentId: null,
      dfaSelectionScreen: true,
      btnDisabled: true,
      notificationMessage: null,
      notificationVariant: null,
    };
  }

  componentDidMount = () => {
    //this.setProgressBar();
    // this.handleGenerateOTP();
    const { paymentAuthentication } = this.props;
    const { paymentsData } = paymentAuthentication;
    this.setState({
      paymentsData: paymentsData.map((item, i) => ({
        ...item,
        isChecked: true,
      })),
      paymentId:
        paymentsData && paymentsData.length > 0
          ? paymentsData[0].PaymentTypeID
          : null,
    });
    this.props.setPaymentsRenderFalse();
  };
  getDFAType = (value) => {
    switch (value) {
      case "EMAIL":
        return 1;
      case "SMS":
        return 2;
      case "PHONE":
        return 3;
      default:
        return null;
    }
  };
  handleGenerateOTP = () => {
    const { dispatch } = this.props;
    const { typeDFA, paymentsData } = this.state;

    if (paymentsData && paymentsData.length > 0) {
      let arr = [];
      paymentsData &&
        paymentsData.map((item, index) => {
          return item.isChecked ? arr.push(item.PaymentID) : null;
        });
      const data = {
        paymentIds: arr,
        otpPreference: this.getDFAType(typeDFA),
        nonCdmToken: null, // null in case of user logged in or guest user
      };
      dispatch(genereatePaymentOTP(data)).then((response) => {
        if (!response) {
          this.setState({
            hasTimeUp: true,
            ctaDisabled: false,
            resendCta: false,
            typeDFA: null,
            dfaSelectionScreen: true,
            notificationMessage: this.props.paymentAuthentication.error || "",
            notificationVariant: "error",
          });
          return false;
        }
        this.setState(
          {
            errCode: null,
            hasTimeUp: false,
            progress: 0,
            dfaSelectionScreen: false,
          },
          () => {
            this.setProgressBar();
          }
        );
      });
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
  handleClick = () => {
    const { code, paymentsData } = this.state;
    const { t } = this.props;
    let ids = [];
    paymentsData.forEach(function (item, index) {
      if (item.isChecked) {
        ids.push(item.PaymentID);
      }
    });
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    //const showVerifyData = Boolean(Number(cookies.get(`@isOtpRequired_${routeParam}`)));
    const showVerifyData = Boolean(
      Number(sessionStorage.getItem(`@isOtpRequired_${routeParam}`))
    );

    const data = {
      otp: code.toString().length === 0 ? null : code,
      nonCdmToken: null,
      paymentIds: ids,
      isOtpRequiredForPaymentVerification: Number(
        //cookies.get(`@isOtpRequired_${routeParam}`)
        sessionStorage.getItem(`@isOtpRequired_${routeParam}`)
      ),
    };

    if (showVerifyData && code.toString().length === 0) {
      this.setState({
        errCode: t("paymentAuthentication.error.enterCode"),
        notificationMessage: t("paymentAuthentication.error.enterCode") || "",
        notificationVariant: "error",
      });
      return false;
    }
    if (ids.length === 0) {
      this.setState({
        errCode: t("paymentAuthentication.error.selectonePayment"),
        notificationMessage: t("paymentAuthentication.error.selectonePayment"),
        notificationVariant: "error",
      });
      return false;
    }
    this.props.dispatch(verifyPaymentOTP(data)).then((response) => {
      this.handleResponse(response);
    });
  };
  handleResponse = (response) => {
    const { paymentAuthentication } = this.props;
    if (!response) {
      this.setState({
        errCode: paymentAuthentication.error || "",
        notificationMessage: paymentAuthentication.error || "",
        notificationVariant: "error",
      });
      return false;
    }
    // this.deleteCookie("@isOtpRequired");
    this.setState({
      errCode: null,
      showThankYouPage: true,
    });
  };
  handleCheck = (e) => {
    const { paymentsData } = this.state;
    this.setState({
      paymentsData: paymentsData.map((item, i) =>
        item.PaymentID == e.target.id
          ? {
            ...item,
            isChecked: e.target.checked,
          }
          : item
      ),
    });
  };

  handleBtnClick = (e) => {
    const { id } = e.currentTarget;
    this.setState({ typeDFA: id });
  };
  generateOTP = () => {
    const { paymentsData } = this.state;
    const { t } = this.props;
    let ids = [];
    paymentsData.forEach(function (item, index) {
      if (item.isChecked) {
        ids.push(item.PaymentID);
      }
    });
    if (ids.length === 0) {
      this.setState({
        errCode: t("paymentAuthentication.error.selectonePayment"),
        notificationMessage: t("paymentAuthentication.error.selectonePayment"),
        notificationVariant: "error",
      });
      return false;
    }
    this.setState(
      {
        hasTimeUp: false,
        ctaDisabled: true,
        resendCta: true,
        progress: 0,
        showTimer: true,
        btnDisabled: true,
        code: "",
      },
      () => {
        this.handleGenerateOTP();
      }
    );
  };
  getThankYouMessages = (paymentType, t) => {
    switch (paymentType) {
      case paymentMethodIds.CHK:
        return t("paymentAuthentication.dashboard.verifySuccessMsg.check", {
          timeRequired: paymentMethodsTimeSpan.CHK,
        });
      case paymentMethodIds.ACH:
        return t("paymentAuthentication.dashboard.verifySuccessMsg.ach", {
          timeRequired: paymentMethodsTimeSpan.ACH,
        });
      case paymentMethodIds.PPL:
        return t("paymentAuthentication.dashboard.verifySuccessMsg.paypal", {
          timeRequired: paymentMethodsTimeSpan.PPL,
        });
      case paymentMethodIds.MSC:
        return t(
          "paymentAuthentication.dashboard.verifySuccessMsg.directDeposit",
          {
            timeRequired: paymentMethodsTimeSpan.MSC,
          }
        );
      case paymentMethodIds.CXC:
        return t("paymentAuthentication.dashboard.verifySuccessMsg.zelle", {
          timeRequired: paymentMethodsTimeSpan.CXC,
        });
      default:
        return "";
    }
  };
  render() {
    const { classes, paymentAuthentication, openAuthModal, t } = this.props;
    const {
      code,
      errCode,
      progress,
      hasTimeUp,
      showThankYouPage,
      paymentsData,
      typeDFA,
      paymentId,
      ctaDisabled,
      resendCta,
      dfaSelectionScreen,
      btnDisabled,
      notificationMessage,
      notificationVariant,
    } = this.state;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    //const showVerifyData = Boolean(Number(cookies.get(`@isOtpRequired_${routeParam}`)));
    const showVerifyData = Boolean(
      Number(sessionStorage.getItem(`@isOtpRequired_${routeParam}`))
    );

    if (showThankYouPage) {
      return (
        <SuccessDialog
          open={Boolean(showThankYouPage)}
          dialogText={this.getThankYouMessages(paymentId, t)}
          dialogIcon={StepDoneIcon}
          dialogTitle={t("paymentAuthentication.dashboard.verifySuccessTitle")}
          buttonName={t("updatedAccounts.buttonLabel.okay")}
          handleDialogClose={() => {
            this.setState({
              showThankYouPage: false,
            });
            this.props.onBtnClick();
          }}
        />
      );
    }

    return (
      <>
        {notificationMessage && (
          <Notification
            variant={notificationVariant}
            message={notificationMessage}
            handleClose={() => {
              this.setState({
                notificationMessage: null,
                notificationVariant: null,
              });
            }}
          />
        )}
        {paymentsData && paymentsData.length > 0 ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={classes.rootContainer}
          >
            <Grid item xs sm md={7} lg={7} xl={7}>
              <Box
                textAlign="center"
                justifyContent="center"
                className={classes.paymentRegCont}
              >
                <Box display="flex">
                  <Box py={2} flexGrow={1} mr="-46px">
                    <img
                      src={require(`~/assets/icons/vpn_key.svg`)}
                      alt={"VPN KEY"}
                    />
                  </Box>
                  <Box py={1}>
                    <IconButton onClick={this.props.onCancelClick}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography
                  variant="h1"
                  textAlign="center"
                  className={classes.paymentHeading}
                  gutterBottom
                >
                  {t("paymentAuthentication.dashboard.verifyPaymentTitle")}
                </Typography>
                {dfaSelectionScreen && (
                  <Box
                    pt={{ xs: 2, sm: 2, md: 1, lg: 1 }}
                    px={2}
                    width={{ lg: "75%", xs: "100%" }}
                    mx="auto"
                  >
                    <Typography
                      variant="span"
                      textAlign="center"
                      gutterBottom
                      className={classes.codeBox}
                    >
                      {t("paymentAuthentication.dashboard.verifyPaymentText")}
                    </Typography>
                  </Box>
                )}
                <Box
                  textAlign="center"
                  pb={2}
                  width={{ lg: "75%", xs: "90%" }}
                  mx={"auto"}
                >
                  {dfaSelectionScreen && (
                    <>
                      <Box
                        py={2}
                        borderBottom={
                          showVerifyData ? "1px dashed #9E9E9E" : "none"
                        }
                      >
                        <Grid container justifyContent="center">
                          {paymentsData &&
                            paymentsData.length > 0 &&
                            paymentsData.map((s, index) => (
                              <>
                                <Grid item xs={6} lg={3}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checkedIcon={
                                          <img
                                            src={CheckBoxChecked}
                                            alt="Checked_Checkbox"
                                          />
                                        }
                                        id={s.PaymentID}
                                        name="amount"
                                        checked={s.isChecked}
                                        onChange={(event) =>
                                          this.handleCheck(event)
                                        }
                                      />
                                    }
                                    className={classes.paymentCheckbox}
                                    label={`$ ${s.PaymentAmount}`}
                                  />
                                </Grid>
                              </>
                            ))}
                        </Grid>
                      </Box>
                      {showVerifyData && (
                        <Box
                          py={2}
                          width={{ lg: "75%", xs: "90%" }}
                          mx={"auto"}
                        >
                          <Typography
                            variant="span"
                            textAlign="center"
                            gutterBottom
                            className={classes.codeBox}
                          >
                            {t("dfa.message.MFAText")}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                  {showVerifyData && (
                    <VerifyOTP
                      paymentsData={paymentsData}
                      typeDFA={typeDFA}
                      ctaDisabled={ctaDisabled}
                      handleBtnClick={this.handleBtnClick}
                      code={code}
                      generateOTP={this.generateOTP}
                      onCodeChange={(e) => {
                        const val = e.target.value;
                        this.setState({
                          code: val,
                          errCode: null,
                          btnDisabled: val.length === 6 ? false : true,
                        });
                      }}
                      hasTimeUp={hasTimeUp}
                      progress={progress}
                      resendCta={resendCta}
                      errCode={errCode}
                      dfaSelectionScreen={dfaSelectionScreen}
                    />
                  )}
                  {dfaSelectionScreen ? (
                    <Grid
                      container
                      justifyContent="center"
                      xs={12}
                      md={12}
                      lg={12}
                      xl={12}
                      spacing={2}
                      style={{ marginTop: "8px" }}
                    >
                      <Grid
                        item
                        xs={this.props.i18n.language !== "en" ? 8 : 6}
                        sm={4}
                        md={4}
                        lg={3}
                        xl={2}
                      >
                        <Button
                          onClick={this.props.onCancelClick}
                          variant="outlined"
                          color="primary"
                          fullWidth
                        >
                          {openAuthModal
                            ? t("paymentAuthentication.buttonLabel.later")
                            : t("paymentAuthentication.buttonLabel.cancel")}
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={
                          this.props.i18n.language === "fr" && !showVerifyData
                            ? 10
                            : 6
                        }
                        sm={
                          this.props.i18n.language === "fr" && !showVerifyData
                            ? 6
                            : 4
                        }
                        md={
                          this.props.i18n.language === "fr" && !showVerifyData
                            ? 6
                            : 4
                        }
                        lg={
                          this.props.i18n.language === "fr" && !showVerifyData
                            ? 5
                            : 3
                        }
                        xl={2}
                      >
                        <Button
                          onClick={() =>
                            showVerifyData === false
                              ? this.handleClick()
                              : this.generateOTP()
                          }
                          color="primary"
                          fullWidth
                          variant="contained"
                          disabled={
                            showVerifyData === false
                              ? false
                              : typeDFA === null
                                ? true
                                : false
                          }
                        >
                          {showVerifyData
                            ? t("dfa.buttonLabel.send")
                            : t("paymentAuthentication.buttonLabel.submit")}
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      justifyContent="center"
                      xs={12}
                      md={12}
                      lg={12}
                      xl={12}
                      spacing={2}
                      style={{ marginTop: "8px" }}
                    >
                      <Grid item xs={5} sm={4} md={4} lg={3} xl={2}>
                        <Button
                          variant="outlined"
                          fullWidth
                          // color="primary"
                          disabled={ctaDisabled}
                          // className={classes.continueBtn}
                          onClick={() =>
                            this.setState({ dfaSelectionScreen: true })
                          }
                        >
                          {t("dfa.buttonLabel.back")}
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={this.props.i18n.language === "fr" ? 10 : 5}
                        sm={this.props.i18n.language === "fr" ? 6 : 4}
                        md={this.props.i18n.language === "fr" ? 8 : 4}
                        lg={this.props.i18n.language === "fr" ? 5 : 3}
                        xl={this.props.i18n.language === "fr" ? 3 : 2}
                      >
                        <Button
                          onClick={this.handleClick}
                          fullWidth
                          color="primary"
                          variant="contained"
                          disabled={btnDisabled}
                        // className={classes.continueBtn}
                        >
                          {t("paymentAuthentication.buttonLabel.submit")}
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={12}>
              <Box textAlign="center">
                <Box p={2} className={classes.paymentHeading}>
                  {paymentAuthentication.error ? (
                    paymentAuthentication.error
                  ) : (
                    <>{t("paymentAuthentication.dashboard.NoPaymentsText")}.</>
                  )}
                </Box>
                <Box textAlign="center" pt={2} pl={5}>
                  <Box pt={2}>
                    <img
                      src={require(`~/assets/icons/thankyou_img.svg`)}
                      alt={"Thank You"}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.paymentAuthentication,
  }))(withStyles(styles)(VerifyRegisteredUser))
);
