import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, CircularProgress, Box, Modal } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Notification from '~/components/Notification';
import { connect } from 'react-redux';
import { createConsumerZelle } from '~/redux/actions/paymentRegistration';
import config from '~/config';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { preferencePaymentType } from '~/config/consumerEnrollmentConst';
import { styles } from './styles';
import VerifyUser from "~/module/PaymentAuthentication/verifyUser";
import { fetchPaymentsToAuthenticate } from "~/redux/actions/paymentAuthentication";

class USBankZelle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenType: 'email',
      TokenValue: null,
      countryCode: null,
      inProgress: false,
      errMsg: {
        variant: null,
        notificationMsg: null,
      },
      remittanceEmail: null,
      openAuthModal: false,
      paymentMethodShared: null,
      zelleConditions: false,
    };
  }

  componentDidMount = () => {
    const { paymentRegistration } = this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
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
        remittanceEmail: consumerPaymentTypesList.data.remittanceEmail,
      });
    }
  };

  onSubmit = () => {
    const { tokenType, TokenValue, countryCode, remittanceEmail } = this.state;
    const preferenceType = preferencePaymentType.preferred;
    const { consumerPaymentTypesList } = this.props.paymentRegistration;
    const { paymentAuthentication, t } = this.props
    this.setState(
      {
        inProgress: true,
      },
      () => {
        this.props
          .dispatch(
            createConsumerZelle(
              tokenType,
              TokenValue,
              countryCode,
              preferenceType,
              null,
              null,
              true,
              remittanceEmail
            )
          )
          .then((res) => {
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
            } 
            else {
              this.setState(
                {
                  inProgress: false,
                  errMsg: {
                    ...this.state.errMsg,
                    variant: "success",
                    notificationMsg: t("paymentRegistration.ach.successMsg"),
                  },
                },
                () => {
                  if (consumerPaymentTypesList?.data?.enrollmentLinkId) {
                    this.props
                      .dispatch(
                        fetchPaymentsToAuthenticate(
                          {
                            token:
                              consumerPaymentTypesList?.data
                                ?.enrollmentLinkId,
                          },
                          false
                        )
                      )
                      .then((response) => {
                        if (!response) {
                          this.setState({
                            ...this.state,
                            inProgress: false,
                            errMsg: {
                              ...this.state.errMsg,
                              variant: "error",
                              notificationMsg:
                                paymentAuthentication?.error ??
                                t("paymentRegistration.somethingWentWrong"),
                            },
                          });
                          return null;
                        } else {
                          const { paymentAuthentication } = this.props;
                          const { paymentsData } = paymentAuthentication;
                          if (
                            consumerPaymentTypesList?.data
                              ?.isPaymentAuthRequired === true &&
                            paymentsData &&
                            paymentsData?.length > 0
                          ) {
                            this.setState({
                              openAuthModal: true,
                              paymentMethodShared:
                                this.props.paymentRegistration
                                  .selectedPaymentTypeCode,
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
    );
  };

  routeToRegistrationCompletedPage = () => {
    const { consumerPaymentTypesList } = this.props.paymentRegistration;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    if (consumerPaymentTypesList?.data?.alternatePaymentMethods.length > 0) {
      this.props.history.push({
        pathname: `${config.baseName}/${routeParam}/paymentRegistration/alternatePayment`,
        state: {
          paymentType: "Zelle",
          preferredMsg:
            this.props.paymentRegistration.zelleInfo?.data?.dynamicMessage ??
            "",
          preferredFooterMsg:
            this.props.paymentRegistration?.zelleInfo?.data
              ?.dynamicFooterMessage || "",
          isVerified: this.props?.location?.state?.isVerified || "",
        },
      });
    } else this.pushToThankyouPage();
  };

  pushToThankyouPage = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    const { paymentRegistration } = this.props;

    this.props.history.push({
      pathname: `${config.baseName}/${routeParam}/paymentRegistration/complete`,
      state: {
        paymentType: 'Zelle',
        dynamicFooterMessage:
          paymentRegistration?.zelleInfo?.data?.dynamicFooterMessage || '',
        dynamicMessage:
          paymentRegistration?.zelleInfo?.data?.dynamicMessage || '',
        isVerified: true,
      },
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

  renderZelleConditions = () => {
    this.setState({ zelleConditions: true });
  };

  showZelleConditions = () => {
    const { t, classes } = this.props;
    return (
      <Grid container spacing={4} className={classes.container}>
        <Grid item xs={12} lg={12}>
          <Typography>
            {t('paymentRegistration.zelle.conditions.txt')}
          </Typography>
          <Box pt={3}>
            <Typography className={classes.note}>
              <span>{t('paymentRegistration.zelle.conditions.note')}</span>
              {t('paymentRegistration.zelle.conditions.txt2')}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={12} className={classes.BtnContainer}>
          <Button
            variant='contained'
            color='primary'
            className={classes.connectionButton}
            onClick={() => this.renderZelleConditions()}
          >
            {t('paymentRegistration.button.continue')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  handleModalCloseIcon = () => {
    this.setState({
      openAuthModal: false,
    });
    if (this.props.user && this.props.user.isLoggedIn) {
      this.routeToRegistrationCompletedPage();
    }
  };

  render() {
    const { classes, t, token, paymentAuthentication, ...otherProps } = this.props;
    const { inProgress, errMsg } = this.state;
    const { notificationMsg, variant } = errMsg;
    let { zelleTokenMessage } =
      this.props.paymentRegistration?.consumerPaymentTypesList?.data ?? {};
    const { paymentsData } = paymentAuthentication;
    const loggedIn = this.props.user && this.props.user.isLoggedIn;
    return (
      <>
        <Grid container spacing={4} className={classes.container}>
          <Grid item xs={12} lg={12}>
            <Typography>{zelleTokenMessage}</Typography>
          </Grid>
          <Grid item xs={12} lg={12} className={classes.BtnContainer}>
            <Grid container className={classes.BtnContainer}>
              {inProgress ? (
                <CircularProgress color='primary' />
              ) : (
                <Button
                  variant='contained'
                  className={classes.shareButton}
                  onClick={() => this.onSubmit()}
                  color='primary'
                >
                  {t('paymentRegistration.button.continue')}
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
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
        {notificationMsg && (
          <Notification
            variant={variant}
            message={notificationMsg}
            handleClose={() => this.closeNotification()}
          />
        )}
      </>
    );
  }
}

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.paymentAuthentication,
  ...state.accounts,
  ...state.user,
}))(compose(withTranslation('common'), withStyles(styles))(USBankZelle));
