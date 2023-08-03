import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Box, CircularProgress, Modal } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import styles from './styles';
import Button from '~/components/Forms/Button';
import TextField from '~/components/Forms/TextField';
import Notification from '~/components/Notification';
import {
  createDeposittoDebitCard,
  selectedPaymentType,
} from '~/redux/actions/paymentRegistration';
import trim from 'deep-trim-node';
import CardNumber from '~/components/MaskInput/CardNumber';
import 'react-datepicker/dist/react-datepicker.css';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { TimeoutDialog } from '~/components/Dialogs';
import 'date-fns';
import { preferencePaymentType } from '~/config/consumerEnrollmentConst';
import ConfirmationDialog from '~/components/Dialogs/confirmationDialog';
import { getMFAStatus } from '~/redux/helpers/user';
import MFA from '~/module/DFA/MFA';
import {
  updateDepositInfo,
  fetchConsumerPaymentDetails,
} from '~/redux/actions/accounts';

import { paymentMethodsTimeSpan } from '~/config/paymentMethods';

class DepositToDebit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      depositToDebitCardInfo: {
        name: '',
        cardNo: '',
        expiryDate: null,
      },
      DDCDetailId: null,
      validation: {},
      isLoading: false,
      error: null,
      variant: null,
      isProcessing: false,
      cardType: 'Both',
      openAuthModal: false,
      paymentMethodShared: null,
      clientId: null,
      openConfirmationDialog: false,
      showMFA: false,
      createAcc: null,
      phoneNum: '',
      phoneCode: '',
    };
  }

  componentDidMount = () => {
    this.setState({
      clientId: this.props?.user?.brandInfo?.clientId,
    });
    const { consumerPaymentDetails } = this.props.accounts;
    const DebitCardDetailsInfo =
      consumerPaymentDetails?.data?.consumerDebitCardDetails ?? null;
    if (DebitCardDetailsInfo) {
      this.setState({
        depositToDebitCardInfo: {
          name: !DebitCardDetailsInfo.cardHolderLastName
            ? DebitCardDetailsInfo.cardHolderFirstName
            : DebitCardDetailsInfo.cardHolderFirstName +
              ` ${DebitCardDetailsInfo.cardHolderLastName}`,
          cardNo: DebitCardDetailsInfo.debitCardNumber,
          expiryDate: DebitCardDetailsInfo.cardExpiryDate,
        },
        DDCDetailId: DebitCardDetailsInfo.id,
        cardType: this.getCardType(DebitCardDetailsInfo.debitCardNumber),
      });
    }
  };

  getCardType = (debitCardNumber) => {
    if (debitCardNumber?.toString().charAt(0) === '4') {
      return 'Visa';
    } else if (debitCardNumber?.toString().charAt(0) === '5') {
      return 'MasterCard';
    }
    return 'Both';
  };

  handleChange = (name, e) => {
    const { value } = e.target;
    const { depositToDebitCardInfo } = this.state;
    if (name === 'name') {
      this.setState({
        depositToDebitCardInfo: {
          ...depositToDebitCardInfo,
          [name]: value.replace(/[^a-zA-Z0-9 ._-]/g, ''),
        },
      });
    } else {
      this.setState({
        depositToDebitCardInfo: { ...depositToDebitCardInfo, [name]: value },
      });
    }
  };

  handleShare = () => {
    const { t } = this.props;
    const isValid = this.validateForm();
    if (!isValid) {
      return false;
    } else {
      this.setState({
        isProcessing: true,
      });

      if (!this.state.DDCDetailId) {
        const type = 'payment_preference';
        getMFAStatus(type).then((response) => {
          if (!response) {
            this.setState({
              notificationVariant: 'error',
              notificationMessage:
                response?.message ??
                t('updatedAccounts.message.somethingWentWrong'),
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
        const type = 'payment_preference';
        getMFAStatus(type).then((response) => {
          if (!response) {
            this.setState({
              notificationVariant: 'error',
              notificationMessage:
                response?.message ??
                t('updatedAccounts.message.somethingWentWrong'),
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
      }
    }
  };
  handleCreateAcc = (flag) => {
    const { dispatch, setNotificationMessage, t } = this.props;
    const { clientId } = this.state;
    const data = trim(this.state.depositToDebitCardInfo);
    dispatch(
      createDeposittoDebitCard(data, clientId, preferencePaymentType.preferred)
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification('depositToDebitCardInfoData', true);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          t('updatedAccounts.message.successfulCheckPreferredPaymentUpdate', {
            paymentMethodName: 'Deposit to Debit Card',
            timeSpan: paymentMethodsTimeSpan.USBankDepositToDebitcard,
          })
        );
        this.setState({
          isProcessing: false,
        });
      }
    });
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
  handleEditAcc = (flag) => {
    const { dispatch, setNotificationMessage, t } = this.props;
    const { depositToDebitCardInfo, clientId, DDCDetailId } = this.state;

    const data = trim(depositToDebitCardInfo);
    dispatch(
      updateDepositInfo(
        data,
        clientId,
        preferencePaymentType.preferred,
        DDCDetailId
      )
    ).then((response) => {
      if (!response) {
        this.handleErrorNotification('depositToDebitCardInfoData', false);
        return null;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          t('updatedAccounts.message.successfulCheckPreferredPaymentUpdate', {
            paymentMethodName: 'Deposit to Debit Card',
            timeSpan: paymentMethodsTimeSpan.USBankDepositToDebitcard,
          })
        );
        this.setState({
          isProcessing: false,
        });
      }
    });
  };
  handleErrorNotification = (errorInAction, flag) => {
    const { accounts, paymentRegistration, t } = this.props;

    this.setState({
      notificationVariant: 'error',
      notificationMessage: flag
        ? paymentRegistration[errorInAction]?.error?.message ??
          t('updatedAccounts.message.somethingWentWrong')
        : accounts[errorInAction]?.error ??
          t('updatedAccounts.message.somethingWentWrong'),
      isProcessing: false,
    });
  };

  onBlur = (e) => {
    const val = e;
    if (val.toString().charAt(0) === '4') {
      this.setState({
        cardType: 'Visa',
        validation: { ...this.state.validation, cardNo: null },
      });
    } else if (val.toString().charAt(0) === '5') {
      this.setState({
        cardType: 'MasterCard',
        validation: { ...this.state.validation, cardNo: null },
      });
    } else {
      this.setState({
        cardType: 'Both',
      });
    }
  };

  validateForm = () => {
    let valid = true;
    let errorText = {};
    const { name, cardNo, expiryDate } = this.state.depositToDebitCardInfo;
    const { t } = this.props;

    if (
      name === null ||
      (name !== null && name.toString().trim().length === 0)
    ) {
      valid = false;
      errorText['name'] = t(
        'paymentRegistration.depositToDebit.error.nameRequired'
      );
    }
    if (
      cardNo === null ||
      (cardNo !== null && cardNo.toString().trim().length < 11)
    ) {
      valid = false;
      errorText['cardNo'] = t(
        'paymentRegistration.depositToDebit.error.validCardNumber'
      );
    } else if (
      cardNo &&
      !cardNo.toString().startsWith(4) &&
      !cardNo.toString().startsWith(5)
    ) {
      valid = false;
      errorText['cardNo'] = t(
        'paymentRegistration.depositToDebit.error.cardNumber'
      );
    }
    if (expiryDate === null) {
      valid = false;
      errorText['expiryDate'] = t(
        'paymentRegistration.depositToDebit.error.cardExpiryDate'
      );
    }
    if (expiryDate !== null && expiryDate === 'Invalid Date') {
      valid = false;
      errorText['expiryDate'] = t(
        'paymentRegistration.depositToDebit.error.invalidCardExpiry'
      );
    }

    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };

  handleDateChange = (date) => {
    let err = null;
    const { depositToDebitCardInfo } = this.state;
    const { t } = this.props;
    if (
      date !== null &&
      (date._d.toString() === 'Invalid Date' ||
        new Date().getTime() - date._d.getTime() > 0)
    ) {
      err = t('paymentRegistration.pushToCard.error.invalidCardExpiry');
    }
    this.setState({
      depositToDebitCardInfo: {
        ...depositToDebitCardInfo,
        expiryDate: date,
      },
      validation: {
        ...this.state.validation,
        expiryDate: err,
      },
    });
  };

  handleConfirmationDialogClose = () => {
    this.setState({
      openConfirmationDialog: false,
    });
    this.props.dispatch(selectedPaymentType(null));
  };

  render() {
    const {
      depositToDebitCardInfo,
      validation,
      cardType,
      isLoading,
      alternateMethod,
      showMFA,
      createAcc,
      phoneNum,
      phoneCode,
      notificationMessage,
      alertMsg,
      isProcessing,
      openConfirmationDialog,
    } = this.state;
    const { consumerPaymentDetails } = this.props.accounts;
    const secondaryPaymentMethodId =
      consumerPaymentDetails?.data?.secondaryPaymentMethodId;
    const {
      classes,
      t,
      paymentRegistration,
      csc,
      token,
      closeDialog,
      ...otherProps
    } = this.props;
    if (isLoading) {
      return (
        <Box display='flex' p={10} justifyContent='center' alignItems='center'>
          <CircularProgress color='primary' />
        </Box>
      );
    }
    return (
      <>
        <Grid container item display='flex' direction='row'>
          <Box pt={4}>
            <Grid container item spacing={2}>
              <Grid item container spacing={2}>
                <Grid item xs={12} md={10} lg={10}>
                  <TextField
                    color='secondary'
                    label={t(
                      'paymentRegistration.depositToDebit.label.nameOnCard'
                    )}
                    error={validation.name}
                    helperText={validation.name}
                    value={depositToDebitCardInfo.name || ''}
                    name='name'
                    inputProps={{
                      maxLength: 70,
                    }}
                    onChange={(e) => this.handleChange('name', e)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={10} lg={10}>
                  <CardNumber
                    label={t(
                      'paymentRegistration.depositToDebit.label.cardNumber'
                    )}
                    error={validation.cardNo}
                    helperText={validation.cardNo}
                    value={depositToDebitCardInfo.cardNo || ''}
                    name='cardNo'
                    inputProps={{
                      minLength: 11,
                      maxLength: 19,
                    }}
                    getvalue={(val) => {
                      this.setState({
                        depositToDebitCardInfo: {
                          ...depositToDebitCardInfo,
                          cardNo: val,
                        },
                      });
                    }}
                    onBlur={this.onBlur}
                    showPaymentIcons={true}
                    cardType={cardType}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={10} lg={10}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      className={classes.calenderField}
                      color='secondary'
                      disablePast
                      minDate={new Date()}
                      inputVariant='outlined'
                      placeholder='MM/YYYY'
                      format={'MM/YYYY'}
                      name='expiryDate'
                      label={t(
                        'paymentRegistration.depositToDebit.label.expiryDate'
                      )}
                      value={depositToDebitCardInfo.expiryDate}
                      error={validation && validation.expiryDate}
                      helperText={validation && validation.expiryDate}
                      onChange={this.handleDateChange}
                      autoOk={true}
                      views={['month', 'year']}
                      openTo='month'
                      fullWidth={true}
                      required
                    />
                  </MuiPickersUtilsProvider>
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
                MFAType={'PostLoginMFA'}
              />
            </Modal>
          )}
          <Grid item container xs={12} justifyContent='center'>
            {isProcessing ? (
              <Box p={2}>
                <CircularProgress color='primary' />
              </Box>
            ) : (
              <Grid
                container
                item
                xs={11}
                sm={7}
                md={11}
                lg={8}
                justifyContent='center'
                spacing={2}
                style={{ marginTop: '8px' }}
              >
                <Grid item xs={6} sm={4} md={4} lg={4}>
                  <Button
                    variant='outlined'
                    onClick={(e) => closeDialog()}
                    fullWidth
                  >
                    {t('updatedAccounts.buttonLabel.cancel')}
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={this.props.i18n.language === 'fr' ? 10 : 6}
                  sm={this.props.i18n.language === 'fr' ? 6 : 4}
                  md={4}
                  lg={4}
                >
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={(e) => this.handleShare(e)}
                    fullWidth
                  >
                    {alternateMethod && !secondaryPaymentMethodId
                      ? t('updatedAccounts.buttonLabel.add')
                      : t('updatedAccounts.buttonLabel.update')}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>

        {notificationMessage && this.renderSnackbar()}
        {alertMsg ? (
          <TimeoutDialog
            open={alertMsg}
            msgText={t('updatedAccounts.message.checkAlternatePaymentMethod')}
          />
        ) : null}
        <ConfirmationDialog
          handleClose={() => {
            this.handleConfirmationDialogClose();
          }}
          open={openConfirmationDialog}
          dialogContentText={t(
            'paymentRegistration.depositToDebit.message.confirmationText'
          )}
          cancelButtonName={t('paymentRegistration.button.OK')}
        />
      </>
    );
  }
}

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.paymentAuthentication,
  ...state.csc,
  ...state.accounts,
  ...state.user,
}))(withStyles(styles)(DepositToDebit));
