import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  Modal,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { withTranslation } from "react-i18next";
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

class PayPal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paypalInfo: {
        infoType: "email",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
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
    const { paypalInfo } = this.state;
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
      paypalInfo.city = "";
      paypalInfo.state = "";
    } else if (name === "state") {
      paypalInfo.city = "";
    }
    this.setState({
      paypalInfo: { ...paypalInfo, [name]: finalValue },
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
    const data = trim(this.state.paypalInfo);
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
            this.handleErrorNotification("payPalInfo");
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
          preferredMsg: paymentRegistration?.payPalInfo?.data?.dynamicMessage,
          preferredFooterMsg: paymentRegistration.payPalInfo
            ? paymentRegistration?.payPalInfo?.data?.dynamicFooterMessage
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
          paymentRegistration?.payPalInfo?.data?.dynamicMessage || "",
        dynamicFooterMessage:
          paymentRegistration?.payPalInfo?.data?.dynamicFooterMessage || "",
        isVerified: true,
      },
    });
  };

  validateForm = () => {
    let valid = true;
    let errorText = {};
    const {
      infoType,
      phone,
      email,
      address1,
      country,
      state,
      city,
      postalCode,
    } = this.state.paypalInfo;
    const { t } = this.props;
    if (
      address1 === null ||
      (address1 !== null && address1.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["address1"] = t("paymentRegistration.paypal.error.address1");
    }
    if (
      country === null ||
      (country !== null && country.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["country"] = t("paymentRegistration.paypal.error.country");
    }
    if (
      state === null ||
      (state !== null && state.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["state"] = t("paymentRegistration.paypal.error.state");
    }
    if (
      city === null ||
      (city !== null && city.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["city"] = t("paymentRegistration.paypal.error.city");
    }
    if (
      postalCode === null ||
      (postalCode !== null && postalCode.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["postalCode"] = t(
        "paymentRegistration.paypal.error.postalCode"
      );
    }
    if (
      infoType === "phone" &&
      phone !== null &&
      phone.toString().trim().length !== 10
    ) {
      if (!phone || !phone?.trim()?.length) {
        valid = false;
        errorText["phone"] = t("paymentRegistration.paypal.error.phoneNumber");
      } else if (phone.toString().trim().length !== 10) {
        valid = false;
        errorText["phone"] = t("paymentRegistration.paypal.error.phoneLength");
      }
    }
    if (infoType === "email" && email !== null) {
      const userEmail = email !== null && email.toString().trim().toLowerCase();
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (email.toString().trim().length === 0) {
        valid = false;
        errorText["email"] = t("paymentRegistration.paypal.error.email");
      } else {
        if (!re.test(userEmail)) {
          valid = false;
          errorText["email"] = t("paymentRegistration.paypal.error.emailValid");
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
      paypalInfo,
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
          <Grid item xs={12}>
            <Box pb={2}>
              <Grid container display="flex" alignItems="center">
                <Grid item xs={12} lg={9} className={classes.headingCont}>
                  <Typography className={classes.heading}>
                    {t("paymentRegistration.heading.paypal")}
                  </Typography>
                  <span style={{alignSelf:'center'}}>
                    <LightTooltip
                      title={t("paymentRegistration.tooltipText.paypal", {
                        threshold:
                          consumerPaymentTypesList?.data?.thresholds?.PPL,
                      })}
                      placement="right"
                    />
                  </span>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid container item spacing={2}>
            <Grid item container spacing={2} xs={12} md={12} lg={12}>
              <Grid item xs={12} md={6} lg={6}>
                <CheckboxGroup
                  options={info}
                  selectedOption={paypalInfo.infoType}
                  onChange={(val) => {
                    this.setState({
                      showEmailInfo: val.value === "email" ? true : false,
                      paypalInfo: {
                        ...paypalInfo,
                        infoType: val.value,
                      },
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                {showEmailInfo ? (
                  <Grid item xs={12} md={10} lg={10}>
                    <TextField
                      label={t("paymentRegistration.paypal.label.email")}
                      error={validation.email}
                      helperText={validation.email}
                      value={paypalInfo.email || ""}
                      name="email"
                      inputProps={{
                        maxLength: 74,
                      }}
                      onChange={(e) => this.handleChange("email", e)}
                      required
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12} md={10} lg={10}>
                      <Phone
                        error={validation.phone}
                        helperText={validation.phone}
                        id="phone"
                        name="phone"
                        required
                        value={(paypalInfo && paypalInfo.phone) || ""}
                        prefixCcode="+1"
                        onChange={(e) => this.handleChange("phone", e)}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>

            <Grid item container spacing={2} xs={12} md={12} lg={12}>
              <Grid item xs={12} md={10} lg={10}>
                <div>
                  <Typography className={classes.addressHeading}>
                    {t("paymentRegistration.paypal.label.address")}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12} md={10} lg={10}>
                <TextField
                  label={t("paymentRegistration.paypal.label.addressLine1")}
                  error={validation.address1}
                  helperText={validation.address1}
                  value={paypalInfo.address1 || ""}
                  name="address1"
                  inputProps={{
                    maxLength: 35,
                  }}
                  onChange={(e) => this.handleChange("address1", e)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={10} lg={10}>
                <TextField
                  label={t("paymentRegistration.paypal.label.addressLine2")}
                  error={validation.address2}
                  helperText={validation.address2}
                  value={paypalInfo.address2 || ""}
                  name="address2"
                  inputProps={{
                    maxLength: 16,
                  }}
                  onChange={(e) => this.handleChange("address2", e)}
                />
              </Grid>
              <Grid item xs={12} md={5} lg={5}>
                <CountryIso
                  name="country"
                  label={t("paymentRegistration.label.country")}
                  selectedCountry={(paypalInfo && paypalInfo.country) || ""}
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
                  selectedState={(paypalInfo && paypalInfo.state) || ""}
                  selectedCountry={(paypalInfo && paypalInfo.country) || ""}
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
                  selectedState={(paypalInfo && paypalInfo.state) || ""}
                  selectedCountry={(paypalInfo && paypalInfo.country) || ""}
                  selectedCity={(paypalInfo && paypalInfo.city) || ""}
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
                  label={t("paymentRegistration.paypal.label.zipCode")}
                  value={(paypalInfo && paypalInfo.postalCode) || ""}
                  name="postalCode"
                  inputProps={{
                    maxLength: 10,
                  }}
                  onChange={(e) => this.handleChange("postalCode", e)}
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
}))(compose(withTranslation("common"), withStyles(styles))(PayPal));
