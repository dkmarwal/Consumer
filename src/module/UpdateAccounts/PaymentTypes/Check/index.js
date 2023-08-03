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
import ConsumerEnrollmentRemittance from "~/module/Remittance/UpdateAccounts";
import { CountryIso, CityIso, StatesIso } from "~/components/CSC";
import { createConsumerCheckInfo } from "~/redux/actions/paymentRegistration";
import {
  updateConsumerCheckInfo,
  fetchConsumerPaymentDetails,
} from "~/redux/actions/accounts";
import { connect } from "react-redux";
import trim from "deep-trim-node";
import Notification from "~/components/Notification";
import {
  preferencePaymentType,
  EmailDeliveryModeId,
} from "~/config/consumerEnrollmentConst";
import { getMFAStatus } from "~/redux/helpers/user";
import { TimeoutDialog } from "~/components/Dialogs";
import { paymentMethodsTimeSpan } from "~/config/paymentMethods";
import MFA from "~/module/DFA/MFA";

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
      checkDetailId: null,
      createAcc:null,
      showMFA: false,
      phoneNum: "",
      phoneCode: "",
      otp: null,
    };
  }

  componentDidMount = () => {
    const { consumerPaymentDetails } = this.props.accounts;
    const checkDetailsInfo =
      consumerPaymentDetails?.data?.consumerCheckDetails ?? null;
    if (checkDetailsInfo) {
      this.setState({
        checkInfo: {
          addressLine1: checkDetailsInfo.addressLine1,
          addressLine2: checkDetailsInfo.addressLine2,
          city: checkDetailsInfo.city,
          country: checkDetailsInfo.country,
          state: checkDetailsInfo.state,
          postalCode: checkDetailsInfo.postalCode,
        },
        checkDetailId: checkDetailsInfo.checkDetailId,
      });
    }
  };

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
        "updatedAccounts.error.addressLine1"
      );
      isError = true;
    }
    if (!country) {
      currentValidationInfo.country = t("updatedAccounts.error.country");
      isError = true;
    }
    if (!state) {
      currentValidationInfo.state = t("updatedAccounts.error.state");
      isError = true;
    }
    if (!city) {
      currentValidationInfo.city = t("updatedAccounts.error.city");
      isError = true;
    }
    if (!postalCode || !postalCode.trim().length) {
      currentValidationInfo.postalCode = t("updatedAccounts.error.postalCode");
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

  handleCheckInfoSave = (_) => {
    const {
      dispatch,
      paymentRegistration,
      alternateMethod,
      setNotificationMessage,
      t,
    } = this.props;
    const { isRemittanceEnabled, selectedRemittanceConfigData } =
      paymentRegistration;
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
        notificationMessage: t("updatedAccounts.remittance.deliveryMode"),
      });
    } else {
      this.setState({
        processingUpdate: true,
      });

      if (!this.state.checkDetailId) {
        if (!alternateMethod) {
          const type = 'payment_preference';
          getMFAStatus(type).then((response) => {
            if (!response) {
              this.setState({
                notificationVariant: "error",
                notificationMessage:
                  response?.message ??
                  t("updatedAccounts.message.somethingWentWrong"),
                processingUpdate: false,
              });
              return null;
            }
            if (response?.data?.isMfaStatusRequired === 1) {
              this.setState({
                showMFA: true,
                phoneNum: response?.data?.phoneNumber,
                phoneCode: response?.data?.phoneCountryCode,
                processingUpdate: false,
                createAcc: true
              });
            } else {
              this.handleCreateAcc(false);
            }
          });
        }else{
          this.handleCreateAcc(false);
        }

      } else {
        if (!alternateMethod) {
          const type = 'payment_preference';
          getMFAStatus(type).then((response) => {
            if (!response) {
              this.setState({
                notificationVariant: "error",
                notificationMessage:
                  response?.message ??
                  t("updatedAccounts.message.somethingWentWrong"),
                processingUpdate: false,
              });
              return null;
            }
            if (response?.data?.isMfaStatusRequired === 1) {
              this.setState({
                showMFA: true,
                phoneNum: response?.data?.phoneNumber,
                phoneCode: response?.data?.phoneCountryCode,
                processingUpdate: false,
                createAcc: false
              });
            } else {
              this.handleEditAcc(false);
            }
          });
        } else {
          this.handleEditAcc(false);
        }
      }
    }
  };

  handleCreateAcc = (flag) =>{
    const {
      dispatch,
      paymentRegistration,
      alternateMethod,
      setNotificationMessage,
      t,
    } = this.props;
    const { otp } = this.state;
    const { isRemittanceEnabled, selectedRemittanceConfigData } =
      paymentRegistration;
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
          otp: flag ? otp : null,
        })
      ).then((response) => {
        if (!response) {
          this.handleErrorNotification("checkInfo", true);
          return null;
        } else {
          dispatch(fetchConsumerPaymentDetails());
          setNotificationMessage(
            alternateMethod
              ? t("updatedAccounts.message.successfulAlternatePaymentMethod")
              : t(
                "updatedAccounts.message.successfulCheckPreferredPaymentUpdate",
                {
                  paymentMethodName: "Check",
                  timeSpan: paymentMethodsTimeSpan.CHK,
                }
              )
          );
          this.setState({
            processingUpdate: false,
          });
        }
      });
  }

  handleEditAcc = (flag) => {
    const {
      dispatch,
      paymentRegistration,
      alternateMethod,
      setNotificationMessage,
      t,
    } = this.props;
    const { otp } = this.state;
    const { selectedRemittanceConfigData } = paymentRegistration;
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
      updateConsumerCheckInfo({
        ...finalCheckInfoData,
        remittanceDetails: remittanceData,
        preferenceType: alternateMethod
          ? preferencePaymentType.alternate
          : preferencePaymentType.preferred,
        checkDetailId: this.state.checkDetailId,
        otp: flag ? otp : null,
      })
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification("checkInfo", false);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          alternateMethod
            ? t("updatedAccounts.message.successfulAlternatePaymentMethod")
            : t(
              "updatedAccounts.message.successfulCheckPreferredPaymentUpdate",
              {
                paymentMethodName: "Check",
                timeSpan: paymentMethodsTimeSpan.CHK,
              }
            )
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
      notificationVariant: "error",
      notificationMessage: flag
        ? paymentRegistration[errorInAction]?.error ??
        t("updatedAccounts.message.somethingWentWrong")
        : accounts[errorInAction]?.error ??
        t("updatedAccounts.message.somethingWentWrong"),
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

  render() {
    const {
      t,
      classes,
      paymentRegistration,
      alternateMethod,
      closePaymentMethodsDialog,
      closeDialog,
      ...otherProps
    } = this.props;

    const { consumerPaymentDetails, remittanceStatus } = this.props.accounts;
    const {
      checkInfo,
      validationInfo,
      notificationMessage,
      processingUpdate,
      alertMsg,
      showMFA,
      phoneNum,
      phoneCode,createAcc,
    } = this.state;
    const secondaryPaymentMethodId =
      consumerPaymentDetails?.data?.secondaryPaymentMethodId;

    const labelToShow = t("updatedAccounts.check.content.checkInformation");
    return (
      <Grid container>
        <Grid container className={classes.checkInfoOuterContainer}>
          <Box pb={1} mb={2} className={classes.checkHeadingContainer}>
            <Typography className={classes.checkInfoHeading}>
              {labelToShow}
            </Typography>
          </Box>
          <Grid container item md={11} lg={11} spacing={2}>
            <Grid item xs={12} md={12} lg={12}>
              <TextField
                name="addressLine1"
                label={t("updatedAccounts.label.addressLine1")}
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
            <Grid item xs={12} md={12} lg={12}>
              <TextField
                name="addressLine2"
                variant="outlined"
                label={t("updatedAccounts.label.addressLine2")}
                onChange={(e) => this.handleChange("addressLine2", e)}
                value={checkInfo.addressLine2}
                inputProps={{
                  maxLength: 75,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <CountryIso
                name="country"
                label={t("updatedAccounts.label.country")}
                selectedCountry={checkInfo.country}
                onChange={(e) => this.handleChange("country", e)}
                error={Boolean(validationInfo.country)}
                helperText={validationInfo.country}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <StatesIso
                name="state"
                label={t("updatedAccounts.label.state")}
                error={Boolean(validationInfo.state)}
                helperText={validationInfo.state}
                selectedState={checkInfo.state}
                selectedCountry={checkInfo.country}
                onChange={(e) => this.handleChange("state", e)}
                required
              />
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <CityIso
                name="city"
                label={t("updatedAccounts.label.city")}
                error={Boolean(validationInfo.city)}
                helperText={validationInfo.city}
                selectedState={checkInfo.state}
                selectedCountry={checkInfo.country}
                selectedCity={checkInfo.city}
                onChange={(e) => this.handleChange("city", e)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                variant="outlined"
                label={t("updatedAccounts.label.postalCode")}
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
            {/* </Grid> */}

            {remittanceStatus?.data?.isRemittanceEnabled && !alternateMethod ? (
              <Grid item xs={12} md={12} lg={12}>
                <ConsumerEnrollmentRemittance
                  remittanceEmailError={validationInfo.remittanceEmail}
                  handleRemittanceEmailError={this.handleRemittanceEmailError}
                  {...otherProps}
                />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        {showMFA && (
          <Modal
            open={showMFA}
            onClose={() =>
              this.setState({ showMFA: false, processingUpdate: false })
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
                this.setState({ showMFA: false, processingUpdate: false })
              }
              phoneNum={phoneNum}
              phoneCode={phoneCode}
              MFAType={"PostLoginMFA"}
            />
          </Modal>
        )}
        <Grid container justifyContent="center">
          {processingUpdate ? (
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
                  onClick={(e) => closeDialog()}
                  fullWidth
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
                  variant="contained"
                  color="primary"
                  onClick={(e) => this.handleCheckInfoSave(e)}
                  fullWidth
                >
                  {alternateMethod && !secondaryPaymentMethodId
                    ? t("updatedAccounts.buttonLabel.add")
                    : t("updatedAccounts.buttonLabel.update")}
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
        {notificationMessage && this.renderSnackbar()}
        {alertMsg ? (
          <TimeoutDialog
            open={alertMsg}
            msgText={t("updatedAccounts.message.checkAlternatePaymentMethod")}
          />
        ) : null}
      </Grid>
    );
  }
}

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.accounts,
}))(withStyles(styles)(Check));
