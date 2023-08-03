import React, { Component } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import PaymentTypes from "./PaymentTypes";
import Check from "./PaymentTypes/Check";
import USbankCheck from "./PaymentTypes/Check/USbank";
import USbankACH from "./PaymentTypes/ACH/USbank";
import USbankDepositToDebit from "./PaymentTypes/Deposittodebitcard";
import PayPal from "./PaymentTypes/Paypal";
import PushToCard from "./PaymentTypes/PushToCard";
import Zelle from "./PaymentTypes/Zelle";
import USBankZelle from "./PaymentTypes/Zelle/USBank";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import ACH from "./PaymentTypes/ACH";
import { fetchConsumerPaymentDetails } from "~/redux/actions/accounts";
import CorporateCard from "./PaymentTypes/CorporateCard";
import ReliaCard from "./PaymentTypes/ReliaCard";
import FocusCard from "./PaymentTypes/FocusNonPayroll";
import {
  paymentMethodIds,
  USBankPaymentMethodIds,
  paymentMethods,
} from "~/config/paymentMethods";
import { selectedPaymentType } from "~/redux/actions/paymentRegistration";
import ActionButtons from "./actionButtons";
import Notification from "~/components/Notification";
import PaymentMethods from "./paymentMethods";
import { consumerDetails } from "~/redux/actions/DFA";
import { fetchUSBankPrepaidCardData } from "~/redux/actions/USBank/payments";

class UpdateDialogContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaymentMethodSelected: null,
      prepaidCardType: null,
      FormatList: [],
      finalCardDetails: [],
      corporateCardData: [],
    };
  }

  componentDidMount = () => {
    const { accounts, dispatch, paymentRegistration } = this.props;
    const { isPayeeChoicePortal } = this.props.user;
    const paymentMethodIdList = this.props.user.isPayeeChoicePortal
      ? USBankPaymentMethodIds
      : paymentMethodIds;
    const preferredPaymentList =
      paymentRegistration?.consumerPaymentTypesList?.data?.preferredPaymentList;
    let primaryPaymentMethodId =
      accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId;
    if (primaryPaymentMethodId === USBankPaymentMethodIds["RTP"]) {
      primaryPaymentMethodId = USBankPaymentMethodIds["ACH"];
    }
    const isPrimaryMethodAvailable = preferredPaymentList?.filter(
      (item) => item.paymentTypeId === primaryPaymentMethodId
    );
    if (
      accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId &&
      preferredPaymentList
    ) {
      if (
        !isPrimaryMethodAvailable?.length &&
        preferredPaymentList?.length === 1
      ) {
        dispatch(selectedPaymentType(preferredPaymentList[0].paymentCode));
      } else if (isPrimaryMethodAvailable?.length) {
        let primaryPaymentMethodId =
          accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId;
        if (primaryPaymentMethodId === USBankPaymentMethodIds["RTP"]) {
          primaryPaymentMethodId = USBankPaymentMethodIds["ACH"];
        }
        const selectedPayMethod = Object.keys(paymentMethodIdList).find(
          (key) => paymentMethodIdList[key] === primaryPaymentMethodId
        );
        dispatch(selectedPaymentType(selectedPayMethod));
      } else dispatch(selectedPaymentType(null));
    }
   
    if (isPayeeChoicePortal) {
      this.cardSelection();
    }
  };
  componentDidUpdate(prevProps){
    const { isPayeeChoicePortal } = this.props.user;
    const { paymentRegistration, accounts } = prevProps;
  if (
    this.props.paymentRegistration.selectedPaymentTypeCode !== prevProps.paymentRegistration.selectedPaymentTypeCode && this.props.paymentRegistration.selectedPaymentTypeCode==="PPD"
  ){

      this.cardSelection();
  }
  }
  cardSelection = async () => {
    await this.props.dispatch(consumerDetails());
    const clientId = this.props.DFA?.hasPymentTaken?.clientId;
    if (!this.props.usBankpayment.storedPrepaidCardData) {
      await this.props.dispatch(fetchUSBankPrepaidCardData(clientId));
    }
    if (!this.props.accounts.consumerPaymentDetails) {
      await this.props.dispatch(fetchConsumerPaymentDetails());
    }

    if (!this.state.isPaymentMethodSelected) {
      if (
       ( this.props.accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId===USBankPaymentMethodIds["CRP"])||
       ( this.props.accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId===USBankPaymentMethodIds["CRD"])||
       ( this.props.accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId===USBankPaymentMethodIds["PFB"])||
       ( this.props.accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId===USBankPaymentMethodIds["PRC"])
      ) {
        const MethodID =
          this.props.accounts.consumerPaymentDetails?.data
            ?.primaryPaymentMethodId;
        let corporateCardselected = [].concat(MethodID);
        this.setState({
          isPaymentMethodSelected: corporateCardselected,
        });
      }
      else{
       
        if (this.props.usBankpayment.storedPrepaidCardData?.data) {
          const { prepaidCardData } =
            this.props.usBankpayment.storedPrepaidCardData?.data;
      this.setState({
        isPaymentMethodSelected: prepaidCardData.map(
          (elem) => elem.paymentTypeId
        ),
      });}}
    }
  
   
  
      if (
      this.state.isPaymentMethodSelected?.includes(
        paymentMethodIds.PlasticCorporateCard
      )
    ) {
      this.setState({ prepaidCardType: paymentMethods.PlasticCorporateCard });
    } else if (
      this.state.isPaymentMethodSelected?.includes(
        paymentMethodIds.DigitalCorporateCard
      )
    ) {
      this.setState({ prepaidCardType: paymentMethods.DigitalCorporateCard });
    } else if (
      this.state.isPaymentMethodSelected?.includes(
        paymentMethodIds.PrepaidFocusNonPayroll
      )
    ) {
      this.setState({ prepaidCardType: paymentMethods.PrepaidFocusNonPayroll });
    } else if (
      this.state.isPaymentMethodSelected?.includes(
        paymentMethodIds.PrepaidReliaCard
      )
    ) {
      this.setState({ prepaidCardType: paymentMethods.PrepaidReliaCard });
    }
    const { ndaFilesData, registrationData, corporateCardData } =
      this.props.usBankpayment.storedPrepaidCardData?.data;
    if (ndaFilesData?.length) {
      this.setState({ FormatList: ndaFilesData });
    }
    if (registrationData?.length) {
      this.setState({ finalCardDetails: registrationData[0] });
    }
    if (corporateCardData?.length) {
      this.setState({ corporateCardData: corporateCardData });
    }
  };
  renderPrepaidCardForms = () => {
    // this.cardSelection();
    const { classes, paymentRegistration, ...otherProps } = this.props;
    const { token, FormatList, finalCardDetails, corporateCardData } =
      this.state;
    switch (this.state.prepaidCardType) {
      case paymentMethods.PrepaidFocusNonPayroll:
        return (
          <FocusCard
            {...otherProps}
            token={token}
            FormatList={FormatList}
            finalCardDetails={finalCardDetails}
          />
        );
      case paymentMethods.PrepaidReliaCard:
        return (
          <ReliaCard
            {...otherProps}
            token={token}
            FormatList={FormatList}
            finalCardDetails={finalCardDetails}
          />
        );
     
        case paymentMethods.PlasticCorporateCard:
          case paymentMethods.DigitalCorporateCard:
          return (
            <CorporateCard
              {...otherProps}
              token={token}
              FormatList={FormatList}
              finalCardDetails={finalCardDetails}
              corporateCardData={corporateCardData}
            />
          );
      default:
        return <></>;
    }
  };
  renderSelectedPaymentMethodForm = () => {
    const { classes, paymentRegistration, ...otherProps } = this.props;
    const { isPayeeChoicePortal } = this.props.user;

    if (!isPayeeChoicePortal) {
      switch (paymentRegistration.selectedPaymentTypeCode) {
        case "CHK":
          return <Check {...otherProps} />;
        case "ACH":
          return <ACH {...otherProps} />;
        case "PPL":
          return <PayPal {...otherProps} />;
        case "MSC":
          return <PushToCard {...otherProps} />;
        case "CXC":
          return <Zelle {...otherProps} />;

        default:
          return <></>;
      }
    } else {
      switch (paymentRegistration.selectedPaymentTypeCode) {
        case "CHK":
          return <USbankCheck {...otherProps} />;
        case "ACH":
        case "RTP":
          return <USbankACH {...otherProps} />;
        // case "DDC":
        //   return <DepositToDebit {...otherProps} token={token} />;
        // case "ACH":
        //   return <USbankACH {...otherProps} token={token} />;
        case "DDC":
          return <USbankDepositToDebit {...otherProps} />;
        case "PPD":
         
          return this.renderPrepaidCardForms();
        //   return <PrepaidCard {...otherProps} token={token} />;
        case "ZEL":
          return <USBankZelle {...otherProps} />;
        default:
          return <></>;
      }
    }
  };

  render() {
    const { paymentRegistration, closePaymentMethodsDialog, accounts } =
      this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
    const preferredPaymentList =
      paymentRegistration?.consumerPaymentTypesList?.data?.preferredPaymentList;
    let primaryPaymentMethodId =
      accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId;

    if (primaryPaymentMethodId === USBankPaymentMethodIds["RTP"]) {
      primaryPaymentMethodId = USBankPaymentMethodIds["ACH"];
    }
    let isSelectedPaymentMethodAvailable = false;
    const isPrimaryMethodAvailable = preferredPaymentList?.filter(
      (item) => item.paymentTypeId === primaryPaymentMethodId
    );
    if (preferredPaymentList && paymentRegistration.selectedPaymentTypeCode) {
      const selectedPaymentData = preferredPaymentList.find(
        (item) =>
          item.paymentCode === paymentRegistration.selectedPaymentTypeCode
      );
      if (selectedPaymentData) {
        isSelectedPaymentMethodAvailable = true;
      }
    }

    return preferredPaymentList ? (
      <Grid container>
        {((isPrimaryMethodAvailable?.length && primaryPaymentMethodId) ||
          isSelectedPaymentMethodAvailable) &&
        preferredPaymentList &&
        preferredPaymentList.length &&
        preferredPaymentList.length !== 1 ? (
          <>
            <PaymentTypes isPrimaryMethodAvailable={isPrimaryMethodAvailable} />
          </>
        ) : (
          <PaymentMethods />
        )}
        {paymentRegistration.selectedPaymentTypeCode &&
          this.renderSelectedPaymentMethodForm()}
        {!paymentRegistration.selectedPaymentTypeCode && (
          <ActionButtons
            closePaymentMethodsDialog={closePaymentMethodsDialog}
          />
        )}
      </Grid>
    ) : consumerPaymentTypesList?.error ? (
      <Notification
        variant={"error"}
        message={consumerPaymentTypesList.error}
        handleClose={() => {}}
      />
    ) : (
      <CircularProgress />
    );
  }
}

export default withTranslation("common")(
  connect((state) => ({
    ...state.paymentRegistration,
    ...state.accounts,
    ...state.user,
    ...state.USbankpayment,
    ...state.DFA,
  }))(withStyles(styles)(UpdateDialogContent))
);
