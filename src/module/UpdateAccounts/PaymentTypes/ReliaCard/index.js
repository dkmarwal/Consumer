import React, { Component } from "react";
import { connect } from "react-redux";
import { getMFAStatus } from "~/redux/helpers/user";
import {
  Grid,
  FormControlLabel,
  Typography,
  Box,
  Checkbox,
  Link,
  InputAdornment,
  Modal,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import EventIcon from "@material-ui/icons/Event";
import { withStyles } from "@material-ui/styles";
import { withTranslation } from "react-i18next";
import * as FileSaver from "file-saver";
import "react-datepicker/dist/react-datepicker.css";
import Notification from "~/components/Notification";
import Button from "~/components/Forms/Button";
import { compose } from "redux";
import styles from "./styles";
import TextField from "~/components/Forms/TextField";
import trim from "deep-trim-node";
import { preferencePaymentType } from "~/config/consumerEnrollmentConst";
import Phone from "~/components/TextBox/Phone";
import { createFocusreliaZelle } from "~/redux/actions/USBank/paymentRegistration";
import config from "~/config";
import { CountryIso, CityIso, StatesIso } from "~/components/CSC";
import MFA from "~/module/DFA/MFA";
import DatePicker from "react-datepicker";
import PreivewModal from "~/components/Model/PreviewModal.js";
import { downloadPrepaidCardFiles } from "~/redux/helpers/payments";
import FormViewer from "~/components/Disclouserform";
import Alert from "@material-ui/lab/Alert";
import {
  updateFocusreliaZelle,
  fetchConsumerPaymentDetails,
} from "~/redux/actions/accounts";
import { paymentMethodsTimeSpan } from "~/config/paymentMethods";
import { TimeoutDialog } from "~/components/Dialogs";
import ConfirmationDialog from "~/components/Dialogs/confirmationDialog";
class ReliaCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prepaidCardType: null,
      focusInfo: {
        infoType: "email",
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
        email: "",
        dateOfBirth: "",
        homePhone: "",
        phone: "",
        employerState: "",
        uniqueId: "",
        SSN: "",
        startDate: null,
        paymentTypeId: null,
        transactionId: null,
        TokenValue: null,
        countryCode: null,
        mobilePhone:null,
        govLocation:null,
        govExpiredDate:null,
        govIdType:null,
        govIdValue:null,
        isRegistered:null,
      },
      openPreviewDialog: false,
      showPreviewDialogLoader: false,
      imageFullPath: null,
      dataUrl: null,
      pdfviewe: null,
      validation: {},
      openAuthModal: false,
      showEmailInfo: true,
      isLoading: false,
      error: null,
      variant: null,
      isProcessing: false,
      paymentMethodShared: null,
      title: null,
      end: null,
      isackFlagAck: false,
      checkboxesState: {},
      showMFA: false,
      createAcc: null,
      phoneNum: "",
      phoneCode: "",
      flagForAck:false,
      formIDFlag:[],
      formId:null
    };
  }

  componentDidMount() {
    const { finalCardDetails } = this.props;
    const { focusInfo } = this.state;
    const { consumerPaymentDetails } = this.props.accounts;
    const PrepaidCardDetailsInfo =
      consumerPaymentDetails?.data?.consumerPrepaidCardDetails ?? null;
    this.setState({
      clientId: this.props?.user?.brandInfo?.clientId,
    });
    if (PrepaidCardDetailsInfo) {
      this.setState({
        focusInfo: {
          ...focusInfo,
          paymentTypeId: PrepaidCardDetailsInfo.paymentTypeId||null,
          transactionId: PrepaidCardDetailsInfo.transId||null,
          firstName: PrepaidCardDetailsInfo.firstName||null,
          lastName: PrepaidCardDetailsInfo.lastName||null,
          address1: PrepaidCardDetailsInfo.address1||null,
          address2: PrepaidCardDetailsInfo.address2||null,
          country: PrepaidCardDetailsInfo.country||null,
          state: PrepaidCardDetailsInfo.state||null,
          city: PrepaidCardDetailsInfo.city||null,
          postalCode: PrepaidCardDetailsInfo.postalCode||null,
          email: PrepaidCardDetailsInfo.emailId||null,
          startDate: PrepaidCardDetailsInfo.dateOfBirth ?(new Date(PrepaidCardDetailsInfo.dateOfBirth)):null,
          phone: PrepaidCardDetailsInfo.homePhone||null,
          mobilePhone: PrepaidCardDetailsInfo.mobilePhone||null,
          employerState: PrepaidCardDetailsInfo.employerState||null,
          govLocation: PrepaidCardDetailsInfo.govLocation||null,
          govExpiredDate:PrepaidCardDetailsInfo.govExpiredDate? new Date(PrepaidCardDetailsInfo.govExpiredDate):null,
          govIdValue:PrepaidCardDetailsInfo.govIdValue||null,
          govIdType:finalCardDetails.govIdValue||null,
          uniqueId: PrepaidCardDetailsInfo.uniqueId||null,
          SSN: PrepaidCardDetailsInfo.ssn,
          isRegistered:PrepaidCardDetailsInfo.isRegistered,
        },
        PPDDetailId: PrepaidCardDetailsInfo.id,
        flagForAck: PrepaidCardDetailsInfo.id ? true:false,
      });
    }
  }
  handleDOBActivatedAt = (date) => {
    const { focusInfo } = this.state;
    this.setState({
      focusInfo: {
        ...focusInfo,
        startDate: date,
      },
    });
  };
  handleexpiryActivatedAt = (date) => {
    const { focusInfo } = this.state;
    this.setState({
      focusInfo: {
        ...focusInfo,
        govExpiredDate: date,
      },
    });
  };
  verfi() {
    const { checkboxesState } = this.state;
    const {FormatList}=this.props;
    let arr = Object.values(checkboxesState);
    let flag = !(FormatList.length===arr.length) ? true : (arr.length ? arr.includes(false) : true);
    return flag;
  }
  handleChange = (name, e) => {
    const { value } = e.target;
    const { focusInfo } = this.state;
    let finalValue = "";

    switch (name) {
      case "postalCode":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;
      case "homePhone":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;
      case "phone":
        finalValue = value.phone;
        break;
      case "address1":
        finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
        break;
        case "address2":
          finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
          break;
      case "uniqueId":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;
      case "SSN":
        finalValue = value.replace(/[^0-9-]/g, "");
        break;
        case "govLocation":
          finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
          break;
        case "employerState":
          finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
          break;
          case "govIdValue":
            finalValue = value.replace(/[^0-9-]/g, "");
            break;         
      default:
        finalValue = value;
        break;
    }
    if (name === "country") {
      focusInfo.city = "";
      focusInfo.state = "";
    } else if (name === "state") {
      focusInfo.city = "";
    }
    this.setState({
      focusInfo: { ...focusInfo, [name]: finalValue },
    });
  };
  fetchFile = (formName,formId) => {
    this.setState({
      formId:formId,
      showPreviewDialogLoader: true,
    });
    this.props
      .dispatch(downloadPrepaidCardFiles(formName))
      .then((res) => {
        if (res && res.data) {
          const data = new Blob([res.data], {
            type: "application/pdf",
            encoding: "UTF-8",
          });
          const blob_url = URL.createObjectURL(data);
          this.setState({
            dataUrl: blob_url,
            showPreviewDialogLoader: false,
            pdfviewe: true,
            title: "ACKNOWLEDGE THE PRE-ACQUISITION DISCLOSURE & FEE SEHEDULE",
          });
          // this.setState({ dataUrl: blob_url });
        } else {
          this.setState({
            showPreviewDialogLoader: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          showPreviewDialogLoader: false,
        });
      });
  };
  handleDownload = (Doc) => {
    this.setState({
      showPreviewDialogLoader: true,
    });
    this.props
      .dispatch(downloadPrepaidCardFiles(Doc))
      .then((res) => {
        if (res && res.data) {
          const data = new Blob([res.data], {
            type: "application/pdf",
            encoding: "UTF-8",
          });
          FileSaver.saveAs(data, Doc);
          this.setState({
            showPreviewDialogLoader: false,
          });
        } else {
          this.setState({
            showPreviewDialogLoader: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          showPreviewDialogLoader: false,
        });
      });
  };

  handleOpenPreviewDialog = (formName) => {
    const itemName = formName
      ? formName
      : this.props.finalCardDetails?.cardUploadImageName;
    this.setState({
      showPreviewDialogLoader: true,
    });
    this.props
      .dispatch(downloadPrepaidCardFiles(itemName))
      .then((res) => {
        if (res && res.data) {
          const reader = new FileReader();
          reader.readAsDataURL(res.data);
          reader.onloadend = () => {
            const base64data = reader.result;
            this.setState({
              focusInfo: {
                ...this.state.focusInfo,
                imageFullPath: base64data,
              },
              openPreviewDialog: true,
              showPreviewDialogLoader: false,
              title: "WHAT WILL MY CARD LOOK LIKE ?",
              end: "CLOSE",
            });
          };
        } else {
          this.setState({
            showPreviewDialogLoader: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          showPreviewDialogLoader: false,
        });
      });
  };

  ackDoc = () => {
    let errorText = "";
    errorText = "Document Acknowledgment is required";
    this.setState({ docError: errorText, isackFlagAck: true });
  };

  handleShare = () => {
    const { paymentRegistration, alternateMethod, t,FormatList } = this.props;

    const { isRemittanceEnabled, selectedRemittanceConfigData } =
      paymentRegistration;
    const isValid = this.validateForm();

    // this.ackDoc();
    const flag = FormatList.length?this.verfi():false;
    if (!isValid) {
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
        isProcessing: true,
      });

      if (!this.state.PPDDetailId) {
        if (!alternateMethod) {
          const type = "payment_preference";
          getMFAStatus(type).then((response) => {
            if (!response) {
              this.setState({
                notificationVariant: "error",
                notificationMessage:
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
                createAcc: true,
              });
            } else {
              this.handleCreateAcc(false);
            }
          });
        } else {
          this.handleCreateAcc(false);
        }
      } else {
        if (!alternateMethod) {
          const type = "payment_preference";
          getMFAStatus(type).then((response) => {
            if (!response) {
              this.setState({
                notificationVariant: "error",
                notificationMessage:
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
                createAcc: false,
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
  handleCreateAcc = (flag) => {
    const { dispatch, alternateMethod, setNotificationMessage, t } = this.props;
    const getConsumerId = this.props?.DFA?.hasPymentTaken?.consumerId ?? null;
    const { finalCardDetails } = this.props;
    const { focusInfo } = this.state;
    this.setState({
      focusInfo: {
        ...focusInfo,
        paymentTypeId: finalCardDetails.paymentTypeId,
        transactionId: finalCardDetails.transId,
        govIdType:finalCardDetails.govIdValue,
      },
    });
    let remittanceData = null;
    const data = trim(this.state.focusInfo);
    dispatch(
      createFocusreliaZelle({
        ...data,
        remittanceDetails: remittanceData,
        preferenceType: preferencePaymentType.preferred,
        consumerID: getConsumerId,
      })
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification("focusInfo", true);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          alternateMethod
            ? t("updatedAccounts.message.successfulAlternatePaymentMethod")
            : t(
                "updatedAccounts.message.successfulCheckPreferredPaymentUpdate",
                {
                  paymentMethodName: "Relia Card",
                  timeSpan: paymentMethodsTimeSpan.USBankPrepaidCard,
                }
              )
        );
        this.setState({
          isProcessing: false,
        });
      }
    });
  };
  handleEditAcc = (flag) => {
    const { dispatch, alternateMethod, setNotificationMessage, t } = this.props;
    const { focusInfo, clientId, PPDDetailId } = this.state;
    const getConsumerId = this.props?.DFA?.hasPymentTaken?.consumerId ?? null;
    const data = trim(focusInfo);
    let remittanceData = null;
    dispatch(
      updateFocusreliaZelle({
        ...data,
        remittanceDetails: remittanceData,
        preferenceType: preferencePaymentType.preferred,
        consumerID: getConsumerId,
        PPDDetailId: PPDDetailId,
      })
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification("focusInfo", false);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          alternateMethod
            ? t("updatedAccounts.message.successfulAlternatePaymentMethod")
            : t(
                "updatedAccounts.message.successfulCheckPreferredPaymentUpdate",
                {
                  paymentMethodName: "Relia Card",
                  timeSpan: paymentMethodsTimeSpan.USBankPrepaidCard,
                }
              )
        );
        this.setState({
          isProcessing: false,
        });
      }
    });
  };
  handleClosePreviewDialog = () => {
    this.setState({
      openPreviewDialog: false,
    });
  };
  handleConfirmPreviewDialog=()=>{
    const{formId,formIDFlag}=this.state;
   formIDFlag.push(formId)
    console.log('sss',formIDFlag)
    this.setState({
      pdfviewe: false,
      okFlag:false,
      formIDFlag:formIDFlag,
    }); 
  }
  handleErrorNotification = (errorInAction) => {
    const { usbankpaymentRegistration, t } = this.props;
    this.setState({
      variant: "error",
      error:
        usbankpaymentRegistration[errorInAction]?.error ??
        t("paymentRegistration.somethingWentWrong"),
      isProcessing: false,
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
  routeToRegistrationCompletedPage = () => {
    const { usbankpaymentRegistration, location } = this.props;
    const { consumerPaymentTypesList } = usbankpaymentRegistration;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    if (consumerPaymentTypesList?.data?.alternatePaymentMethods.length > 0) {
      this.props.history.push({
        pathname: `${config.baseName}/${routeParam}/paymentRegistration/alternatePayment`,
        state: {
          paymentType: "USBankPrepaidCard",
          preferredMsg:
            usbankpaymentRegistration?.focusInfo?.data?.dynamicMessage,
          preferredFooterMsg: usbankpaymentRegistration.focusInfo
            ? usbankpaymentRegistration?.focusInfo?.data?.dynamicFooterMessage
            : "",
          isVerified: location?.state?.isVerified || "",
        },
      });
    } else this.pushToThankyouPage();
  };
  handlePhoneChange = (type, e) => {
    const { focusInfo } = this.state;
    this.setState({
      focusInfo: {
        ...focusInfo,
        TokenValue: e.target.value.phone.replace(/[^0-9-]/g, ""),
        countryCode: e.target.value.ccode,
      },
    });
  };
  handlecheckChange = (e, id) => {
    const { checkboxesState } = this.state;
    this.setState({
      checkboxesState: {
        ...this.state.checkboxesState,
        [id]: checkboxesState[id] ? false : true,
      },
      isackFlagAck: false,
    });
  };
  pushToThankyouPage = () => {
    const { usbankpaymentRegistration } = this.props;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    this.props.history.push({
      pathname: `${config.baseName}/${routeParam}/paymentRegistration/complete`,
      state: {
        paymentType: "USBankPrepaidCard",
        dynamicMessage:
          usbankpaymentRegistration?.focusInfo?.data?.dynamicMessage || "",
        dynamicFooterMessage:
          usbankpaymentRegistration?.focusInfo?.data?.dynamicFooterMessage ||
          "",
        isVerified: true,
      },
    });
  };

  validateForm = () => {
    let valid = true;
    let errorText = {};
    const { finalCardDetails } = this.props;
    const {
      firstName,
      lastName,
      infoType,
      phone,
      email,
      address1,
      address2,
      country,
      state,
      city,
      postalCode,
      SSN,
      startDate,
      govIdValue,
      homePhone,
      TokenValue,
      employerState,
      govLocation,
      govExpiredDate,
      mobilePhone,
    } = this.state.focusInfo;
    const { t } = this.props;
    if (
      finalCardDetails.isName &&
      (firstName === null ||
        (firstName !== null && firstName.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["firstName"] = t(
        "paymentRegistration.USbankFocusCard.error.firstName"
      );
    }
    if (
      finalCardDetails.isName &&
      (lastName === null ||
        (lastName !== null && lastName.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["lastName"] = t(
        "paymentRegistration.USbankFocusCard.error.lastName"
      );
    }
    if (
      finalCardDetails.isAddress &&
      (address1 === null ||
        (address1 !== null && address1.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["address1"] = t(
        "paymentRegistration.USbankFocusCard.error.address1"
      );
    }
    // if (
    //   finalCardDetails.isAddress &&
    //   (address2 === null ||
    //     (address2 !== null && address2.toString().trim().length === 0))
    // ) {
    //   valid = false;
    //   errorText["address2"] = t(
    //     "paymentRegistration.USbankFocusCard.error.address2"
    //   );
    // }
    if (
      finalCardDetails.isAddress &&
      (country === null ||
        (country !== null && country.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["country"] = t(
        "paymentRegistration.USbankFocusCard.error.country"
      );
    }
    if (
      finalCardDetails.isAddress &&
      (state === null ||
        (state !== null && state.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["state"] = t("paymentRegistration.USbankFocusCard.error.state");
    }
    if (
      finalCardDetails.isAddress &&
      (city === null || (city !== null && city.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["city"] = t("paymentRegistration.USbankFocusCard.error.city");
    }
    if (
      finalCardDetails.isAddress &&
      (postalCode === null ||
        (postalCode !== null && postalCode.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["postalCode"] = t(
        "paymentRegistration.USbankFocusCard.error.postalCode"
      );
    }else if ( finalCardDetails.isAddress && postalCode.toString().trim().length < 5) {
      valid = false;
      errorText["postalCode"] = t(
        "paymentRegistration.USbankFocusCard.error.postalCodemin"
      );
    }
    if (
      finalCardDetails.isEmployeeState &&
      (employerState === null ||
        (employerState !== null &&
          employerState.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["employerState"] = t(
        "paymentRegistration.USbankFocusCard.error.employerState"
      );
    }else if (finalCardDetails.isEmployeeState &&employerState.toString().trim().length < 2) {
      valid = false;
      errorText["employerState"] = t(
        "paymentRegistration.USbankFocusCard.error.employerStatemin"
      );
    }
  
    if (
      finalCardDetails.isGovLocation &&
      (govLocation === null ||
        (govLocation !== null &&
          govLocation.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["govLocation"] = t(
        "paymentRegistration.USbankFocusCard.error.govLocation"
      );
    }
    if (
      finalCardDetails.isSsn &&
      (SSN === null || (SSN !== null && SSN.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["SSN"] = t("paymentRegistration.USbankFocusCard.error.SSN");
    }
    if (finalCardDetails.isDateOfBirth && startDate === null) {
      valid = false;
      errorText["dateOfBirth"] = t(
        "paymentRegistration.USbankFocusCard.error.dateOfBirth"
      );
    }
    if (finalCardDetails.govIdTypeId && govExpiredDate === null) {
      valid = false;
      errorText["govExpiredDate"] = t(
        "paymentRegistration.USbankFocusCard.error.govExpiredDate"
      );
    }
    if (finalCardDetails.govIdTypeId && govIdValue === null) {
      valid = false;
      errorText["govIdValue"] = t(
        "paymentRegistration.USbankFocusCard.error.govIdValue"
      );
    }
    if (
      finalCardDetails.isHomePhone &&
      (phone === null ||
        (phone !== null && phone.toString().trim().length !== 10))
    ) {
      if ( finalCardDetails.isHomePhone &&(!phone || !phone?.trim()?.length)) {
        valid = false;
        errorText["phone"] = t(
          "paymentRegistration.USbankFocusCard.error.phoneNumber"
        );
      } 
      // else if ( finalCardDetails.isHomePhone &&phone.toString().trim().length !== 10) {
      //   valid = false;
      //   errorText["phone"] = t(
      //     "paymentRegistration.USbankFocusCard.error.phoneLength"
      //   );
      // }
    }
    if (
      finalCardDetails.isMobilePhone &&(mobilePhone === null ||
      (mobilePhone !== null &&
      mobilePhone.toString().trim().length !== 10))
    ) {
      if (finalCardDetails.isMobilePhone &&(!mobilePhone || !mobilePhone?.trim()?.length)) {
        valid = false;
        errorText["mobilePhone"] = t(
          "paymentRegistration.USbankFocusCard.error.phoneNumber"
        );
      } else if (finalCardDetails.isMobilePhone &&(mobilePhone.toString().trim().length !== 10)) {
        valid = false;
        errorText["mobilePhone"] = t(
          "paymentRegistration.USbankFocusCard.error.phoneLength"
        );
      }
    }
    if (finalCardDetails.isEmail && infoType === "email" && email !== null) {
      const userEmail = email !== null && email.toString().trim().toLowerCase();
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (finalCardDetails.isEmail && email.toString().trim().length === 0) {
        valid = false;
        errorText["email"] = t(
          "paymentRegistration.USbankFocusCard.error.email"
        );
      } else {
        if (finalCardDetails.isEmail && !re.test(userEmail)) {
          valid = false;
          errorText["email"] = t(
            "paymentRegistration.USbankFocusCard.error.emailValid"
          );
        }
      }
    }

    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };
  handleCloseFaq = () => {
    this.setState({ pdfviewe: false });
  };

  handleModalCloseIcon = () => {
    this.setState({
      openAuthModal: false,
    });
    if (this.props.user && this.props.user.isLoggedIn) {
      this.routeToRegistrationCompletedPage();
    }
  };
  handleRadioButton = (e) => {
    this.setState({
      prepaidCardType: e.target.value,
    });
  };

  render() {
    const {
      usbankpaymentRegistration,
      classes,
      t,
      paymentAuthentication,
      token,
      FormatList,
      finalCardDetails,
      showMFA,
      createAcc,
      phoneNum,
      phoneCode,
      closeDialog,
      alternateMethod,
      alertMsg,
      openConfirmationDialog,
      notificationMessage,
      ...otherProps
    } = this.props;
    const { consumerPaymentDetails } = this.props.accounts;
    const secondaryPaymentMethodId =
      consumerPaymentDetails?.data?.secondaryPaymentMethodId;
    const { focusInfo, validation, variant, error,  isProcessing,flagForAck,formIDFlag} = this.state;
    const { isRegistered } = this.state.focusInfo;
    const { consumerPaymentTypesList } = usbankpaymentRegistration;
    const { paymentsData } = paymentAuthentication;
    const { remittanceStatus } = this.props.accounts;
    const loggedIn = this.props.user && this.props.user.isLoggedIn;
    return (
      <>
        <Grid container item className={classes.root}>
          <Grid item xs={12} lg={8} className={classes.headingCont}>
            <Typography className={classes.prepaidHeading}>
              {t("paymentRegistration.heading.ReliaCard")}
            </Typography>
          </Grid>
          <Grid item xs={12} lg={8} className={classes.headingCont}>
            <Box className={classes.Disclosuretext}> 
               {finalCardDetails.addPredisclosureText} </Box>
          </Grid>
       {/* {FormatList.length?   <Grid style={{ display: "flex", paddingTop: "20px" }}>
            <Box>{t("paymentRegistration.FocusCard.info.acknowledgement")}</Box>
          </Grid>:null} */}

          {/* <Typography noWrap className={classes.link}> */}
          {FormatList.map((item) => {
            return (
              <>
                <Grid item xs={12} lg={12} className={classes.headingCont}>
                  <Box className={classes.link} my={1}>
                    <Link
                       component="body2"
                      onClick={() => {
                        this.fetchFile(item.fileActualName,item.ndaFileId);
                      }}
                      className={classes.link}
                      key={5}
                      rel="noopener"
                    >
                      {/* {" "}
    <HelpOutlineIcon className={classes.fontSizeSmall} />{" "} */}
                      {item.fileActualName}
                    </Link>
                    <IconButton
                      color="primary"
                      aria-label="download"
                      component="span"
                      size="small"
                      onClick={() => this.handleDownload(item.fileActualName)}
                    >
                      <GetAppIcon color="primary" fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={8} className={classes.headingCont}>
                  <FormControlLabel
                     control={
                      <Checkbox
                        checked={
                          flagForAck? true:
                          (this.state.checkboxesState[item.ndaFileId]
                            ? true
                            : false)
                        }
                        disabled={flagForAck?flagForAck:!(formIDFlag.includes(item.ndaFileId))}
                        // checked={false}
                        onChange={(e) =>
                          this.handlecheckChange(e, item.ndaFileId)
                        }
                        // disabled={disableEdit}
                        // disabled={true}
                        name="paymentAuthNonCDM"
                        color="primary"
                      />
                    }
                    label={t("paymentRegistration.FocusCard.info.acknowledge")}
                    className={classes.ack}
                  />
                </Grid>
                {this.state.isackFlagAck &&
                  !this.state.checkboxesState[item.ndaFileId] && (
                    <Grid item xs={12} lg={8} className={classes.headingCont}>
                      <Alert
                        severity="error"
                        variant=""
                        className={classes.error}
                      >
                        {this.state.docError}
                      </Alert>
                      {/* <Box className={classes.error}>{this.state.docError}</Box> */}
                    </Grid>
                  )}
              </>
            );
          })}

{this.props.finalCardDetails?.cardUploadImageName?  <Grid item xs={12} lg={8} className={classes.headingCont}>
            <Box className={classes.link} my={1}>
              <Link
                component="button"
                onClick={() => {
                  this.handleOpenPreviewDialog();
                }}
                className={classes.link}
                key={5}
                rel="noopener"
              >
                {/* {" "}
                <LockIcon className={classes.fontSizeSmall} filled />{" "} */}
                {t("paymentRegistration.FocusCard.info.Card")}
              </Link>
            </Box>
          </Grid>:<></>}
          <Grid item xs={12} lg={8} className={classes.headingCont}>
            <Box className={classes.Disclosuretext}> 
             {finalCardDetails.addVerbiageText} 
            </Box>
          </Grid>
          <Grid item xs={12} lg={8} className={classes.headingCont}>
            <Box>{t("paymentRegistration.FocusCard.info.mailimgaddress")}</Box>
          </Grid>
          <Box pt={2}>
            <Grid container item spacing={2}>
              <Grid item container spacing={2} xs={12} md={12} lg={12}>
              {finalCardDetails.isName   ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <TextField
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.firstName"
                      )}
                      error={validation.firstName}
                      helperText={validation.firstName}
                      value={focusInfo.firstName || ""}
                      name="firstName"
                      inputProps={{
                        maxLength: 35,
                      }}
                      onChange={(e) => this.handleChange("firstName", e)}
                      disabled={isRegistered?true:false}
                      required
                    />
                  </Grid>
                ) : null}

                {finalCardDetails.isName ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <TextField
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.lastName"
                      )}
                      error={validation.lastName}
                      helperText={validation.lastName}
                      value={focusInfo.lastName || ""}
                      name="lastName"
                      inputProps={{
                        maxLength: 35,
                      }}
                      onChange={(e) => this.handleChange("lastName", e)}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}
                {finalCardDetails.isEmail ? (
                  <Grid item xs={12} md={10} lg={10}>
                    <TextField
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.email"
                      )}
                      error={validation.email}
                      helperText={validation.email}
                      value={focusInfo.email || ""}
                      name="email"
                      inputProps={{
                        maxLength: 48,
                      }}
                      onChange={(e) => this.handleChange("email", e)}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}
                {finalCardDetails.isAddress ? (
                  <Grid item xs={12} md={10} lg={10}>
                    <TextField
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.addressLine1"
                      )}
                      error={validation.address1}
                      helperText={validation.address1}
                      value={focusInfo.address1 || ""}
                      name="address1"
                      inputProps={{
                        maxLength: 35,
                      }}
                      onChange={(e) => this.handleChange("address1", e)}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}
                {finalCardDetails.isAddress ? (
                  <Grid item xs={12} md={10} lg={10}>
                    <TextField
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.addressLine2"
                      )}
                      error={validation.address2}
                      helperText={validation.address2}
                      value={focusInfo.address2 || ""}
                      name="address2"
                      inputProps={{
                        maxLength: 35,
                      }}
                      onChange={(e) => this.handleChange("address2", e)}
                      disabled={isRegistered}
                    />
                  </Grid>
                ) : null}
                {finalCardDetails.isAddress ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <CountryIso
                      name="country"
                      label={t("paymentRegistration.label.country")}
                      selectedCountry={(focusInfo && focusInfo.country) || ""}
                      error={validation.country}
                      helperText={validation.country}
                      onChange={(e) => this.handleChange("country", e)}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}
                {finalCardDetails.isAddress ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <TextField
                      required
                      error={validation.postalCode}
                      helperText={validation.postalCode}
                      fullWidth={true}
                      autoComplete="off"
                      variant="outlined"
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.zipCode"
                      )}
                      value={(focusInfo && focusInfo.postalCode) || ""}
                      name="postalCode"
                      inputProps={{
                        minLength:5,
                        maxLength: 10,
                      }}
                      disabled={isRegistered}
                      onChange={(e) => this.handleChange("postalCode", e)}
                    />
                  </Grid>
                ) : null}
                {finalCardDetails.isAddress ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <StatesIso
                      name="state"
                      label={t("paymentRegistration.label.state")}
                      error={validation.state}
                      helperText={validation.state}
                      selectedState={(focusInfo && focusInfo.state) || ""}
                      selectedCountry={(focusInfo && focusInfo.country) || ""}
                      onChange={(e) => this.handleChange("state", e)}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}

                {finalCardDetails.isAddress ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <CityIso
                      name="city"
                      label={t("paymentRegistration.label.city")}
                      error={validation.city}
                      helperText={validation.city}
                      selectedState={(focusInfo && focusInfo.state) || ""}
                      selectedCountry={(focusInfo && focusInfo.country) || ""}
                      selectedCity={(focusInfo && focusInfo.city) || ""}
                      onChange={(e) => this.handleChange("city", e)}
                      disabled={isRegistered}
                      required
                    />{" "}
                  </Grid>
                ) : null}
                {finalCardDetails.isDateOfBirth ? (
                  <Grid item xs={12} md={12} lg={5}>
                    <DatePicker
                      customInput={
                        <TextField
                          label={t(
                            "paymentRegistration.USbankFocusCard.label.dateOfBirth"
                          )}
                          error={validation.dateOfBirth}
                          // onChange={(e) => this.handleChange("date", e)}
                          helperText={validation.dateOfBirth}
                          // value={plasticCardInfo.dateOfBirth || ""}
                          // selected={this.state.startDate}
                          // name="dateOfBirth"
                          className="fullWidth"
                          color="primary"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <EventIcon
                                  fontSize="small"
                                  style={{ cursor: "pointer" }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      }
                      name="startDate"
                      placeholderText={"Date of Birth"}
                      dateFormat="MM/dd/yyyy"
                      className={classes.datePicker}
                      selected={this.state.focusInfo.startDate}
                      maxDate={new Date()}
                      showYearDropdown
                      yearDropdownItemNumber={115}
                      dropdownMode="select"
                      // selected={this.state.startDate}
                      onChange={this.handleDOBActivatedAt}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}

                {finalCardDetails.isSsn ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <TextField
                      label={t("paymentRegistration.USbankFocusCard.label.SSN")}
                      error={validation.SSN}
                      helperText={validation.SSN}
                      value={focusInfo.SSN || ""}
                      name="SSN"
                      inputProps={{
                        // minLength: 9,
                        maxLength: 9,
                      }}
                      onChange={(e) => this.handleChange("SSN", e)}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}

                {finalCardDetails.isHomePhone ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <Phone
                      isExt={false}
                      error={validation.phone}
                      helperText={validation.phone}
                      id="phone"
                      name="phone"
                      ext=""
                      value={focusInfo.phone || ""}
                      inputProps={{
                        maxLength: 20,
                      }}
                      ccode=""
                      prefixCcode="+1"
                      // ccodeDisabled={!getZelleTokenFromConsumer}
                      onChange={(e) => this.handleChange("phone", e)}
                      disabled={isRegistered}
                      required
                      // disabled={!getZelleTokenFromConsumer}
                    />
                  </Grid>
                ) : null}
                {finalCardDetails.isMobilePhone ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <TextField
                      label={t(
                        "paymentRegistration.plasticCard.label.mobilePhone"
                      )}
                      error={validation.mobilePhone}
                      helperText={validation.mobilePhone}
                      value={focusInfo.mobilePhone || ""}
                      name="mobilePhone"
                      inputProps={{
                        minLength: 10,
                        maxLength: 10,
                      }}
                      onChange={(e) => this.handleChange("mobilePhone", e)}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}
                {finalCardDetails.isEmployeeState ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <TextField
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.employerState"
                      )}
                      error={validation.employerState}
                      helperText={validation.employerState}
                      value={focusInfo.employerState || ""}
                      name="employerState"
                      inputProps={{
                        minLength:2,
                        maxLength: 4,
                      }}
                      onChange={(e) => this.handleChange("employerState", e)}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}
                {finalCardDetails.isGovLocation ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <TextField
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.govLocation"
                      )}
                      error={validation.govLocation}
                      helperText={validation.govLocation}
                      value={focusInfo.govLocation || ""}
                      name="govLocation"
                      inputProps={{
                        maxLength: 20,
                      }}
                      onChange={(e) => this.handleChange("govLocation", e)}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}
                  {finalCardDetails.govIdTypeId ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <TextField
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.govIdType"
                      )}
                      value={focusInfo.govIdType}
                      name="govIdType"
                      disabled={true}
                      
                    />
                  </Grid>
                ) : null}
                  {finalCardDetails.govIdTypeId ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <TextField
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.govIdValue"
                      )}
                      error={validation.govIdValue}
                      helperText={validation.govIdValue}
                      value={focusInfo.govIdValue || ""}
                      name="govIdValue"
                      inputProps={{
                        maxLength: 50,
                      }}
                      onChange={(e) => this.handleChange("govIdValue", e)}
                      disabled={isRegistered}
                      required
                    />
                  </Grid>
                ) : null}
                {finalCardDetails.govIdTypeId ?
               (
                <Grid item xs={12} md={12} lg={5}>
                  <DatePicker
                    customInput={
                      <TextField
                        label={t(
                          "paymentRegistration.USbankFocusCard.label.govExpiredDate"
                        )}
                        error={validation.govExpiredDate}
                        helperText={validation.govExpiredDate}
                        name="govExpiredDate"
                        className="fullWidth"
                        color="primary"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <EventIcon
                                fontSize="small"
                                style={{ cursor: "pointer" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    }
                    placeholderText={t(
                      "paymentRegistration.USbankFocusCard.label.govExpiredDate"
                    )}
                    dateFormat="MM/dd/yyyy"
                    className={classes.datePicker}
                    selected={focusInfo.govExpiredDate}
                    minDate={new Date()}
                    // selected={this.state.startDate}
                    onChange={this.handleexpiryActivatedAt}
                    disabled={isRegistered}
                    required
                  />
                </Grid>
              ) 
                 : null}
                {finalCardDetails.isUniqueId ? (
                  <Grid item xs={12} md={5} lg={5}>
                    <TextField
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.uniqueId"
                      )}
                      error={validation.uniqueId}
                      helperText={validation.uniqueId}
                      value={focusInfo.uniqueId || ""}
                      name="uniqueId"
                      inputProps={{
                        maxLength: 50,
                      }}
                      onChange={(e) => this.handleChange("uniqueId", e)}
                      disabled={isRegistered}
                    />
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Box>

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
                      createAcc
                        ? this.handleCreateAcc(true)
                        : this.handleEditAcc(true);
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
          <Grid item container xs={12} justifyContent="center">
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
                 { !isRegistered && <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => this.handleShare(e)}
                    fullWidth
                  >
                    {alternateMethod && !secondaryPaymentMethodId 
                      ? t("updatedAccounts.buttonLabel.add")
                      : t("updatedAccounts.buttonLabel.update")}
                  </Button>}
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
        <Backdrop
          className={classes.backdrop}
          open={this.state.showPreviewDialogLoader}
        >
          <CircularProgress color="primary" />
        </Backdrop>
        <PreivewModal
          dialogTitle={this.state.title}
          imageLocation={this.state.focusInfo.imageFullPath}
          confirmButton={this.state.end}
          handleClose={this.handleClosePreviewDialog}
          open={this.state.openPreviewDialog}
        />

        <Backdrop
          className={classes.backdrop}
          open={this.state.showPreviewDialogLoader}
        >
          <CircularProgress color="primary" />
        </Backdrop>
        <FormViewer
          dialogTitle={this.state.title}
          open={this.state.pdfviewe}
          dataUrl={this.state.dataUrl}
          handleClose={this.handleCloseFaq}
          handleConfirm={this.handleConfirmPreviewDialog}
          formId={this.state.formId}
        />
        {notificationMessage && this.renderSnackbar()}
        {alertMsg ? (
          <TimeoutDialog
            open={alertMsg}
            msgText={t("updatedAccounts.message.checkAlternatePaymentMethod")}
          />
        ) : null}
        <ConfirmationDialog
          handleClose={() => {
            this.handleConfirmationDialogClose();
          }}
          open={openConfirmationDialog}
          dialogContentText={t(
            "paymentRegistration.depositToDebit.message.confirmationText"
          )}
          cancelButtonName={t("paymentRegistration.button.OK")}
        />
      </>
    );
  }
}

export default connect((state) => ({
  ...state.usbankpaymentRegistration,
  ...state.paymentAuthentication,
  ...state.paymentRegistration,
  ...state.accounts,
  ...state.user,
  ...state.DFA,
}))(compose(withTranslation("common"), withStyles(styles))(ReliaCard));
