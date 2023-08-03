import React, { Component } from "react";
import { Grid, Box, Typography, IconButton, Button } from "@material-ui/core";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { PaymentTypeList } from "~/utils/const";
import CloseIcon from "@material-ui/icons/Close";
import { paymentMethodsTimeSpan } from "~/config/paymentMethods";
import config from "~/config";
import { BankType } from '~/config/bankTypes';
import { USBankPaymentMethodIds } from '~/config/paymentMethods';

/*
Dashboard payment Auth. / non CDM users
*/
class ThankYouPage extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      authType: null,
      validation: {},
      email: "",
      phone: "",
      pageType: state && state.isNonCDM ? true : false,
      amount: state && state.amount ? state.amount : 0,
      id: state && state.id ? state.id : null,
      paymentRefId: state && state.isNonCDM ? state?.dynamicFooterMessage?.split(":")?.[1] ?? "" : "",
    };
  }

  getGuestUserThankYouMessages = (paymentType, t, paymentRefId) => {
    switch (paymentType) {
      case "PPL":
        return t("paymentRegistration.thankyouMessage.registeredUser.usBankPrepaidCard", {
          paymentRefId: paymentRefId ?? "",
        });
      case "ACH":
        return t("paymentRegistration.thankyouMessage.registeredUser.usbankAch", {
          timeRequired: paymentMethodsTimeSpan.ACH,
          paymentRefId: paymentRefId ?? "",
        });
      case "CHK":
        return t("paymentRegistration.thankyouMessage.registeredUser.usBankCHK", {
          timeRequired: paymentMethodsTimeSpan.CHK,
          paymentRefId: paymentRefId ?? "",
        });
      case "DDC":
        return t("paymentRegistration.thankyouMessage.registeredUser.usBankDepositToDebitcard", {
          paymentRefId: paymentRefId ?? "",
        });
      case "ZEL":
        return t("paymentRegistration.thankyouMessage.registeredUser.usbankZelle", {
          paymentRefId: paymentRefId ?? "",
        });
      default:
        return "";
    }
  };

  render() {
    const { classes, paymentAuthentication, t } = this.props;
    const { pageType, amount, id} = this.state;
    const { paymentsData } = paymentAuthentication;
    const paymentType = paymentsData && paymentsData.length > 0 ? Object.keys(USBankPaymentMethodIds).find(
      (key) => USBankPaymentMethodIds[key] === paymentsData[0].PaymentTypeID ) : null;
    const isUsBank = config.bankTypeId === BankType.USBANK;
    let total = 0;
    paymentsData.length > 0 &&
      paymentsData.map(
        (item) =>
          (total = total + Number(item.PaymentAmount.replace(/[^0-9.-]+/g, "")))
      );

    return (
      <>
        {paymentsData && paymentsData.length > 0 ? (
          <>
            <Grid container justifyContent="center" alignItems="center">
              {this.props.showCloseIcon ? (
                <Grid item xs={3} container justify="flex-end">
                  {" "}
                  <IconButton
                    className={classes.closeButton}
                    onClick={() => this.props.onBtnClick()}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              ) : (
                <></>
              )}
              <Grid item xs={12} md={12}>
                <Box
                  mt={2}
                  pt={2}
                  textAlign="center"
                  className={classes.paymentRegCont}
                >
                  <Typography
                    variant="h1"
                    textAlign="center"
                    className={classes.paymentHeading}
                  >
                    {t("paymentAuthentication.heading.thankYou")}
                  </Typography>

                  <Box textAlign="center" pt={2}>
                    <Box pt={2}>
                      <img
                        src={require(`~/assets/images/thankyouImage.png`)}
                        alt={"Thank You"}
                      />
                    </Box>
                  </Box>
                  <>
                  { isUsBank ? (
                    <Box p={2} className={classes.paymentTextDesc}>
                      {pageType ? (
                        <>
                            { this.getGuestUserThankYouMessages(paymentType, t, '' ) }
                        </>
                      ) : (
                        <>{`${t(
                          "paymentAuthentication.heading.recievePayment"
                        )} $${total} ${t(
                          "paymentAuthentication.heading.confirmation"
                        )}`}</>
                      )}
                      <Typography variant="body1">
                        {/* Below text need to be dynamic from the Api  */}
                        {/* {`${t("paymentAuthentication.heading.thankyouText")}`} */}
                      </Typography>
                    </Box>
                  ) : (
                      <Box p={2} className={classes.paymentTextDesc}>
                      {pageType ? (
                        <>
                          {`${t(
                            "paymentAuthentication.heading.payment"
                          )} $${amount} ${t(
                            "paymentAuthentication.heading.reflect"
                          )} ${PaymentTypeList[id]} ${t(
                            "paymentAuthentication.heading.account"
                          )}`}{" "}
                          
                        </>
                      ) : (
                        <>{`${t(
                          "paymentAuthentication.heading.recievePayment"
                        )} $${total} ${t(
                          "paymentAuthentication.heading.confirmation"
                        )}`}</>
                      )}
                      <Typography variant="body1">
                        {/* Below text need to be dynamic from the Api  */}
                        {/* {`${t("paymentAuthentication.heading.thankyouText")}`} */}
                      </Typography>
                    </Box>
                  )}
                  </>

                  <Box py={2}>
                    {this.props.showCloseIcon ? (
                      <Button
                        onClick={() => this.props.onBtnClick()}
                        className={classes.shareButton}
                        color="primary"
                        variant="contained"
                      >
                        {t("paymentAuthentication.buttonLabel.okay")}
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </>
        ) : (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={classes.nonCDMContainer}
          >
            <Grid item xs md>
              <Box textAlign="center" className={classes.paymentRegCont}>
                <Box p={2} className={classes.paymentHeading}>
                  {paymentAuthentication.error ? (
                    paymentAuthentication.error
                  ) : (
                    <>{t("paymentAuthentication.dashboard.NoPaymentsText")}</>
                  )}
                </Box>
                <Box textAlign="center">
                  <Box m={2}>
                    <img
                      style={{width: '100%'}}
                      src={require(`~/assets/icons/thankyou_img.svg`)}
                      alt={"Thank You"}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.paymentAuthentication,
  }))(withStyles(styles)(ThankYouPage))
);
