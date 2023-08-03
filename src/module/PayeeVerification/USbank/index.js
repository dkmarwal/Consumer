import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WhiteCard from '~/components/WhiteCard';
import USbankPrivacyPolicyViewer from '~/components/PrivacyPolicy/USbank';
import USbankTCViewer from '~/components/TCViewer/USbank';

import {
  Box,
  Typography,
  Container,
  Button,
  withStyles,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Link,
  Divider,
  InputAdornment,
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import trim from 'deep-trim-node';
import TextField from '~/components/Forms/TextField';
import PhoneNumber from '~/components/PhoneNumber';
import AlertMessage from '~/components/AlertMessage';
import config from '~/config';
import { verifyConsumerUSbank } from '~/redux/actions/consumerRegistration';
import { preLoginDFA } from '~/redux/actions/DFA';
import { LightTooltip } from '~/components/Tooltip/LightTooltip';
import { updateSnackbar } from '~/redux/actions/consumerRegistration';
import clsx from 'clsx';
import { starredMask } from '~/utils/common';

const styles = (theme) => ({
  root: {
    paddingBottom: '60px',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(1),
    },
  },
  leftDivider: {
    marginLeft: theme.spacing(2),
  },
  headerDivider: {
    borderLeft: `1px solid ${theme.palette.border.main}`,
  },
  primaryTextColor: {
    color: theme.palette.text.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(2.5),
    },
  },
  getStartedButton: {
    minWidth: '9.75rem',
  },
  blueLink: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '-12px',
    marginBottom: '15px',
    '& a': {
      color: '#008CE6',
      fontSize: '12px',
      fontWeight: 'normal',
      paddingLeft: '40px',
      cursor: 'pointer',
    },
  },
  verticalDivider: {
    margin: '9px 0px',
    marginRight: '16px',
    background: '#000',
  },
  formControlLabelClass: {
    '&.MuiFormControlLabel-label': {
      fontWeight: 'bold',
    },
  },
  formControlLabel: {
    fontSize: '16px',
  },
  sendCodeText: {
    color: '#008CE6',
    textDecoration: 'underline',
    cursor:'pointer'
  },
  disabledSendCodeText : {
    color: 'rgba(0, 0, 0, 0.38)',
    textDecoration: 'underline',
  }
});

class USbankPayeeVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: {},
      consumerConfig: {},
      validation: {},
      alertType: '', //info/success/error/loading
      alertMessage: '',
      btnDisabled: false,
      token: null,
      alertBox: false,
      phoneAuthentication: 'payeeId',
      showPrivacyPolicy: false,
      showTC: false,
      codeSent: false,
      disableSendCode:props?.consumer?.error && !props?.consumer?.errorMsgs?.length ? true : false
    };
  }

  handleClosePrivacyPolicy = () => {
    this.setState({ showPrivacyPolicy: false });
  };
  handleCloseTC = () => {
    this.setState({ showTC: false });
  };

  handleSendCode = () => {
    if(this.state.disableSendCode) return false
    const token =
    (this.props?.match?.params && this.props?.match?.params?.token) || '';
    let noOfAttemptsLeft = sessionStorage.getItem(`@noOfAttemptsToResendOtpPayeeAuth_${token}`)
    if(noOfAttemptsLeft === "0"){
      this.setState({
        alertType: 'error',
        alertMessage: "You have exceeded maximum attempts. Please try again after 15 minutes.",
        btnDisabled: false,
      });
      return false
    } else {
      noOfAttemptsLeft-=1
      sessionStorage.setItem(`@noOfAttemptsToResendOtpPayeeAuth_${token}`,noOfAttemptsLeft)
      if(!this.state.codeSent){
        this.setState({
          codeSent: true,
        });
      }
      this.setState({
        disableSendCode:true
      },()=>{
        this.verifyPhone()
      })
    }
   
  };

  verifyPhone = () => {
    const { token, validation } = this.state;
    const { config } = this.props.consumer;
    const preLoginData = {
      token: token,
      portalTypeId: 5,
      dfaType: 'SMS',
      phone: config.phoneNumber,
      phoneCountryCode: '+91',
    };
    this.props.dispatch(preLoginDFA(preLoginData)).then((response) => {
      if (!response) {
        this.setState({
          alertType: 'error',
          validation: { ...validation, phoneOTP: this.props?.DFA?.error ?? '' },
          disableSendCode:false
        });
        return false;
      } else {
        this.setState({
          disableSendCode:false
        })
        this.props.dispatch(
          updateSnackbar({
            message: this.props.t(
              'payeeVerification.user.addView.notification.otpSent'
            ),
            severity: 'success',
            openSnackbar: true,
          })
        );
      }
    });
  };

  getQueryVar = (key) => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === key) {
        return decodeURIComponent(pair[1]);
      }
    }
  };

  componentDidMount = () => {
    const token =
      (this.props?.match?.params && this.props?.match?.params?.token) || '';

    this.setState(
      {
        token: (token && token.trim()) || null,
      },
      () => {
        this.fetchConsumerConfig();
      }
    );
  };

  fetchConsumerConfig = () => {
    const { consumerVerificationParamters, noOfAttemptsToResendOtpPayeeAuth } = this.props.consumer.config || {};
    const token =
      (this.props?.match?.params && this.props?.match?.params?.token) || '';
    let userInfo = {};
    if (consumerVerificationParamters) {
      if(sessionStorage.getItem(`@noOfAttemptsToResendOtpPayeeAuth_${token}`) === null){
        sessionStorage.setItem(`@noOfAttemptsToResendOtpPayeeAuth_${token}`, noOfAttemptsToResendOtpPayeeAuth);
      }
      consumerVerificationParamters &&
        consumerVerificationParamters.length > 0 &&
        consumerVerificationParamters.forEach((item) => {
          if (item.fieldName === 'phoneNumber') {
            userInfo['phone'] = item.value;
          } else if (item.fieldName === 'emailAddress') {
            userInfo['emailAddress'] = null;
          } else {
            userInfo[`${item.fieldName}`] = item.value || null;
          }
        });
    }

    this.setState({
      consumerConfig: this.props.consumer.config || {},
      user: userInfo,
      btnDisabled: false,
      alertType: 'info',
      isLoading: false,
    });
  };

  validateForm = () => {
    const {
      user,
      consumerConfig: { consumerVerificationParamters },
      phoneAuthentication,
    } = this.state;
    let valid = true;
    let validation = {};

    if (phoneAuthentication === 'txtMe') {
      if (!user.phoneOTP || (user.phoneOTP && user.phoneOTP.trim() === '')) {
        validation['phoneOTP'] = this.props.t(
          'payeeVerification.user.addView.error.phoneOTP'
        );
        valid = false;
      }
    }

    consumerVerificationParamters &&
      consumerVerificationParamters.length > 0 &&
      consumerVerificationParamters
        .filter((item) => item.isRequired)
        .map((item) => {
          if (
            item.fieldName === 'consumerIdentifier' &&
            phoneAuthentication === 'payeeId' &&
            (!user ||
              !user.consumerIdentifier ||
              (user.consumerIdentifier &&
                user.consumerIdentifier.trim() === ''))
          ) {
            validation['consumerIdentifier'] = this.props.t(
              'payeeVerification.user.addView.error.consumerId',
              { displayName: item.displayName }
            );
            valid = false;
          }

          if (
            item.fieldName === 'firstName' &&
            (!user ||
              !user.firstName ||
              (user.firstName && user.firstName.trim() === ''))
          ) {
            validation['firstName'] = this.props.t(
              'payeeVerification.user.addView.error.firstName'
            );
            valid = false;
          }

          if (
            item.fieldName === 'lastName' &&
            (!user ||
              !user.lastName ||
              (user.lastName && user.lastName.trim() === ''))
          ) {
            validation['lastName'] = this.props.t(
              'payeeVerification.user.addView.error.lastName'
            );
            valid = false;
          }

          const phoneValidation = /^([0-9]){10}$/;
          if (
            item.fieldName === 'phoneNumber' &&
            user &&
            user.phone &&
            !phoneValidation.test(user.phone.trim())
          ) {
            validation['phone'] = this.props.t(
              'payeeVerification.user.addView.error.phone'
            );
            valid = false;
          }

          if (
            item.fieldName === 'phoneNumber' &&
            (!user ||
              !user.phone ||
              user.phone.toString().trim() === '' ||
              user.phone.toString().trim().length !== 10)
          ) {
            validation['phone'] = this.props.t(
              'payeeVerification.user.addView.error.phone'
            );
            valid = false;
          }

          if (
            item.fieldName === 'emailAddress' &&
            (!user ||
              !user.emailAddress ||
              (user.emailAddress && user.emailAddress.trim() === ''))
          ) {
            validation['emailAddress'] = this.props.t(
              'payeeVerification.user.addView.error.emptyEmail',
              { displayName: item.displayName }
            );
            valid = false;
          }
          if (
            item.fieldName === 'emailAddress' &&
            user &&
            user.emailAddress &&
            user.emailAddress.trim().length > 0
          ) {
            const re =
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(user.emailAddress.trim().toLowerCase())) {
              validation['emailAddress'] = this.props.t(
                'payeeVerification.user.addView.error.email',
                { displayName: item.displayName }
              );
              valid = false;
            }
          }
          if (
            item.fieldName === 'addressLine1' &&
            (!user ||
              !user.addressLine1 ||
              (user.addressLine1 && user.addressLine1.trim() === ''))
          ) {
            validation['addressLine1'] = this.props.t(
              'payeeVerification.user.addView.error.addressLine1'
            );
            valid = false;
          }
          if (
            item.fieldName === 'addressLine2' &&
            (!user ||
              !user.addressLine2 ||
              (user.addressLine2 && user.addressLine2.trim() === ''))
          ) {
            validation['addressLine2'] = this.props.t(
              'payeeVerification.user.addView.error.addressLine2'
            );
            valid = false;
          }
          if (
            item.fieldName === 'customField1' &&
            (!user ||
              !user.customField1 ||
              (user.customField1 && user.customField1.trim() === ''))
          ) {
            validation['customField1'] = this.props.t(
              'payeeVerification.user.addView.error.customFieldError',
              { fieldName: item.displayName }
            );
            valid = false;
          }
          if (
            item.fieldName === 'customField2' &&
            (!user ||
              !user.customField2 ||
              (user.customField2 && user.customField2.trim() === ''))
          ) {
            validation['customField2'] = this.props.t(
              'payeeVerification.user.addView.error.customFieldError',
              { fieldName: item.displayName }
            );
            valid = false;
          }
          if (
            item.fieldName === 'customField3' &&
            (!user ||
              !user.customField3 ||
              (user.customField3 && user.customField3.trim() === ''))
          ) {
            validation['customField3'] = this.props.t(
              'payeeVerification.user.addView.error.customFieldError',
              { fieldName: item.displayName }
            );
            valid = false;
          }
          if (
            item.fieldName === 'customField4' &&
            (!user ||
              !user.customField4 ||
              (user.customField4 && user.customField4.trim() === ''))
          ) {
            validation['customField4'] = this.props.t(
              'payeeVerification.user.addView.error.customFieldError',
              { fieldName: item.displayName }
            );
            valid = false;
          }
          if (
            item.fieldName === 'customField5' &&
            (!user ||
              !user.customField5 ||
              (user.customField5 && user.customField5.trim() === ''))
          ) {
            validation['customField5'] = this.props.t(
              'payeeVerification.user.addView.error.customFieldError',
              { fieldName: item.displayName }
            );
            valid = false;
          }
        });

    this.setState({ validation: { ...validation } });
    return valid;
  };

  handleChange = (field, event, position) => {
    const { user } = this.state;
    const newUserDetail = { ...user };

    switch (field) {
      case 'phone':
        const phoneValue = event.target.value;
        newUserDetail['phoneCountryCode'] = '+1';
        newUserDetail['phone'] = phoneValue.phone;
        break;
      case 'consumerIdentifier':
        const consumerIdentifier = event.target.value.replace(
          /[^a-zA-Z0-9 !@_#$';{}^.~-]/g,
          ''
        );
        newUserDetail[field] = consumerIdentifier;
        break;
      case 'phoneOTP':
        newUserDetail[field] = event.target.value.replace(/[^0-9]/g, '');
        break;
      default:
        newUserDetail[field] = event.target.value;
        break;
    }

    this.setState({ user: { ...newUserDetail } });
  };

  hideAlertMessage = () => {
    this.setState({ alertMessage: '', alertType: 'info' });
  };

  handleAlertClose = () => {
    this.setState(
      {
        alertBox: false,
      },
      () => {
        const { consumerConfig, token } = this.state;
        const routeParam =
          (this.props.match.params && this.props.match.params.clientSlug) || '';
        const { takePhoneDuringEnrollment } =
          this.props.consumer.config || false;
        this.props.history.push({
          pathname: `${config.baseName}/${routeParam}/signup`,
          state: {
            token: token,
            isVerified: true,
            isOneTimePayment:
              (consumerConfig && consumerConfig.isOneTimePayment) || false,
            showSSN:
              consumerConfig && consumerConfig.isSsnMandatory === 1
                ? true
                : false,
            paymentAmount: consumerConfig.paymentAmount,
            clientName: consumerConfig.clientName,
            consumerInfo: this.props.consumer?.info,
            takePhoneDuringEnrollment:
              takePhoneDuringEnrollment === true ||
              takePhoneDuringEnrollment === 'true' ||
              takePhoneDuringEnrollment === 1
                ? true
                : false,
          },
        });
      }
    );
  };

  renderInfo = () => {
    const { alertType, alertMessage } = this.state;
    const { user, t } = this.props;
    const clientName = user?.brandInfo?.clientName ?? '';

    switch (alertType) {
      case 'error':
        return (
          <AlertMessage
            alertType='error'
            alertTitleMsg={`WARNING: ${alertMessage}`}
          />
        );
      default:
        return (
          <Typography variant='body2'>
            {t('payeeVerification.identityVerificationMessage', {
              clientName: clientName,
            })}
          </Typography>
        );
    }
  };
  showErrorFields = (errorMsges) => {
    let validation = {};
    errorMsges?.length > 0 &&
      errorMsges.map((item) =>
        item.fieldName === 'phoneNumber'
          ? (validation['phone'] = item.errorMessage)
          : item.fieldName === 'dfaCode' ? (validation['phoneOTP'] = item.errorMessage) : (validation[item.fieldName] = item.errorMessage)
      );
    this.setState({ validation: { ...validation } });
  };

  handleSubmit = () => {
    let { user, consumerConfig, token, phoneAuthentication } = this.state;
    const valid = this.validateForm();
    if (!valid) {
      /*this.setState({
        alertType: "error",
        alertMessage: "Kindly check the details provided.",
      });*/
      return false;
    }
    this.setState(
      {
        alertType: 'loading',
        btnDisabled: true,
      },
      () => {
        this.props
          .dispatch(
            verifyConsumerUSbank({
              token: token,
              user: trim(user),
              phoneAuthentication: phoneAuthentication,
              phoneOTP: user.phoneOTP,
            })
          )
          .then((response) => {
            if (!response) {
              this.showErrorFields(this.props.consumer.errorMsgs);
              if(this.props.consumer.error && !this.props.consumer.errorMsgs?.length){
                sessionStorage.removeItem(`@noOfAttemptsToResendOtpPayeeAuth_${token}`)
                this.setState({
                  disableSendCode:true
                })
              }
              this.setState({
                alertType: 'error',
                alertMessage: this.props.consumer.error,
                btnDisabled: false,
              });
              return false;
            }
            sessionStorage.removeItem(`@noOfAttemptsToResendOtpPayeeAuth_${token}`)
            this.props.dispatch(
              updateSnackbar({
                message: this.props.t(
                  'payeeVerification.user.addView.notification.youAreSuccessfullyVerified'
                ),
                severity: 'success',
                openSnackbar: true,
              })
            );
            const routeParam =
              (this.props.match.params && this.props.match.params.clientSlug) ||
              '';
            const { takePhoneDuringEnrollment } =
              this.props.consumer.config || false;
            this.props.history.push({
              pathname: `${config.baseName}/${routeParam}/signup`,
              state: {
                token: token,
                isVerified: true,
                isOneTimePayment:
                  (consumerConfig && consumerConfig.isOneTimePayment) || false,
                showSSN:
                  consumerConfig && consumerConfig.isSsnMandatory === 1
                    ? true
                    : false,
                paymentAmount: consumerConfig.paymentAmount,
                clientName: consumerConfig.clientName,
                consumerInfo: this.props.consumer?.info,
                takePhoneDuringEnrollment:
                  takePhoneDuringEnrollment === true ||
                  takePhoneDuringEnrollment === 'true' ||
                  takePhoneDuringEnrollment === 1
                    ? true
                    : false,
              },
            });
          });
      }
    );
  };

  renderForm = () => {
    const {
      consumerConfig: { consumerVerificationParamters },
    } = this.state;
    const dynamicFieldNames =
      consumerVerificationParamters?.map((items) => items.fieldName) ?? [];

    const isNamesAvailable =
      dynamicFieldNames?.includes('firstName') &&
      dynamicFieldNames?.includes('lastName');

    const namesArr = [];
    const payeeForm =
      (consumerVerificationParamters &&
        consumerVerificationParamters.length > 0 &&
        consumerVerificationParamters.map((item) => {
          if (
            isNamesAvailable &&
            (item.fieldName === 'firstName' || item.fieldName === 'lastName')
          ) {
            namesArr.push(item);
          }
          if (
            (isNamesAvailable &&
              item.fieldName !== 'firstName' &&
              item.fieldName !== 'lastName') ||
            !isNamesAvailable
          ) {
            const formItem = this.renderFormItem(item);
            return formItem;
          }
        })) ||
      [];
    if (isNamesAvailable) {
      const namesItems = this.renderNames(namesArr);
      if (namesItems) {
        if (payeeForm.length) {
          payeeForm.splice(1, 0, namesItems);
        } else {
          payeeForm.push(namesItems);
        }
      }
    }
    return payeeForm;
  };

  renderNames = (namesArr) => {
    const { validation, user } = this.state;
    return (
      <Grid container justifyContent='space-between'>
        {namesArr.map((item) => {
          return (
            <Box
              width={{ xs: 1, lg: 0.49, xl: 0.49 }}
              mt={2}
              key={item.fieldId}
            >
              <TextField
                required={item.isRequired || false}
                label={item.displayName || ''}
                error={validation[item.fieldName || false]}
                helperText={validation[item.fieldName] || ''}
                fullWidth={true}
                autoComplete='off'
                autoFocus={false}
                variant='outlined'
                value={(user && user[[item.fieldName]]) || ''}
                name={item.fieldName}
                onChange={(event) => this.handleChange(item.fieldName, event)}
                inputProps={{
                  maxLength: 50,
                }}
              />
            </Box>
          );
        })}
      </Grid>
    );
  };

  renderFormItem = (item) => {
    const { validation, user, phoneAuthentication } = this.state;
    // if((item.fieldName === "consumerIdentifier" || item.fieldName === "phoneNumber") && phoneAuthentication === "txtMe") {
    //   return null
    // }

    if (
      item.fieldName === 'consumerIdentifier' &&
      phoneAuthentication === 'txtMe'
    ) {
      return null;
    }

    if (item.fieldName === 'phoneNumber') {
      return (
        <Box width={1} mt={2} key={item.fieldId}>
          <PhoneNumber
            required={item.isRequired || false}
            error={validation.phone ? true : false}
            helperText={validation.phone}
            // id="phone"
            name='phone'
            label={this.props.t('textBox.label.phone')}
            isExt={false}
            ext={(user && user.phoneExt) || ''}
            value={(user && user.phone) || ''}
            ccode={(user && user.phoneCountryCode) || ''}
            isCountryCode={false}
            prefixCcode='+1'
            onChange={(event) => this.handleChange('phone', event)}
            placeHolderText={item.value ? `XXX-XXX-${item.value.slice(6)}` : ''}
          />
        </Box>
      );
    }
    if (item.fieldName === 'emailAddress') {
      return (
        <Grid
          container
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box width={1} mt={2} key={item.fieldId} position='relative'>
            <TextField
              required={item.isRequired || false}
              label={item.displayName || ''}
              error={validation[item.fieldName || false]}
              helperText={validation[item.fieldName] || ''}
              fullWidth={true}
              autoComplete='off'
              autoFocus={false}
              variant='outlined'
              value={(user && user[[item.fieldName]]) || ''}
              name={item.fieldName}
              onChange={(event) => this.handleChange(item.fieldName, event)}
              inputProps={{
                maxLength: 254,
              }}
              placeholder={item.value ?? ''}
            />
            <Box
              width={0.05}
              mt={2}
              display='flex'
              position='absolute'
              right={{ xs: '-7%', sm: '-30px', md: '-45px', lg: '-50px' }}
              top='0'
            >
              <LightTooltip
                title={this.props.t('payeeVerification.emailTooltip')}
                placement='top-end'
              />
            </Box>
          </Box>
        </Grid>
      );
    }

    let maxLength = 140;
    switch (item.fieldName) {
      case 'consumerIdentifier':
        maxLength = 255;
        break;
      case 'firstName':
      case 'lastName':
        maxLength = 50;
        break;
      case 'addressLine1':
      case 'addressLine2':
        maxLength = 75;
        break;
      case 'postalCode':
        maxLength = 20;
        break;
      case 'customField1':
      case 'customField2':
      case 'customField3':
      case 'customField4':
      case 'customField5':
        maxLength = 140;
        break;
      default:
        break;
    }

    return (
      <Box width={1} mt={2} key={item.fieldId}>
        <TextField
          required={item.isRequired || false}
          label={item.displayName || ''}
          error={validation[item.fieldName || false]}
          helperText={validation[item.fieldName] || ''}
          fullWidth={true}
          autoComplete='off'
          autoFocus={false}
          variant='outlined'
          value={(user && user[[item.fieldName]]) || ''}
          name={item.fieldName}
          onChange={(event) => this.handleChange(item.fieldName, event)}
          inputProps={{
            maxLength: maxLength,
          }}
        />
      </Box>
    );
  };

  handleFormSelection = (e) => {
    // if (
    //   e.target.value === 'txtMe' &&
    //   this.state.phoneAuthentication !== 'txtMe'
    // ) {
    //   this.verifyPhone();
    // }
    this.setState({
      phoneAuthentication: e.target.value,
      validation: {},
    });
  };

  privacyPolicyMessage = () => {
    const { t } = this.props;
    return (
      <>
        <Typography variant='p'>
          {t('payeeVerification.privacyPolicyMsg')}
        </Typography>
      </>
    );
  };

  termServicesMessage = () => {
    const { t } = this.props;
    const userInfo = this.props.user?.brandInfo;
    return (
      <>
        <Box pt={2} pb={4}>
          <img src={userInfo.logo} alt={userInfo.clientName} />
        </Box>
        <Box pb={4}>
          <Typography variant='h1'>
            {t('payeeVerification.termServices')}
          </Typography>
        </Box>
        <Box>
          <Typography variant='p'>
            {t('payeeVerification.termServicesMsg')}{' '}
            <a href='https://www.usbank.com/privacy/'>
              https://www.usbank.com/privacy/
            </a>
            {t('payeeVerification.termServicesMsg1')}{' '}
            <a href='https://www.usbank.com/en/personal/PersonalCustomerService'>
              https://www.usbank.com/en/personal/PersonalCustomerService.
            </a>
            {t('payeeVerification.termServicesMsg2')}
          </Typography>
        </Box>
      </>
    );
  };

  renderFormSelection = () => {
    const {
      consumerConfig: {
        consumerVerificationParamters,
        phoneNumber,
        isPayeeAuthenticationUsingOTP,
      },
      phoneAuthentication,
      validation,
      showPrivacyPolicy,
      showTC,
      user,
      disableSendCode,
      codeSent
    } = this.state;
    const { classes, t } = this.props;
    const phoneNumerField = consumerVerificationParamters?.find(
      (item) => item.fieldName === 'phoneNumber'
    );
    if (isPayeeAuthenticationUsingOTP && phoneNumber) {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='row-radio-buttons-group'
              >
                <FormControlLabel
                  value='payeeId'
                  control={<Radio />}
                  label={t('payeeVerification.radioBtn.payeeID')}
                  checked={phoneAuthentication === 'payeeId'}
                  name='payeeId'
                  onChange={this.handleFormSelection}
                  classes={{
                    label: clsx(
                      classes.formControlLabel,
                      phoneAuthentication === 'payeeId' &&
                        classes.formControlLabelClass
                    ),
                  }}
                />
                <Divider
                  orientation='vertical'
                  flexItem
                  className={classes.verticalDivider}
                />
                <FormControlLabel
                  value='txtMe'
                  control={<Radio />}
                  label={t('payeeVerification.radioBtn.txtMe')}
                  checked={phoneAuthentication === 'txtMe'}
                  name='txtMe'
                  onChange={this.handleFormSelection}
                  classes={{
                    label: clsx(
                      classes.formControlLabel,
                      phoneAuthentication === 'txtMe' &&
                        classes.formControlLabelClass
                    ),
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {phoneAuthentication !== 'payeeId' ? (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box pt={2}>
                    <TextField
                      disabled
                      value={phoneNumber ? starredMask(phoneNumber) : ''}
                      label={phoneNumerField?.displayName}
                      fullWidth={true}
                      autoComplete='off'
                      autoFocus={false}
                      variant='outlined'
                      name={phoneNumerField?.fieldName}
                      inputProps={{
                        maxLength: 10,
                      }}
                      endAdornmentText={
                        <InputAdornment position='end'>
                          <Typography
                            className={disableSendCode ? classes.disabledSendCodeText :classes.sendCodeText}
                            onClick={this.handleSendCode}
                            disabled={disableSendCode}
                          >
                            {codeSent ? 'Resend Code' : 'Send Code'}
                          </Typography>
                        </InputAdornment>
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} justifyContent='flex-end'>
                  <Box className={classes.blueLink}>
                    {/* <Link onClick={this.verifyPhone}>
                      {t('payeeVerification.textBoxLink.resendCode')}
                    </Link> */}
                    <Link
                      onClick={() => {
                        this.setState({ showPrivacyPolicy: true });
                      }}
                    >
                      {t('payeeVerification.textBoxLink.privacyPolicy')}
                    </Link>
                    <Link
                      onClick={() => {
                        this.setState({ showTC: true });
                      }}
                    >
                      {t('payeeVerification.textBoxLink.termOfServices')}
                    </Link>
                  </Box>
                  <Box>
                    <TextField
                      required={true}
                      label={t('payeeVerification.user.addView.label.enterOTP')}
                      error={validation['phoneOTP' || false]}
                      helperText={validation['phoneOTP'] || ''}
                      fullWidth={true}
                      autoComplete='off'
                      autoFocus={false}
                      variant='outlined'
                      value={user.phoneOTP || ''}
                      name='phoneOTP'
                      onChange={(event) => this.handleChange('phoneOTP', event)}
                      inputProps={{
                        maxLength: 10,
                      }}
                      disabled={!this.state.codeSent}
                      placeholder={t(
                        'payeeVerification.user.addView.placeholder.enterOTP'
                      )}
                    />
                  </Box>
                  {showTC && (
                    <USbankTCViewer
                      //title={t("payeeVerification.termServices")}
                      open={showTC}
                      handleClose={this.handleCloseTC}
                      {...this.props}
                      message={this.termServicesMessage()}
                    />
                  )}
                  {showPrivacyPolicy && (
                    <USbankPrivacyPolicyViewer
                      title={t('payeeVerification.privacyPolicy')}
                      open={showPrivacyPolicy}
                      handleClose={this.handleClosePrivacyPolicy}
                      {...this.props}
                      message={this.privacyPolicyMessage()}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      );
    }
  };

  render() {
    const { btnDisabled } = this.state;
    const { classes, t, isError } = this.props;
    const payeeMesssage = this.renderInfo();
    return (
      <Container maxWidth='lg'>
        <Box mt={{ xs: 2, md: 4, lg: 4, xl: 4 }} mb={{ md: 4, lg: 4, xl: 4 }}>
          {isError ? (
            <WhiteCard margin='2rem 0 1rem 0' mobMar='1.5rem 0 1rem 0'>
              <Box
                display='flex'
                mt={{ xs: 0, lg: 1, xl: 1 }}
                mb={0}
                justifyContent='center'
                style={{ marginBottom: '16px' }}
              >
                <Typography variant='h1' className={classes.primaryTextColor}>
                  {t('payeeVerification.payeeVerification')}
                </Typography>
              </Box>
              <Box
                display='flex'
                justifyContent='center'
                width={{ xs: 'auto', lg: '70%' }}
                margin='auto'
                textAlign='center'
                mt={2}
                mb={{ xs: 2, lg: 4, xl: 3 }}
                alignItems='center'
              >
                <AlertMessage
                  alertType='error'
                  alertTitleMsg={`WARNING: ${isError}`}
                />
              </Box>
            </WhiteCard>
          ) : (
            <WhiteCard margin='2rem 0 1rem' mobMar='1.5rem 0 1rem 0'>
              <Grid
                component={Box}
                width={{ xs: '90%', lg: '77%', xl: '60%' }}
                mx='auto'
              >
                <Box display='flex' mt={{ xs: 0, lg: 1, xl: 1 }} mb={0}>
                  <Typography variant='h1' className={classes.primaryTextColor}>
                    {t('payeeVerification.payeeVerification')}
                  </Typography>
                </Box>
                <Box></Box>
                <Box
                  display='flex'
                  mt={2}
                  width={1}
                  mb={{ xs: 2, lg: 4, xl: 3 }}
                  alignItems='center'
                >
                  {payeeMesssage}
                </Box>
                <Box>{this.renderFormSelection()}</Box>
                {/*content starts here*/}
                {this.renderForm()}
                {/* {this.state.alertBox && (
                <AlertBox
                  heading={t(
                    'payeeVerification.user.addView.notification.verificationComplete'
                  )}
                  text={alertMessage}
                  icon={alertType}
                  open={this.state.alertBox}
                  handleClose={this.handleAlertClose}
                  buttonText={t('payeeVerification.buttonLabel.continue')}
                />
              )} */}
                <Box
                  display='flex'
                  justifyContent='center'
                  mx={1}
                  width={1}
                  mt={{ xs: 2, lg: 3, xl: 3 }}
                  mb={{ xs: 1, lg: 2, xl: 2 }}
                >
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={btnDisabled}
                    disableElevation
                    onClick={() => this.handleSubmit()}
                    className={classes.getStartedButton}
                  >
                    {t('payeeVerification.buttonLabel.verify')}
                  </Button>
                </Box>
              </Grid>
            </WhiteCard>
          )}
        </Box>
        {/*content ends here*/}
        {/*alertType ==="error" && this.renderSnackbar(alertType, alertMessage)*/}

        {/* <Hidden only={["sm", "md", "lg"]}>
          <Box className="stepCol">
            <div className="stepColLeft">
              <p>1</p>
            </div>
            <div className="stepColRight">
              <p>{t("payeeVerification.threeSteps")}</p>
              <h5>{t("payeeVerification.verifyYourself")}</h5>
            </div>
          </Box>
        </Hidden> */}
      </Container>
    );
  }
  // showPrivacyPolicy = (showPrivacyPolicy) => {
  //   return (
  //     <USbankPrivacyPolicyViewer
  //       open={showPrivacyPolicy}
  //       handleClose={this.handleClosePrivacyPolicy}
  //       {...this.props}
  //       message={this.privacyPolicyMessage}
  //     />
  //   );
  // };
  showTC = (showTC) => {
    return (
      <USbankTCViewer
        open={showTC}
        handleClose={this.handleCloseTC}
        {...this.props}
      />
    );
  };
}

export default connect((state) => ({
  ...state.consumerVerification,
  ...state.user,
}))(
  compose(
    withTranslation('common'),
    withStyles(styles)
  )(USbankPayeeVerification)
);
