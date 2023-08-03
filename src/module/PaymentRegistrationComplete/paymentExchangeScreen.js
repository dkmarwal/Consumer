import React from "react";
import { Grid, Box, Button, Typography } from "@material-ui/core";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import config from "~/config";
import { paymentMethodsTimeSpan } from "~/config/paymentMethods";

const getRegisteredUserThankYouMessages = (paymentType, t) => {
    switch (paymentType) {
      case "Paypal":
        return t("paymentRegistration.thankyouMessage.registeredUser.paypal");
      case "ACH":
        return t("paymentRegistration.thankyouMessage.registeredUser.ach", {
          timeRequired: paymentMethodsTimeSpan.ACH,
        });
      case "Check":
        return t("paymentRegistration.thankyouMessage.registeredUser.check", {
          timeRequired: paymentMethodsTimeSpan.CHK,
        });
      case "Push To Card":
        return t(
          "paymentRegistration.thankyouMessage.registeredUser.directDeposit"
        );
      case "Zelle":
        return t("paymentRegistration.thankyouMessage.registeredUser.zelle");
        case "USBankACH":
          return t("paymentRegistration.thankyouMessage.registeredUser.usbankAch", {
            timeRequired: paymentMethodsTimeSpan.USBankACH,
          });
        case "USBankCHK":
          return t("paymentRegistration.thankyouMessage.registeredUser.usBankCHK", {
            timeRequired: paymentMethodsTimeSpan.USBankCHK,
          });
        case "USBankDepositToDebitcard":
          return t(
            "paymentRegistration.thankyouMessage.registeredUser.usBankDepositToDebitcard", {
              timeRequired: paymentMethodsTimeSpan.USBankDepositToDebitcard,
            }
          );
        case "USBankZelle":
          return t("paymentRegistration.thankyouMessage.registeredUser.usbankZelle", {
            timeRequired: paymentMethodsTimeSpan.USBankZelle,
          });
        case "USBankPrepaidCard":
          return t("paymentRegistration.thankyouMessage.registeredUser.usBankPrepaidCard", {
            timeRequired: paymentMethodsTimeSpan.USBankPrepaidCard,
          });
      default:
        return "";
    }
  }
  
const getGuestUserThankYouMessages = (paymentType, t, paymentRefId) => {
  switch (paymentType) {
    case "Paypal":
      return t("paymentRegistration.thankyouMessage.guestUser.paypal", {
        paymentRefId: paymentRefId ?? "",
      });
    case "ACH":
      return t("paymentRegistration.thankyouMessage.guestUser.ach", {
        timeRequired: paymentMethodsTimeSpan.ACH,
        paymentRefId: paymentRefId ?? "",
      });
    case "Check":
      return t("paymentRegistration.thankyouMessage.guestUser.check", {
        timeRequired: paymentMethodsTimeSpan.CHK,
        paymentRefId: paymentRefId ?? "",
      });
    case "Push To Card":
      return t("paymentRegistration.thankyouMessage.guestUser.directDeposit", {
        paymentRefId: paymentRefId ?? "",
      });
    case "Zelle":
      return t("paymentRegistration.thankyouMessage.guestUser.zelle", {
        paymentRefId: paymentRefId ?? "",
      });
      case "USBankPrepaidCard":
        return t("paymentRegistration.thankyouMessage.guestUser.usBankPrepaidCard", {
          paymentRefId: paymentRefId ?? "",
        });
    default:
      return "";
  }
};

/*
Enrollment journey reg. user/Guest user Thank you page
*/
const paymentExchangeScreen = (props) => {
  const { classes, user, t } = props;
  const { isLoggedIn } = user;
  const { state } = props.location;
  const paymentRefId = !isLoggedIn
    ? state?.dynamicFooterMessage?.split(":")?.[1] ?? ""
    : "";

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={12} md={12} lg={12} style={{margin:"16px"}}>
        <Box textAlign="center" className={classes.paymentRegCont}>
          <Box p={2} textAlign="center">
            <Typography variant="body1" className={classes.thankYouText}>
              {t("paymentRegistrationComplete.thankYou")}
            </Typography>
          </Box>

          {isLoggedIn ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{width: '100%'}}
            >
              <Box width="60%" display="flex" justifyContent="center">
                <img
                  src={require(`~/assets/images/thankyouImage.png`)}
                  alt={"Payment Exchange"}
                  className={classes.guestImage}
                />
              </Box>
              <Box width={{ xs: "80%", md: "62%", lg: "62%" }} mb={2}>
                <Typography variant="body1" className={classes.paymentDetails}>
                  {getRegisteredUserThankYouMessages(state?.paymentType, t)}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{width: '100%'}}
            >
              <Box>
                <img
                  src={require(`~/assets/images/guestThankyou.png`)}
                  alt={"Payment Exchange"}
                  className={classes.guestImage}
                />
              </Box>
              <Box width={{ xs: "80%", md: "62%", lg: "62%" }} mb={2}>
                <Typography variant="body1" className={classes.paymentDetails}>
                  {getGuestUserThankYouMessages(
                    state?.paymentType,
                    t,
                    paymentRefId
                  )}
                </Typography>
                <Typography variant="body1" className={classes.paymentRefId}>
                  {t("paymentRegistration.paymentRef", {
                    paymentRefId: paymentRefId ?? "",
                  })}
                </Typography>
              </Box>
            </Box>
          )}

          {isLoggedIn && (
            <Box py={2}>
              <Button
                onClick={() => {
                  const routeParam =
                    (props.match.params && props.match.params.clientSlug) || "";
                  props.history.push({
                    pathname: `${config.baseName}/${routeParam}/dashboard`,
                  });
                }}
                className={classes.shareButton}
                variant="contained"
                color="primary"
              >
                {t("paymentRegistrationComplete.Continue")}
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.paymentRegistration,
    ...state.user,
  }))(withStyles(styles)(paymentExchangeScreen))
);
