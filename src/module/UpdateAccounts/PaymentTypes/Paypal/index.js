import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  Modal,
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import styles from "./styles";
import TextField from "~/components/Forms/TextField";
import Notification from "~/components/Notification";
import { CountryIso, CityIso, StatesIso } from "~/components/CSC";
import Phone from "~/components/TextBox/Phone";
import ConsumerEnrollmentRemittance from "~/module/Remittance/UpdateAccounts";
import { createPaypal } from "~/redux/actions/paymentRegistration";
import trim from "deep-trim-node";
import { preferencePaymentType } from "~/config/consumerEnrollmentConst";
import { EmailDeliveryModeId } from "~/config/consumerEnrollmentConst";
import {
  updateConsumerPayPalInfo,
  fetchConsumerPaymentDetails,
} from "~/redux/actions/accounts";
import { getMFAStatus } from "~/redux/helpers/user";
import { CheckboxGroup } from "~/components/Forms";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import MFA from "~/module/DFA/MFA";

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
      info: [
        { label: this.props.t("updatedAccounts.label.email"), value: "email" },
        {
          label: this.props.t("updatedAccounts.label.phoneNumber"),
          value: "phone",
        },
      ],
      paypalId: null,
      createAcc:null,
      showMFA: false,
      phoneNum: "",
      phoneCode: "",
      otp: null,
    };
  }
  componentDidMount = () => {
    const { consumerPaymentDetails } = this.props.accounts;
    const PayPalDetailsInfo =
      consumerPaymentDetails?.data?.consumerPaypalDetails ?? null;
    let phoneVal = "";
    if (PayPalDetailsInfo) {
      if (
        PayPalDetailsInfo.tokenType === "phone" &&
        PayPalDetailsInfo.tokenValue
      ) {
        const splitArr = PayPalDetailsInfo.tokenValue.split(" ");
        phoneVal = splitArr[splitArr.length - 1];
      }
      this.setState({
        paypalInfo: {
          infoType: PayPalDetailsInfo.tokenType,
          email:
            PayPalDetailsInfo.tokenType === "email"
              ? PayPalDetailsInfo.tokenValue
              : "",
          phone: PayPalDetailsInfo.tokenType === "phone" ? phoneVal : "",
          address1: PayPalDetailsInfo.addressLine1,
          address2: PayPalDetailsInfo.addressLine2,
          country: PayPalDetailsInfo.country,
          city: PayPalDetailsInfo.city,
          state: PayPalDetailsInfo.state,
          postalCode: PayPalDetailsInfo.postalCode,
        },
        paypalId: PayPalDetailsInfo.paypalDetailId,
        showEmailInfo: PayPalDetailsInfo.tokenType === "email",
      });
    }
  };
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
        finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
        break
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
    const { dispatch, paymentRegistration, setNotificationMessage, t } =
      this.props;
    const { selectedRemittanceConfigData, isRemittanceEnabled } =
      paymentRegistration;
    const data = trim(this.state.paypalInfo);
    const isValid = this.validateForm();
    if (isValid) {
      if (isRemittanceEnabled && !selectedRemittanceConfigData) {
        this.setState({
          variant: "error",
          error: t("updatedAccounts.remittance.deliveryMode"),
        });
      } else {
        this.setState({
          isProcessing: true,
        });
        if (!this.state.paypalId) {
          const type = 'payment_preference';
          getMFAStatus(type).then((response) => {
            if (!response) {
              this.setState({
                variant: "error",
                error:
                  response?.message ??
                  t("updatedAccounts.message.somethingWentWrong"),
                isProcessing: false,
              });
              return null;
            }
            if (response?.data?.isMfaStatusRequired === 1) {
              this.setState({
                showMFA: true,
                phoneNum: response?.data?.phoneNumber,
                phoneCode: response?.data?.phoneCountryCode,
                isProcessing: false,
                createAcc: true
              });
            } else {
              this.handleCreateAcc(false);
            }
          });
        } else {
          const type = 'payment_preference';
          getMFAStatus(type).then((response) => {
            if (!response) {
              this.setState({
                variant: "error",
                error:
                  response?.message ??
                  t("updatedAccounts.message.somethingWentWrong"),
                isProcessing: false,
              });
              return null;
            }
            if (response?.data?.isMfaStatusRequired === 1) {
              this.setState({
                showMFA: true,
                phoneNum: response?.data?.phoneNumber,
                phoneCode: response?.data?.phoneCountryCode,
                isProcessing: false,
                createAcc: false
              });
            } else {
              this.handleEditAcc(false);
            }
          });
        }
      }
    }
  };

  handleCreateAcc = (flag) =>{
    const { dispatch, paymentRegistration, setNotificationMessage, t } =
    this.props;
  const { selectedRemittanceConfigData, isRemittanceEnabled } =
    paymentRegistration;
  const data = trim(this.state.paypalInfo);
  const { otp } = this.state;
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
        otp: flag ? otp : null,
      })
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification("payPalInfo", true);
      } else {
        dispatch(fetchConsumerPaymentDetails());
        this.setState({
          isProcessing: false,
        });
        setNotificationMessage(
          t("updatedAccounts.message.successfulPreferredPaymentMethod", {
            paymentMethodName: "PayPal",
          })
        );
      }
    });
  }

  handleEditAcc = (flag) => {
    const { dispatch, paymentRegistration, setNotificationMessage, t } =
      this.props;
    const { selectedRemittanceConfigData } = paymentRegistration;
    const data = trim(this.state.paypalInfo);
    const { otp } = this.state;
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
      updateConsumerPayPalInfo({
        ...data,
        remittanceDetails: remittanceData,
        preferenceType: preferencePaymentType.preferred,
        paypalId: this.state.paypalId,
        otp: flag ? otp : null,
      })
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification("payPalInfo", false);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          t("updatedAccounts.message.successfulPreferredPaymentMethod", {
            paymentMethodName: "PayPal",
          })
        );
        this.setState({
          processingUpdate: false,
        });
      }
    });
  };
  handleErrorNotification = (errorInAction, flag) => {
    const { accounts, paymentRegistration, t } = this.props;
    this.setState({
      variant: "error",
      error: flag
        ? paymentRegistration[errorInAction]?.error ??
        t("updatedAccounts.message.somethingWentWrong")
        : accounts[errorInAction]?.error ??
        t("updatedAccounts.message.somethingWentWrong"),
      isProcessing: false,
    });
  };

  validateForm = () => {
    const { t } = this.props;
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

    if (
      address1 === null ||
      (address1 !== null && address1.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["address1"] = t("updatedAccounts.error.addressLine1");
    }
    if (
      country === null ||
      (country !== null && country.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["country"] = t("updatedAccounts.error.country");
    }
    if (
      state === null ||
      (state !== null && state.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["state"] = t("updatedAccounts.error.state");
    }
    if (
      city === null ||
      (city !== null && city.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["city"] = t("updatedAccounts.error.city");
    }
    if (
      postalCode === null ||
      (postalCode !== null && postalCode.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["postalCode"] = t("updatedAccounts.error.postalCode");
    }
    if (infoType === "phone") {
      if (phone === "" || phone === null || phone === undefined) {
        valid = false;
        errorText["phone"] = t(
          "updatedAccounts.paypal.error.phoneNumberRequired"
        );
      } else if (phone.toString().trim().length !== 10) {
        valid = false;
        errorText["phone"] = t(
          "updatedAccounts.paypal.error.phoneNumberLength"
        );
      }
    }
    if (infoType === "email" && email !== null) {
      const userEmail = email !== null && email.toString().trim().toLowerCase();
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (email.toString().trim().length === 0) {
        valid = false;
        errorText["email"] = t("updatedAccounts.paypal.error.emailIdRequired");
      } else {
        if (!re.test(userEmail)) {
          valid = false;
          errorText["email"] = t("updatedAccounts.paypal.error.validEmailId");
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
        return t("updatedAccounts.remittance.emailIdRequired");
      } else if (
        !reg.test(
          String(selectedRemittanceConfigData.remittanceEmail).toLowerCase()
        )
      ) {
        return t("updatedAccounts.remittance.validEmailId");
      }
    }
    return false;
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
      showMFA,
      phoneNum,
      phoneCode,createAcc,
    } = this.state;
    const { classes, t, paymentRegistration, closeDialog, ...otherProps } =
      this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
    const { remittanceStatus } = this.props.accounts;
    const labelToShow = t("updatedAccounts.paypal.content.paypalInformation");
    if (isLoading) {
      return (
        <Box display="flex" p={10} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }
    return (
      <>
        <Grid container spacing={2} className={classes.headingContainer}>
          <Grid item xs={12} lg={11}>
            <Grid container display="flex" alignItems="center">
              <Typography className={classes.heading}>{labelToShow}</Typography>
              <span>
                <LightTooltip
                  title={t("updatedAccounts.tooltipText.paypal", {
                    threshold: consumerPaymentTypesList?.data?.thresholds?.PPL,
                  })}
                  placement="right"
                ></LightTooltip>
              </span>
            </Grid>
          </Grid>
          <Grid container item spacing={2}>
            <Grid item xs={12} md={11} lg={11}>
              <Grid item container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
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
                    <Grid item xs={12} md={12} lg={12}>
                      <TextField
                        color="secondary"
                        label={t("updatedAccounts.label.email")}
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
                    <Grid item xs={12} lg={12}>
                      <Phone
                        error={Boolean(validation.phone)}
                        helperText={validation.phone}
                        id="phone"
                        name="phone"
                        required
                        value={(paypalInfo && paypalInfo.phone) || ""}
                        prefixCcode="+1"
                        onChange={(e) => this.handleChange("phone", e)}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={11} lg={11}>
              <Grid item container spacing={2}>
                <Grid item xs={12} md={11} lg={11}>
                  <div>
                    <Typography className={classes.addressHeading}>
                      {t("updatedAccounts.label.address")}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <TextField
                    color="secondary"
                    label={t("updatedAccounts.label.addressLine1")}
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
                <Grid item xs={12} md={12} lg={12}>
                  <TextField
                    color="secondary"
                    label={t("updatedAccounts.label.addressLine2")}
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
                <Grid item xs={12} md={6} lg={6}>
                  <CountryIso
                    name="country"
                    label={t("updatedAccounts.label.country")}
                    selectedCountry={(paypalInfo && paypalInfo.country) || ""}
                    error={validation.country}
                    helperText={validation.country}
                    onChange={(e) => this.handleChange("country", e)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <StatesIso
                    name="state"
                    label={t("updatedAccounts.label.state")}
                    error={validation.state}
                    helperText={validation.state}
                    selectedState={(paypalInfo && paypalInfo.state) || ""}
                    selectedCountry={(paypalInfo && paypalInfo.country) || ""}
                    onChange={(e) => this.handleChange("state", e)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <CityIso
                    name="city"
                    label={t("updatedAccounts.label.city")}
                    error={validation.city}
                    helperText={validation.city}
                    selectedState={(paypalInfo && paypalInfo.state) || ""}
                    selectedCountry={(paypalInfo && paypalInfo.country) || ""}
                    selectedCity={(paypalInfo && paypalInfo.city) || ""}
                    onChange={(e) => this.handleChange("city", e)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    required
                    error={validation.postalCode}
                    helperText={validation.postalCode}
                    fullWidth={true}
                    autoComplete="off"
                    variant="outlined"
                    label={t("updatedAccounts.label.postalCode")}
                    value={(paypalInfo && paypalInfo.postalCode) || ""}
                    name="postalCode"
                    inputProps={{
                      maxLength: 10,
                    }}
                    onChange={(e) => this.handleChange("postalCode", e)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {remittanceStatus?.data?.isRemittanceEnabled ? (
            <Grid item xs={12} md={11} lg={11}>
              <Box my={1}>
                <ConsumerEnrollmentRemittance
                  remittanceEmailError={validation.remittanceEmail}
                  handleRemittanceEmailError={this.handleRemittanceEmailError}
                  {...otherProps}
                />
              </Box>
            </Grid>
          ) : null}
          {showMFA && (
            <Modal
              open={showMFA}
              onClose={() =>
                this.setState({ showMFA: false, isProcessing: false })
              }
            >
              <MFA
                onBtnClick={(otp) => {
                  this.setState(
                    {
                      showMFA: false,
                      otp: otp,
                    },
                    () => {
                      createAcc ? this.handleCreateAcc(true) :
                      this.handleEditAcc(true)
                    }
                  );
                }}
                onCancelClick={() =>
                  this.setState({ showMFA: false, isProcessing: false })
                }
                phoneNum={phoneNum}
                phoneCode={phoneCode}
                MFAType={"PostLoginMFA"}
              />
            </Modal>
          )}
          <Grid container justifyContent="center">
            {isProcessing ? (
              <Box p={2}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Grid
                container
                item
                xs={11}
                sm={7}
                md={11}
                lg={8}
                justifyContent="center"
                spacing={2}
                style={{ marginTop: "8px" }}
              >
                <Grid item xs={6} sm={4} md={4} lg={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={(e) => closeDialog()}
                  >
                    {t("updatedAccounts.buttonLabel.cancel")}
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={this.props.i18n.language === "fr" ? 10 : 6}
                  sm={this.props.i18n.language === "fr" ? 6 : 4}
                  md={4}
                  lg={4}
                >
                  <Button
                    onClick={this.handleShare}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {t("updatedAccounts.buttonLabel.update")}
                  </Button>
                </Grid>
              </Grid>
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
  ...state.user,
  ...state.paymentRegistration,
  ...state.accounts,
}))(compose(withTranslation("common"), withStyles(styles))(PayPal));
