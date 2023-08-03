import React, { Component } from "react";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import {
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Modal,
  Link,
} from "@material-ui/core";
import ConsumerEnrollmentRemittance from "~/module/Remittance/UpdateAccounts";
import { connect } from "react-redux";
import RoutingCodeSearch from "~/module/RoutingCodeResults/routingCodeSearch";
import { CustomDialog } from "~/components/Dialogs";
import {
  getClientPaymentTypes,
  fetchRoutingCodes,
} from "~/redux/actions/payments";
import { createConsumerACHInfo } from "~/redux/actions/paymentRegistration";
import trim from "deep-trim-node";
import Notification from "~/components/Notification";
import TextField from "~/components/Forms/TextField";
import {
  preferencePaymentType,
  EmailDeliveryModeId,
} from "~/config/consumerEnrollmentConst";
import {
  updateConsumerBankAchInfo,
  fetchConsumerPaymentDetails,
} from "~/redux/actions/accounts";
import { getMFAStatus } from "~/redux/helpers/user";
import MFA from "~/module/DFA/MFA";
import SearchIcon from "~/assets/icons/search.svg";
import AlphaNumericMaskInput from "~/components/MaskInput/AlphaNumericMaskInput";
import { paymentMethodsTimeSpan } from "~/config/paymentMethods";

class ACH extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSearchModal: false,
      openAuthModal: false,
      achInfo: {
        accountNumber: "",
        routingNumber: "",
        accountType: "",
        bankName: "",
        confirmAccountNumber: "",
      },
      validationInfo: {
        accountNumber: false,
        routingNumber: false,
        accountType: false,
        bankName: false,
        confirmAccountNumber: false,
        remittanceEmail: false,
      },
      notificationVariant: "",
      notificationMessage: "",
      processingUpdate: false,
      bankAccountId: null,
      createAcc:null,
      showMFA: false,
      phoneNum: "",
      phoneCode: "",
      otp: null,
    };
  }

  componentDidMount = () => {
    const { dispatch, t } = this.props;
    dispatch(getClientPaymentTypes()).then((response) => {
      if (!response) {
        this.setState({
          notificationVariant: "error",
          notificationMessage:
            response.message ?? t("updatedAccounts.message.somethingWentWrong"),
        });
        return false;
      }
    });
    const { consumerPaymentDetails } = this.props.accounts;
    const ACHDetailsInfo =
      consumerPaymentDetails?.data?.consumerBankAccountDetails ?? null;
    if (ACHDetailsInfo) {
      this.setState({
        achInfo: {
          accountNumber: ACHDetailsInfo.accountNumber,
          routingNumber: ACHDetailsInfo.routingNumber,
          accountType: ACHDetailsInfo.accountTypeId,
          bankName: ACHDetailsInfo.bankName,
          confirmAccountNumber: ACHDetailsInfo.accountNumber,
        },
        bankAccountId: ACHDetailsInfo.bankAccountId,
      });
    }
  };

  handleChange = (name, { target }) => {
    const { value } = target;
    const newAchInfo = { ...this.state.achInfo };
    const numericFields = ["routingNumber"];
    const finalValue =
      numericFields.indexOf(name) > -1 ? value.replace(/[^0-9]/g, "") : value;
    if (name === "routingNumber") {
      if (finalValue?.length === 9) {
        this.onBlurRoutingCode(finalValue);
      }
      if (this.state.achInfo.bankName) {
        newAchInfo.bankName = "";
      }
    }
    newAchInfo[name] = finalValue;
    this.setState({
      achInfo: {
        ...newAchInfo,
      },
    });
    if (finalValue) {
      const newValidationInfo = {
        ...this.state.validationInfo,
        [name]: false,
      };
      this.setState({
        validationInfo: newValidationInfo,
      });
    }
  };

  onBlurRoutingCode = (finalValue) => {
    this.props
      .dispatch(
        fetchRoutingCodes({
          routingCode: finalValue,
          rowsPerPage: 10,
          page: 0,
        })
      )
      .then((response) => {
        if (!response) {
          return false;
        }
        if (this.props.payment.totalCount) {
          this.setState({
            achInfo: {
              ...this.state.achInfo,
              bankName: this.props.payment?.routingCodes[0]?.bankName,
            },
          });
        } else {
          this.setState({
            achInfo: {
              ...this.state.achInfo,
              bankName: "",
            },
          });
        }
      });
  };

  handleValidation = () => {
    const currentValidationInfo = {};
    const { t } = this.props;
    const {
      accountNumber,
      routingNumber,
      accountType,
      bankName,
      confirmAccountNumber,
    } = this.state.achInfo;

    let isError = false;

    if (!accountNumber || !accountNumber.trim().length) {
      currentValidationInfo.accountNumber = t(
        "updatedAccounts.error.accountNumberRequired"
      );
      isError = true;
    }

    if (!confirmAccountNumber || !confirmAccountNumber.trim().length) {
      currentValidationInfo.confirmAccountNumber = t(
        "updatedAccounts.error.confirmAccountNumber"
      );
      isError = true;
    } else if (
      confirmAccountNumber &&
      accountNumber &&
      confirmAccountNumber !== accountNumber
    ) {
      currentValidationInfo.confirmAccountNumber = t(
        "updatedAccounts.error.accountNumberSame"
      );
      isError = true;
    }

    if (!routingNumber || !routingNumber.trim().length) {
      currentValidationInfo.routingNumber = t(
        "updatedAccounts.error.routingNumberRequired"
      );
      isError = true;
    } else if (routingNumber.length !== 9) {
      currentValidationInfo.routingNumber = t(
        "updatedAccounts.error.routingNumberLength"
      );
      isError = true;
    }

    if (!accountType) {
      currentValidationInfo.accountType = t(
        "updatedAccounts.error.accountTypeRequired"
      );
      isError = true;
    }
    if (!bankName || !bankName.trim().length) {
      currentValidationInfo.bankName = t(
        "updatedAccounts.error.bankNameRequired"
      );
      isError = true;
    } else if (bankName.trim().length > 158) {
      currentValidationInfo.bankName = t(
        "updatedAccounts.error.bankNameLength"
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
    this.setState({
      validationInfo: currentValidationInfo,
    });
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

  handleACHInfoSave = (_) => {
    const {
      dispatch,
      paymentRegistration,
      alternateMethod,
      setNotificationMessage,
      t,
    } = this.props;
    const { selectedRemittanceConfigData, isRemittanceEnabled } =
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

      if (!this.state.bankAccountId) {
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
    const { selectedRemittanceConfigData, isRemittanceEnabled } =
      paymentRegistration;
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
    const finalAchInfoData = trim(this.state.achInfo);

    dispatch(
      createConsumerACHInfo({
        ...finalAchInfoData,
        remittanceDetails: remittanceData,
        preferenceType: alternateMethod
          ? preferencePaymentType.alternate
          : preferencePaymentType.preferred,
          otp: flag ? otp : null,
      })
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification("ACHInfo", true);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          alternateMethod
            ? t("updatedAccounts.message.successfulAlternatePaymentMethod")
            : t(
              "updatedAccounts.message.successfulACHPreferredPaymentUpdate",
              {
                timeSpan: paymentMethodsTimeSpan.ACH,
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
    this.setState({
      processingUpdate: true,
    });
    let remittanceData = null;
    const { selectedRemittanceConfigData } = paymentRegistration;
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
    const finalAchInfoData = trim(this.state.achInfo);
    dispatch(
      updateConsumerBankAchInfo({
        ...finalAchInfoData,
        remittanceDetails: remittanceData,
        preferenceType: alternateMethod
          ? preferencePaymentType.alternate
          : preferencePaymentType.preferred,
        bankAccountId: this.state.bankAccountId,
        otp: flag ? otp : null,
      })
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification("ACHInfo", false);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          alternateMethod
            ? t("updatedAccounts.message.successfulAlternatePaymentMethod")
            : t("updatedAccounts.message.successfulACHPreferredPaymentUpdate", {
              timeSpan: paymentMethodsTimeSpan.ACH,
            })
        );
        this.setState({
          processingUpdate: false,
        });
      }
    });
  };
  handleInputChange = ({ target }, name) => {
    const { value } = target;
    this.setState({
      achInfo: {
        ...this.state.achInfo,
        [name]: value,
      },
    });
    if (value && this.state.validationInfo[name]) {
      this.setState({
        validationInfo: {
          ...this.state.validationInfo,
          [name]: false,
        },
      });
    }
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

  selectBankDetails = (bankData) => {
    this.setState({
      achInfo: {
        ...this.state.achInfo,
        bankName: bankData?.bankName ?? "",
        routingNumber: bankData?.routingCode ?? "",
      },
      validationInfo: {
        ...this.state.validationInfo,
        bankName: false,
        routingNumber: false,
      },
    });
  };

  handleDialogClose = () => {
    this.setState({
      openSearchModal: false,
    });
  };

  render() {
    const {
      t,
      classes,
      payment,
      paymentRegistration,
      alternateMethod,
      closePaymentMethodsDialog,
      closeDialog,
      ...otherProps
    } = this.props;
    const { consumerPaymentDetails, remittanceStatus } = this.props.accounts;
    const secondaryPaymentMethodId =
      consumerPaymentDetails?.data?.secondaryPaymentMethodId;
    const { types } = payment;
    const {
      achInfo,
      validationInfo,
      notificationMessage,
      showMFA,
      phoneNum,
      phoneCode,createAcc,
    } = this.state;
    const labelToShow = t("updatedAccounts.ach.content.achInformation");
    return (
      <Grid container item display="flex" direction="row">
        <Grid container className={classes.achInfoOuterContainer}>
          <Box pb={2}>
            <Typography className={classes.achInfoHeading} gutterBottom>
              {labelToShow}
            </Typography>
          </Box>
          <Grid container item md={11} lg={11} spacing={2}>
            <Grid item xs={12} md={6} lg={6}>
              <AlphaNumericMaskInput
                required
                className={classes.alphaNumericTextField}
                label={t("updatedAccounts.label.accountNumber")}
                error={Boolean(validationInfo.accountNumber)}
                helperText={validationInfo.accountNumber}
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={achInfo.accountNumber || ""}
                name="accountNumber"
                getValue={(val) => {
                  this.setState({
                    achInfo: {
                      ...achInfo,
                      accountNumber: val,
                    },
                  });
                }}
                inputProps={{
                  maxLength: 17,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <AlphaNumericMaskInput
                required
                className={classes.alphaNumericTextField}
                label={t("updatedAccounts.label.confirmAccountNumber")}
                error={Boolean(validationInfo.confirmAccountNumber)}
                helperText={validationInfo.confirmAccountNumber}
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={achInfo.confirmAccountNumber || ""}
                name="confirmAccountNumber"
                getValue={(val) => {
                  this.setState({
                    achInfo: {
                      ...achInfo,
                      confirmAccountNumber: val,
                    },
                  });
                }}
                inputProps={{
                  maxLength: 17,
                }}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <TextField
                required
                label={t("updatedAccounts.label.routingNumber")}
                error={Boolean(validationInfo.routingNumber)}
                helperText={validationInfo.routingNumber}
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={this.state.achInfo.routingNumber}
                name="routingNumber"
                onChange={(e) => this.handleChange("routingNumber", e)}
                inputProps={{
                  maxLength: 9,
                  minLength: 9,
                }}
              />
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  this.setState({
                    openSearchModal: true,
                  });
                }}
                className={classes.searchRoutingText}
              >
                {t("updatedAccounts.label.searchBank")}
                <img
                  style={{ marginLeft: "4px" }}
                  src={SearchIcon}
                  alt="search"
                />
              </Link>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <TextField
                name="bankName"
                variant="outlined"
                label={t("updatedAccounts.label.bankName")}
                onChange={(e) => this.handleChange("bankName", e)}
                value={achInfo.bankName ?? ""}
                inputProps={{
                  maxLength: 158,
                }}
                required
                error={Boolean(validationInfo.bankName)}
                helperText={validationInfo.bankName}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <TextField
                required
                label={t("updatedAccounts.label.accountType")}
                error={validationInfo.accountType}
                helperText={validationInfo.accountType}
                select
                value={achInfo.accountType}
                variant="outlined"
                name="accountType"
                onChange={(event) => this.handleChange("accountType", event)}
              >
                <MenuItem value="">
                  <em>{t("updatedAccounts.label.select")}</em>
                </MenuItem>
                {types ? (
                  types.rows?.map((option) => (
                    <MenuItem
                      key={option.accountTypeId}
                      value={option.accountTypeId}
                    >
                      {option.description}
                    </MenuItem>
                  ))
                ) : (
                  <Box
                    width="100px"
                    display="flex"
                    mt={1.875}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress color="primary" />
                  </Box>
                )}
              </TextField>
            </Grid>
            {remittanceStatus?.data?.isRemittanceEnabled && !alternateMethod ? (
              <Grid item xs={12} md={12} lg={12}>
                <ConsumerEnrollmentRemittance
                  handleRemittanceEmailError={this.handleRemittanceEmailError}
                  remittanceEmailError={validationInfo.remittanceEmail}
                  {...otherProps}
                />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <CustomDialog
          showBtn={false}
          showCloseIcon={true}
          fullWidth={true}
          open={this.state.openSearchModal}
          onClose={() => this.handleDialogClose()}
          dialogClassName={classes.routingCodeDialog}
        >
          <RoutingCodeSearch
            onClose={this.handleDialogClose}
            onSelectBank={this.selectBankDetails}
          />
        </CustomDialog>
        {showMFA && (
          <Modal
            open={showMFA}
            onClose={() => this.setState({ showMFA: false })}
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
              onCancelClick={() => this.setState({ showMFA: false })}
              phoneNum={phoneNum}
              phoneCode={phoneCode}
              MFAType={"PostLoginMFA"}
            />
          </Modal>
        )}
        <Grid container justifyContent="center">
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
                onClick={(e) => this.handleACHInfoSave(e)}
                fullWidth
              >
                {alternateMethod && !secondaryPaymentMethodId
                  ? t("updatedAccounts.buttonLabel.add")
                  : t("updatedAccounts.buttonLabel.update")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {notificationMessage && this.renderSnackbar()}
      </Grid>
    );
  }
}

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.payment,
  ...state.accounts,
}))(withStyles(styles)(ACH));
