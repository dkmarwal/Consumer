import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Notification from "~/components/Notification";
import styles from "./style";
import Box from "@material-ui/core/Box";
import { connect } from "react-redux";
import config from "~/config";
import Footer from "~/components/Footer";
import clsx from "clsx";
import MFA from "~/module/DFA/MFA";

class DFA extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      variant: null,
      notificationMsg: null,
      ccode: null,
      loginId: state && state.loginId ? state.loginId : null,
      password: state && state.password ? state.password : null,
      dfaDetails: state && state.dfaDetails ? state.dfaDetails : {},
      token: state && state.token ? state.token : null,
      user: state && state.user ? state.user : {},
      consumerSlugUrl:
        state && state.consumerSlugUrl ? state.consumerSlugUrl : null,
      consumerInfo: state && state.consumerInfo ? state.consumerInfo : null,
      isGuestUser: state && state.isGuestUser ? state.isGuestUser : false,
      isVerified: state && state.isVerified ? state.isVerified : false,
      isOneTimePayment:
        state && state.isOneTimePayment ? state.isOneTimePayment : false,
      clientName: state && state.clientName ? state.clientName : "",
      paymentAmount: state && state.paymentAmount ? state.paymentAmount : "",
      takePhoneDuringEnrollment: state && state.takePhoneDuringEnrollment ? state.takePhoneDuringEnrollment : false,
      phone: state && state.phone ? state.phone : "",
    };
  }

  handleNotification = (msg, msgType) => {
    this.setState({
      variant: msgType,
      notificationMsg: msg,
    });
  };
  closeNotification = () => {
    this.setState({
      variant: null,
      notificationMsg: null,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      variant,
      notificationMsg,
      loginId,
      password,
      dfaDetails,
      consumerInfo,
      consumerSlugUrl,
      isGuestUser,
      token,
      user,
      isVerified,
      isOneTimePayment,
      clientName,
      paymentAmount, takePhoneDuringEnrollment, phone,
    } = this.state;

    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    if (!isVerified) {
      this.props.history.push(`${config.baseName}/${routeParam}/nopagefound`);
    }
    const isRegiteredUser =
      dfaDetails.dfaApplied !== null &&
        typeof dfaDetails.dfaApplied !== "undefined" &&
        dfaDetails.dfaApplied === false
        ? true
        : false;
    return (
      <>
        <Grid
          container
          className={clsx("fixedHeaderGutter", classes.BgContainerBlue)}
          justifyContent="center"
          alignContent="center"
        >
          <Grid
            item
            xs={isRegiteredUser && 10}
            md={isRegiteredUser ? 10 : 12}
            lg={isRegiteredUser ? 9 : 12}
            xl={isRegiteredUser ? 9 : 12}
          >
            <Box
              component="div"
              mt={3}
              display="flex"
              justifyContent="center"
              width={1}
              className={
                isRegiteredUser ? classes.wrapper : classes.enrollWrapper
              }
            >
              {/* {consumerInfo?.isMFARegistrationRequired === 1 ? */}
              <MFA
                loginId={loginId}
                password={password}
                isRegiteredUser={isRegiteredUser}
                handleNotification={this.handleNotification}
                phoneNum={
                  consumerInfo?.isMFARegistrationRequired === 1
                    ? (takePhoneDuringEnrollment ? phone : (consumerInfo.phoneNumber || ""))
                    : dfaDetails.phoneNumber || ""
                }
                phoneCode={
                  consumerInfo?.isMFARegistrationRequired === 1
                    ? (takePhoneDuringEnrollment ? "+1" : (consumerInfo.phoneCountryCode || ""))
                    : dfaDetails.phoneCountryCode || ""
                }
                MFAType={
                  isGuestUser
                    ? "GuestDFA"
                    : consumerInfo?.isMFARegistrationRequired === 1
                      ? "EnrollmentDFA"
                      : "LoginMFA"
                }
                consumerSlugUrl={consumerSlugUrl}
                token={token}
                userDetails={user}
                consumerInfo={consumerInfo}
                isVerified={isVerified}
                isOneTimePayment={isOneTimePayment}
                clientName={clientName}
                paymentAmount={paymentAmount}
                takePhoneDuringEnrollment={takePhoneDuringEnrollment}
                phone={phone}
                {...this.props}
              />
              {/* :
                <MFA
                  loginId={loginId}
                  password={password}
                  isRegiteredUser={isRegiteredUser}
                  handleNotification={this.handleNotification}

                  phoneNum={dfaDetails.phoneNumber || ""}
                  phoneCode={dfaDetails.phoneCountryCode || ""}
        
                  MFAType={"LoginMFA"}
                  {...this.props}
                />
              } */}
            </Box>
          </Grid>
        </Grid>
        <Footer {...this.props} />
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

export default connect((state) => ({ ...state.user, ...state.DFA }))(
  withStyles(styles)(DFA)
);
