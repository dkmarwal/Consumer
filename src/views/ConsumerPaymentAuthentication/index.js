import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import Header from "~/components/Header";
import ConsumerRegistrationSubHeader from "~/components/_SubHeader/ConsumerRegistrationSubHeader";
import VerifyNonCDMUser from "~/module/PaymentAuthentication/verifyNonCdmUser";
import ThankYouPage from "~/module/PaymentAuthentication/thankyouPage";
import { Route, Switch } from "react-router-dom";
import config from "~/config";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Footer from "~/components/Footer";
import styles from "./style";

class AuthRoute extends Component {
  render() {
    const { component: Component, subHeaderText, classes } = this.props;
    return (
      <>
        <Grid
          container
          item
          direction="row"
          justifyContent="center"
          xs={12}
          className={classes.mainContainer}
        >
          <Grid
            container
            justifyContent="center"
            lg={8}
            xs={12}
            direction="row"
            alignItems="center"
          >
            <Grid item>
              {subHeaderText && (
                <ConsumerRegistrationSubHeader
                  {...this.props}
                  subHeaderText={subHeaderText}
                />
              )}
              <Component {...this.props} />
            </Grid>
          </Grid>
        </Grid>
        <Footer {...this.props} />
      </>
    );
  }
}

class ConsumerPaymentAuthentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrMsg: false,
    };
  }

  render() {
    const { classes, t } = this.props;
    return (
      <>
        <Header {...this.props} />
        <Switch>
          <Route
            exact={true}
            path={`${config.baseName}/:clientSlug/paymentAuth/:token`}
            render={(props) => (
              <AuthRoute
                step={1}
                component={VerifyNonCDMUser}
                {...this.props}
              />
            )}
          />
          <Route
            exact={true}
            path={`${config.baseName}/:clientSlug/paymentAuthComplete`}
            render={(props) => (
              <AuthRoute step={2} component={ThankYouPage} {...this.props} />
            )}
          />
        </Switch>
      </>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.paymentAuthentication,
}))(
  compose(withTranslation("common"))(
    withStyles(styles)(ConsumerPaymentAuthentication)
  )
);
