import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  CircularProgress,
  Modal,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Notification from '~/components/Notification';
import { connect } from 'react-redux';
import { createConsumerZelle } from '~/redux/actions/paymentRegistration';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { preferencePaymentType } from '~/config/consumerEnrollmentConst';
import {
  updateConsumerZelleInfo,
  fetchConsumerPaymentDetails,
} from '~/redux/actions/accounts';
import { getMFAStatus } from '~/redux/helpers/user';
import MFA from '~/module/DFA/MFA';

const styles = (theme) => ({
  container: {
    backgroundColor: '#fff',
    padding: '0',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
    },
    // marginBottom: '64px',
    '& h1': {
      fontSize: '16px',
      color: '#000',
      padding: '16px 0 30px 0',
    },
  },
  BtnContainer: {
    textAlign: 'center',
    justifyContent:'center',
    display: 'flex',
    width: '100%',
    // margin: '40px 0 0',
    '& button': {
      margin: '0 10px',
      padding: '6px 35px',
      cursor: 'pointer',
    },
  },
});

class USBankZelle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenType: 'email',
      TokenValue: '',
      countryCode: null,
      inProgress: false,
      errMsg: {
        variant: null,
        notificationMsg: null,
        phoneErr: null,
        emailErr: null,
      },
      openAuthModal: false,
      zelleId: null,
      createAcc: null,
      showMFA: false,
      phoneNum: '',
      phoneCode: '',
      otp: null,
    };
  }

  componentDidMount = () => {
    const { consumerPaymentDetails } = this.props.accounts;
    const ZelleDetailsInfo =
      consumerPaymentDetails?.data?.consumerZelleDetails ?? null;
    if (ZelleDetailsInfo) {
      this.setState({
        tokenType: ZelleDetailsInfo.tokenType,
        TokenValue: ZelleDetailsInfo.tokenValue,
        countryCode: ZelleDetailsInfo.phoneCountryCode,
        zelleId: ZelleDetailsInfo.zelleDetailId,
      });
    } else {
      const { consumerPaymentTypesList } = this.props.paymentRegistration;
      if (
        consumerPaymentTypesList?.data &&
        !consumerPaymentTypesList.data.getZelleTokenFromConsumer
      ) {
        this.setState({
          tokenType: consumerPaymentTypesList.data.zelleTokenType,
          TokenValue: consumerPaymentTypesList.data.zelleTokenValue,
          countryCode:
            consumerPaymentTypesList.data.zelleTokenType === 'phone'
              ? '+1'
              : null,
        });
      }
    }
  };

  onSubmit = () => {
    const { t } = this.props;
    this.setState(
      {
        inProgress: true,
      },
      () => {
        if (!this.state.zelleId) {
          const type = 'payment_preference';
          getMFAStatus(type).then((response) => {
            if (!response) {
              this.setState({
                ...this.state,
                inProgress: false,
                errMsg: {
                  ...this.state.errMsg,
                  variant: 'error',
                  notificationMsg:
                    response?.message ??
                    t('updatedAccounts.message.somethingWentWrong'),
                },
              });
              return false;
            }
            if (response?.data?.isMfaStatusRequired === 1) {
              this.setState({
                showMFA: true,
                phoneNum: response?.data?.phoneNumber,
                phoneCode: response?.data?.phoneCountryCode,
                inProgress: false,
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
                ...this.state,
                inProgress: false,
                errMsg: {
                  ...this.state.errMsg,
                  variant: 'error',
                  notificationMsg:
                    response?.message ??
                    t('updatedAccounts.message.somethingWentWrong'),
                },
              });
              return false;
            }
            if (response?.data?.isMfaStatusRequired === 1) {
              this.setState({
                showMFA: true,
                phoneNum: response?.data?.phoneNumber,
                phoneCode: response?.data?.phoneCountryCode,
                inProgress: false,
                createAcc: false,
              });
            } else {
              this.handleEditAcc(false);
            }
          });
        }
      }
    );
  };

  handleCreateAcc = (flag) => {
    const { tokenType, TokenValue, countryCode } = this.state;
    const { setNotificationMessage, dispatch, t } = this.props;
    const { otp } = this.state;
    const mfaOTP = flag ? otp : null;
    const preferenceType = preferencePaymentType.preferred;

    let remittanceData = null;
    dispatch(
      createConsumerZelle(
        tokenType,
        TokenValue,
        countryCode,
        preferenceType,
        remittanceData,
        mfaOTP
      )
    ).then((res) => {
      if (!res) {
        const { error } = this.props.paymentRegistration?.zelleInfo ?? {};
        this.setState({
          ...this.state,
          inProgress: false,
          errMsg: {
            ...this.state.errMsg,
            variant: 'error',
            notificationMsg: Boolean(error) && error,
          },
        });
        return false;
      } else {
        this.setState({
          inProgress: false,
        });
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          t('updatedAccounts.message.successfulPreferredPaymentMethod', {
            paymentMethodName: 'Zelle',
          })
        );
      }
    });
  };

  handleEditAcc = (flag) => {
    const { tokenType, TokenValue, countryCode, otp } = this.state;
    const { setNotificationMessage, dispatch, t } = this.props;
    const preferenceType = preferencePaymentType.preferred;
    let remittanceData = null;
    dispatch(
      updateConsumerZelleInfo(
        tokenType,
        TokenValue,
        tokenType === 'email' ? null : countryCode,
        preferenceType,
        remittanceData,
        this.state.zelleId,
        flag ? otp : null
      )
    ).then((response) => {
      if (!response) {
        const { error } = this.props.accounts?.zelleInfo ?? {};
        this.setState({
          ...this.state,
          inProgress: false,
          errMsg: {
            ...this.state.errMsg,
            variant: 'error',
            notificationMsg: Boolean(error) && error,
          },
        });
        return false;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          t('updatedAccounts.message.successfulPreferredPaymentMethod', {
            paymentMethodName: 'Zelle',
          })
        );
        this.setState({
          processingUpdate: false,
        });
      }
    });
  };
  closeNotification = () => {
    this.setState({
      ...this.state,
      errMsg: {
        ...this.state.errMsg,
        variant: null,
        notificationMsg: null,
      },
    });
  };

  render() {
    const { t, classes, closeDialog } = this.props;
    const { inProgress, errMsg, showMFA, phoneNum, phoneCode, createAcc } =
      this.state;
    const { notificationMsg, variant } = errMsg;
    let { zelleTokenMessage } =
      this.props.paymentRegistration?.consumerPaymentTypesList?.data ?? {};

    return (
      <>
        <Grid container spacing={2} className={classes.container}>
          <Grid item xs={12} lg={12}>
            <Typography>{zelleTokenMessage}</Typography>
          </Grid>
          <Grid item xs={12} lg={12} className={classes.BtnContainer}>
            <Grid container className={classes.BtnContainer}>
              {inProgress ? (
                <CircularProgress color='primary' />
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
                      fullWidth
                      onClick={(e) => closeDialog()}
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
                      fullWidth
                      color='primary'
                      onClick={() => this.onSubmit()}
                    >
                      {t('updatedAccounts.buttonLabel.update')}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        {notificationMsg && (
          <Notification
            variant={variant}
            message={notificationMsg}
            handleClose={() => this.closeNotification()}
          />
        )}
        {showMFA && (
          <Modal
            open={showMFA}
            onClose={() => this.setState({ showMFA: false, inProgress: false })}
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
                this.setState({ showMFA: false, inProgress: false })
              }
              phoneNum={phoneNum}
              phoneCode={phoneCode}
              MFAType={'PostLoginMFA'}
            />
          </Modal>
        )}
      </>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.paymentRegistration,
  ...state.accounts,
}))(compose(withTranslation('common'), withStyles(styles))(USBankZelle));
