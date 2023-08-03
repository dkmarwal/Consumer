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
import config from "~/config";
import styles from "./styles";
import Button from "~/components/Forms/Button";
import TextField from "~/components/Forms/TextField";
import Notification from "~/components/Notification";
import { CountryIso, CityIso, StatesIso } from "~/components/CSC";
import ConsumerEnrollmentRemittance from "~/module/Remittance/ConsumerEnrollment";
import { createPushtoCard } from "~/redux/actions/paymentRegistration";
import trim from "deep-trim-node";
import CardNumber from "~/components/MaskInput/CardNumber";
import "react-datepicker/dist/react-datepicker.css";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "date-fns";
import { preferencePaymentType } from "~/config/consumerEnrollmentConst";
import { EmailDeliveryModeId } from "~/config/consumerEnrollmentConst";
import VerifyUser from "~/module/PaymentAuthentication/verifyUser";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import DirectDepositCard from "~/assets/images/directDepositCard.svg";
import { fetchPaymentsToAuthenticate } from "~/redux/actions/paymentAuthentication";

class PushToCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushToCardInfo: {
        name: "",
        cardNo: "",
        expiryDate: null,
        cvv: "",
        address1: "",
        address2: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
      },
      validation: {},
      isLoading: false,
      error: null,
      variant: null,
      isProcessing: false,
      cardType: "Both",
      openAuthModal: false,
      paymentMethodShared: null,
    };
  }

  handleChange = (name, e) => {
    const { value } = e.target;
    const { pushToCardInfo } = this.state;
    let finalValue = "";

    switch (name) {
      case "cvv":
      case "postalCode":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;
      case "phone":
        finalValue = value.phone;
        break;
      case "address1":
      case "address2":
        finalValue= value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
        break;
      default:
        finalValue = value;
        break;
    }
    if (name === "country") {
      pushToCardInfo.city = "";
      pushToCardInfo.state = "";
    } else if (name === "state") {
      pushToCardInfo.city = "";
    }
    this.setState({
      pushToCardInfo: { ...pushToCardInfo, [name]: finalValue },
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
    const { pushToCardInfo } = this.state;
    const isValid = this.validateForm();
    const data = trim(pushToCardInfo);

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
          createPushtoCard({
            ...data,
            remittanceDetails: remittanceData,
            preferenceType: preferencePaymentType.preferred,
          })
        ).then((response) => {
          if (!response) {
            this.handleErrorNotification("pushToCardInfo");
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
        t("paymentRegistration.pushToCard.message.somethingWentWrong"),
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
          paymentType: "Push To Card",
          preferredMsg: paymentRegistration.pushToCardInfo
            ? paymentRegistration?.pushToCardInfo?.data?.dynamicMessage ?? ""
            : "",
          preferredFooterMsg: paymentRegistration.pushToCardInfo
            ? paymentRegistration?.pushToCardInfo?.data?.dynamicFooterMessage ??
              ""
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
        paymentType: "Push To Card",
        dynamicMessage:
          paymentRegistration?.pushToCardInfo?.data?.dynamicMessage || "",
        dynamicFooterMessage:
          paymentRegistration?.pushToCardInfo?.data?.dynamicFooterMessage || "",
        isVerified: true,
      },
    });
  };

  onBlur = (e) => {
    const val = e;
    if (val.toString().charAt(0) === "4") {
      this.setState({
        cardType: "Visa",
      });
    } else if (val.toString().charAt(0) === "5") {
      this.setState({
        cardType: "MasterCard",
      });
    } else {
      this.setState({
        cardType: "Both",
      });
    }
  };
  validateForm = () => {
    let valid = true;
    let errorText = {};
    const {
      name,
      cardNo,
      expiryDate,
      cvv,
      address1,
      country,
      state,
      city,
      postalCode,
    } = this.state.pushToCardInfo;

    const { t } = this.props;

    if (
      name === null ||
      (name !== null && name.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["name"] = t(
        "paymentRegistration.pushToCard.error.nameRequired"
      );
    }
    if (
      cardNo === null ||
      (cardNo !== null && cardNo.toString().trim().length < 11)
    ) {
      valid = false;
      errorText["cardNo"] = t(
        "paymentRegistration.pushToCard.error.validCardNumber"
      );
    } else if (
      cardNo &&
      !cardNo.toString().startsWith(4) &&
      !cardNo.toString().startsWith(5)
    ) {
      valid = false;
      errorText["cardNo"] = t(
        "paymentRegistration.pushToCard.error.cardNumber"
      );
    }
    if (expiryDate === null) {
      valid = false;
      errorText["expiryDate"] = t(
        "paymentRegistration.pushToCard.error.cardExpiryDate"
      );
    }
    if (expiryDate !== null && expiryDate._d.toString() === "Invalid Date") {
      valid = false;
      errorText["expiryDate"] = t(
        "paymentRegistration.pushToCard.error.invalidCardExpiry"
      );
    }
    if (cvv === null || (cvv !== null && cvv.toString().trim().length !== 3)) {
      valid = false;
      errorText["cvv"] = t("paymentRegistration.pushToCard.error.cvvLength");
    }

    if (
      address1 === null ||
      (address1 !== null && address1.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["address1"] = t("paymentRegistration.error.addressLine1");
    }
    if (
      country === null ||
      (country !== null && country.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["country"] = t("paymentRegistration.error.country");
    }
    if (
      state === null ||
      (state !== null && state.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["state"] = t("paymentRegistration.error.state");
    }
    if (
      city === null ||
      (city !== null && city.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["city"] = t("paymentRegistration.error.city");
    }
    if (
      postalCode === null ||
      (postalCode !== null && postalCode.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["postalCode"] = t("paymentRegistration.error.postalCode");
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
    const { paymentRegistration } = this.props;
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
        return this.props.t("paymentRegistration.remittance.emailIdRequired");
      } else if (
        !reg.test(
          String(selectedRemittanceConfigData.remittanceEmail).toLowerCase()
        )
      ) {
        return this.props.t("paymentRegistration.remittance.validEmail");
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
  handleDateChange = (date) => {
    let err = null;
    const { pushToCardInfo } = this.state;
    const { t } = this.props;
    if (date !== null && date._d.toString() === "Invalid Date") {
      err = t("paymentRegistration.pushToCard.error.invalidCardExpiry");
    } else if (date !== null && new Date().getTime() - date._d.getTime() > 0) {
      err = t("paymentRegistration.pushToCard.error.invalidCardExpiry");
    }
    this.setState({
      pushToCardInfo: {
        ...pushToCardInfo,
        expiryDate: date,
      },
      validation: {
        ...this.state.validation,
        expiryDate: err,
      },
    });
  };
  render() {
    const {
      pushToCardInfo,
      validation,
      cardType,
      isLoading,
      variant,
      error,
      isProcessing,
    } = this.state;
    const { classes, t, paymentRegistration, csc, token, ...otherProps } =
      this.props;
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
    let selectedCountry = "";
    if (pushToCardInfo && pushToCardInfo.country) {
      selectedCountry = csc["countryList"]?.find(
        (item) => item.isoCode3 === pushToCardInfo.country
      )?.isoCode;
    }
    return (
      <>
        <Grid container item display="flex" direction="row">
          <Grid item xs={12}>
            <Box pb={2} width={1}>
              <Grid container display="flex" alignItems="center">
                <Grid item xs={12} lg={10} className={classes.headingCont}>
                  <Typography className={classes.heading}>
                    {t(
                      "paymentRegistration.pushToCard.heading.pushToCardInformation"
                    )}
                  </Typography>
                  <span style={{ alignSelf: "center" }}>
                    <LightTooltip
                      title={t(
                        "paymentRegistration.tooltipText.directDeposit",
                        {
                          threshold:
                            consumerPaymentTypesList?.data?.thresholds?.MSC,
                        }
                      )}
                      placement="right"
                    />
                  </span>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box pb={2} width={1}>
              <Grid container display="flex" alignItems="center">
                <Grid item xs={12} lg={10} className={classes.cardHeadingCont}>
                  <Typography className={classes.cardInfo}>
                    {t("paymentRegistration.heading.cardInfo")}
                  </Typography>
                  <span>
                    <LightTooltip
                      title={
                        <img src={DirectDepositCard} alt="Instant Pay Card" />
                      }
                      placement="right-end"
                    />
                  </span>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item container spacing={2}>
              <Grid item xs={12} md={10} lg={10}>
                <TextField
                  color="secondary"
                  label={t("paymentRegistration.pushToCard.label.nameOnCard")}
                  error={validation.name}
                  helperText={validation.name}
                  value={pushToCardInfo.name || ""}
                  name="name"
                  inputProps={{
                    maxLength: 40,
                  }}
                  onChange={(e) => this.handleChange("name", e)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={10} lg={10}>
                <CardNumber
                  label={t("paymentRegistration.pushToCard.label.cardNumber")}
                  error={validation.cardNo}
                  helperText={validation.cardNo}
                  value={pushToCardInfo.cardNo || ""}
                  name="cardNo"
                  inputProps={{
                    maxLength: 19,
                  }}
                  getvalue={(val) => {
                    this.setState({
                      pushToCardInfo: {
                        ...pushToCardInfo,
                        cardNo: val,
                      },
                    });
                  }}
                  onBlur={this.onBlur}
                  showPaymentIcons={true}
                  cardType={cardType}
                  required
                />
              </Grid>
              <Grid item xs={12} md={5} lg={5}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    className={classes.calenderField}
                    color="secondary"
                    disablePast
                    minDate={new Date()}
                    inputVariant="outlined"
                    placeholder="MM/YYYY"
                    format={"MM/YYYY"}
                    name="expiryDate"
                    label={t("paymentRegistration.pushToCard.label.expiryDate")}
                    value={pushToCardInfo.expiryDate}
                    error={validation && validation.expiryDate}
                    helperText={validation && validation.expiryDate}
                    onChange={this.handleDateChange}
                    autoOk={true}
                    views={["month", "year"]}
                    openTo="month"
                    fullWidth={true}
                    required
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} md={5} lg={5}>
                <TextField
                  color="secondary"
                  label={t("paymentRegistration.pushToCard.label.cvv")}
                  error={validation.cvv}
                  helperText={validation.cvv}
                  value={pushToCardInfo.cvv || ""}
                  name="cvv"
                  inputProps={{
                    maxLength: 3,
                  }}
                  type="password"
                  onChange={(e) => this.handleChange("cvv", e)}
                  required
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={12} md={10} lg={10}>
                <div>
                  <Typography className={classes.addressHeading}>
                    {t("paymentRegistration.paypal.label.address")}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={10} lg={10}>
                <TextField
                  color="secondary"
                  label={t("paymentRegistration.label.addressLine1")}
                  error={validation.address1}
                  helperText={validation.address1}
                  value={pushToCardInfo.address1 || ""}
                  name="address1"
                  inputProps={{
                    maxLength: 50,
                  }}
                  onChange={(e) => this.handleChange("address1", e)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={10} lg={10}>
                <TextField
                  color="secondary"
                  label={t("paymentRegistration.label.addressLine2")}
                  error={validation.address2}
                  helperText={validation.address2}
                  value={pushToCardInfo.address2 || ""}
                  name="address2"
                  inputProps={{
                    maxLength: 50,
                  }}
                  onChange={(e) => this.handleChange("address2", e)}
                />
              </Grid>
              <Grid item container spacing={2}>
                <Grid item xs={12} md={5} lg={5}>
                  <CountryIso
                    isoCode3={true}
                    name="country"
                    label={t("paymentRegistration.label.country")}
                    selectedCountry={
                      (pushToCardInfo && pushToCardInfo.country) || ""
                    }
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
                    selectedState={
                      (pushToCardInfo && pushToCardInfo.state) || ""
                    }
                    selectedCountry={selectedCountry}
                    onChange={(e) => this.handleChange("state", e)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={5} lg={5}>
                  <CityIso
                    name="city"
                    label={t("paymentRegistration.label.city")}
                    error={Boolean(validation.city)}
                    helperText={validation.city}
                    selectedState={
                      (pushToCardInfo && pushToCardInfo.state) || ""
                    }
                    selectedCountry={
                      (pushToCardInfo && pushToCardInfo.country) || ""
                    }
                    selectedCity={(pushToCardInfo && pushToCardInfo.city) || ""}
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
                    label={t("paymentRegistration.label.postalCode")}
                    value={(pushToCardInfo && pushToCardInfo.postalCode) || ""}
                    name="postalCode"
                    inputProps={{
                      maxLength: 10,
                    }}
                    onChange={(e) => this.handleChange("postalCode", e)}
                  />
                </Grid>
              </Grid>

              {remittanceStatus?.data?.isRemittanceEnabled ? (
                <Grid item xs={12} md={10} lg={10}>
                  <Box>
                    <ConsumerEnrollmentRemittance
                      remittanceEmailError={validation.remittanceEmail}
                      handleRemittanceEmailError={
                        this.handleRemittanceEmailError
                      }
                      {...otherProps}
                    />
                  </Box>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
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
          <Grid item container xs={12} justifyContent="center">
            {isProcessing ? (
              <Box p={2}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Box p={2}>
                <Button
                  onClick={(e) => this.handleShare()}
                  className={classes.shareButton}
                  color="primary"
                >
                  {t("paymentRegistration.buttonLabel.continue")}
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
  ...state.csc,
  ...state.accounts,
  ...state.user,
}))(withStyles(styles)(PushToCard));
