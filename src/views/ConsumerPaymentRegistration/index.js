import React, { Component } from "react";
import Header from "~/components/Header";
import PaymentRegistration from "~/module/PaymentRegistration";
import PaymentExchangeScreen from "~/module/PaymentRegistrationComplete/paymentExchangeScreen";
import AlternatePaymentMethod from "~/module/PaymentRegistration/AlternatePaymentMethod";
import { Route, Switch } from "react-router-dom";
import config from "~/config";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Footer from "~/components/Footer";
import { Grid, Box } from "@material-ui/core";
import styles from "./style";
import EnrollmentStepper from "~/module/EnrollmentStepper";
import clsx from "clsx";

class AuthRoute extends Component {
  render() {
    const {
      component: Component,
      step,
      paymentRegistration,
      classes,
    } = this.props;
    const clientName =
      paymentRegistration?.consumerPaymentTypesList?.data?.clientName ?? "";
    const paymentAmount =
      paymentRegistration?.consumerPaymentTypesList?.data?.paymentAmount ?? "";
    return (
      <>
        <Grid
          container
          className={clsx("fixedHeaderGutter", classes.containerBg)}
          justifyContent="center"
          alignItems="flex-start"
        >
          {step ? (
            <EnrollmentStepper
              step={step}
              clientName={clientName}
              paymentAmount={paymentAmount}
            />
          ) : null}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={10} className={classes.payeePaymentMethodSelection}>
            
              <Box 
                width={{ xs: "90%", lg: "77%", xl: "60%" }}
                mx="auto"
                >
                {/* {step ? (
                  <Box
                    width={{ xs: 1, sm: "85%", md: "90%", lg: "83%" }}
                    margin="auto"
                  >
                    <WhiteCard
                      margin="2rem 0 2rem 0"
                      mobMar="1rem 0 0rem 0"
                      mobPad="1rem 0.3rem"
                    >
                      <EnrollmentStepper
                        step={step}
                        clientName={clientName}
                        paymentAmount={paymentAmount}
                      />
                    </WhiteCard>
                  </Box>
                ) : null} */}

                {<Component {...this.props} />}
              </Box>
            
          </Grid>
        </Grid>
        <Footer {...this.props} />
      </>
    );
  }
}

class ConsumerPaymentRegistration extends Component {
  componentDidMount = () => {
    const { location } = this.props;
    if (!location?.state?.isVerified) {
      const routeParam =
        (this.props.match.params && this.props.match.params.clientSlug) || "";
      this.props.history.push({
        pathname: `${config.baseName}/${routeParam}`,
      });
    }
  };

  render() {
    return (
      <>
        <Header
          hideUserDetails={!this.props.user?.isLoggedIn && true}
          {...this.props}
        />
        <Switch>
          <Route
            exact={true}
            path={`${config.baseName}/:clientSlug/paymentRegistration`}
            render={(props) => (
              <AuthRoute
                step={3}
                component={PaymentRegistration}
                {...this.props}
              />
            )}
          />
          <Route
            exact={true}
            path={`${config.baseName}/:clientSlug/paymentRegistration/complete`}
            render={(props) => (
              <AuthRoute component={PaymentExchangeScreen} {...this.props} />
            )}
          />

          <Route
            exact={true}
            path={`${config.baseName}/:clientSlug/paymentRegistration/alternatePayment`}
            render={(props) => (
              <AuthRoute component={AlternatePaymentMethod} {...this.props} />
            )}
          />
        </Switch>
      </>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.paymentRegistration,
}))(
  compose(withTranslation("common"))(
    withStyles(styles)(ConsumerPaymentRegistration)
  )
);
