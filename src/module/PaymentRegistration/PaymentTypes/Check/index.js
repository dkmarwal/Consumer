import React, { Component } from "react";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import {
  Grid,
  Typography,
  Button,
  CircularProgress,
  Box,
  Modal,
} from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import ConsumerEnrollmentRemittance from "~/module/Remittance/ConsumerEnrollment";
import { CountryIso, CityIso, StatesIso } from "~/components/CSC";
import { createConsumerCheckInfo } from "~/redux/actions/paymentRegistration";
import { connect } from "react-redux";
import trim from "deep-trim-node";
import Notification from "~/components/Notification";
import config from "~/config";
import { preferencePaymentType } from "~/config/consumerEnrollmentConst";
import { EmailDeliveryModeId } from "~/config/consumerEnrollmentConst";
import { TimeoutDialog } from "~/components/Dialogs";
import VerifyUser from "~/module/PaymentAuthentication/verifyUser";
import { fetchPaymentsToAuthenticate } from "~/redux/actions/paymentAuthentication";

class Check extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkInfo: {
        addressLine1: "",
        addressLine2: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
      },
      validationInfo: {
        addressLine1: false,
        addressLine2: false,
        country: false,
        state: false,
        city: false,
        postalCode: false,
        remittanceEmail: false,
      },
      notificationVariant: "",
      notificationMessage: "",
      processingUpdate: false,
      alertMsg: false,
      openAuthModal: false,
      paymentMethodShared: null,
    };
  }

  handleChange = (name, { target }) => {
    const { value } = target;
    const finalValue =
      name === "postalCode"
        ? value.replace(/[^0-9-]/g, "")
        : ["addressLine1", "addressLine2"].includes(name)
          ? value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "")
          : value;
    const stateValue = name === "country" ? "" : this.state.checkInfo.state;
    const cityValue = ["country", "state"].includes(name)
      ? ""
      : this.state.checkInfo.city;
    this.setState({
      checkInfo: {
        ...this.state.checkInfo,
        state: stateValue,
        city: cityValue,
        [name]: finalValue,
      },
    });

    if (finalValue) {
      const newValidationInfo = {
        ...this.state.validationInfo,
        [name]: false,
      };
      this.setState({ validationInfo: newValidationInfo });
    }
  };

  handleValidation = () => {
    const { t } = this.props;
    const currentValidationInfo = { ...this.state.validationInfo };
    const { addressLine1, country, state, city, postalCode } =
      this.state.checkInfo;
    let isError = false;
    if (!addressLine1 || !addressLine1.trim().length) {
      currentValidationInfo.addressLine1 = t(
        "paymentRegistration.error.addressLine1"
      );
      isError = true;
    }
    if (!country) {
      currentValidationInfo.country = t("paymentRegistration.error.country");
      isError = true;
    }
    if (!state) {
      currentValidationInfo.state = t("paymentRegistration.error.state");
      isError = true;
    }
    if (!city) {
      currentValidationInfo.city = t("paymentRegistration.error.city");
      isError = true;
    }
    if (!postalCode || !postalCode.trim().length) {
      currentValidationInfo.postalCode = t(
        "paymentRegistration.error.postalCode"
      );
      isError = true;
    }
    const remittanceEmailError = this.handleRemittanceEmailValidation();
    if (remittanceEmailError) {
      currentValidationInfo.remittanceEmail = remittanceEmailError;
      isError = true;
    } else {
      currentValidationInfo.remittanceEmail = null;
    }
    this.setState({ validationInfo: currentValidationInfo });
    return isError;
  };

  handleRemittanceEmailError = () => {
    this.setState({
      validationInfo: {
        ...this.state.validationInfo,
        remittanceEmail: null,
      },
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

  routeToRegistrationCompletedPage = () => {
    const { alternateMethod } = this.props;
    const { paymentRegistration, paymentAuthentication } = this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
    const { paymentsData } = paymentAuthentication;
    if (
      consumerPaymentTypesList?.data?.isPaymentAuthRequired === true &&
      paymentsData &&
      paymentsData?.length > 0 &&
      !alternateMethod
    ) {
      this.setState({
        openAuthModal: true,
      });
    } else {
      if (alternateMethod) {
        this.setState({ alertMsg: true }, () => {
          setTimeout(() => {
            this.pushToThankyouPage();
          }, 5000);
        });
      } else {
        this.pushToThankyouPage();
      }
    }
  };

  pushToThankyouPage = () => {
    const { paymentRegistration, alternateMethod, location } = this.props;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    this.props.history.push({
      pathname: `${config.baseName}/${routeParam}/paymentRegistration/complete`,
      state: {
        paymentType: alternateMethod ? location?.state?.paymentType : "Check",
        dynamicMessage: alternateMethod
          ? location?.state?.preferredMsg
          : paymentRegistration.checkInfo?.data?.dynamicMessage,
        dynamicFooterMessage: alternateMethod
          ? location?.state?.preferredFooterMsg
          : paymentRegistration.checkInfo?.data?.dynamicFooterMessage,
        isVerified: true,
      },
    });
  };

  handleCheckInfoSave = (_) => {
    const {
      dispatch,
      paymentRegistration,
      paymentAuthentication,
      alternateMethod,
      t,
    } = this.props;
    const {
      consumerPaymentTypesList,
      isRemittanceEnabled,
      selectedRemittanceConfigData,
    } = paymentRegistration;
    const isError = this.handleValidation();
    if (isError) {
      return false;
    } else if (
      isRemittanceEnabled &&
      !selectedRemittanceConfigData &&
      !alternateMethod
    ) {
      this.setState({
        notificationVariant: "error",
        notificationMessage: t("paymentRegistration.remittance.deliveryMode"),
      });
    } else {
      this.setState({
        processingUpdate: true,
      });
      let remittanceData = null;
      if (selectedRemittanceConfigData) {
        remittanceData = [...selectedRemittanceConfigData.remittanceDetails];
        const isEmailSelected =
          selectedRemittanceConfigData.remittanceDetails?.findIndex(
            (item) => item.deliveryModeId === EmailDeliveryModeId
          );
        if (isEmailSelected > -1) {
          remittanceData[isEmailSelected].remittanceEmailId =
            selectedRemittanceConfigData.remittanceEmail;
        }
      }
      const finalCheckInfoData = trim(this.state.checkInfo);
      dispatch(
        createConsumerCheckInfo({
          ...finalCheckInfoData,
          remittanceDetails: remittanceData,
          preferenceType: alternateMethod
            ? preferencePaymentType.alternate
            : preferencePaymentType.preferred,
        })
      ).then((response) => {
        if (!response) {
          this.handleErrorNotification("checkInfo");
          return null;
        } else {
          this.setState(
            {
              paymentMethodShared: paymentRegistration.selectedPaymentTypeCode,
              processingUpdate: false,
              notificationVariant:
                alternateMethod === undefined ? "success" : "",
              notificationMessage:
                alternateMethod === undefined
                  ? t("paymentRegistration.ach.successMsg")
                  : "",
            },
            () => {
              if (consumerPaymentTypesList?.data?.enrollmentLinkId) {
                dispatch(
                  fetchPaymentsToAuthenticate(
                    { token: consumerPaymentTypesList?.data?.enrollmentLinkId },
                    false
                  )
                ).then((response) => {
                  if (!response) {
                    this.setState({
                      notificationVariant: "error",
                      notificationMessage:
                        paymentAuthentication?.error ??
                        t("paymentRegistration.somethingWentWrong"),
                      processingUpdate: false,
                    });
                    return null;
                  } else {
                    this.routeToRegistrationCompletedPage();
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
    // }
  };

  handleErrorNotification = (errorInAction) => {
    const { paymentRegistration, t } = this.props;
    this.setState({
      notificationVariant: "error",
      notificationMessage:
        paymentRegistration[errorInAction]?.error ??
        t("paymentRegistration.check.message.somethingWentWrong"),
      processingUpdate: false,
    });
  };

  resetNotification = () => {
    this.setState({
      notificationVariant: "",
      notificationMessage: "",
    });
  };

  renderSnackbar = () => {
    const { notificationVariant, notificationMessage } = this.state;
    return (
      <Notification
        variant={notificationVariant}
        message={notificationMessage}
        handleClose={this.resetNotification}
      />
    );
  };

  handleModalCloseIcon = () => {
    this.setState({
      openAuthModal: false,
    });
    if (this.props.user && this.props.user.isLoggedIn) {
      this.pushToThankyouPage();
    }
  };

  render() {
    const {
      t,
      classes,
      paymentRegistration,
      paymentAuthentication,
      token,
      alternateMethod,
      onSkipButton,
      ...otherProps
    } = this.props;
    const { paymentsData } = paymentAuthentication;
    const { remittanceStatus } = this.props.accounts;
    const {
      checkInfo,
      validationInfo,
      notificationMessage,
      processingUpdate,
      alertMsg,
    } = this.state;
    const loggedIn = this.props.user && this.props.user.isLoggedIn;
    return (
      <Grid container>
        <Grid container>
          <Box pb={2} width={1}>
            <Grid container className={classes.headingCont}>
              <Grid item xs={12} lg={12}>
                <Typography className={classes.checkInfoHeading}>
                  {t("paymentRegistration.check.heading.checkInformation")}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Grid container item spacing={2}>
            <Grid item xs={12} md={10} lg={10}>
              <TextField
                name="addressLine1"
                label={t("paymentRegistration.label.addressLine1")}
                required
                value={checkInfo.addressLine1}
                onChange={(e) => this.handleChange("addressLine1", e)}
                inputProps={{
                  maxLength: 75,
                }}
                error={Boolean(validationInfo.addressLine1)}
                helperText={validationInfo.addressLine1}
              ></TextField>
            </Grid>
            <Grid item xs={12} md={10} lg={10}>
              <TextField
                name="addressLine2"
                variant="outlined"
                label={t("paymentRegistration.label.addressLine2")}
                onChange={(e) => this.handleChange("addressLine2", e)}
                value={checkInfo.addressLine2}
                inputProps={{
                  maxLength: 75,
                }}
              />
            </Grid>

            <Grid item xs={12} md={5} lg={5}>
              <CountryIso
                name="country"
                label={t("paymentRegistration.label.country")}
                selectedCountry={checkInfo.country}
                onChange={(e) => this.handleChange("country", e)}
                error={Boolean(validationInfo.country)}
                helperText={validationInfo.country}
                required
              />
            </Grid>

            <Grid item xs={12} md={5} lg={5}>
              <StatesIso
                name="state"
                label={t("paymentRegistration.label.state")}
                error={Boolean(validationInfo.state)}
                helperText={validationInfo.state}
                selectedState={checkInfo.state}
                selectedCountry={checkInfo.country}
                onChange={(e) => this.handleChange("state", e)}
                required
              />
            </Grid>

            <Grid item xs={12} md={5} lg={5}>
              <CityIso
                name="city"
                label={t("paymentRegistration.label.city")}
                error={Boolean(validationInfo.city)}
                helperText={validationInfo.city}
                selectedState={checkInfo.state}
                selectedCountry={checkInfo.country}
                selectedCity={checkInfo.city}
                onChange={(e) => this.handleChange("city", e)}
                required
              />
            </Grid>
            <Grid item xs={12} md={5} lg={5}>
              <TextField
                variant="outlined"
                label={t("paymentRegistration.label.postalCode")}
                required
                value={checkInfo.postalCode}
                onChange={(e) => this.handleChange("postalCode", e)}
                name="postalCode"
                inputProps={{
                  maxLength: 10,
                }}
                error={Boolean(validationInfo.postalCode)}
                helperText={validationInfo.postalCode}
              />
            </Grid>
            {remittanceStatus?.data?.isRemittanceEnabled && !alternateMethod ? (
              <Grid item xs={12} md={10} lg={10}>
                <ConsumerEnrollmentRemittance
                  remittanceEmailError={validationInfo.remittanceEmail}
                  handleRemittanceEmailError={this.handleRemittanceEmailError}
                  {...otherProps}
                />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
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
                this.pushToThankyouPage();
              }}
            />
          </Modal>
        )}
        <Grid container className={classes.actionButtonCont}>
          {alternateMethod && (
            <Grid item style={{ padding: "8px" }}>
              <Button className={classes.linkBtn} onClick={onSkipButton}>
                {t("paymentRegistration.alternatePayment.skip")}
              </Button>
            </Grid>
          )}
          <Grid item className={classes.buttonGridItems}>
            {processingUpdate ? (
              <Box p={2}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className={classes.checkShareButton}
                onClick={(e) => this.handleCheckInfoSave(e)}
              >
                {t("paymentRegistration.buttonLabel.continue")}
              </Button>
            )}
          </Grid>
        </Grid>
        {notificationMessage && this.renderSnackbar()}
        {alertMsg ? (
          <TimeoutDialog
            open={alertMsg}
            msgText={t(
              "paymentRegistration.check.message.checkAlternateMethod"
            )}
          />
        ) : null}
      </Grid>
    );
  }
}

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.paymentAuthentication,
  ...state.accounts,
  ...state.user,
}))(withStyles(styles)(Check));
