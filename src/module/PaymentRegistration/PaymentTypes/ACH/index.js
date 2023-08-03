import React, { Component } from 'react';
import { styles } from './styles';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import {
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Modal,
  Link,
} from '@material-ui/core';
import ConsumerEnrollmentRemittance from '~/module/Remittance/ConsumerEnrollment';
import { connect } from 'react-redux';
import RoutingCodeSearch from '~/module/RoutingCodeResults/routingCodeSearch';
import { CustomDialog, TimeoutDialog } from '~/components/Dialogs';
import {
  getClientPaymentTypes,
  fetchRoutingCodes,
} from '~/redux/actions/payments';
import { createConsumerACHInfo } from '~/redux/actions/paymentRegistration';
import trim from 'deep-trim-node';
import Notification from '~/components/Notification';
import TextField from '~/components/Forms/TextField';
import config from '~/config';
import { preferencePaymentType,EmailDeliveryModeId } from '~/config/consumerEnrollmentConst';
import VerifyUser from '~/module/PaymentAuthentication/verifyUser';
import { fetchPaymentsToAuthenticate } from '~/redux/actions/paymentAuthentication';
import { withTranslation } from 'react-i18next';
import SearchIcon from '~/assets/icons/search.svg';
import AlphaNumericMaskInput from '~/components/MaskInput/AlphaNumericMaskInput';

class ACH extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSearchModal: false,
      openAuthModal: false,
      achInfo: {
        accountNumber: '',
        routingNumber: '',
        accountType: '',
        bankName: '',
        confirmAccountNumber: '',
      },
      validationInfo: {
        accountNumber: false,
        routingNumber: false,
        accountType: false,
        bankName: false,
        confirmAccountNumber: false,
        remittanceEmail: false,
      },
      notificationVariant: '',
      notificationMessage: '',
      processingUpdate: false,
      alertMsg: false,
      paymentMethodShared: null,
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(getClientPaymentTypes());
  };

  handleChange = (name, { target }) => {
    const { value } = target;
    const newAchInfo = { ...this.state.achInfo }
    const numericFields = ['routingNumber'];
    const finalValue =
      numericFields.indexOf(name) > -1 ? value.replace(/[^0-9]/g, '') : value;
    if (name === 'routingNumber') {
      if (finalValue?.length === 9) {
        this.onBlurRoutingCode(finalValue);
      }
      if (this.state.achInfo.bankName) {
        newAchInfo.bankName = ''
      }
    }
    newAchInfo[name] = finalValue
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
              bankName: '',
            },
          });
        }
      });
  };

  handleValidation = () => {
    const currentValidationInfo = {};
    const {
      accountNumber,
      routingNumber,
      accountType,
      bankName,
      confirmAccountNumber,
    } = this.state.achInfo;
    const { t } = this.props;
    let isError = false;

    if (!accountNumber || !accountNumber.trim().length) {
      currentValidationInfo.accountNumber = t(
        'paymentRegistration.ach.error.accountNumber'
      );
      isError = true;
    }

    // for alternate payment method
    if (!confirmAccountNumber || !confirmAccountNumber.trim().length) {
      currentValidationInfo.confirmAccountNumber = t(
        'paymentRegistration.ach.error.confirmAccountNumber'
      );
      isError = true;
    } else if (
      confirmAccountNumber &&
      accountNumber &&
      confirmAccountNumber !== accountNumber
    ) {
      currentValidationInfo.confirmAccountNumber = t(
        'paymentRegistration.ach.error.confirmAccountNumberCheck'
      );
      isError = true;
    }

    if (!routingNumber || !routingNumber.trim().length) {
      currentValidationInfo.routingNumber = t(
        'paymentRegistration.ach.error.routingNumber'
      );
      isError = true;
    } else if (routingNumber.length !== 9) {
      currentValidationInfo.routingNumber = t(
        'paymentRegistration.ach.error.routingNumberLength'
      );
      isError = true;
    }

    if (!accountType) {
      currentValidationInfo.accountType = t(
        'paymentRegistration.ach.error.accountType'
      );
      isError = true;
    }
    if (!bankName || !bankName.trim().length) {
      currentValidationInfo.bankName = t(
        'paymentRegistration.ach.error.bankName'
      );
      isError = true;
    } else if (bankName.trim().length > 158) {
      currentValidationInfo.bankName = t(
        'updatedAccounts.error.bankNameLength'
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
        return t('paymentRegistration.remittance.emailIdRequired');
      } else if (
        !reg.test(
          String(selectedRemittanceConfigData.remittanceEmail).toLowerCase()
        )
      ) {
        return t('paymentRegistration.remittance.validEmail');
      }
    }
    return false;
  };

  handleErrorNotification = (errorInAction) => {
    const { paymentRegistration, t } = this.props;
    this.setState({
      notificationVariant: 'error',
      notificationMessage:
        paymentRegistration[errorInAction]?.error ??
        t('paymentRegistration.somethingWentWrong'),
      processingUpdate: false,
    });
  };

  routeToRegistrationCompletedPage = () => {
    const { alternateMethod } = this.props;
    const { paymentRegistration, paymentAuthentication } = this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
    const { paymentsData } = paymentAuthentication;
    if (
      consumerPaymentTypesList?.data?.isPaymentAuthRequired === true &&
      paymentsData &&
      paymentsData?.length > 0 &&
      !alternateMethod
    ) {
      this.setState({
        openAuthModal: true,
      });
    } else {
      if (alternateMethod) {
        this.setState({ alertMsg: true }, () => {
          setTimeout(() => {
            this.pushToThankyouPage();
          }, 5000);
        });
      } else {
        this.pushToThankyouPage();
      }
    }
  };

  pushToThankyouPage = () => {
    const { paymentRegistration, alternateMethod, location } = this.props;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';

    this.props.history.push({
      pathname: `${config.baseName}/${routeParam}/paymentRegistration/complete`,
      state: {
        paymentType: alternateMethod ? location?.state?.paymentType : 'ACH',
        dynamicMessage: alternateMethod
          ? this.props?.location?.state?.preferredMsg
          : paymentRegistration.ACHInfo?.data?.dynamicMessage,
        dynamicFooterMessage: alternateMethod
          ? this.props?.location?.state?.preferredFooterMsg
          : paymentRegistration.ACHInfo?.data?.dynamicFooterMessage,
        isVerified: true,
      },
    });
  };

  handleACHInfoSave = (_) => {
    const {
      dispatch,
      paymentRegistration,
      paymentAuthentication,
      alternateMethod,
      t,
    } = this.props;
    const {
      consumerPaymentTypesList,
      selectedRemittanceConfigData,
      isRemittanceEnabled,
    } = paymentRegistration;
    const isError = this.handleValidation();
    if (isError) {
      return false;
    } else if (
      isRemittanceEnabled &&
      !selectedRemittanceConfigData &&
      !alternateMethod
    ) {
      this.setState({
        notificationVariant: 'error',
        notificationMessage: t('paymentRegistration.remittance.deliveryMode'),
      });
    } else {
      this.setState({
        processingUpdate: true,
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
      const finalAchInfoData = trim(this.state.achInfo);
      dispatch(
        createConsumerACHInfo({
          ...finalAchInfoData,
          remittanceDetails: remittanceData,
          preferenceType: alternateMethod
            ? preferencePaymentType.alternate
            : preferencePaymentType.preferred,
        })
      ).then((response) => {
        if (!response) {
          this.handleErrorNotification('ACHInfo');
          return null;
        } else {
          this.setState(
            {
              paymentMethodShared: paymentRegistration.selectedPaymentTypeCode,
              processingUpdate: false,
              notificationVariant:
                alternateMethod === undefined ? 'success' : '',
              notificationMessage:
                alternateMethod === undefined
                  ? t('paymentRegistration.ach.successMsg')
                  : '',
            },
            () => {
              if (consumerPaymentTypesList?.data?.enrollmentLinkId) {
                dispatch(
                  fetchPaymentsToAuthenticate(
                    { token: consumerPaymentTypesList?.data?.enrollmentLinkId },
                    false
                  )
                ).then((response) => {
                  if (!response) {
                    this.setState({
                      notificationVariant: 'error',
                      notificationMessage:
                        paymentAuthentication?.error ??
                        t('paymentRegistration.somethingWentWrong'),
                      processingUpdate: false,
                    });
                    return null;
                  } else {
                    this.routeToRegistrationCompletedPage();
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
    // }
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
      notificationVariant: '',
      notificationMessage: '',
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
        bankName: bankData.bankName,
        routingNumber: bankData.routingCode,
      },
      validationInfo: {
        ...this.state.validationInfo,
        bankName: false,
        routingNumber: false,
      },
    });
  };

  handleModalCloseIcon = () => {
    this.setState({
      openAuthModal: false,
    });
    if (this.props.user && this.props.user.isLoggedIn) {
      this.pushToThankyouPage();
    }
  };

  handleDialogClose = () => {
    this.setState({
      openSearchModal: false,
    });
  };

  renderManualConnection = () => {
    this.setState({manualConnection: true})
  }

  showManualConnection = () => {
    const { t, classes } = this.props;
    return (
      <Grid container spacing={4}>
      <Grid item xs={12} lg={6}>
      <Typography className={classes.connectionHeading} gutterBottom>
        {t('paymentRegistration.heading.instantConnection')}
      </Typography>
      <Typography>
      {t('paymentRegistration.ach.instantConnectionMsg')}
      </Typography>
      <Box pt={7.5}>
      <Button
        variant="contained"
        color="primary"
        className={classes.connectionButton}
        //onClick={(e) => this.handleACHInfoSave(e)}
      >
        {t('paymentRegistration.button.loginBank')}
      </Button>
      </Box>
      </Grid>
      <Grid item xs={12} lg={6}>
      <Typography className={classes.connectionHeading} gutterBottom>
        {t('paymentRegistration.heading.manualConnection')}
      </Typography>
      <Typography>
      {t('paymentRegistration.ach.manualConnectionMsg')}
      </Typography>
      <Box pt={5}>
      <Button
        variant="contained"
        color="primary"
        className={classes.connectionButton}
        onClick={() => this.renderManualConnection()}
      >
        {t('paymentRegistration.button.addBank')}
      </Button>
      </Box>
      </Grid>
      </Grid>
    )
  }

  render() {
    const {
      classes,
      payment,
      paymentRegistration,
      paymentAuthentication,
      token,
      alternateMethod,
      onSkipButton,
      ...otherProps
    } = this.props;
    const { types } = payment;
    const { remittanceStatus } = this.props.accounts;
    const { paymentsData } = paymentAuthentication;
    const { t } = this.props;
    const { achInfo, validationInfo, notificationMessage, alertMsg } =
      this.state;
    const loggedIn = this.props.user && this.props.user.isLoggedIn;
    return (
      <Grid container>
        <Grid container className={classes.achInfoOuterContainer}>
          <Grid item xs={12} lg={10}>
            <Typography className={classes.achInfoHeading} gutterBottom>
              {t('paymentRegistration.heading.ach')}
            </Typography>
          </Grid>
          <Grid container item spacing={2}>
            <Grid item xs={12} md={5} lg={5}>
              <AlphaNumericMaskInput
                required
                className={classes.alphaNumericTextField}
                label={t('paymentRegistration.ach.label.accountNumber')}
                error={Boolean(validationInfo.accountNumber)}
                helperText={validationInfo.accountNumber}
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={achInfo.accountNumber}
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

            <Grid item xs={12} md={5} lg={5}>
              <AlphaNumericMaskInput
                required
                className={classes.alphaNumericTextField}
                label={t('paymentRegistration.ach.label.accountNumberConfirm')}
                error={Boolean(validationInfo.confirmAccountNumber)}
                helperText={validationInfo.confirmAccountNumber}
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={achInfo.confirmAccountNumber}
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

            <Grid item xs={12} md={10} lg={10}>
              <TextField
                required
                label={t('paymentRegistration.ach.label.routingNumber')}
                error={Boolean(validationInfo.routingNumber)}
                helperText={validationInfo.routingNumber}
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={this.state.achInfo.routingNumber}
                name="routingNumber"
                onChange={(e) => this.handleChange('routingNumber', e)}

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
                {t('updatedAccounts.label.searchBank')}
                <img
                  style={{ marginLeft: '4px' }}
                  src={SearchIcon}
                  alt="search"
                />
              </Link>
            </Grid>

            <Grid item xs={12} md={10} lg={10}>
              <TextField
                name="bankName"
                variant="outlined"
                label={t('paymentRegistration.ach.label.bankName')}
                onChange={(e) => this.handleChange('bankName', e)}
                value={achInfo.bankName}
                inputProps={{
                  maxLength: 158,
                }}
                required
                error={Boolean(validationInfo.bankName)}
                helperText={validationInfo.bankName}
              />
            </Grid>

            <Grid item xs={12} md={10} lg={10}>
              <TextField
                required
                label={t('paymentRegistration.ach.label.accountType')}
                error={validationInfo.accountType}
                helperText={validationInfo.accountType}
                select
                value={achInfo.accountType}
                variant="outlined"
                name="accountType"
                onChange={(event) => this.handleChange('accountType', event)}
              >
                <MenuItem value="">
                  <em>{t('paymentRegistration.ach.label.select')}</em>
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
              <Grid item xs={12} md={10} lg={10}>
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
        {paymentsData && paymentsData.length > 0 && (
          <Modal
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
                this.pushToThankyouPage();
              }}
            />
          </Modal>
        )}
        <Grid container className={classes.actionButtonCont}>
          {alternateMethod && (
            <Grid item style={{ padding: '8px' }}>
              <Button className={classes.linkBtn} onClick={onSkipButton}>
                {t('paymentRegistration.alternatePayment.skip')}
              </Button>
            </Grid>
          )}
          <Grid item className={classes.buttonGridItems}>
            <Button
              variant="contained"
              color="primary"
              className={classes.shareButton}
              onClick={(e) => this.handleACHInfoSave(e)}
            >
              {t('paymentRegistration.button.continue')}
            </Button>
          </Grid>
        </Grid>
        {notificationMessage && this.renderSnackbar()}
        {alertMsg ? (
          <TimeoutDialog
            open={alertMsg}
            msgText={t('paymentRegistration.ach.msgText')}
          />
        ) : null}
      </Grid>
    );
  }
}

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.payment,
  ...state.paymentAuthentication,
  ...state.accounts,
  ...state.user,
}))(compose(withTranslation('common'), withStyles(styles))(ACH));