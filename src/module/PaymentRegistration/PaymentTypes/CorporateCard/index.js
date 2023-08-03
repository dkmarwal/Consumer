import React, { Component } from "react";
import { connect } from "react-redux";
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
  Radio,
  Backdrop,
  CircularProgress,
  RadioGroup,
} from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import EventIcon from "@material-ui/icons/Event";
import { withStyles } from "@material-ui/styles";
import { withTranslation } from "react-i18next";
import * as FileSaver from "file-saver";
import "react-datepicker/dist/react-datepicker.css";
import VerifyUser from "~/module/PaymentAuthentication/verifyUser";
import Notification from "~/components/Notification";
import Button from "~/components/Forms/Button";
import { compose } from "redux";
import styles from "./styles";
import TextField from "~/components/Forms/TextField";
import trim from "deep-trim-node";
import { preferencePaymentType } from "~/config/consumerEnrollmentConst";
import Phone from "~/components/TextBox/Phone";
import { createCorporatZelle } from "~/redux/actions/USBank/paymentRegistration";
import { fetchPaymentsToAuthenticate } from "~/redux/actions/paymentAuthentication";
import config from "~/config";
import { CountryIso, CityIso, StatesIso } from "~/components/CSC";
import DatePicker from "react-datepicker";
import PreivewModal from "~/components/Model/PreviewModal.js";
import { downloadPrepaidCardFiles } from "~/redux/helpers/payments";
import FormViewer from "~/components/Disclouserform";
import Alert from "@material-ui/lab/Alert";
import { paymentMethodIds,transactionIds,CorporateCardconsts } from "~/config/paymentMethods";
class corporateCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prepaidCardType: null,
      CorporateInfo: {
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
      },
      openPreviewDialog: false,
      showPreviewDialogLoader: false,
      imageFullPath: null,
      dataUrl: null,
      pdfview: null,
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
      prepaidCardTypeit:[paymentMethodIds.PlasticCorporateCard],
      fileActualName:null,
      cardmsg:null,
      formIDFlag:false,
    };
  }
  componentDidMount() {
    const { corporateCardData } = this.props;
    const { CorporateInfo,prepaidCardTypeit } = this.state;
    this.setState({
      CorporateInfo: {
        ...CorporateInfo,
        paymentTypeId: corporateCardData.length===1?corporateCardData[0].paymentTypeId:prepaidCardTypeit[0],
        transactionId: corporateCardData.length===1?corporateCardData[0].transId:transactionIds["PlasticCorporateCard"],
      
        // govIdType:finalCardDetails.govIdValue,
      },
    });
    this.setState({
      
        fileActualName:CorporateCardconsts["disclouserform"],
        cardmsg: corporateCardData.length===1?corporateCardData[0].paymentTypeId===paymentMethodIds["PlasticCorporateCard"]?"Corporate-Plastic-Card.png":"Corporate-Digital-Card.png":
        
        prepaidCardTypeit[0]===paymentMethodIds["PlasticCorporateCard"]?CorporateCardconsts["PlasticCard"]:CorporateCardconsts["DigitalCard"],
        // govIdType:finalCardDetails.govIdValue,
  
    });
  }

  
  // verfi() {
  //   const { checkboxesState } = this.state;
  //   let flag = checkboxesState;
  //   return flag;
  // }
  handleChange = (name, e) => {
    const { value } = e.target;
    const { CorporateInfo } = this.state;
    let finalValue = "";

    switch (name) {
      case "postalCode":
        finalValue = value.replace(/[^0-9-]/g, "");
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
      CorporateInfo.city = "";
      CorporateInfo.state = "";
    } else if (name === "state") {
      CorporateInfo.city = "";
    }
    this.setState({
      CorporateInfo: { ...CorporateInfo, [name]: finalValue },
    });
  };
  fetchFile = (fileActualName) => {
    this.setState({
      showPreviewDialogLoader: true,
    });
    this.props
      .dispatch(downloadPrepaidCardFiles(fileActualName))
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
            pdfview: true,
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

  handleOpenPreviewDialog = (cardmsg) => {
    const itemName = cardmsg;
    this.props
      .dispatch(downloadPrepaidCardFiles(itemName))
      .then((res) => {
        if (res && res.data) {
          const reader = new FileReader();
          reader.readAsDataURL(res.data);
          reader.onloadend = () => {
            const base64data = reader.result;
            this.setState({
              CorporateInfo: {
                ...this.state.CorporateInfo,
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
    // const {isAck}=this.state.ackFlag;
    // if(isAck){
    //   return true
    // }
    // else{
    errorText = "Document Acknowledgment is required";
    this.setState({ docError: errorText, isackFlagAck: true });
    // return false
    // }
  };
  handleShare = () => {
    const { dispatch, usbankpaymentRegistration, paymentAuthentication, t,FormatList } =
      this.props;
    const { consumerPaymentTypesList } = usbankpaymentRegistration;
    const getConsumerId = this.props?.DFA?.hasPymentTaken?.consumerId ?? null;
    const data = trim(this.state.CorporateInfo);
    const isValid = this.validateForm();
    this.ackDoc();
    const flag = this.state.checkboxesState;

    if (isValid && flag) {
      // if (isValid) {
      this.setState({
        isProcessing: true,
      });
      let remittanceData = null;
      dispatch(
        createCorporatZelle({
          ...data,
          remittanceDetails: remittanceData,
          preferenceType: preferencePaymentType.preferred,
          consumerID: getConsumerId,
        })
      ).then((response) => {
        if (!response) {
          this.handleErrorNotification("focusInfo");
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
                      consumerPaymentTypesList?.data?.isPaymentAuthRequired ===
                        true &&
                      paymentsData &&
                      paymentsData?.length > 0
                    ) {
                      this.setState({
                        openAuthModal: true,
                        paymentMethodShared:
                          usbankpaymentRegistration.selectedPaymentTypeCode,
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
    
  };

  handleClosePreviewDialog = () => {
    this.setState({
      openPreviewDialog: false,
    });
  };
  handleConfirmPreviewDialog=()=>{
    this.setState({
      formIDFlag:true,
      pdfview: false
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
          preferredFooterMsg: usbankpaymentRegistration.CorporateInfo
            ? usbankpaymentRegistration?.focusInfo?.data?.dynamicFooterMessage
            : "",
          isVerified: location?.state?.isVerified || "",
        },
      });
    } else this.pushToThankyouPage();
  };
  handlePhoneChange = (type, e) => {
    const { CorporateInfo } = this.state;
    this.setState({
      CorporateInfo: {
        ...CorporateInfo,
        TokenValue: e.target.value.phone.replace(/[^0-9-]/g, ""),
        countryCode: e.target.value.ccode,
      },
    });
  };
  handlecheckChange = (e) => {
    const {checkboxesState}=this.state;
    this.setState({
      checkboxesState: !checkboxesState,
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
      email,
      address1,
      address2,
      country,
      state,
      city,
      postalCode,
      
    } = this.state.CorporateInfo;
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
    }else if ( postalCode.toString().trim().length < 5) {
      valid = false;
      errorText["postalCode"] = t(
        "paymentRegistration.USbankFocusCard.error.postalCodemin"
      );
    }
 
    if (infoType === "email" && email !== null) {
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
    this.setState({ pdfview: false });
  };

  handleModalCloseIcon = () => {
    this.setState({
      openAuthModal: false,
    });
    if (this.props.user && this.props.user.isLoggedIn) {
      this.routeToRegistrationCompletedPage();
    }
  };
  handleRadioButton = ({ target }) => {
    const { value } = target;
    const { CorporateInfo } = this.state;
    this.setState({
      prepaidCardTypeit: [parseInt(value)],
      cardmsg:parseInt(value)===paymentMethodIds["PlasticCorporateCard"]?"Corporate-Plastic-Card.png":"Corporate-Digital-Card.png",
      paymentTypeId:parseInt(value),
    });
    this.setState({
      CorporateInfo: {
        ...CorporateInfo,
        paymentTypeId:parseInt(value),
      },
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
      corporateCardData,
      ...otherProps
    } = this.props;

    const { CorporateInfo, validation, variant, error,isProcessing,prepaidCardTypeit,fileActualName,cardmsg,formIDFlag } = this.state;
    const { consumerPaymentTypesList } = usbankpaymentRegistration;
    const { paymentsData } = paymentAuthentication;
    const { remittanceStatus } = this.props.accounts;
    const loggedIn = this.props.user && this.props.user.isLoggedIn;
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
        
          {  corporateCardData.length===1?
          corporateCardData[0].paymentTypeId=== paymentMethodIds.PlasticCorporateCard?
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
                          this.state.checkboxesState
                        }
                        // checked={false}
                        onChange={(e) =>
                          this.handlecheckChange(e)
                        }
                        disabled={!formIDFlag}
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
          {corporateCardData.paymentTypeId=== paymentMethodIds.PlasticCorporateCard?
          <Grid item xs={12} lg={8} className={classes.headingCont}>
            <Box className={classes.Disclosuretext}> 
            
            {t("paymentRegistration.digitalCard.info.PlasticDisclosure")}
            </Box>
          </Grid>:
          <Grid item xs={12} lg={8} className={classes.headingCont}>
          <Box className={classes.Disclosuretext}> 
          
          {t("paymentRegistration.digitalCard.info.DigitalDisclosure")}
          </Box>
        </Grid>}
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
                      value={CorporateInfo.firstName || ""}
                      name="firstName"
                      inputProps={{
                        maxLength: 35,
                      }}
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
                      value={CorporateInfo.lastName || ""}
                      name="lastName"
                      inputProps={{
                        maxLength: 35,
                      }}
                      onChange={(e) => this.handleChange("lastName", e)}
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
                      value={CorporateInfo.email || ""}
                      name="email"
                      inputProps={{
                        maxLength: 100,
                      }}
                      onChange={(e) => this.handleChange("email", e)}
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
                      value={CorporateInfo.address1 || ""}
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
                      label={t(
                        "paymentRegistration.USbankFocusCard.label.addressLine2"
                      )}
                      error={validation.address2}
                      helperText={validation.address2}
                      value={CorporateInfo.address2 || ""}
                      name="address2"
                      inputProps={{
                        maxLength: 35,
                      }}
                      onChange={(e) => this.handleChange("address2", e)}
                      required
                    />
                  </Grid>
                
                
                  <Grid item xs={12} md={5} lg={5}>
                    <CountryIso
                      name="country"
                      label={t("paymentRegistration.label.country")}
                      selectedCountry={(CorporateInfo && CorporateInfo.country) || ""}
                      error={validation.country}
                      helperText={validation.country}
                      onChange={(e) => this.handleChange("country", e)}
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
                      value={(CorporateInfo && CorporateInfo.postalCode) || ""}
                      name="postalCode"
                      inputProps={{
                        maxLength: 10,
                      }}
                      onChange={(e) => this.handleChange("postalCode", e)}
                    />
                  </Grid>
                
              
                  <Grid item xs={12} md={5} lg={5}>
                    <StatesIso
                      name="state"
                      label={t("paymentRegistration.label.state")}
                      error={validation.state}
                      helperText={validation.state}
                      selectedState={(CorporateInfo && CorporateInfo.state) || ""}
                      selectedCountry={(CorporateInfo && CorporateInfo.country) || ""}
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
                      selectedState={(CorporateInfo && CorporateInfo.state) || ""}
                      selectedCountry={(CorporateInfo && CorporateInfo.country) || ""}
                      selectedCity={(CorporateInfo && CorporateInfo.city) || ""}
                      onChange={(e) => this.handleChange("city", e)}
                      required
                    />{" "}
                  </Grid>

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
            ) :(
            <Box p={2}>
              <Button
                onClick={this.handleShare}
                className={classes.shareButton}
                color="primary"
              >
                {t("paymentRegistration.button.continue")}
              </Button>
            </Box>)}
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
          imageLocation={this.state.CorporateInfo.imageFullPath}
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
          open={this.state.pdfview}
          dataUrl={this.state.dataUrl}
          handleClose={this.handleCloseFaq}
          handleConfirm={this.handleConfirmPreviewDialog}
        />
      </>
    );
  }
}

export default connect((state) => ({
  ...state.usbankpaymentRegistration,
  ...state.paymentAuthentication,
  ...state.accounts,
  ...state.user,
  ...state.DFA,
}))(compose(withTranslation("common"), withStyles(styles))(corporateCard));

