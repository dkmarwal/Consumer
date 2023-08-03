import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import RegistrationForm from '~/module/Signup/';
import USBankSignup from '~/module/Signup/USBank';
import Footer from '~/components/Footer';
import config from '~/config';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import EnrollmentStepper from '~/module/EnrollmentStepper';
import { PayeeType } from '~/config/consumerEnrollmentConst';

const styles = (theme) => ({
  backgroundWrapper: {
    background: theme.palette.background.main,
  },
  payeeSignupForm: {
    minHeight: 'calc(100vh - 320px)',
  },
});

class SignUp extends Component {
  render() {
    const { user, classes } = this.props;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';

    if (user && user.isLoggedIn) {
      this.props.history.push(`${config.baseName}/${routeParam}`);
    }

    return (
      <>
        <Grid
          container
          className={clsx('fixedHeaderGutter', classes.backgroundWrapper)}
          justifyContent='center'
        >
          <EnrollmentStepper
            step={2}
            clientName={this.props?.location?.state?.clientName}
            paymentAmount={this.props?.location?.state?.paymentAmount}
          />
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={10}
            xl={8}
            className={classes.payeeSignupForm}
          >
            {this.props.location?.state?.consumerInfo?.payeeType ===
            PayeeType.Business ? (
              <USBankSignup {...this.props} />
            ) : (
              <RegistrationForm {...this.props} />
            )}
          </Grid>
        </Grid>
        <Footer {...this.props} />
      </>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.permissions,
  ...state.DFA,
}))(withStyles(styles)(SignUp));
