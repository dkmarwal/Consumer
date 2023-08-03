import { Box, Grid, Hidden, CircularProgress } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import PaymentMethodCardView from './PaymentMethodCardView';
import PaymentMethodAccordionView from './PaymentMethodAccordionView';
import {
  fetchConsumerPaymentDetails,
  fetchSecondaryPaymentMethodsList,
  fetchRemittanceStatus,
} from '~/redux/actions/accounts';
import { getStatesOfCountry, getAllCountries } from '~/redux/actions/csc';
import {
  selectedPaymentType,
  selectedAlternatePaymentType,
  updateSortedPaymentTypesList,
  updateFetchConsumerPaymentTypesList,
} from '~/redux/actions/paymentRegistration';
import {
  paymentMethodIds,
  USBankPaymentMethodIds,
} from '~/config/paymentMethods';
import { getClientPaymentTypes } from '~/redux/actions/payments';
import Notification from '~/components/Notification/index';
import { consumerStatus } from '~/config/entityTypes';
import {
  starredMask,
  starredMaskCard,
  getFormattedPhoneNumber,
} from '~/utils/common';
import { consumerDetails } from "~/redux/actions/DFA";
import { fetchUSBankPrepaidCardData } from "~/redux/actions/USBank/payments";
class Accounts extends Component {
  state = {
    message: '',
    variant: '',
    expansionState: {
      primary: true,
      secondary: false,
    },
    finalCardDetails:{}
  };

  componentDidMount = () => {
    this.loadData();
    if(!this.props.user.isPayeeChoicePortal){
      this.props.dispatch(fetchSecondaryPaymentMethodsList());
    }
    if(this.props.user.isPayeeChoicePortal){
      this.cardSelection();
    }
    this.props.dispatch(fetchRemittanceStatus());
    this.props.dispatch(getStatesOfCountry('US')); // country passed will be changed to dynamic If more countries will be added in dropdown
    this.props.dispatch(getAllCountries());
  };
  cardSelection = async () => {
    await this.props.dispatch(consumerDetails());
    const clientId = await this.props.DFA?.hasPymentTaken?.clientId;
      await this.props.dispatch(fetchUSBankPrepaidCardData(clientId));
    const { registrationData } =
    await this.props.usBankpayment.storedPrepaidCardData?.data;

  if (registrationData?.length) {
    this.setState({ finalCardDetails: registrationData[0]  
    }
    );
  }
  
  }

  loadData = () => {
    const { dispatch, user } = this.props;
    const paymentMethodIdList = user.isPayeeChoicePortal
      ? USBankPaymentMethodIds
      : paymentMethodIds;
    let primaryPaymentMethodId = null;
    let secondaryPaymentMethodId = null;
    dispatch(updateSortedPaymentTypesList(null));
    dispatch(updateFetchConsumerPaymentTypesList(null));
    dispatch(fetchConsumerPaymentDetails()).then((res) => {
      if(res){
        const { accounts } = this.props;
        if (accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId) {
          primaryPaymentMethodId =
            accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId;
          if(primaryPaymentMethodId === USBankPaymentMethodIds["RTP"]){
            primaryPaymentMethodId = USBankPaymentMethodIds["ACH"]
          }
          const selectedPayMethod = Object.keys(paymentMethodIdList).find(
            (key) => paymentMethodIdList[key] === primaryPaymentMethodId
          );
          dispatch(selectedPaymentType(selectedPayMethod));
        }
  
        if (accounts.consumerPaymentDetails?.data?.secondaryPaymentMethodId) {
          secondaryPaymentMethodId =
            accounts.consumerPaymentDetails?.data?.secondaryPaymentMethodId;
          const selectedPayMethod = Object.keys(paymentMethodIdList).find(
            (key) => paymentMethodIdList[key] === secondaryPaymentMethodId
          );
          dispatch(selectedAlternatePaymentType(selectedPayMethod));
        }
        if (primaryPaymentMethodId === 2 || secondaryPaymentMethodId === 2) {
          this.fetchPaymentTypes();
        }
      } else {
        const { accounts } = this.props;
        this.setNotification(
          'error',
          accounts.consumerPaymentDetails?.error ||
            this.props.t('updatedAccounts.message.somethingWentWrong')
        );
      }

    });
   
  };
  fetchPaymentTypes = () => {
    this.props.dispatch(getClientPaymentTypes()).then((response) => {
      if (!response) {
        this.setNotification(
          'error',
          this.props.payment.error ||
            this.props.t('updatedAccounts.message.somethingWentWrong')
        );
        return false;
      }
    });
  };

  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.resetNotification.bind(this)}
      />
    );
  };

  setNotification(variant, message) {
    this.setState({ variant, message });
  }

  resetNotification() {
    this.setState({ variant: '', message: '' });
  }

  getStateName = (state) => {
    const { csc } = this.props;
    let stateName = '';
    if (state && csc.stateList?.length) {
      stateName =
        csc.stateList.filter((stateItem) => stateItem.stateCode === state)[0]
          ?.name ?? '';
    }
    return stateName;
  };

  /** get country name using ISO code */
  getCountryName = (country) => {
    const { csc } = this.props;
    let countryName = '';
    if (country && csc.countryList?.length) {
      countryName =
        csc.countryList.filter(
          (countryItem) => countryItem.isoCode === country
        )[0]?.name ?? '';
    }
    return countryName;
  };

  getPymentTypeData =  (type, editType) => {
    const { t, csc, user } = this.props;
    const {isPayeeChoicePortal} = user
    const { data } = this.props.accounts.consumerPaymentDetails;
    // if(type==='PFB'||'PRC'||"CRP"||'CRD'){
    //   await this.prepaiddata()
    // }
    switch (type) {
      case 'CHK': {
        const { addressLine1, addressLine2, country, state, city, postalCode } =
          data.consumerCheckDetails || {};
        const stateName = this.getStateName(state);
        const countryName = this.getCountryName(country);
        const details = [
          {
            label: t('accounts.check.address'),
            value: addressLine1 + (addressLine2 ? ', ' + addressLine2 : ''),
          },
          {
            label: t('accounts.check.city'),
            value: city,
          },
          {
            label: t('accounts.check.state'),
            value: stateName ?? state,
          },
          {
            label: t('accounts.check.country'),
            value: isPayeeChoicePortal ? country : countryName ?? country,
          },
          {
            label: t('accounts.check.zipCode'),
            value: postalCode,
          },
        ];
        return this.renderPaymentDetails(
          details,
          editType,
          type,
          t('accounts.check.methodName')
        );
      }
      case 'ACH':
      case 'RTP': {
        const { accountNumber, routingNumber, bankName, accountType } =
          data.consumerBankAccountDetails || {};
        const details = [
          {
            label: t('accounts.ach.accountNumber'),
            value: starredMask(accountNumber),
          },
          {
            label: t('accounts.ach.routingNumber'),
            value: routingNumber,
          },
          {
            label: t('accounts.ach.bankName'),
            value: bankName,
          },
          {
            label: t('accounts.ach.bankAccountType'),
            //value: bankAccountType && bankAccountType.description,
            value: accountType,
          },
        ];
        return this.renderPaymentDetails(
          details,
          editType,
          type,
          user.isPayeeChoicePortal
            ? t('accounts.bankAccount.methodName')
            : t('accounts.ach.methodName')
        );
      }
      case 'PPL': {
        const {
          tokenValue,
          addressLine1,
          addressLine2,
          country,
          state,
          city,
          postalCode,
          tokenType,
        } = data.consumerPaypalDetails || {};
        const stateName = this.getStateName(state);
        const countryName = this.getCountryName(country);

        let phoneNumber = '';
        let tempNumber = '';
        if (tokenType === 'phone') {
          tempNumber = tokenValue.split(' ');
          phoneNumber = getFormattedPhoneNumber(tempNumber[1]);
        }

        const details = [
          {
            label: t(`accounts.paypal.${tokenType}`),
            value:
              tokenType === 'phone'
                ? `${tempNumber[0]}-${phoneNumber}`
                : tokenValue,
          },
          {
            label: t('accounts.paypal.address'),
            value: addressLine1 + (addressLine2 ? ', ' + addressLine2 : ''),
          },
          {
            label: t('accounts.paypal.city'),
            value: city,
          },
          {
            label: t('accounts.paypal.state'),
            value: stateName ?? state,
          },
          {
            label: t('accounts.paypal.country'),
            value: countryName ?? country,
          },
          {
            label: t('accounts.paypal.zipCode'),
            value: postalCode,
          },
        ];
        return this.renderPaymentDetails(
          details,
          editType,
          type,
          t('accounts.paypal.methodName')
        );
      }
      case 'MSC': {
        const {
          nameOnCard,
          cardNumber,
          expiryMonth,
          expiryYear,
          addressLine1,
          addressLine2,
          city,
          postalCode,
          state,
          country,
        } = data.consumerCardDetails || {};
        const stateName = this.getStateName(state);
        let countryName = '';
        if (country && csc.countryList?.length) {
          countryName =
            csc.countryList.filter(
              (countryItem) => countryItem.isoCode3 === country
            )[0]?.name ?? '';
        }
        const details = [
          {
            label: t('accounts.directDeposit.nameOnCard'),
            value: nameOnCard,
          },
          {
            label: t('accounts.directDeposit.cardNumber'),
            value: starredMaskCard(cardNumber),
          },
          {
            label: t('accounts.directDeposit.expiryDate'),
            value: `${expiryMonth}/${expiryYear}`,
          },
          {
            label: t('accounts.directDeposit.addressLine1'),
            value: addressLine1 + (addressLine2 ? ', ' + addressLine2 : ''),
          },
          {
            label: t('accounts.directDeposit.city'),
            value: city,
          },
          {
            label: t('accounts.directDeposit.state'),
            value: stateName ?? state,
          },
          {
            label: t('accounts.directDeposit.country'),
            value: countryName ?? country,
          },

          {
            label: t('accounts.directDeposit.zipCode'),
            value: postalCode,
          },
        ];
        return this.renderPaymentDetails(
          details,
          editType,
          type,
          t('accounts.directDeposit.methodName')
        );
      }
      case 'DDC': {
        const {
          cardExpiryDate,
          cardHolderFirstName,
          cardHolderLastName,
          debitCardNumber,
        } = data.consumerDebitCardDetails || {};
        let expiryDate = cardExpiryDate
        if(cardExpiryDate && cardExpiryDate.includes("-")){ // us bank expiry date format need to be same as that shown in edit popup
          let tempArr = cardExpiryDate.split("-")
          if(tempArr?.length>1){
            expiryDate = `${tempArr[1]}/${tempArr[0]}`
          }
        }
        const details = [
          {
            label: t('accounts.depositToDebitCard.nameOnCard'),
            value: cardHolderLastName?`${cardHolderFirstName} ${cardHolderLastName}`:`${cardHolderFirstName} `,
          },
          {
            label: t('accounts.depositToDebitCard.cardNumber'),
            value: starredMaskCard(debitCardNumber),
          },
          {
            label: t('accounts.depositToDebitCard.expiryDate'),
            value: `${expiryDate}`,
          },
        ];
        return this.renderPaymentDetails(
          details,
          editType,
          type,
          t('accounts.depositToDebitCard.methodName')
        );
      }
      case 'PFB':
        case 'PRC':
         {
        const {
          firstName,lastName,emailId,address1,address2,city,state,country, postalCode,dateOfBirth,ssn,homePhone,paymentTypeId,mobilePhone,employerState,govLocation,govExpiredDate,govIdType,govIdValue,uniqueId
        } = data.consumerPrepaidCardDetails || {};
        const {finalCardDetails} =this.state;
        let cardType
        switch (paymentTypeId) {
          case paymentMethodIds.PrepaidFocusNonPayroll:
            cardType= t('accounts.FocusCard.methodName');
            break;
            case paymentMethodIds.PrepaidReliaCard:
              cardType= t('accounts.ReliaCard.methodName');
              break;
        
          default:
            cardType= t('accounts.CorporateCard.methodName');
            break;
        }
        let details=[];
        if( finalCardDetails?.isName){
          details.push({
            label: t('accounts.ReliaCard.firstName'),
            value: firstName,
          },
          finalCardDetails?.isName &&  {
            label: t('accounts.ReliaCard.lastName'),
            value: lastName,
          },)
        }
         if ( finalCardDetails?.isEmail ){
          details.push({
            label: t('accounts.ReliaCard.email'),
            value: emailId,
          })
        }
         if ( finalCardDetails?.isAddress ){
          details.push({
            label: t('accounts.ReliaCard.addressLine1'),
            value: address1,
          },
         {
            label: t('accounts.ReliaCard.addressLine2'),
            value: address2,
          },
         {
            label: t('accounts.ReliaCard.country'),
            value: country,
          },
       {
            label: t('accounts.ReliaCard.zipCode'),
            value: postalCode,
          },
         {
            label: t('accounts.ReliaCard.state'),
            value: state,
          },
       {
            label: t('accounts.ReliaCard.city'),
            value: city,
          })
        }
         if ( finalCardDetails?.govIdTypeId ){
          details.push( {label: t('accounts.ReliaCard.govIdType'),
          value: govIdType,
        },
      {
          label: t('accounts.ReliaCard.govExpiredDate'),
          value: govExpiredDate
        },
        {
          label: t('accounts.ReliaCard.govIdValue'),
          value: govIdValue,
        },)
        }
         if ( finalCardDetails?.isUniqueId ){
          details.push({
            label: t('accounts.ReliaCard.uniqueId'),
             value: uniqueId,
           })
        }
        if ( finalCardDetails?.isDateOfBirth
          ){
          details.push({
            label: t('accounts.ReliaCard.isDateOfBirth'),
            value: dateOfBirth
           })
        }
        
         if ( finalCardDetails?.isGovLocation ){
          details.push({
            label: t('accounts.ReliaCard.govLocation'),
            value: govLocation,
          })}
           if (  finalCardDetails?.isEmployeeState ){
            details.push({
              label: t('accounts.ReliaCard.employerState'),
            value: employerState,
            })
        }
         if ( finalCardDetails?.isHomePhone ){
          details.push({
            label: t('accounts.ReliaCard.homePhone'),
            value: homePhone,
          })
      }
     
    
     if ( finalCardDetails?.isMobilePhone ){
      details.push({
        label: t('accounts.ReliaCard.mobilePhone'),
            value: mobilePhone,
      })
  }
   if ( finalCardDetails?.isSsn ){
    details.push({
      label: t('accounts.ReliaCard.SSN'),
      value: ssn,
    })
}


                return this.renderPaymentDetails(
          details,
          editType,
          type,
          cardType
        );
      }
      case 'CRP':
        case 'CRD':
         {
        const {
          firstName,lastName,emailId,address1,address2,city,state,country, postalCode,paymentTypeId
        } = data.consumerPrepaidCardDetails || {};
        const {finalCardDetails} =this.state;
        let cardType
        switch (paymentTypeId) {
          case paymentMethodIds.PlasticCorporateCard:
            cardType= t('accounts.PlasticCard.methodName');
            break;
            case paymentMethodIds.DigitalCorporateCard:
              cardType= t('accounts.DigitalCard.methodName');
              break;
        
          default:
            cardType= t('accounts.CorporateCard.methodName');
            break;
        }
        let details=[{
         
            label: t('accounts.ReliaCard.firstName'),
            value: firstName,
          },
        {
            label: t('accounts.ReliaCard.lastName'),
            value: lastName,
          },
      {
            label: t('accounts.ReliaCard.email'),
            value: emailId,
      },{

            label: t('accounts.ReliaCard.addressLine1'),
            value: address1,
          },
         {
            label: t('accounts.ReliaCard.addressLine2'),
            value: address2,
          },
         {
            label: t('accounts.ReliaCard.country'),
            value: country,
          },
       {
            label: t('accounts.ReliaCard.zipCode'),
            value: postalCode,
          },
         {
            label: t('accounts.ReliaCard.state'),
            value: state,
          },
       {
            label: t('accounts.ReliaCard.city'),
            value: city,
          }
        ];
                return this.renderPaymentDetails(
          details,
          editType,
          type,
          cardType
        );
      }
      case 'CXC':
      case 'ZEL': {
        const { tokenValue, tokenType, phoneCountryCode } =
          data.consumerZelleDetails || {};

        const phoneNumber =
          tokenType === 'phone' ? getFormattedPhoneNumber(tokenValue) : '';
        const details = [
          {
            label: tokenType ? t(`accounts.zelle.${tokenType}`) : '',
            value:
              tokenType === 'phone'
                ? `${phoneCountryCode}-${phoneNumber}`
                : tokenValue,
          },
        ];
        return this.renderPaymentDetails(
          details,
          editType,
          type,
          t(`accounts.zelle.methodName`)
        );
      }
      default:
        const details = [];
        return (
          <>
            {/* desktop view */}
            <Hidden only={['xs', 'sm']}>
              <PaymentMethodCardView
                details={details}
                editType={editType}
                type={type}
                methodName={''}
              />
            </Hidden>
            {/* mobile view */}
            <Hidden only={['md', 'lg', 'xl']}>
              <PaymentMethodAccordionView
                details={details}
                editType={editType}
                type={type}
                methodName={''}
                expansionState={this.state.expansionState}
                handleExpansion={this.handleExpansion}
              />
            </Hidden>
          </>
        );
    }
  };

  renderPaymentDetails = (details, editType, type, methodName) => {
    return (
      <>
        {/* mobile view */}
        <Hidden only={['md', 'lg', 'xl']}>
          <PaymentMethodAccordionView
            details={details}
            editType={editType}
            type={type}
            loadData={this.loadData}
            methodName={methodName}
            expansionState={this.state.expansionState}
            handleExpansion={this.handleExpansion}
          />
        </Hidden>
        {/* desktop view */}
        <Hidden only={['xs', 'sm']}>
          <PaymentMethodCardView
            details={details}
            editType={editType}
            type={type}
            loadData={this.loadData}
            methodName={methodName}
          />
        </Hidden>
      </>
    );
  };

  handleExpansion = (methodEditType) => {
    const { expansionState } = this.state;
    if (expansionState[methodEditType]) {
      this.setState({
        expansionState: {
          ...expansionState,
          [methodEditType]: !expansionState[methodEditType],
        },
      });
    } else {
      if (methodEditType === 'primary') {
        this.setState({
          expansionState: {
            primary: true,
            secondary: false,
          },
        });
      } else {
        this.setState({
          expansionState: { secondary: true, primary: false },
        });
      }
    }
  };

  render() {
    const { accounts, paymentRegistration, paymentAuthentication, user } =
      this.props;
    const { secondaryPaymentMethodList, consumerPaymentDetails } = accounts;
    const { variant, message } = this.state;
    const paymentMethodIdList = user.isPayeeChoicePortal
      ? USBankPaymentMethodIds
      : paymentMethodIds;
    const { consumerPaymentTypesList } = paymentRegistration;
    const { paymentsData } = paymentAuthentication;
    const hasAlternatePaymentMethods =
      secondaryPaymentMethodList?.data?.alternatePaymentMethods &&
      secondaryPaymentMethodList.data.alternatePaymentMethods.length > 0;
    let isPrimaryMethodAchChk = false;
    let primaryPaymentCode = null;
    let secondaryPaymentCode = null;
    if (accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId) { 
      const primaryPaymentMethodId =
        accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId;
      primaryPaymentCode = Object.keys(paymentMethodIdList).find(
        (key) => paymentMethodIdList[key] === primaryPaymentMethodId
      );
      if (
        [paymentMethodIdList.CHK, paymentMethodIdList.ACH].includes(
          primaryPaymentMethodId
        )
      ) {
        isPrimaryMethodAchChk = true;
      }
    }

    if (accounts.consumerPaymentDetails?.data?.secondaryPaymentMethodId) {
      const secondaryPaymentMethodId =
        accounts.consumerPaymentDetails?.data?.secondaryPaymentMethodId;
      secondaryPaymentCode = Object.keys(paymentMethodIdList).find(
        (key) => paymentMethodIdList[key] === secondaryPaymentMethodId
      );
    }
    const isAlternatePaymentMethodsList =
      secondaryPaymentMethodList?.data?.alternatePaymentMethods?.length;
    const consumerStatusId =
      this.props.DFA?.hasPymentTaken?.consumerStatusId || 0;
    const isAlternateCardVisible =
      isAlternatePaymentMethodsList &&
      !isPrimaryMethodAchChk &&
      ((!secondaryPaymentCode && consumerStatusId !== consumerStatus.REVOKED) ||
        secondaryPaymentCode);
    return (
      <>
        <Box
          height={150}
          bgcolor='highlight.main'
          position='absolute'
          left={0}
          top={!paymentsData || !paymentsData.length ? '56px' : '100px'}
          borderRadius='0 0 50% 50%'
          zIndex='-1'
          width={1}
        ></Box>
        {consumerPaymentDetails?.data ? (
          <>
            <Grid
              container
              style={{
                marginTop: (!paymentsData || !paymentsData.length) && '24px',
              }}
            >
              <Grid item xs>
                <Grid
                  container
                  justifyContent={'space-between'}
                  spacing={3}
                  alignContent='stretch'
                >
                  <Grid item xs={12} md={6} lg={6}>
                    {/* //desktop view */}
                    <Hidden only={['xs', 'sm']}>
                      <Box
                        my={2}
                        p={2}
                        mt={0}
                        pb={0}
                        bgcolor='background.paper'
                        borderRadius='10px'
                        boxShadow=' 0px 0px 8px rgba(0, 0, 0, 0.14)'
                        height={1}
                      >
                        {accounts.consumerPaymentDetails &&
                          this.getPymentTypeData(primaryPaymentCode, 'primary')}
                      </Box>
                    </Hidden>
                    {/* mobile view */}
                    <Hidden only={['md', 'lg', 'xl']}>
                      {accounts.consumerPaymentDetails &&
                        this.getPymentTypeData(primaryPaymentCode, 'primary')}
                    </Hidden>
                  </Grid>
                  {isAlternateCardVisible ? (
                    <Grid item xs={12} md={6} lg={6}>
                      {/* //desktop view */}
                      <Hidden only={['xs', 'sm']}>
                        <Box
                          my={2}
                          mt={0}
                          p={2}
                          pb={0}
                          bgcolor='background.paper'
                          borderRadius='10px'
                          boxShadow=' 0px 0px 8px rgba(0, 0, 0, 0.14)'
                          height={1}
                        >
                          {!secondaryPaymentMethodList?.data
                            ?.alternatePaymentMethods ? (
                            <CircularProgress color='inherit' />
                          ) : accounts.consumerPaymentDetails &&
                            hasAlternatePaymentMethods ? (
                            this.getPymentTypeData(
                              secondaryPaymentCode,
                              'secondary'
                            )
                          ) : (
                            <></>
                          )}
                        </Box>
                      </Hidden>
                      {/* mobile view */}
                      <Hidden only={['md', 'lg', 'xl']}>
                        {accounts.consumerPaymentDetails &&
                        hasAlternatePaymentMethods ? (
                          this.getPymentTypeData(
                            secondaryPaymentCode,
                            'secondary'
                          )
                        ) : (
                          <></>
                        )}
                      </Hidden>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : consumerPaymentDetails?.error ? (
          <Notification
            variant={'error'}
            message={consumerPaymentTypesList.error}
            handleClose={this.resetNotification.bind(this)}
          />
        ) : (
          <Grid
            container
            style={{
              marginTop: (!paymentsData || !paymentsData.length) && '24px',
            }}
          >
            <Grid item xs>
              <Grid
                container
                justifyContent={'space-between'}
                spacing={3}
                alignContent='stretch'
                style={{ height: '208px' }}
              >
                <Grid item xs={12} md={6} lg={6}>
                  <Box
                    my={2}
                    mt={0}
                    bgcolor='background.paper'
                    borderRadius='10px'
                    boxShadow=' 0px 0px 8px rgba(0, 0, 0, 0.14)'
                    height={1}
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                  >
                    <CircularProgress />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {variant &&
          message &&
          message.length > 0 &&
          this.renderSnackbar(variant, message)}
      </>
    );
  }
}
export default connect((state) => ({
  ...state.user,
  ...state.payment,
  ...state.accounts,
  ...state.paymentRegistration,
  ...state.paymentAuthentication,
  ...state.DFA,
  ...state.csc,
  ...state.USbankpayment,
}))(compose(withTranslation('common'))(Accounts));
