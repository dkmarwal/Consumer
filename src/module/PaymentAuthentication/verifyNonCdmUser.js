import React, { Component } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  genereateNonCDMPaymentOTP,
  verifyNonCDMPaymentOTP,
  fetchPaymentsToAuthenticate
} from "~/redux/actions/paymentAuthentication";
import {
  fetchUSBankPaymentsToAuthenticate,
} from "~/redux/actions/USBank/paymentAuthentication";
import config from "~/config";
import VerifyOTP from "./VerifyOTP";
import { StopTimer } from "~/config/entityTypes";
import { BankType } from '~/config/bankTypes';

class VerifyNonCDMUser extends Component {
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
      isLoading: true,
      dfaSelectionScreen: true,
      btnDisabled: true,
    };
  }
  componentDidMount() {
    //this.setProgressBar();
    this.paymentsToAuthenticate();
  }

  getQueryVar = (key) => {
    const locationPath = window?.location?.pathname ?? ""
    const vars = locationPath?.split('/')
    if (vars?.length) {
      return vars[vars.length - 1]
    }
    return null
  };

  paymentsToAuthenticate = () => {
    const token = (this.props?.match?.params && this.props?.match?.params?.token) || "";
    const { dispatch } = this.props;
    const data = {
      token: token,
    };
    if (token !== null) {
      if(config.bankTypeId === BankType.USBANK) {
        dispatch(fetchUSBankPaymentsToAuthenticate(data, false)).then((response) => {
          if (!response) {
            this.setState({
              isLoading: false,
            });
            return false;
          }
          this.setState({
            isLoading: false,
          });
          // this.handleGenerateOTP();
        });
      }
      else {
        dispatch(fetchPaymentsToAuthenticate(data, false)).then((response) => {
          if (!response) {
            this.setState({
              isLoading: false,
            });
            return false;
          }
          this.setState({
            isLoading: false,
          });
          // this.handleGenerateOTP();
        });
      }
    }
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
    const token = (this.props?.match?.params && this.props?.match?.params?.token) || null;
    const { paymentAuthentication, dispatch } = this.props;
    const { typeDFA } = this.state;
    const { paymentsData } = paymentAuthentication;
    if (paymentsData && paymentsData.length > 0) {
      let arr = [];
      paymentsData &&
        paymentsData.map((item, index) => {
          return arr.push(item.PaymentID);
        });
      const data = {
        paymentIds: arr,
        otpPreference: this.getDFAType(typeDFA),
        nonCdmToken: token, // null in case of user logged in or guest user
      };
      dispatch(genereateNonCDMPaymentOTP(data)).then((response) => {
        if (!response) {
          this.setState({
            hasTimeUp: true,
            ctaDisabled: false,
            resendCta: false,
            typeDFA: null,
            dfaSelectionScreen: true,
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
    const token = (this.props?.match?.params && this.props?.match?.params?.token) || null;
    const { dispatch, t } = this.props;
    const { code } = this.state;
    const data = {
      otp: code,
      token: token,
    };
    if (code.toString().length === 0) {
      this.setState({
        errCode: t("paymentAuthentication.error.enterCode"),
      });
      return false;
    }
    dispatch(verifyNonCDMPaymentOTP(data)).then((response) => {
      this.handleResponse(response);
    });
  };
  handleResponse = (response) => {
    const { paymentAuthentication } = this.props;
    const { paymentsData } = paymentAuthentication;
    if (!response) {
      this.setState({
        errCode: paymentAuthentication.error,
      });
      return false;
    }
    this.setState({
      errCode: null,
    });
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    this.props.history.push({
      pathname: `${config.baseName}/${routeParam}/paymentAuthComplete`,
      state: {
        isNonCDM: true,
        amount:
          paymentsData && paymentsData.length > 0
            ? paymentsData[0].PaymentAmount
            : 0,
        id:
          paymentsData && paymentsData.length > 0
            ? paymentsData[0].PaymentTypeID
            : null,
      },
    });
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
    const { classes, paymentAuthentication, t } = this.props;
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
      isLoading,
    } = this.state;
    const { paymentsData } = paymentAuthentication;

    if (isLoading) {
      return (
        <Backdrop className={this.props.classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }
    return (
      <>
        {paymentsData && paymentsData.length > 0 ? (
          <Grid
            container
            justifyContent="center"
            alignItems="left"
            className={classes.nonCDMContainer}
          >
            <Grid item xs md>
              <Box textAlign="center" className={classes.paymentRegCont}>
                <Box pt={{ xs: 2, lg: 3 }}>
                  <img
                    src={require(`~/assets/icons/vpn_key.svg`)}
                    alt={"VPN KEY"}
                  />
                  <Typography variant="h1" textAlign="center">
                    {t("card.authenticatePayment")}
                  </Typography>
                </Box>

                {dfaSelectionScreen && (
                  <Box py={2} width={{ lg: "75%", xs: "90%" }} mx={"auto"}>
                    <Typography
                      variant="span"
                      textAlign="center"
                      gutterBottom
                      className={classes.codeBox}
                    >
                      {t(
                        "paymentAuthentication.nonCdmAuth.paymentReceivedHeading",
                        {
                          paymentAmount:
                            paymentsData && paymentsData[0].PaymentAmount,
                        }
                      )}
                      . {t("dfa.message.MFAText")}
                    </Typography>
                  </Box>
                )}
                <Box
                  textAlign="center"
                  width={{ lg: "75%", xs: "90%" }}
                  mx={"auto"}
                >
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
                    <Box display="flex" justifyContent="center" py={2}>
                      <Box px={1}>
                        <Button
                          onClick={() => this.generateOTP()}
                          className={classes.shareButton}
                          color="primary"
                          variant="contained"
                          disabled={typeDFA === null ? true : false}
                        >
                          {t("dfa.buttonLabel.send")}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Grid container
                      justifyContent="center"
                      xs={12}
                      md={12}
                      lg={12}
                      xl={12}
                      spacing={2}
                      style={{ marginTop: "8px" }}>
                      <Grid item xs={5} sm={4} md={4} lg={3}>
                        <Button
                          variant="outlined"
                          // className={classes.continueBtn}
                          // color="primary"
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
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={classes.nonCDMContainer}
          >
            <Grid item xs md>
              <Box
                textAlign="center"
                mt={{ xs: 3, lg: "" }}
                className={classes.paymentRegCont}
              >
                <Box p={2} className={classes.paymentHeading}>
                  {paymentAuthentication.error ? (
                    paymentAuthentication.error
                  ) : (
                    <>{t("paymentAuthentication.dashboard.NoPaymentsText")}</>
                  )}
                </Box>
                <Box textAlign="center" p={2}>
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
  }))(withStyles(styles)(VerifyNonCDMUser))
);
