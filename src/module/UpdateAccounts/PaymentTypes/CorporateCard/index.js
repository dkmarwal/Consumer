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
  Radio,
  RadioGroup,
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
import { createCorporatZelle } from "~/redux/actions/USBank/paymentRegistration";
import config from "~/config";
import { CountryIso, CityIso, StatesIso } from "~/components/CSC";
import MFA from "~/module/DFA/MFA";
import PreivewModal from "~/components/Model/PreviewModal.js";
import { downloadPrepaidCardFiles } from "~/redux/helpers/payments";
import FormViewer from "~/components/Disclouserform";
import Alert from "@material-ui/lab/Alert";
import {
  updatecorporateZelle,
  fetchConsumerPaymentDetails,
} from "~/redux/actions/accounts";
import { paymentMethodsTimeSpan } from "~/config/paymentMethods";
import { TimeoutDialog } from "~/components/Dialogs";
import ConfirmationDialog from "~/components/Dialogs/confirmationDialog";
import { paymentMethodIds,transactionIds,CorporateCardconsts } from "~/config/paymentMethods";
class corporateCard extends Component {
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
        
        paymentTypeId: null,
        transactionId: null,
        
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
      checkboxesState: false,
      showMFA: false,
      createAcc: null,
      phoneNum: "",
      phoneCode: "",
      prepaidCardTypeit:[paymentMethodIds.PlasticCorporateCard],
      fileActualName:CorporateCardconsts["disclouserform"],
      cardmsg:CorporateCardconsts["PlasticCard"],
    };
  }

  componentDidMount() {
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
          paymentTypeId: PrepaidCardDetailsInfo.paymentTypeId,
        transactionId: PrepaidCardDetailsInfo.transId,
          firstName: PrepaidCardDetailsInfo.firstName||null,
          lastName: PrepaidCardDetailsInfo.lastName||null,
          address1: PrepaidCardDetailsInfo.address1||null,
          address2: PrepaidCardDetailsInfo.address2||null,
          country: PrepaidCardDetailsInfo.country||null,
          state: PrepaidCardDetailsInfo.state||null,
          city: PrepaidCardDetailsInfo.city||null,
          postalCode: PrepaidCardDetailsInfo.postalCode||null,
          email: PrepaidCardDetailsInfo.emailId||null,
         
          isRegistered:PrepaidCardDetailsInfo.isRegistered,
        },
        PPDDetailId: PrepaidCardDetailsInfo.id,
        flagForAck: PrepaidCardDetailsInfo.id ? true:false,
        cardmsg:PrepaidCardDetailsInfo.paymentTypeId===paymentMethodIds["PlasticCorporateCard"]?CorporateCardconsts["PlasticCard"]:PrepaidCardDetailsInfo.paymentTypeId===paymentMethodIds["DigitalCorporateCard"]?CorporateCardconsts["DigitalCard"]:"",
      });
    }
    else{
      const { corporateCardData
      } = this.props;
      const { focusInfo } = this.state;
      this.setState({
        focusInfo: {
          ...focusInfo,
          paymentTypeId: corporateCardData?.length===1 ? corporateCardData[0]?.paymentTypeId:paymentMethodIds.PlasticCorporateCard,
          transactionId: corporateCardData?.length===1 ? corporateCardData[0]?.transId: transactionIds["PlasticCorporateCard"],
        },
        cardmsg:corporateCardData[0]?.paymentTypeId===paymentMethodIds["PlasticCorporateCard"]?CorporateCardconsts["PlasticCard"]:corporateCardData[0]?.paymentTypeId===paymentMethodIds["DigitalCorporateCard"]?CorporateCardconsts["DigitalCard"]:CorporateCardconsts["PlasticCard"],
      });  
    }
  }
  handleRadioButton = ({ target }) => {
    const { value } = target;
    const { focusInfo,prepaidCardTypeit } = this.state;
    this.setState({
      prepaidCardTypeit: [parseInt(value)],
      cardmsg:parseInt(value)===paymentMethodIds["PlasticCorporateCard"]?"Corporate-Plastic-Card.png":"Corporate-Digital-Card.png",
      paymentTypeId:parseInt(value),
    });
    this.setState({
      focusInfo: {
        ...focusInfo,
        paymentTypeId:parseInt(value),
        transactionId: transactionIds["PlasticCorporateCard"],
      },
    });
  };
  // verfi() {
  //   const { checkboxesState } = this.state;
  //   let arr = Object.values(checkboxesState);
  //   let flag = arr.length ? arr.includes(false) : true;
  //   return flag;
  // }
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
  fetchFile = (formName) => {
    this.setState({
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
  handleConfirmPreviewDialog=()=>{
    this.setState({
      formIDFlag:true,
      pdfviewe: false
    }); 
  }
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
    this.ackDoc();
    const flag = this.state.checkboxesState;

   
   
    if (isValid && flag) {
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
      } 
      else {
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
  
    let remittanceData = null;
    const data = trim(this.state.focusInfo);
    dispatch(
      createCorporatZelle({
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
                  paymentMethodName: this.state.paymentTypeId===paymentMethodIds["PlasticCorporateCard"]?"Plastic Card":"Digital card",
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
    const data = trim(focusInfo);
    let remittanceData = null;
    dispatch(
      updatecorporateZelle({
        ...data,
        remittanceDetails: remittanceData,
        preferenceType: preferencePaymentType.preferred,
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
                  paymentMethodName: this.state.paymentTypeId===paymentMethodIds["PlasticCorporateCard"]?"Plastic Card":"Digital card",
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
     
    } = this.state.focusInfo;
    const { t } = this.props;
    if (
      
      (firstName === null ||
        (firstName !== null && firstName.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["firstName"] = t(
        "paymentRegistration.USbankFocusCard.error.firstName"
      );
    }
    if (
    
      (lastName === null ||
        (lastName !== null && lastName.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["lastName"] = t(
        "paymentRegistration.USbankFocusCard.error.lastName"
      );
    }
    if (
      
      (address1 === null ||
        (address1 !== null && address1.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["address1"] = t(
        "paymentRegistration.USbankFocusCard.error.address1"
      );
    }
    if (
   
      (address2 === null ||
        (address2 !== null && address2.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["address2"] = t(
        "paymentRegistration.USbankFocusCard.error.address2"
      );
    }
    if (
   
      (country === null ||
        (country !== null && country.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["country"] = t(
        "paymentRegistration.USbankFocusCard.error.country"
      );
    }
    if ( 
      (state === null ||
        (state !== null && state.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["state"] = t("paymentRegistration.USbankFocusCard.error.state");
    }
    if (
     
      (city === null || (city !== null && city.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["city"] = t("paymentRegistration.USbankFocusCard.error.city");
    }
    if (
    
      (postalCode === null ||
        (postalCode !== null && postalCode.toString().trim().length === 0))
    ) {
      valid = false;
      errorText["postalCode"] = t(
        "paymentRegistration.USbankFocusCard.error.postalCode"
      );
    }else if (postalCode.toString().trim().length < 5) {
      valid = false;
      errorText["postalCode"] = t(
        "paymentRegistration.USbankFocusCard.error.postalCodemin"
      );
    }
  
    if ( infoType === "email" && email !== null) {
      const userEmail = email !== null && email.toString().trim().toLowerCase();
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (email.toString().trim().length === 0) {
        valid = false;
        errorText["email"] = t(
          "paymentRegistration.USbankFocusCard.error.email"
        );
      } else {
        if (!re.test(userEmail)) {
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
      corporateCardData,
      ...otherProps
    } = this.props;
   
    const { consumerPaymentDetails } = this.props.accounts;
    const secondaryPaymentMethodId =
      consumerPaymentDetails?.data?.secondaryPaymentMethodId;
    const { focusInfo, validation, variant, error, isRegistered, isProcessing,prepaidCardTypeit,fileActualName,cardmsg,flagForAck,formIDFlag } = this.state;
    
    return (
      <>
        <Grid container item className={classes.root}>
          <Grid item xs={12} lg={8} className={classes.headingCont}>
            <Typography className={classes.prepaidHeading}>
            {t("paymentRegistration.heading.corporateReward")}
            </Typography>
          </Grid>
          <div>
          <Grid style={{ display: "flex" }}>
            <Box>{t("paymentRegistration.digitalCard.info.document")}</Box>
          </Grid>
          {  this.state.PPDDetailId? 
          (focusInfo.paymentTypeId=== paymentMethodIds.PlasticCorporateCard?
            <Grid style={{ display: "flex", paddingTop:"15px"}}><Box>  {t("paymentRegistration.digitalCard.info.PlasticCard")}</Box> </Grid>:
             <Grid style={{ display: "flex",paddingTop:"15px" }}> <Box> {t("paymentRegistration.digitalCard.info.DigitalCard")}</Box></Grid>):
             corporateCardData.length===1?  focusInfo.paymentTypeId=== paymentMethodIds.PlasticCorporateCard?
          <Grid style={{ display: "flex", paddingTop:"15px"}}><Box>  {t("paymentRegistration.digitalCard.info.PlasticCard")}</Box> </Grid>:
           <Grid style={{ display: "flex",paddingTop:"15px" }}> <Box> {t("paymentRegistration.digitalCard.info.DigitalCard")}</Box></Grid>:
              <RadioGroup
              name='prepaidCardTypes'
              value={prepaidCardTypeit[0]}
              row
              style={{ marginBottom: '8px', paddingLeft: '10px' }}
              onChange={(e) => this.handleRadioButton(e)}
            >
              
               {   corporateCardData.map((elem)=>{
               
                  return (
                    <FormControlLabel
                      key={elem.paymentTypeId}
                      value={elem.paymentTypeId}
                      control={<Radio color='primary' />}
                      label={elem.paymentTypeId===paymentMethodIds.PlasticCorporateCard?"Plastic card":"Digital Card"}
                    />
                  );})}
              
            </RadioGroup>

             }
            
          </div>
         

          {/* <Typography noWrap className={classes.link}> */}
          <Grid item xs={12} lg={12} className={classes.headingCont}>
                  <Box className={classes.link} my={1}>
                    <Link
                      component="body2"
                      onClick={() => {
                        this.fetchFile(fileActualName);
                      }}
                      className={classes.link}
                      key={5}
                      rel="noopener"
                    >
                      {/* {" "}
    <HelpOutlineIcon className={classes.fontSizeSmall} />{" "} */}
                    {t("paymentRegistration.digitalCard.info.Agreement")}
                    </Link>
                   
                  </Box>
                </Grid>
                <Grid item xs={12} lg={8} className={classes.headingCont}>
                  <FormControlLabel
                    control={
                      <Checkbox
                       
                        checked={
                          flagForAck? true:
                          this.state.checkboxesState
                        }
                        // checked={false}
                        onChange={(e) =>
                          this.handlecheckChange(e)
                        }
                        disabled={flagForAck?flagForAck:formIDFlag}
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
                  !this.state.checkboxesState&&
                   (
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
           

          <Grid item xs={12} lg={8} className={classes.headingCont}>
            <Box className={classes.link} my={1}>
              <Link
                component="button"
                onClick={() => {
                  this.handleOpenPreviewDialog(cardmsg);
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
          </Grid>
          {focusInfo.paymentTypeId=== paymentMethodIds.PlasticCorporateCard?
          <Grid item xs={12} lg={8} className={classes.headingCont}>
            <Box className={classes.Disclosuretext}> 
            
            {t("paymentRegistration.digitalCard.info.PlasticDisclosure")}
            </Box>
          </Grid>:
          <Grid item xs={12} lg={8} className={classes.headingCont}>
          <Box className={classes.Disclosuretext}> 
          
          {t("paymentRegistration.digitalCard.info.DigitalDisclosure")}
          </Box>
        </Grid>
        
        
        }
    

          {/* <Typography noWrap className={classes.link}> */}
         
          <Grid item xs={12} lg={8} className={classes.headingCont}>
            <Box>{t("paymentRegistration.FocusCard.info.mailimgaddress")}</Box>
          </Grid>
          <Box pt={2}>
            <Grid container item spacing={2}>
              <Grid item container spacing={2} xs={12} md={12} lg={12}>
            
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
                      disabled={flagForAck? flagForAck:isRegistered}
                      onChange={(e) => this.handleChange("firstName", e)}
                      required
                    />
                  </Grid>
              

              
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
                      disabled={flagForAck? flagForAck:isRegistered}
                      required
                    />
                  </Grid>
               
              
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
                        maxLength: 100,
                      }}
                      onChange={(e) => this.handleChange("email", e)}
                      disabled={flagForAck? flagForAck:isRegistered}
                      required
                    />
                  </Grid>
              
               
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
                      disabled={flagForAck? flagForAck:isRegistered}
                      required
                    />
                  </Grid>
              
            
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
                      disabled={flagForAck? flagForAck:isRegistered}
                      required
                    />
                  </Grid>
               
             
                  <Grid item xs={12} md={5} lg={5}>
                    <CountryIso
                      name="country"
                      label={t("paymentRegistration.label.country")}
                      selectedCountry={(focusInfo && focusInfo.country) || ""}
                      error={validation.country}
                      helperText={validation.country}
                      onChange={(e) => this.handleChange("country", e)}
                      disabled={flagForAck? flagForAck:isRegistered}
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
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.zipCode"
                      )}
                      value={(focusInfo && focusInfo.postalCode) || ""}
                      name="postalCode"
                      inputProps={{
                        maxLength: 10,
                      }}
                      disabled={flagForAck? flagForAck:isRegistered}
                      onChange={(e) => this.handleChange("postalCode", e)}
                    />
                  </Grid>
             
                
                  <Grid item xs={12} md={5} lg={5}>
                    <StatesIso
                      name="state"
                      label={t("paymentRegistration.label.state")}
                      error={validation.state}
                      helperText={validation.state}
                      selectedState={(focusInfo && focusInfo.state) || ""}
                      selectedCountry={(focusInfo && focusInfo.country) || ""}
                      onChange={(e) => this.handleChange("state", e)}
                      disabled={flagForAck? flagForAck:isRegistered}
                      required
                    />
                  </Grid>
             
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
                      disabled={flagForAck? flagForAck:isRegistered}
                      required
                    />{" "}
                  </Grid>
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
               {!flagForAck && !secondaryPaymentMethodId &&
               <Button
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
}))(compose(withTranslation("common"), withStyles(styles))(corporateCard));
