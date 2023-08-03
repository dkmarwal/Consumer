import React, { Component } from "react";
import {
  Grid,
  Box,
} from "@material-ui/core";
import { compose } from "redux";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import {fetchConsumerPaymentTypesList} from '~/redux/actions/paymentRegistration';
import PaymentTypes from "./PaymentTypes";
import ActionButtons from "./actionButtons";
import Check from "./PaymentTypes/Check";
import PayPal from "./PaymentTypes/Paypal";
import PushToCard from "./PaymentTypes/PushToCard";
import Zelle from "./PaymentTypes/Zelle";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import ACH from "./PaymentTypes/ACH";
import USbankACH from "./PaymentTypes/USbankACH";
import DataSecure from "~/assets/images/dataSecure.svg";
import PaymentMethods from "./paymentMethods";
import { fetchRemittanceStatus } from "~/redux/actions/accounts";
import config from "~/config";
import { consumerDetails } from "~/redux/actions/DFA";
import DepositToDebit from "./PaymentTypes/DepositToDebit";
import USBankZelle from "./PaymentTypes/USBankZelle";
import ReliaCard from "./PaymentTypes/ReliaCard";
import FocusCard from "./PaymentTypes/FocusNonPayroll";
import CorporateCard from "./PaymentTypes/CorporateCard"
import { fetchUSBankPrepaidCardData } from "~/redux/actions/USBank/payments";
import { paymentMethodIds, paymentMethods } from "~/config/paymentMethods";
import USbankCheck from "./PaymentTypes/USbankCheck";

class PaymentRegistration extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;

    this.state = {
      token: (state && state.token) || null,
      isPaymentMethodSelected: null,
      prepaidCardType: null,
      corporateCardData:[],
    };
  }
  componentDidUpdate = (prevProps) => {
    const { DFA, paymentRegistration, location, user } = this.props;
    const { state } = location;
    if (
      user.isLoggedIn &&
      DFA.hasPymentTaken &&
      (prevProps.DFA.hasPymentTaken ||
        prevProps.DFA.hasPymentTaken !== DFA.hasPymentTaken) &&
      paymentRegistration?.consumerPaymentTypesList &&
      (prevProps.paymentRegistration?.consumerPaymentTypesList ||
        prevProps.paymentRegistration?.consumerPaymentTypesList !==
          paymentRegistration.consumerPaymentTypesList)
    ) {
      if (DFA.hasPymentTaken?.primaryPaymentMethodId) {
        const routeParam =
          (this.props.match.params && this.props.match.params.clientSlug) || "";
        const primaryMethodId = DFA.hasPymentTaken.primaryPaymentMethodId;
        if (
          paymentRegistration.consumerPaymentTypesList?.data
            ?.alternatePaymentMethods?.length &&
          DFA.hasPymentTaken.primaryPaymentMethodId !== 1 &&
          DFA.hasPymentTaken.primaryPaymentMethodId !== 2
        ) {
          this.props.history.push({
            pathname: `${config.baseName}/${routeParam}/paymentRegistration/alternatePayment`,
            state: {
              ...state,
              paymentType: this.getPrimaryPaymentMethodDetails(primaryMethodId),
            },
          });
        } else {
          this.props.history.push({
            pathname: `${config.baseName}/${routeParam}/paymentRegistration/complete`,
            state: {
              ...state,
              paymentType: this.getPrimaryPaymentMethodDetails(primaryMethodId),
            },
          });
        }
      }
    }
  };

  getPrimaryPaymentMethodDetails = (primaryMethodId) => {
    const { isPayeeChoicePortal } = this.props.user;
    if (!isPayeeChoicePortal) {
      switch (primaryMethodId) {
        case 1:
          return "Check";
        case 2:
          return "ACH";
        case 16:
          return "Paypal";
        case 32:
          return "Push To Card";
        case 64:
          return "Zelle";
        default:
          return "";
      }
    } else {
      switch (primaryMethodId) {
        case 1:
          return "USBankCHK";
        case 2:
          return "USBankACH";
        case 64:
          return "USBankZelle";
        case 256:
          return "USBankDepositToDebitcard";
        case 512:
          return "USBankPrepaidCard";
        default:
          return "";
      }
    }
  };
  componentDidMount = () => {
    const { user } = this.props;
    const { isPayeeChoicePortal } = this.props.user;
    if (user.isLoggedIn) {
      this.props.dispatch(consumerDetails());
    }
    if (isPayeeChoicePortal) {
    this.props.dispatch(fetchRemittanceStatus());
  
  }
    if (isPayeeChoicePortal) { // waiting for clientId to get added in list API response
      this.cardSelection();
    }
  };
  
 
  cardSelection = async () => {
    const { user } = this.props;
    let clientId
    if(user.isLoggedIn){
    await this.props.dispatch(consumerDetails());
     clientId = this.props.DFA?.hasPymentTaken?.clientId;
  }
  else{
    await   this.props.dispatch(fetchConsumerPaymentTypesList());
     clientId =
      this.props.paymentRegistration.consumerPaymentTypesList.data.clientId;
  }
    
    // const clientId = this.props.DFA?.hasPymentTaken?.clientId;
    if (!this.props.usBankpayment.storedPrepaidCardData) {
      await this.props.dispatch(fetchUSBankPrepaidCardData(clientId));
    }
    if (this.props.usBankpayment.storedPrepaidCardData?.data) {
      const { prepaidCardData } =
        this.props.usBankpayment.storedPrepaidCardData?.data;
      if (!this.state.isPaymentMethodSelected) {
        if (prepaidCardData?.length) {
          this.setState({
            isPaymentMethodSelected: prepaidCardData.map(
              (elem) => elem.paymentTypeId
            ),
          });
        }
      }
    }
    if (
      this.state.isPaymentMethodSelected?.includes(
        paymentMethodIds.PlasticCorporateCard
      ) ||
      this.state.isPaymentMethodSelected?.includes(
        paymentMethodIds.DigitalCorporateCard
      )
    ) {
      this.setState({ prepaidCardType: paymentMethods.PrepaidCorporateReward });
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
    const { ndaFilesData, registrationData,corporateCardData } =
      this.props.usBankpayment?.storedPrepaidCardData?.data;
   
    
    if (corporateCardData?.length) {
      this.setState({ corporateCardData: corporateCardData });
    }
  };

  renderPrepaidCardForms = () => {
    const { classes, paymentRegistration, ...otherProps } = this.props;
    const { token, corporateCardData } = this.state;
    const {  registrationData,ndaFilesData } =
    this.props.usBankpayment?.storedPrepaidCardData?.data ?? {};
    switch (this.state.prepaidCardType) {
      case paymentMethods.PrepaidFocusNonPayroll:
        return (
          <FocusCard
            {...otherProps}
            token={token}
            FormatList={ndaFilesData ?? []}
            finalCardDetails={registrationData?.[0] ?? {}}
          />
        );
      case paymentMethods.PrepaidReliaCard:
        return (
          <ReliaCard
            {...otherProps}
            token={token}
            FormatList={ndaFilesData ?? []}
            finalCardDetails={registrationData?.[0] ?? {}}
          />
        );
      case paymentMethods.PrepaidCorporateReward:
        return( <CorporateCard {...otherProps} token={token}
        corporateCardData={corporateCardData}
        FormatList={ndaFilesData ?? []}
        finalCardDetails={registrationData?.[0] ?? {}}
        />
        );
        // return <></>;
      default:
        return (
          <></>
        );
    
  };
  }
  renderSelectedPaymentMethodForm = () => {
    const { classes, paymentRegistration, ...otherProps } = this.props;
    const { token } = this.state;
    const { isPayeeChoicePortal } = this.props.user;
    if (!isPayeeChoicePortal) {
      switch (paymentRegistration.selectedPaymentTypeCode) {
        case "CHK":
          return <Check {...otherProps} token={token} />;
        case "ACH":
          return <ACH {...otherProps} token={token} />;
        case "PPL":
          return <PayPal {...otherProps} token={token} />;
        case "MSC":
          return <PushToCard {...otherProps} token={token} />;
        case "CXC":
          return <Zelle {...otherProps} token={token} />;
        default:
          return <></>;
      }
    } else {
      switch (paymentRegistration.selectedPaymentTypeCode) {
        case "CHK":
          return <USbankCheck {...otherProps} token={token} />;
        case "ACH":
          return <USbankACH {...otherProps} token={token} />;
        case "DDC":
          return <DepositToDebit {...otherProps} token={token} />;
        case "PPD":
          return this.renderPrepaidCardForms();
        case "ZEL":
          return <USBankZelle {...otherProps} token={token} />;
        default:
          return <></>;
      }
    }
  };
  render() {
    const { t, classes, paymentRegistration, user, ...otherProps } = this.props;
    const { token } = this.state;
    const { selectedPaymentTypeCode, consumerPaymentTypesList } =
      paymentRegistration;
    const paymentListRender =
      ((user.isLoggedIn && consumerPaymentTypesList?.data?.allPaymentMethods) ||
        consumerPaymentTypesList?.data?.preferredPaymentList) ??
      null;
    return (
      <Grid container className={classes.paymentRegCont}>
        <Grid container justifyContent="space-between" alignItems="flex-start">
          <Grid item xs md="auto" lg xl className={classes.paymentMethodHeader}>
            {paymentListRender && (
              <Typography gutterBottom variant="h1">
                {paymentListRender.length === 1
                  ? t("paymentRegistration.heading.sharePaymentDetails")
                  : t("paymentRegistration.heading.paymentMethod")}
              </Typography>
            )}
          </Grid>
          <Grid item xs={2} sm={"auto"}>
            <div className={classes.dataSecure}>
              <img
                src={DataSecure}
                className={classes.dataSecureImg}
                alt={t("paymentRegistration.dataSecureText")}
              />
              <span className={classes.dataSecureText}>
                {t("paymentRegistration.dataSecureText")}
              </span>
            </div>
          </Grid>
        </Grid>

        <Box mt={3} width={1}>
          {!selectedPaymentTypeCode ||
          (paymentListRender && paymentListRender.length === 1) ? (
            <PaymentMethods {...otherProps} />
          ) : (
            <PaymentTypes token={token} {...otherProps} />
          )}
        </Box>
        {this.renderSelectedPaymentMethodForm()}
        {!user?.isLoggedIn && !paymentRegistration.selectedPaymentTypeCode && (
          <ActionButtons {...otherProps} />
        )}
      </Grid>
    );
  }
}

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.user,
  ...state.DFA,
  ...state.consumerVerification,
  ...state.USbankpayment,
}))(
  compose(withTranslation("common"), withStyles(styles))(PaymentRegistration)
);
