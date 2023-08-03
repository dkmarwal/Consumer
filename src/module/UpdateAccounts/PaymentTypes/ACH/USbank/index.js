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
import InstantBanking from './instantBanking';
import { connect } from 'react-redux';
import RoutingCodeSearch from '~/module/RoutingCodeResults/routingCodeSearch';
import { CustomDialog, TimeoutDialog } from '~/components/Dialogs';
import {
  getClientPaymentTypes,
  fetchRoutingCodes,
} from '~/redux/actions/payments';
import {
  updateConsumerBankAchInfo,
  fetchConsumerPaymentDetails,
} from '~/redux/actions/accounts';
import { createConsumerACHInfo } from '~/redux/actions/paymentRegistration';
import trim from 'deep-trim-node';
import Notification from '~/components/Notification';
import TextField from '~/components/Forms/TextField';
import config from '~/config';
import { preferencePaymentType } from '~/config/consumerEnrollmentConst';
import VerifyUser from '~/module/PaymentAuthentication/verifyUser';
import { withTranslation } from 'react-i18next';
import SearchIcon from '~/assets/icons/search.svg';
import AlphaNumericMaskInput from '~/components/MaskInput/AlphaNumericMaskInput';
import { paymentMethodsTimeSpan } from '~/config/paymentMethods';
import { getMFAStatus } from '~/redux/helpers/user';

class USbankACH extends Component {
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
      },
      notificationVariant: '',
      notificationMessage: '',
      processingUpdate: false,
      alertMsg: false,
      paymentMethodShared: null,
      manualConnection: false,
      isInstantBankingData: false,
    };
  }

  componentDidMount = () => {
    const { dispatch, t } = this.props;
    dispatch(getClientPaymentTypes()).then((response) => {
      if (!response) {
        this.setState({
          notificationVariant: 'error',
          notificationMessage:
            response.message ?? t('updatedAccounts.message.somethingWentWrong'),
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

  handleNotification = (message, variant) => {
    this.setState({
      notificationVariant: variant,
      notificationMessage: message,
    });
  };

  handleChange = (name, { target }) => {
    const { value } = target;
    const newAchInfo = { ...this.state.achInfo };
    const numericFields = ['routingNumber'];
    const finalValue =
      numericFields.indexOf(name) > -1 ? value.replace(/[^0-9]/g, '') : value;
    if (name === 'routingNumber') {
      if (finalValue?.length === 9) {
        this.onBlurRoutingCode(finalValue);
      }
      if (this.state.achInfo.bankName) {
        newAchInfo.bankName = '';
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
    this.setState({
      validationInfo: currentValidationInfo,
    });
    return isError;
  };

  handleInstantBankingDataShow = () => {
    this.setState({
      isInstantBankingData: true,
    });
  };

  renderManualConnection = () => {
    this.setState({ manualConnection: true });
  };

  handleInstantBankingDataSave = (instantBankingData) => {
    const { payment } = this.props;
    const { types } = payment;
    const accountTypeId = types.rows?.filter(
      (item) =>
        instantBankingData?.Type?.toLowerCase() ===
        item.description?.toLowerCase()
    )?.[0]?.accountTypeId;
    this.setState({
      achInfo: {
        ...this.state.achInfo,
        bankName: instantBankingData.InstitutionName,
        accountNumber: instantBankingData.AccountNumber,
        confirmAccountNumber: instantBankingData.AccountNumber,
        accountType: accountTypeId,
        routingNumber: instantBankingData.RoutingNumber,
      },
    });
  };

  handleInstantBanking = (instantBankingData) => {
    this.renderManualConnection();
    this.handleInstantBankingDataShow();
    this.handleInstantBankingDataSave(instantBankingData);
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
    const { t } = this.props;

    const isError = this.handleValidation();
    if (isError) {
      return false;
    } else {
      this.setState({
        processingUpdate: true,
      });

      if (!this.state.bankAccountId) {
        const type = 'payment_preference';
        getMFAStatus(type).then((response) => {
          if (!response) {
            this.setState({
              notificationVariant: 'error',
              notificationMessage:
                response?.message ??
                t('updatedAccounts.message.somethingWentWrong'),
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
              createAcc: true,
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
              notificationVariant: 'error',
              notificationMessage:
                response?.message ??
                t('updatedAccounts.message.somethingWentWrong'),
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
              createAcc: false,
            });
          } else {
            this.handleEditAcc(false);
          }
        });
      }
    }
  };

  handleCreateAcc = (flag) => {
    const { dispatch, alternateMethod, setNotificationMessage, t } = this.props;

    const { otp } = this.state;
    let remittanceData = null;
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
        this.handleErrorNotification('ACHInfo', true);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          alternateMethod
            ? t('updatedAccounts.message.successfulAlternatePaymentMethod')
            : t('updatedAccounts.message.successfulACHPreferredPaymentUpdate', {
                timeSpan: paymentMethodsTimeSpan.ACH,
              })
        );
        this.setState({
          processingUpdate: false,
        });
      }
    });
  };

  handleEditAcc = (flag) => {
    const { dispatch, alternateMethod, setNotificationMessage, t } = this.props;
    const { otp } = this.state;
    this.setState({
      processingUpdate: true,
    });
    let remittanceData = null;
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
        this.handleErrorNotification('ACHInfo', false);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          alternateMethod
            ? t('updatedAccounts.message.successfulAlternatePaymentMethod')
            : t('updatedAccounts.message.successfulACHPreferredPaymentUpdate', {
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
    this.setState({ manualConnection: true });
  };

  handleCancelACH = () => {
    this.setState({ manualConnection: false });
  };

  showManualConnection = () => {
    const { t, classes, alternateMethod, ...otherProps } = this.props;
    const { consumerPaymentDetails } = this.props.accounts;
    const secondaryPaymentMethodId =
      consumerPaymentDetails?.data?.secondaryPaymentMethodId;
    return (
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Typography className={classes.connectionHeading} gutterBottom>
            {t('paymentRegistration.heading.instantConnection')}
          </Typography>
          <Typography>
            {t('paymentRegistration.ach.instantConnectionMsg')}
          </Typography>
          <Box pt={7.5} display='flex' justifyContent={'center'}>
            <InstantBanking
              handleNotification={this.handleNotification}
              handleInstantBanking={this.handleInstantBanking}
              {...otherProps}
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography className={classes.connectionHeading} gutterBottom>
            {t('paymentRegistration.heading.manualConnection')}
          </Typography>
          <Typography>
            {t('paymentRegistration.ach.manualConnectionMsg')}
          </Typography>
          <Box pt={5} display='flex' justifyContent={'center'}>
            <Button
              variant='contained'
              color='primary'
              className={classes.connectionButton}
              onClick={() => this.renderManualConnection()}
            >
              {alternateMethod && !secondaryPaymentMethodId
                ? t('updatedAccounts.buttonLabel.add')
                : t('updatedAccounts.buttonLabel.update')}
              {/* {t('paymentRegistration.button.addBank')} */}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} lg={12} style={{display:'flex', justifyContent:'center'}}>
          <Button
            variant='outlined'
            className={classes.shareButton}
            onClick={(e) => this.props.closeDialog()}
            style={{ marginRight: '8px' }}
          >
            {t('updatedAccounts.buttonLabel.cancel')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  render() {
    const {
      classes,
      payment,
      paymentRegistration,
      paymentAuthentication,
      token,
      alternateMethod,
      onSkipButton,
      closeDialog,
      ...otherProps
    } = this.props;
    const { types } = payment;
    const { paymentsData } = paymentAuthentication;
    const { t } = this.props;
    const {
      achInfo,
      validationInfo,
      notificationMessage,
      alertMsg,
      manualConnection,
      isInstantBankingData,
    } = this.state;
    const loggedIn = this.props.user && this.props.user.isLoggedIn;
    return (
      <>
        {manualConnection ? (
          <Grid container>
            <Grid container className={classes.achInfoOuterContainer}>
              <Grid item xs={12} lg={10}>
                <Typography className={classes.achInfoHeading} gutterBottom>
                  {t('paymentRegistration.heading.ach')}
                </Typography>
              </Grid>
              <Grid container item spacing={2}>
                <Grid
                  item
                  xs={12}
                  md={isInstantBankingData ? 10 : 5}
                  lg={isInstantBankingData ? 10 : 5}
                >
                  <AlphaNumericMaskInput
                    required
                    className={classes.alphaNumericTextField}
                    label={t('paymentRegistration.ach.label.accountNumber')}
                    error={Boolean(validationInfo.accountNumber)}
                    helperText={validationInfo.accountNumber}
                    fullWidth={true}
                    autoComplete='off'
                    variant='outlined'
                    value={achInfo.accountNumber || ''}
                    name='accountNumber'
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
                    disabled={isInstantBankingData}
                  />
                </Grid>

                {!isInstantBankingData && (
                  <Grid item xs={12} md={5} lg={5}>
                    <AlphaNumericMaskInput
                      required
                      className={classes.alphaNumericTextField}
                      label={t(
                        'paymentRegistration.ach.label.accountNumberConfirm'
                      )}
                      error={Boolean(validationInfo.confirmAccountNumber)}
                      helperText={validationInfo.confirmAccountNumber}
                      fullWidth={true}
                      autoComplete='off'
                      variant='outlined'
                      value={achInfo.confirmAccountNumber || ''}
                      name='confirmAccountNumber'
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
                )}

                <Grid item xs={12} md={10} lg={10}>
                  <TextField
                    required
                    label={t('paymentRegistration.ach.label.routingNumber')}
                    error={Boolean(validationInfo.routingNumber)}
                    helperText={validationInfo.routingNumber}
                    fullWidth={true}
                    autoComplete='off'
                    variant='outlined'
                    value={this.state.achInfo.routingNumber}
                    name='routingNumber'
                    onChange={(e) => this.handleChange('routingNumber', e)}
                    inputProps={{
                      maxLength: 9,
                      minLength: 9,
                    }}
                    disabled={isInstantBankingData}
                  />
                  {!isInstantBankingData && (
                    <Link
                      component='button'
                      variant='body2'
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
                        alt='search'
                      />
                    </Link>
                  )}
                </Grid>

                <Grid item xs={12} md={10} lg={10}>
                  <TextField
                    name='bankName'
                    variant='outlined'
                    label={t('paymentRegistration.ach.label.bankName')}
                    onChange={(e) => this.handleChange('bankName', e)}
                    value={achInfo.bankName}
                    inputProps={{
                      maxLength: 158,
                    }}
                    required
                    error={Boolean(validationInfo.bankName)}
                    helperText={validationInfo.bankName}
                    disabled={isInstantBankingData}
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
                    variant='outlined'
                    name='accountType'
                    onChange={(event) =>
                      this.handleChange('accountType', event)
                    }
                    disabled={isInstantBankingData}
                  >
                    <MenuItem value=''>
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
                        width='100px'
                        display='flex'
                        mt={1.875}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <CircularProgress color='primary' />
                      </Box>
                    )}
                  </TextField>
                </Grid>
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
                    this.pushToThankyouPage();
                  }}
                />
              </Modal>
            )}
            <Grid
              item
              container
              xs={12}
              justifyContent='center'
              style={{ marginTop: '8px' }}
            >
              <Button
                variant='outlined'
                className={classes.shareButton}
                style={{ marginRight: '8px' }}
                onClick={(e) => this.handleCancelACH(e)}
              >
                {t('updatedAccounts.buttonLabel.cancel')}
              </Button>
              <Button
                variant='contained'
                color='primary'
                className={classes.shareButton}
                onClick={(e) => this.handleACHInfoSave(e)}
                style={{ marginleft: '8px' }}
              >
                {t('paymentRegistration.button.continue')}
              </Button>
            </Grid>
            {notificationMessage && this.renderSnackbar()}
            {alertMsg ? (
              <TimeoutDialog
                open={alertMsg}
                msgText={t('paymentRegistration.ach.msgText')}
              />
            ) : null}
          </Grid>
        ) : (
          this.showManualConnection()
        )}
      </>
    );
  }
}

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.payment,
  ...state.paymentAuthentication,
  ...state.accounts,
  ...state.user,
}))(compose(withTranslation('common'), withStyles(styles))(USbankACH));
