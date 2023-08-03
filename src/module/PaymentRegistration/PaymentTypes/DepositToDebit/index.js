import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Box, CircularProgress, Modal } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import config from '~/config';
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
import 'date-fns';
import { preferencePaymentType } from '~/config/consumerEnrollmentConst';
import ConfirmationDialog from '~/components/Dialogs/confirmationDialog';
import { fetchPaymentsToAuthenticate } from '~/redux/actions/paymentAuthentication';
import VerifyRegisteredUser from "~/module/PaymentAuthentication/verifyRegisteredUser";

class DepositToDebit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      depositToDebitCardInfo: {
        name: '',
        cardNo: '',
        expiryDate: null,
      },
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
      paymentsRender: true,
    };
  }

  componentDidMount = () => {
    this.setState({
      clientId: this.props?.user?.brandInfo?.clientId,
    });
  };

  setPaymentsRenderFalse = () => {
    this.setState({
      paymentsRender: false
    })
  }
  deleteCookie(name) {
    const path = window?.location?.pathname ?? "";
    const clientURL = path.split("/")[1];
    sessionStorage.removeItem(`${name}_${clientURL}`);
  }

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

  checkAuthentication = () => {
    const { dispatch, paymentRegistration, t, paymentAuthentication } =
      this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
    // const { depositToDebitCardInfo, clientId } = this.state;
    // const data = trim(depositToDebitCardInfo);
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
            variant: 'error',
            error:
              paymentAuthentication?.error ??
              t('paymentRegistration.somethingWentWrong'),
            isProcessing: false,
          });
          return null;
        } else {
          this.setState({
            openAuthModal: true,
            paymentMethodShared: paymentRegistration.selectedPaymentTypeCode,
          })
        }
      });
    }
  }

  saveDepositToDebitCardInfo = () => {
    const { dispatch, t } = this.props;
    const { depositToDebitCardInfo, clientId } = this.state;
    const isValid = this.validateForm();
    const data = trim(depositToDebitCardInfo);
    if(isValid) {
      this.setState({
        isProcessing: true,
      });
      dispatch(
        createDeposittoDebitCard(
          data,
          clientId,
          preferencePaymentType.preferred
        )
      ).then((response) => {
        if (!response) {
          this.handleErrorNotification('depositToDebitCardInfoData');
        } else {
          this.setState(
            {
              isProcessing: false,
              variant: 'success',
              error: t('paymentRegistration.ach.successMsg'),
            },
            () => {
              this.routeToRegistrationCompletedPage();
            }
          );
        }
      });
    }
  }

  handleShare = () => {
    const { paymentRegistration} = this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
    const isValid = this.validateForm();

    if (isValid) {
      this.setState({
        isProcessing: true,
      });
      if(consumerPaymentTypesList?.data?.isPaymentAuthRequired === true){
        this.setState({
          isProcessing: false,
        });
        this.checkAuthentication();
      } else {
        this.saveDepositToDebitCardInfo();
      }   
    }
  };

  handleErrorNotification = (errorInAction) => {
    const { paymentRegistration, t } = this.props;
    let showError = true;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    if (paymentRegistration[errorInAction]?.error?.data?.retryCount) {
      this.props.history.push({
        pathname: `${config.baseName}/${routeParam}/paymentRegistration`,
        state: {
          ...this.props?.location?.state,
          retryCount: paymentRegistration[errorInAction].error.data.retryCount,
        },
      });

      if (paymentRegistration[errorInAction].error.data.retryCount > 3) {
        showError = false;
        this.setState({
          openConfirmationDialog: true,
          isProcessing: false,
        });
      }
    }
    if (showError) {
      this.setState({
        variant: 'error',
        error:
          paymentRegistration[errorInAction]?.error?.message ??
          t('paymentRegistration.pushToCard.message.somethingWentWrong'),
        isProcessing: false,
      });
    }
  };

  routeToRegistrationCompletedPage = () => {
    this.pushToThankyouPage();
  };

  pushToThankyouPage = () => {
    const { paymentRegistration } = this.props;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';

    this.props.history.push({
      pathname: `${config.baseName}/${routeParam}/paymentRegistration/complete`,
      state: {
        paymentType: 'Push To Card',
        dynamicMessage:
          paymentRegistration?.depositToDebitCardInfo?.data?.dynamicMessage ||
          '',
        dynamicFooterMessage:
          paymentRegistration?.depositToDebitCardInfo?.data
            ?.dynamicFooterMessage || '',
        isVerified: true,
      },
    });
  };

  onBlur = (e) => {
    const val = e;
    if (val.toString().charAt(0) === '4') {
      this.setState({
        cardType: 'Visa',
        validation:{...this.state.validation, cardNo:null}
      });
    } else if (val.toString().charAt(0) === '5') {
      this.setState({
        cardType: 'MasterCard',
        validation:{...this.state.validation, cardNo:null}
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
    if (expiryDate !== null && expiryDate._d.toString() === 'Invalid Date') {
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

  handleModalCloseIcon = () => {
    this.setState({
      openAuthModal: false,
    });
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
      variant,
      error,
      isProcessing,
      openConfirmationDialog,
      openAuthModal,
    } = this.state;
    const { classes, t, paymentRegistration, csc, token, ...otherProps } =
      this.props;
    const loggedIn = this.props.user && this.props.user.isLoggedIn;
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
          <Modal
            open={openAuthModal}
            onClose={this.handleModalCloseIcon}
            className={classes.authModal}
          >
                <VerifyRegisteredUser
                    {...this.props}
                    onBtnClick={() => {
                      this.setState({
                        isVerifyBtnClicked: false,
                        openAuthModal: false,
                        paymentsRender: true,
                      });
                      this.deleteCookie("@showLoginDFA");
                      this.saveDepositToDebitCardInfo();
                      //this.callPaymentsToAuthenticate();
                    }}
                    onCancelClick={() => {
                      this.setState({
                        isVerifyBtnClicked: false,
                        openAuthModal: false,
                      });
                      this.deleteCookie("@showLoginDFA");
                    }}
                    openAuthModal={openAuthModal}
                    setPaymentsRenderFalse={this.setPaymentsRenderFalse}
                  />
          </Modal>
          <Grid item container xs={12} justifyContent='center'>
            {isProcessing ? (
              <Box p={2}>
                <CircularProgress color='primary' />
              </Box>
            ) : (
              <Box p={2}>
                <Button
                  onClick={(e) => this.handleShare()}
                  className={classes.shareButton}
                  color='primary'
                >
                  {t('paymentRegistration.buttonLabel.continue')}
                </Button>
              </Box>
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
