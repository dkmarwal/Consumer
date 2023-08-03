import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import styles from './style';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { updatePhoneNumber } from '~/redux/actions/consumerRegistration';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import Notification from '~/components/Notification';
import Phone from '~/components/TextBox/Phone';

class PhoneModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: null,
      verificationErr: null,
      alertType: '', //info/success/error/loading
      alertMessage: '',
      alertBox: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    // const { isRegiteredUser } = this.props;
    // if (!isRegiteredUser) {
    //   this.setProgressBar();
    // }
  }

  handleChange = (e) => {
    const val = e.target.value;
    this.setState({
      phone: val.phone,
      verificationErr: null,
    });
  };

  onSubmit = () => {
    const { phone } = this.state;
    const { t } = this.props;
    const isValid = this.validate();

    if (isValid) {
      this.setState(
        {
          isLoading: true,
        },
        () => {
          this.props
            .dispatch(
              updatePhoneNumber({
                phone: phone,
                phoneCountryCode: '+1',
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertType: 'error',
                  alertMessage:
                    this?.props?.paymentRegistration?.phoneNumber?.error ||
                    t('dfa.error.somethingWentWrong'),
                  isLoading: false,
                });
                return false;
              }
              //signUp Page handle Guest Click
              this.props.onBtnClick(phone);
            });
        }
      );
    }
  };

  validate = () => {
    const { takePhoneDuringEnrollment } = this.props;
    const { phone } = this.state;
    let valid = true,
      error = '';
    if (
      takePhoneDuringEnrollment &&
      (!phone || (phone && phone.trim() === '') || phone.trim().length !== 10)
    ) {
      if (!phone || !phone?.trim()?.length) {
        error = this.props.t('signUp.user.error.phoneNumber');
      } else if (phone?.toString().trim().length !== 10) {
        error = this.props.t('signUp.user.error.phoneLength');
      }
      valid = false;
    }
    this.setState({
      verificationErr: error,
    });
    return valid;
  };
  render() {
    const { classes, t, canCloseModal, onCancelClick } = this.props;
    const { phone, verificationErr, alertMessage, alertType } = this.state;

    return (
      <>
        {alertMessage && (
          <Notification
            variant={alertType}
            message={alertMessage}
            handleClose={() => {
              this.setState({
                alertMessage: null,
                alertType: null,
              });
            }}
          />
        )}
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          direction='row'
          className={[classes.fullHeight, classes.whilebg]}
        >
          <Grid
            justifyContent='center'
            alignItems='center'
            direction='row'
            xs={12}
          >
            <Grid item xs={12} md={12} lg={12}>
              <>
                <Box pt={5} p={2}>
                  <Typography variant='h3' align='center' gutterBottom>
                    {t('dfa.message.updatePhoneText')}
                  </Typography>
                </Box>
                <Box pt={2}>
                  <Grid
                    container
                    xs={12}
                    className={classes.verifyBtnContainer}
                  >
                    <Grid item xs={12} sm={6} md={6} lg={8}>
                      <Phone
                        error={Boolean(verificationErr)}
                        helperText={verificationErr}
                        id='phone'
                        name='phone'
                        required
                        value={phone || ''}
                        prefixCcode='+1'
                        onChange={(e) => this.handleChange(e)}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Grid container justifyContent='center'>
                  {this.state.isLoading ? (
                    <CircularProgress />
                  ) : (
                    <>
                      {canCloseModal && (
                        <Button
                          color='primary'
                          variant='outlined'
                          className={classes.continueBtn}
                          onClick={() => onCancelClick()}
                        >
                          {t('dfa.buttonLabel.cancel')}
                        </Button>
                      )}
                      <Button
                        color='primary'
                        variant='contained'
                        className={classes.continueBtn}
                        onClick={() => this.onSubmit()}
                      >
                        {t('dfa.buttonLabel.update')}
                      </Button>
                    </>
                  )}
                </Grid>
              </>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.paymentRegistration,
}))(compose(withTranslation('common'), withStyles(styles))(PhoneModel));
