import React, { Component } from "react";
import { Grid, Box, Typography, Button } from "@material-ui/core";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  genereatePaymentOTP,
  verifyPaymentOTP,
} from "~/redux/actions/paymentAuthentication";
import VerifyOTP from "./VerifyOTP";
import Notification from "~/components/Notification";
import { StopTimer } from "~/config/entityTypes";
import { paymentMethods } from '~/config/paymentMethods';

class VerifyUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      errCode: null,
      progress: 0,
      hasTimeUp: true,
      timer: null,
      typeDFA: null,
      ctaDisabled: false,
      resendCta: true,
      showTimer: false,
      dfaSelectionScreen: true,
      btnDisabled: true,
      notificationMessage: null,
      notificationVariant: null,
    };
  }

  componentDidMount = () => {
    //this.setProgressBar();
    // this.handleGenerateOTP();
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
    const { paymentAuthentication, dispatch } = this.props;
    const { paymentsData } = paymentAuthentication;
    const { typeDFA } = this.state;

    if (paymentsData && paymentsData.length > 0) {
      let arr = [];
      paymentsData &&
        paymentsData.map((item, index) => {
          return arr.push(item.PaymentID);
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
    const { dispatch, t } = this.props;
    const { code } = this.state;
    const data = {
      otp: code,
      nonCdmToken: null,
      // isOtpRequiredForPaymentVerification: Number(cookies.get("@isOtpRequired")),
    };
    if (code.toString().length === 0) {
      this.setState({
        errCode: t("paymentAuthentication.error.enterCode"),
      });
      return false;
    }
    dispatch(verifyPaymentOTP(data)).then((response) => {
      this.handleResponse(response);
    });
  };
  handleResponse = (response) => {
    const { paymentAuthentication } = this.props;
    if (!response) {
      this.setState({
        errCode: paymentAuthentication.error,
        notificationMessage: paymentAuthentication.error || "",
        notificationVariant: "error",
      });
      return false;
    }
    this.setState({
      errCode: null,
    });
    this.props.onBtnClick();
  };
  handleBtnClick = (e) => {
    const { id } = e.currentTarget;
    this.setState({ typeDFA: id });
  };
  generateOTP = () => {
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

  render() {
    const { classes, paymentAuthentication, user, paymentRegistration, t, onCloseIconClick } =
      this.props;
    const {
      code,
      errCode,
      progress,
      hasTimeUp,
      typeDFA,
      ctaDisabled,
      resendCta,
      dfaSelectionScreen,
      btnDisabled,
      notificationMessage,
      notificationVariant,
    } = this.state;
    const { paymentsData } = paymentAuthentication;
    const { isLoggedIn } = user;
    const { consumerPaymentTypesList } = paymentRegistration;
    const isDDCPayment = consumerPaymentTypesList?.data?.allPaymentMethods?.filter((item) => {
      return item.paymentCode === paymentMethods.USBankDepositToDebitcard;
    });
    const isPaymentAuth = consumerPaymentTypesList?.data?.isPaymentAuthRequired;
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
            <Grid item xs md>
              <Box textAlign="center" className={classes.paymentRegCont}>
                <Typography
                  variant="h1"
                  textAlign="center"
                  className={classes.paymentHeading}
                >
                  {t("paymentAuthentication.verifyPayment", {
                    paymentsData: paymentsData && paymentsData[0].PaymentAmount,
                  })}
                </Typography>
                <Box
                  textAlign="center"
                  py={2}
                  width={{ lg: "75%", xs: "90%" }}
                  mx={"auto"}
                >
                  {dfaSelectionScreen && (
                    <Box
                      pt={{ lg: 2, xs: 0 }}
                      width={{ lg: "75%", xs: "100%" }}
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
                      {/* {isLoggedIn && (<Grid item xs={5} sm={4} md={4} lg={3}>
                        <Button
                          onClick={() =>
                            onCloseIconClick ? onCloseIconClick() : null
                          }
                          variant="outlined"
                          color="primary"
                          fullWidth
                        >
                          {t("paymentAuthentication.buttonLabel.later")}
                        </Button>
                      </Grid>)} */}
                      {(isLoggedIn && isDDCPayment && isPaymentAuth === true) ? (
                        <Grid item xs={5} sm={4} md={4} lg={3}>
                          <Button
                          onClick={() =>
                            onCloseIconClick ? onCloseIconClick() : null
                          }
                          variant="outlined"
                          color="primary"
                          fullWidth
                        >
                          {t("paymentAuthentication.buttonLabel.cancel")}
                        </Button>
                        </Grid>
                      ) : (<Grid item xs={5} sm={4} md={4} lg={3}>
                        <Button
                          onClick={() =>
                            onCloseIconClick ? onCloseIconClick() : null
                          }
                          variant="outlined"
                          color="primary"
                          fullWidth
                        >
                          {t("paymentAuthentication.buttonLabel.later")}
                        </Button>
                      </Grid>)}
                      <Grid item xs={5} sm={4} md={4} lg={3}>
                        <Button
                          onClick={() => this.generateOTP()}
                          color="primary"
                          variant="contained"
                          fullWidth
                          disabled={typeDFA === null ? true : false}
                        >
                          {t("dfa.buttonLabel.send")}
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
                      <Grid item xs={5} sm={4} md={4} lg={3}>
                        <Button
                          variant="outlined"
                          disabled={ctaDisabled}
                          fullWidth
                          onClick={() =>
                            this.setState({ dfaSelectionScreen: true })
                          }
                        >
                          {t("dfa.buttonLabel.back")}
                        </Button>
                      </Grid>
                      <Grid item xs={5} sm={4} md={4} lg={3}>
                        <Button
                          onClick={this.handleClick}
                          color="primary"
                          variant="contained"
                          disabled={btnDisabled}
                          fullWidth
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
                    <>{t("paymentAuthentication.heading.noNewPayment")}</>
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
    ...state.paymentRegistration,
  }))(withStyles(styles)(VerifyUser))
);
