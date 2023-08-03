import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Grid, CircularProgress, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import EnrollmentStepper from '~/module/EnrollmentStepper';
import PayeeVerificationForm from '~/module/PayeeVerification';
import USbankPayeeVerification from '~/module/PayeeVerification/USbank';
import Footer from '~/components/Footer';
import styles from './styles';
import config from '~/config';
import { fetchConsumerCampaignDetails } from '~/redux/actions/consumerRegistration';
import { fetchIsPayeeChoicePortal } from '~/redux/actions/user';
import clsx from 'clsx';
import WhiteCard from '~/components/WhiteCard';

class PayeeVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnrolled: 0,
      isGuest: 0,
      token: null,
      isLoading: false,
      alertType: null,
      alertMessage: null,
      alertMessageCallbackType: null,
    };
  }

  componentDidMount = () => {
    const token =
      (this.props?.match?.params && this.props?.match?.params?.token) || '';
    this.setState(
      {
        token: (token && token.trim()) || null,
        isLoading: true,
      },
      () => {
        this.fetchConsumerConfig();
      }
    );
    this.props.dispatch(fetchIsPayeeChoicePortal());
  };

  fetchConsumerConfig = () => {
    const { token } = this.state;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    this.props
      .dispatch(fetchConsumerCampaignDetails(token, routeParam))
      .then((response) => {
        //redirection based on status 400
        if (response.error && response.status === 400) {
          if (Object.keys(response.data).length > 0) {
            if (response?.data?.isEnrolled === 1) {
              this.props.history.push(
                `${config.baseName}/${routeParam}/registereduseralert`
              );
              return false;
            } else if (response?.data?.isGuest === 1) {
              this.props.history.push(
                `${config.baseName}/${routeParam}/guestuseralert`
              );
              return false;
            } else {
              this.props.history.push(`${config.baseName}/${routeParam}`);
              return false;
            }
          } else {
            this.props.history.push(`${config.baseName}/${routeParam}`);
            return false;
          }
        } else if (!response || response.error) {
          sessionStorage.removeItem(`@noOfAttemptsToResendOtpPayeeAuth_${token}`)
          this.setState({
            alertType: 'error',
            alertMessage: this.props?.consumer?.error || response?.message,
            isLoading: false,
          });
          return false;
        }

        this.setState({
          isEnrolled: response?.data?.isEnrolled ?? 0,
          isGuest: response?.data?.isGuest ?? 0,
          isLoading: false,
        });
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

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  render() {
    const { user, classes, consumer } = this.props;
    const { isPayeeChoicePortal } = this.props.user;
    const { alertMessage, isLoading } = this.state;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';

    if (user && user.isLoggedIn) {
      this.props.history.push(`${config.baseName}/${routeParam}`);
    }

    return (
      <>
        <Grid
          container
          className={clsx('fixedHeaderGutter', classes.welcomeCardBg)}
          justifyContent='center'
          alignItems='flex-start'
        >
          {!alertMessage && (
            <EnrollmentStepper
              step={1}
              clientName={consumer?.config?.clientName ?? ''}
              paymentAmount={consumer?.config?.paymentAmount ?? ''}
            />
          )}
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={10}
            xl={8}
            className={classes.payeeVerificationForm}
          >
            {!Boolean(isLoading) ? (
              isPayeeChoicePortal ? (
                <USbankPayeeVerification
                  isError={alertMessage}
                  {...this.props}
                />
              ) : (
                <PayeeVerificationForm isError={alertMessage} {...this.props} />
              )
            ) : (
              <WhiteCard margin='2rem 0 1rem' mobMar='1.5rem 0 1rem 0'>
                <Box
                  display={'flex'}
                  alignItems='center'
                  minHeight={'100px'}
                  justifyContent={'center'}
                  width='100%'
                >
                  <CircularProgress />
                </Box>
              </WhiteCard>
            )}
          </Grid>
        </Grid>
        <Footer {...this.props} />
      </>
    );
  }
}

export default connect((state) => ({
  ...state.consumerVerification,
  ...state.user,
}))(compose(withTranslation('common'), withStyles(styles))(PayeeVerification));
