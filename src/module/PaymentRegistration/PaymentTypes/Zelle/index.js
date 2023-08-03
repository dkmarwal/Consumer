import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, CircularProgress, Modal } from "@material-ui/core";
import { TextField, Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Notification from "~/components/Notification";
import Phone from "~/components/TextBox/Phone";
import { connect } from "react-redux";
import { createConsumerZelle } from "~/redux/actions/paymentRegistration";
import config from "~/config";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import ConsumerEnrollmentRemittance from "~/module/Remittance/ConsumerEnrollment";
import { preferencePaymentType } from "~/config/consumerEnrollmentConst";
import { EmailDeliveryModeId } from "~/config/consumerEnrollmentConst";
import VerifyUser from "~/module/PaymentAuthentication/verifyUser";
import { styles } from "./styles";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import { CheckboxGroup } from "~/components/Forms";
import { fetchPaymentsToAuthenticate } from "~/redux/actions/paymentAuthentication";

class Zelle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenType: "email",
      TokenValue: null,
      countryCode: null,
      inProgress: false,
      errMsg: {
        variant: null,
        notificationMsg: null,
        phoneErr: null,
        emailErr: null,
      },
      remittanceEmail: null,
      openAuthModal: false,
      paymentMethodShared: null,
    };
  }

  componentDidMount = () => {
    const { paymentRegistration } = this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
    if (
      consumerPaymentTypesList?.data &&
      !consumerPaymentTypesList.data.getZelleTokenFromConsumer
    ) {
      this.setState({
        tokenType: consumerPaymentTypesList.data.zelleTokenType,
        TokenValue: consumerPaymentTypesList.data.zelleTokenValue,
        countryCode:
          consumerPaymentTypesList.data.zelleTokenType === "phone"
            ? "+1"
            : null,
      });
    }
  };

  handleSelect = (value) => {
    this.setState({
      tokenType: value,
      TokenValue: null,
      countryCode: null,
      errMsg: {
        phoneErr: null,
        emailErr: null,
      },
    });
  };

  handlePhoneChange = (type, e) => {
    this.setState({
      TokenValue: e.target.value.phone,
      countryCode: e.target.value.ccode,
    });
  };

  handleMailChange = (e) => {
    this.setState({
      TokenValue: e.target.value,
    });
  };

  handleRemittanceEmailValidation = () => {
    const { paymentRegistration, t } = this.props;
    const { selectedRemittanceConfigData } = paymentRegistration;
    const reg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      selectedRemittanceConfigData &&
      selectedRemittanceConfigData.remittanceDetails?.find(
        (item) => item.deliveryModeId === EmailDeliveryModeId
      )
    ) {
      if (!selectedRemittanceConfigData.remittanceEmail) {
        return t("paymentRegistration.remittance.emailIdRequired");
      } else if (
        !reg.test(
          String(selectedRemittanceConfigData.remittanceEmail).toLowerCase()
        )
      ) {
        return t("paymentRegistration.remittance.validEmail");
      }
    }
    return false;
  };

  formValidation = () => {
    const { tokenType, TokenValue } = this.state;
    const { t } = this.props;
    const mailRegx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneRegx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    let valid = true;
    let validation = {};
    const remittanceEmailError = this.handleRemittanceEmailValidation();
    let { getZelleTokenFromConsumer } =
      this.props.paymentRegistration?.consumerPaymentTypesList?.data;
    if (getZelleTokenFromConsumer) {
      if (tokenType === "email" && !mailRegx.test(TokenValue)) {
        valid = false;
        validation = {
          ...validation,
          // variant: "error",
          // notificationMsg: "Validation error",
          phoneErr: null,
          emailErr: t("paymentRegistration.zelle.error.emailErr"),
        };
      }
      if (tokenType === "phone" && !phoneRegx.test(TokenValue)) {
        valid = false;
        validation = {
          ...validation,
          // variant: "error",
          // notificationMsg: "Validation error",
          emailErr: null,
          phoneErr: t("paymentRegistration.zelle.error.phoneErr"),
        };
      }
    }

    if (remittanceEmailError) {
      this.setState({
        remittanceEmail: remittanceEmailError,
      });
      valid = false;
    }
    this.setState({
      errMsg: validation,
    });
    return valid;
  };

  onSubmit = () => {
    const { paymentAuthentication, t } = this.props;
    const isValid = this.formValidation();
    const { tokenType, TokenValue, countryCode } = this.state;
    const {
      selectedRemittanceConfigData,
      consumerPaymentTypesList,
      isRemittanceEnabled,
    } = this.props.paymentRegistration;
    let { getZelleTokenFromConsumer } = this.props.paymentRegistration?.consumerPaymentTypesList?.data;
    const preferenceType = preferencePaymentType.preferred;
    if (!Boolean(TokenValue) && getZelleTokenFromConsumer) {
      this.setState({
        errMsg: {
          ...this.state.errMsg,
          phoneErr: t("paymentRegistration.zelle.error.tokenErrPE"),
          emailErr: t("paymentRegistration.zelle.error.tokenErrEmail"),
        },
      });
    } else if (isRemittanceEnabled && !selectedRemittanceConfigData) {
      this.setState({
        errMsg: {
          ...this.state.errMsg,
          variant: "error",
          notificationMsg: t("paymentRegistration.remittance.deliveryMode"),
        },
      });
    } else if (isValid) {
      this.setState(
        {
          inProgress: true,
          remittanceEmail: null,
        },
        () => {
          let remittanceData = null;
          if (selectedRemittanceConfigData) {
            remittanceData = [
              ...selectedRemittanceConfigData.remittanceDetails,
            ];
            const isEmailSelected =
              selectedRemittanceConfigData.remittanceDetails?.findIndex(
                (item) => item.deliveryModeId === EmailDeliveryModeId
              );
            if (isEmailSelected > -1) {
              remittanceData[isEmailSelected].remittanceEmailId =
                selectedRemittanceConfigData.remittanceEmail;
            }
          }
          this.props
            .dispatch(
              createConsumerZelle(
                tokenType, //bugfix FSINPAYB2B-9990
                TokenValue,
                countryCode,
                preferenceType,
                remittanceData
              )
            )
            .then((res) => {
              if (!res) {
                const { error } =
                  this.props.paymentRegistration?.zelleInfo ?? {};
                this.setState({
                  ...this.state,
                  inProgress: false,
                  errMsg: {
                    ...this.state.errMsg,
                    variant: "error",
                    notificationMsg: Boolean(error) && error,
                  },
                });
                return false;
              } else {
                this.setState(
                  {
                    inProgress: false,
                    errMsg: {
                      ...this.state.errMsg,
                      variant: "success",
                      notificationMsg: t("paymentRegistration.ach.successMsg"),
                    },
                  },
                  () => {
                    if (consumerPaymentTypesList?.data?.enrollmentLinkId) {
                      this.props
                        .dispatch(
                          fetchPaymentsToAuthenticate(
                            {
                              token:
                                consumerPaymentTypesList?.data
                                  ?.enrollmentLinkId,
                            },
                            false
                          )
                        )
                        .then((response) => {
                          if (!response) {
                            this.setState({
                              ...this.state,
                              inProgress: false,
                              errMsg: {
                                ...this.state.errMsg,
                                variant: "error",
                                notificationMsg:
                                  paymentAuthentication?.error ??
                                  t("paymentRegistration.somethingWentWrong"),
                              },
                            });
                            return null;
                          } else {
                            const { paymentAuthentication } = this.props;
                            const { paymentsData } = paymentAuthentication;
                            if (
                              consumerPaymentTypesList?.data
                                ?.isPaymentAuthRequired === true &&
                              paymentsData &&
                              paymentsData?.length > 0
                            ) {
                              this.setState({
                                openAuthModal: true,
                                paymentMethodShared:
                                  this.props.paymentRegistration
                                    .selectedPaymentTypeCode,
                              });
                            } else {
                              this.routeToRegistrationCompletedPage();
                            }
                          }
                        });
                    } else {
                      this.routeToRegistrationCompletedPage();
                    }
                  }
                );
              }
            });
        }
      );
    }
    // }
  };

  routeToRegistrationCompletedPage = () => {
    const { consumerPaymentTypesList } = this.props.paymentRegistration;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    if (consumerPaymentTypesList?.data?.alternatePaymentMethods.length > 0) {
      this.props.history.push({
        pathname: `${config.baseName}/${routeParam}/paymentRegistration/alternatePayment`,
        state: {
          paymentType: "Zelle",
          preferredMsg:
            this.props.paymentRegistration.zelleInfo?.data?.dynamicMessage ??
            "",
          preferredFooterMsg:
            this.props.paymentRegistration?.zelleInfo?.data
              ?.dynamicFooterMessage || "",
          isVerified: this.props?.location?.state?.isVerified || "",
        },
      });
    } else this.pushToThankyouPage();
  };

  pushToThankyouPage = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    const { paymentRegistration } = this.props;

    this.props.history.push({
      pathname: `${config.baseName}/${routeParam}/paymentRegistration/complete`,
      state: {
        paymentType: "Zelle",
        dynamicFooterMessage:
          paymentRegistration?.zelleInfo?.data?.dynamicFooterMessage || "",
        dynamicMessage:
          paymentRegistration?.zelleInfo?.data?.dynamicMessage || "",
        isVerified: true,
      },
    });
  };

  closeNotification = () => {
    this.setState({
      ...this.state,
      errMsg: {
        ...this.state.errMsg,
        variant: null,
        notificationMsg: null,
      },
    });
  };

  handleRemittanceEmailError = () => {
    this.setState({
      remittanceEmail: null,
    });
  };

  handleModalCloseIcon = () => {
    this.setState({
      openAuthModal: false,
    });
    if (this.props.user && this.props.user.isLoggedIn) {
      this.routeToRegistrationCompletedPage();
    }
  };

  render() {
    const { classes, t, token, paymentAuthentication, ...otherProps } =
      this.props;
    const { tokenType, TokenValue, inProgress, errMsg, remittanceEmail } =
      this.state;
    const { phoneErr, emailErr, notificationMsg, variant } = errMsg;
    let { getZelleTokenFromConsumer } =
      this.props.paymentRegistration?.consumerPaymentTypesList?.data ?? {};
    const { consumerPaymentTypesList } = this.props.paymentRegistration;
    const { paymentsData } = paymentAuthentication;
    const { remittanceStatus } = this.props.accounts;
    const loggedIn = this.props.user && this.props.user.isLoggedIn;
    return (
      <>
        <Grid container className={classes.container}>
          <>
            <Grid item xs={12}>
              <Box pb={2}>
                <Grid container display="flex" alignItems="center">
                  <Grid item xs={12} lg={8} className={classes.headingCont}>
                    <Typography className={classes.zelleHeading}>
                      {t("paymentRegistration.heading.zelle")}
                    </Typography>
                    <span style={{alignSelf:'center'}}>
                      <LightTooltip
                        title={t("paymentRegistration.tooltipText.zelle", {
                          threshold:
                            consumerPaymentTypesList?.data?.thresholds?.CXC,
                        })}
                        placement="right"
                      />
                    </span>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={9} md={5} lg={6}>
                <CheckboxGroup
                  options={[
                    {
                      label: this.props.t(
                        "paymentRegistration.zelle.label.email"
                      ),
                      value: "email",
                    },
                    {
                      label: this.props.t(
                        "paymentRegistration.zelle.label.phone"
                      ),
                      value: "phone",
                    },
                  ]}
                  selectedOption={tokenType}
                  onChange={(val) => {
                    this.handleSelect(val.value);
                  }}
                  disabled={!getZelleTokenFromConsumer}
                />
              </Grid>
              <Grid item xs={12} md={10} lg={8}>
                {Boolean(tokenType) && tokenType === "phone" ? (
                  <Phone
                    isExt={false}
                    error={Boolean(phoneErr)}
                    helperText={phoneErr}
                    id="phoneNumber"
                    name="phoneNumber"
                    ext=""
                    value={TokenValue}
                    ccode=""
                    prefixCcode="+1"
                    ccodeDisabled={!getZelleTokenFromConsumer}
                    onChange={(e) => this.handlePhoneChange("phone", e)}
                    disabled={!getZelleTokenFromConsumer}
                  />
                ) : (
                  <TextField
                    required
                    id="mailInput"
                    label={t("paymentRegistration.zelle.label.tokenValue")}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    value={TokenValue}
                    onChange={(e) => this.handleMailChange(e)}
                    autoComplete="off"
                    error={Boolean(emailErr)}
                    helperText={emailErr}
                    disabled={!getZelleTokenFromConsumer}
                  />
                )}
              </Grid>

              {remittanceStatus?.data?.isRemittanceEnabled ? (
                <Grid item xs={12} sm md={10} lg={8}>
                  <ConsumerEnrollmentRemittance
                    remittanceEmailError={remittanceEmail}
                    handleRemittanceEmailError={this.handleRemittanceEmailError}
                    {...otherProps}
                  />
                </Grid>
              ) : null}
            </Grid>
          </>
          {paymentsData && paymentsData.length > 0 && (
            <Modal
              disableBackdropClick={loggedIn ? true : false}
              open={this.state.openAuthModal}
              onClose={this.handleModalCloseIcon}
              className={classes.authModal}
            >
              <VerifyUser
                token={token}
                onCloseIconClick={this.handleModalCloseIcon}
                {...otherProps}
                onBtnClick={() => {
                  this.setState({
                    openAuthModal: false,
                  });
                  this.routeToRegistrationCompletedPage();
                }}
              />
            </Modal>
          )}
          <Grid container className={classes.BtnContainer}>
            {inProgress ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                variant="contained"
                className={classes.shareButton}
                onClick={() => this.onSubmit()}
                color="primary"
              >
                {t("paymentRegistration.button.continue")}
              </Button>
            )}
          </Grid>
        </Grid>

        {notificationMsg && (
          <Notification
            variant={variant}
            message={notificationMsg}
            handleClose={() => this.closeNotification()}
          />
        )}
      </>
    );
  }
}

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.paymentAuthentication,
  ...state.accounts,
  ...state.user,
}))(compose(withTranslation("common"), withStyles(styles))(Zelle));