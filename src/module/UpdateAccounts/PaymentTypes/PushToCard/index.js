import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  Button,
  Modal,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styles from "./styles";
import TextField from "~/components/Forms/TextField";
import Notification from "~/components/Notification";
import { CountryIso, CityIso, StatesIso } from "~/components/CSC";
import ConsumerEnrollmentRemittance from "~/module/Remittance/UpdateAccounts";
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
import {
  updateConsumerPushToCardInfo,
  fetchConsumerPaymentDetails,
} from "~/redux/actions/accounts";
import { getMFAStatus } from "~/redux/helpers/user";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import DirectDepositCard from "~/assets/images/directDepositCard.svg";
import MFA from "~/module/DFA/MFA";
import moment from "moment";

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
      createAcc:null,
      validation: {},
      isLoading: false,
      error: null,
      variant: null,
      isProcessing: false,
      cardType: "Both",
      openAuthModal: false,
      cardId: null,
      showMFA: false,
      phoneNum: "",
      phoneCode: "",
      otp: null,
    };
  }

  componentDidMount = () => {
    const { consumerPaymentDetails } = this.props.accounts;
    const PushToCardDetailsInfo =
      consumerPaymentDetails?.data?.consumerCardDetails ?? null;
    if (PushToCardDetailsInfo) {
      this.onBlur(PushToCardDetailsInfo.cardNumber);
      this.setState({
        pushToCardInfo: {
          name: PushToCardDetailsInfo.nameOnCard,
          cardNo: PushToCardDetailsInfo.cardNumber,
          expiryDate: moment(PushToCardDetailsInfo.expiryDate),
          cvv: PushToCardDetailsInfo.cvv,
          address1: PushToCardDetailsInfo.addressLine1,
          address2: PushToCardDetailsInfo.addressLine2,
          country: PushToCardDetailsInfo.country,
          state: PushToCardDetailsInfo.state,
          city: PushToCardDetailsInfo.city,
          postalCode: PushToCardDetailsInfo.postalCode,
        },
        cardId: PushToCardDetailsInfo.cardDetailId,
      });
    }
  };

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
        finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
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
    const { dispatch, paymentRegistration, setNotificationMessage, t } =
      this.props;
    const { selectedRemittanceConfigData, isRemittanceEnabled } =
      paymentRegistration;
    const isValid = this.validateForm();
    const data = trim(this.state.pushToCardInfo);

    if (isValid) {
      if (isRemittanceEnabled && !selectedRemittanceConfigData) {
        this.setState({
          variant: "error",
          error: t("updatedAccounts.remittance.emailIdRequired"),
        });
      } else {
        this.setState({
          isProcessing: true,
        });
        if (!this.state.cardId) {
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
  const { selectedRemittanceConfigData } = paymentRegistration;
  const data = trim(this.state.pushToCardInfo);
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
      createPushtoCard({
        ...data,
        remittanceDetails: remittanceData,
        preferenceType: preferencePaymentType.preferred,
        otp: flag ? otp : null,
      })
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification("pushToCardInfo", true);
      } else {
        dispatch(fetchConsumerPaymentDetails());
        this.setState({
          isProcessing: false,
        });
        setNotificationMessage(
          t("updatedAccounts.message.successfulPreferredPaymentMethod", {
            paymentMethodName: "Instant Pay",
          })
        );
        this.setState({
          isProcessing: false,
        });
      }
    });
  }

  handleEditAcc = (flag) => {
    const { dispatch, paymentRegistration, setNotificationMessage, t } =
      this.props;
    const { selectedRemittanceConfigData } = paymentRegistration;
    const data = trim(this.state.pushToCardInfo);
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
      updateConsumerPushToCardInfo({
        ...data,
        remittanceDetails: remittanceData,
        preferenceType: preferencePaymentType.preferred,
        cardId: this.state.cardId,
        otp: flag ? otp : null,
      })
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification("pushToCardInfo", false);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          t("updatedAccounts.message.successfulPreferredPaymentMethod", {
            paymentMethodName: "Instant Pay",
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

  onBlur = (e) => {
    const val = e;
    if (val) {
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
    } else {
      this.setState({
        cardType: "Both",
      });
    }
  };
  validateForm = () => {
    const { t } = this.props;
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

    if (
      name === null ||
      (name !== null && name.toString().trim().length === 0)
    ) {
      valid = false;
      errorText["name"] = t("updatedAccounts.pushToCard.error.nameRequired");
    }
    if (
      cardNo === null ||
      (cardNo !== null && cardNo.toString().trim().length < 11)
    ) {
      valid = false;
      errorText["cardNo"] = t(
        "updatedAccounts.pushToCard.error.validCardNumber"
      );
    } else if (
      cardNo &&
      !cardNo.toString().startsWith(4) &&
      !cardNo.toString().startsWith(5)
    ) {
      valid = false;
      errorText["cardNo"] = t("updatedAccounts.pushToCard.error.cardNumber");
    }
    if (expiryDate === null) {
      valid = false;
      errorText["expiryDate"] = t(
        "updatedAccounts.pushToCard.error.expiryDateRequired"
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
      errorText["cvv"] = t("updatedAccounts.pushToCard.error.cvvLength");
    }

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
        return t("updatedAccounts.error.validEmailId");
      }
    }
    return false;
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
      showMFA,
      phoneNum,
      phoneCode,createAcc,
    } = this.state;
    const { classes, t, paymentRegistration, csc, closeDialog, ...otherProps } =
      this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
    const { remittanceStatus } = this.props.accounts;

    const labelToShow = t(
      "updatedAccounts.pushToCard.content.pushToCardInformation"
    );

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
        <Grid container spacing={2} direction="row">
          <Grid container item xs={12} md={11} lg={11} alignItems="center">
            <Typography className={classes.heading}>{labelToShow}</Typography>
            <span style={{ marginTop: "6px", alignSelf: 'flex-start' }}>
              <LightTooltip
                title={t("updatedAccounts.tooltipText.directDeposit", {
                  threshold: consumerPaymentTypesList?.data?.thresholds?.MSC,
                })}
                placement="right"
              ></LightTooltip>
            </span>
          </Grid>
          <Grid container item xs={12} md={11} lg={11} alignItems="center">
            <Typography className={classes.cardInfo}>
              {t("updatedAccounts.heading.cardInfo")}
            </Typography>
            <span style={{ marginTop: "6px" }}>
              <LightTooltip
                title={<img src={DirectDepositCard} alt="Instant Pay Card" />}
                placement="right"
              ></LightTooltip>
            </span>
          </Grid>

          <Grid item container md={11} lg={11} spacing={2}>
            <Grid item xs={12} md={12} lg={12}>
              <TextField
                color="secondary"
                label={t("updatedAccounts.pushToCard.label.cardName")}
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
            <Grid item xs={12} md={12} lg={12}>
              <CardNumber
                label={t("updatedAccounts.pushToCard.label.cardNumber")}
                error={validation.cardNo}
                helperText={validation.cardNo}
                value={pushToCardInfo.cardNo || ""}
                name="cardNo"
                inputProps={{
                  maxLength: 19,
                }}
                getvalue={(val) => {
                  this.setState({
                    pushToCardInfo: { ...pushToCardInfo, cardNo: val },
                  });
                }}
                onBlur={this.onBlur}
                showPaymentIcons={true}
                cardType={cardType}
                required
              />
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
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
                  label={t("updatedAccounts.pushToCard.label.expiryDate")}
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
                {/* <KeyboardDatePicker
                  disablePast
                  placeholder="MM/YYYY"
                  format={"MM/yyyy"}
                  margin="normal"
                  variant="inline"
                  name="expiryDate"
                  label={t("updatedAccounts.pushToCard.label.expiryDate")}
                  views={["month", "year"]}
                  openTo="month"
                  required={true}
                  value={pushToCardInfo.expiryDate || ""}
                  error={validation && validation.expiryDate}
                  helperText={validation && validation.expiryDate}
                  onChange={(val) => {
                    this.setState({
                      pushToCardInfo: {
                        ...pushToCardInfo,
                        expiryDate: this.formatDate(val),
                      },
                    });
                  }}
                  //PopoverProps={{ className: classes.dateFieldItem }}
                  autoOk={true}
                  TextFieldComponent={({
                    InputProps,
                    required,
                    error,
                    helperText,
                    onChange,
                    value,
                    name,
                    label,
                    placeholder,
                  }) => (
                    <TextField
                      InputProps={InputProps}
                      placeholder={placeholder}
                      error={error}
                      helperText={helperText}
                      // onChange={onChange}
                      value={value}
                      name={name}
                      label={label}
                      required={required}
                      inputProps={{
                        maxLength: 7,
                      }}
                    />
                  )}
                  fullWidth={true}
                /> */}
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                color="secondary"
                label={t("updatedAccounts.pushToCard.label.cvv")}
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

            <Grid item xs={12} md={12} lg={12}>
              <div>
                <Typography className={classes.addressHeading}>
                  {t("paymentRegistration.paypal.label.address")}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <TextField
                color="secondary"
                label={t("updatedAccounts.label.addressLine1")}
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
            <Grid item xs={12} md={12} lg={12}>
              <TextField
                color="secondary"
                label={t("updatedAccounts.label.addressLine2")}
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

            <Grid item xs={12} md={6} lg={6}>
              <CountryIso
                isoCode3={true}
                name="country"
                label={t("updatedAccounts.label.country")}
                selectedCountry={
                  (pushToCardInfo && pushToCardInfo.country) || ""
                }
                error={Boolean(validation.country)}
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
                selectedState={(pushToCardInfo && pushToCardInfo.state) || ""}
                selectedCountry={selectedCountry}
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
                selectedState={(pushToCardInfo && pushToCardInfo.state) || ""}
                selectedCountry={
                  (pushToCardInfo && pushToCardInfo.country) || ""
                }
                selectedCity={(pushToCardInfo && pushToCardInfo.city) || ""}
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
                value={(pushToCardInfo && pushToCardInfo.postalCode) || ""}
                name="postalCode"
                inputProps={{
                  maxLength: 10,
                }}
                onChange={(e) => this.handleChange("postalCode", e)}
              />
            </Grid>
            {remittanceStatus?.data?.isRemittanceEnabled ? (
              <Grid item xs={12} md={12} lg={12}>
                <ConsumerEnrollmentRemittance
                  remittanceEmailError={validation.remittanceEmail}
                  handleRemittanceEmailError={this.handleRemittanceEmailError}
                  {...otherProps}
                />
              </Grid>
            ) : null}
          </Grid>

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
              <CircularProgress />
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
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={(e) => this.handleShare()}
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
  ...state.paymentRegistration,
  ...state.accounts,
  ...state.csc,
}))(withStyles(styles)(PushToCard));
