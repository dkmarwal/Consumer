import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  Modal,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { withTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EventIcon from "@material-ui/icons/Event";
import { compose } from "redux";
import config from "~/config";
import styles from "./styles";
import Button from "~/components/Forms/Button";
import TextField from "~/components/Forms/TextField";
import Notification from "~/components/Notification";
import { CountryIso, CityIso, StatesIso } from "~/components/CSC";
import Phone from "~/components/TextBox/Phone";
import ConsumerEnrollmentRemittance from "~/module/Remittance/ConsumerEnrollment";
import { createPaypal } from "~/redux/actions/paymentRegistration";
import trim from "deep-trim-node";
import { preferencePaymentType } from "~/config/consumerEnrollmentConst";
import { EmailDeliveryModeId } from "~/config/consumerEnrollmentConst";
import VerifyUser from "~/module/PaymentAuthentication/verifyUser";
import { CheckboxGroup } from "~/components/Forms";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import { fetchPaymentsToAuthenticate } from "~/redux/actions/paymentAuthentication";

class DigitalCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      digitalCardInfo: {
        infoType: "email",
        firstName: "",
        lastName: "",
        address1: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
        email: "",
      },
      validation: {},
      openAuthModal: false,
      showEmailInfo: true,
      isLoading: false,
      error: null,
      variant: null,
      isProcessing: false,
      paymentMethodShared: null,
      info: [
        {
          label: this.props.t("paymentRegistration.paypal.label.email"),
          value: "email",
        },
        {
          label: this.props.t("paymentRegistration.paypal.label.phoneNumber"),
          value: "phone",
        },
      ],
    };
  }

  handleChange = (name, e) => {
    const { value } = e.target;
    const { digitalCardInfo } = this.state;
    let finalValue = "";

    switch (name) {
      case "postalCode":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;
      case "phone":
        finalValue = value.phone;
        break;
      case "address1":
      case "address2":
        finalValue= value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "")
        break;
      default:
        finalValue = value;
        break;
    }
    if (name === "country") {
      digitalCardInfo.city = "";
      digitalCardInfo.state = "";
    } else if (name === "state") {
      digitalCardInfo.city = "";
    }
    this.setState({
      digitalCardInfo: { ...digitalCardInfo, [name]: finalValue },
    });
  };

  handleShare = () => {
    const { dispatch, paymentRegistration, paymentAuthentication, t } =
      this.props;
    const {
      selectedRemittanceConfigData,
      isRemittanceEnabled,
      consumerPaymentTypesList,
    } = paymentRegistration;
    const data = trim(this.state.digitalCardInfo);
    const isValid = this.validateForm();
    if (isValid) {
      if (isRemittanceEnabled && !selectedRemittanceConfigData) {
        this.setState({
          variant: "error",
          error: t("paymentRegistration.remittance.deliveryMode"),
        });
      } else {
        this.setState({
          isProcessing: true,
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
        dispatch(
          createPaypal({
            ...data,
            remittanceDetails: remittanceData,
            preferenceType: preferencePaymentType.preferred,
          })
        ).then((response) => {
          if (!response) {
            this.handleErrorNotification("digitalCardInfo");
          } else {
            this.setState(
              {
                isProcessing: false,
                variant: "success",
                error: t("paymentRegistration.ach.successMsg"),
              },
              () => {
                if (consumerPaymentTypesList?.data?.enrollmentLinkId) {
                  dispatch(
                    fetchPaymentsToAuthenticate(
                      {
                        token: consumerPaymentTypesList?.data?.enrollmentLinkId,
                      },
                      false
                    )
                  ).then((response) => {
                    if (!response) {
                      this.setState({
                        variant: "error",
                        error:
                          paymentAuthentication?.error ??
                          t("paymentRegistration.somethingWentWrong"),
                        isProcessing: false,
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
                            paymentRegistration.selectedPaymentTypeCode,
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
    }
    // }
  };
  handleErrorNotification = (errorInAction) => {
    const { paymentRegistration, t } = this.props;
    this.setState({
      variant: "error",
      error:
        paymentRegistration[errorInAction]?.error ??
        t("paymentRegistration.somethingWentWrong"),
      isProcessing: false,
    });
  };
  routeToRegistrationCompletedPage = () => {
    const { paymentRegistration, location } = this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    if (consumerPaymentTypesList?.data?.alternatePaymentMethods.length > 0) {
      this.props.history.push({
        pathname: `${config.baseName}/${routeParam}/paymentRegistration/alternatePayment`,
        state: {
          paymentType: "Paypal",
          preferredMsg: paymentRegistration?.digitalCardInfo?.data?.dynamicMessage,
          preferredFooterMsg: paymentRegistration.digitalCardInfo
            ? paymentRegistration?.digitalCardInfo?.data?.dynamicFooterMessage
            : "",
          isVerified: location?.state?.isVerified || "",
        },
      });
    } else this.pushToThankyouPage();
  };

  pushToThankyouPage = () => {
    const { paymentRegistration } = this.props;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";

    this.props.history.push({
      pathname: `${config.baseName}/${routeParam}/paymentRegistration/complete`,
      state: {
        paymentType: "Paypal",
        dynamicMessage:
          paymentRegistration?.digitalCardInfo?.data?.dynamicMessage || "",
        dynamicFooterMessage:
          paymentRegistration?.digitalCardInfo?.data?.dynamicFooterMessage || "",
        isVerified: true,
      },
    });
  };

  validateForm = () => {
    let valid = true;
    let errorText = {};
    const {
      firstName,
      lastName,
      infoType,
      phone,
      email,
      address1,
      country,
      state,
      city,
      postalCode,
    } = this.state.digitalCardInfo;
    const { t } = this.props;
    if (
      firstName === null ||
      (firstName !== null && firstName.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["firstName"] = t("paymentRegistration.digitalCard.error.firstName");
    }
    if (
      lastName === null ||
      (lastName !== null && lastName.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["lastName"] = t("paymentRegistration.digitalCard.error.lastName");
    }
    if (
      address1 === null ||
      (address1 !== null && address1.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["address1"] = t("paymentRegistration.digitalCard.error.address1");
    }
    if (
      country === null ||
      (country !== null && country.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["country"] = t("paymentRegistration.digitalCard.error.country");
    }
    if (
      state === null ||
      (state !== null && state.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["state"] = t("paymentRegistration.digitalCard.error.state");
    }
    if (
      city === null ||
      (city !== null && city.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["city"] = t("paymentRegistration.digitalCard.error.city");
    }
    if (
      postalCode === null ||
      (postalCode !== null && postalCode.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["postalCode"] = t(
        "paymentRegistration.digitalCard.error.postalCode"
      );
    }
    if (
      infoType === "phone" &&
      phone !== null &&
      phone.toString().trim().length !== 10
    ) {
      if (!phone || !phone?.trim()?.length) {
        valid = false;
        errorText["phone"] = t("paymentRegistration.digitalCard.error.phoneNumber");
      } else if (phone.toString().trim().length !== 10) {
        valid = false;
        errorText["phone"] = t("paymentRegistration.digitalCard.error.phoneLength");
      }
    }
    if (infoType === "email" && email !== null) {
      const userEmail = email !== null && email.toString().trim().toLowerCase();
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (email.toString().trim().length === 0) {
        valid = false;
        errorText["email"] = t("paymentRegistration.digitalCard.error.email");
      } else {
        if (!re.test(userEmail)) {
          valid = false;
          errorText["email"] = t("paymentRegistration.digitalCard.error.emailValid");
        }
      }
    }
    const remittanceEmailError = this.handleRemittanceEmailValidation();
    if (remittanceEmailError) {
      errorText.remittanceEmail = remittanceEmailError;
      valid = false;
    }

    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };
  handleRemittanceEmailError = () => {
    this.setState({
      validation: {
        ...this.state.validation,
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

  handleModalCloseIcon = () => {
    this.setState({
      openAuthModal: false,
    });
    if (this.props.user && this.props.user.isLoggedIn) {
      this.routeToRegistrationCompletedPage();
    }
  };
  render() {
    const {
      digitalCardInfo,
      validation,
      info,
      showEmailInfo,
      isLoading,
      variant,
      error,
      isProcessing,
    } = this.state;
    const {
      classes,
      t,
      paymentRegistration,
      paymentAuthentication,
      token,
      ...otherProps
    } = this.props;
    const { paymentsData } = paymentAuthentication;
    const { consumerPaymentTypesList } = paymentRegistration;
    const { remittanceStatus } = this.props.accounts;
    const loggedIn = this.props.user && this.props.user.isLoggedIn;
    if (isLoading) {
      return (
        <Box display="flex" p={10} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }
    return (
      <>
        <Grid container item>
          <Box pt={2}>
          <Grid container item spacing={2}>
            <Grid item container spacing={2} xs={12} md={12} lg={12}>
              <Grid item xs={12} md={5} lg={5}>
                <TextField
                  label={t("paymentRegistration.digitalCard.label.firstName")}
                  error={validation.firstName}
                  helperText={validation.firstName}
                  value={digitalCardInfo.firstName || ""}
                  name="firstName"
                  inputProps={{
                    maxLength: 35,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={5} lg={5}>
                <TextField
                  label={t("paymentRegistration.digitalCard.label.lastName")}
                  error={validation.lastName}
                  helperText={validation.lastName}
                  value={digitalCardInfo.lastName || ""}
                  name="lastName"
                  inputProps={{
                    maxLength: 35,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={10} lg={10}>
                <TextField
                  label={t("paymentRegistration.digitalCard.label.addressLine1")}
                  error={validation.address1}
                  helperText={validation.address1}
                  value={digitalCardInfo.address1 || ""}
                  name="address1"
                  inputProps={{
                    maxLength: 35,
                  }}
                  onChange={(e) => this.handleChange("address1", e)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={5} lg={5}>
                <CountryIso
                  name="country"
                  label={t("paymentRegistration.label.country")}
                  selectedCountry={(digitalCardInfo && digitalCardInfo.country) || ""}
                  error={validation.country}
                  helperText={validation.country}
                  onChange={(e) => this.handleChange("country", e)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={5} lg={5}>
                <StatesIso
                  name="state"
                  label={t("paymentRegistration.label.state")}
                  error={validation.state}
                  helperText={validation.state}
                  selectedState={(digitalCardInfo && digitalCardInfo.state) || ""}
                  selectedCountry={(digitalCardInfo && digitalCardInfo.country) || ""}
                  onChange={(e) => this.handleChange("state", e)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={5} lg={5}>
                <CityIso
                  name="city"
                  label={t("paymentRegistration.label.city")}
                  error={validation.city}
                  helperText={validation.city}
                  selectedState={(digitalCardInfo && digitalCardInfo.state) || ""}
                  selectedCountry={(digitalCardInfo && digitalCardInfo.country) || ""}
                  selectedCity={(digitalCardInfo && digitalCardInfo.city) || ""}
                  onChange={(e) => this.handleChange("city", e)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={5} lg={5}>
                <TextField
                  required
                  error={validation.postalCode}
                  helperText={validation.postalCode}
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  label={t("paymentRegistration.digitalCard.label.zipCode")}
                  value={(digitalCardInfo && digitalCardInfo.postalCode) || ""}
                  name="postalCode"
                  inputProps={{
                    minLenght: 5,
                    maxLength: 10,
                  }}
                  onChange={(e) => this.handleChange("postalCode", e)}
                />
              </Grid>
              <Grid item xs={12} md={10} lg={10}>
                    <TextField
                      label={t("paymentRegistration.digitalCard.label.email")}
                      error={validation.email}
                      helperText={validation.email}
                      value={digitalCardInfo.email || ""}
                      name="email"
                      inputProps={{
                        maxLength: 100,
                      }}
                      required
                    />
              </Grid>
              {remittanceStatus?.data?.isRemittanceEnabled ? (
                <Grid item xs={12} md={10} lg={10}>
                  <ConsumerEnrollmentRemittance
                    remittanceEmailError={validation.remittanceEmail}
                    handleRemittanceEmailError={this.handleRemittanceEmailError}
                    {...otherProps}
                  />
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          </Box>
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
          <Grid item container xs={12} justifyContent="center">
            {isProcessing ? (
              <Box p={2}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Box p={2}>
                <Button
                  onClick={this.handleShare}
                  className={classes.shareButton}
                  color="primary"
                >
                  {t("paymentRegistration.button.continue")}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        {error && (
          <Notification
            variant={variant}
            message={error}
            handleClose={() => {
              this.setState({ error: false });
            }}
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
}))(compose(withTranslation("common"), withStyles(styles))(DigitalCard));
