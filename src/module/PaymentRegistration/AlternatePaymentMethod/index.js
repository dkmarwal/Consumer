import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, Box } from "@material-ui/core";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import config from "~/config";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import AlternatePaymentTypes from "./AlternatePaymentTypes";
import { updateSelectedRemittanceConfigData } from "~/redux/actions/paymentRegistration";
import Check from "~/module/PaymentRegistration/PaymentTypes/Check";
import ACH from "~/module/PaymentRegistration/PaymentTypes/ACH";
import { TimeoutDialog } from "~/components/Dialogs";
import { useHistory } from "react-router-dom";
import DataSecure from "~/assets/images/dataSecure.svg";
import OtherAlternatePaymentMethods from "./otherAlternatePaymentMethods";
import { fetchSecondaryPaymentMethodsList } from "~/redux/actions/accounts";

const AlternatePaymentMethod = (props) => {
  const [alertMsg, setAlertMsg] = useState(false);
  const { classes, paymentRegistration, dispatch, match, t, accounts } = props;
  const { selectedAlternatePaymentTypeCode } = paymentRegistration;
  const { secondaryPaymentMethodList } = accounts;
  const alternatePaymentMethods =
    secondaryPaymentMethodList?.data?.alternatePaymentMethods ?? null;

  const history = useHistory();
  const routeParam = (match && match.params && match.params.clientSlug) || "";

  useEffect(() => {
    dispatch(updateSelectedRemittanceConfigData(null));
    dispatch(fetchSecondaryPaymentMethodsList());
  }, []);

  const handleSelectedAlternateMethod = () => {
    switch (selectedAlternatePaymentTypeCode) {
      case "CHK":
        return (
          <Check
            alternateMethod={true}
            onSkipButton={onSkipButton}
            {...props}
          />
        );
      case "ACH":
        return (
          <ACH alternateMethod={true} onSkipButton={onSkipButton} {...props} />
        );
      default:
        return <></>;
    }
  };

  const onSkipButton = () => {
    setAlertMsg(true);
    setTimeout(() => {
      setAlertMsg(false);
      history.push({
        pathname: `${config.baseName}/${routeParam}/paymentRegistration/complete`,
        state: {
          paymentType: props?.location?.state?.paymentType ?? "",
          dynamicMessage: props?.location?.state?.preferredMsg ?? "",
          dynamicFooterMessage:
            props?.location?.state?.preferredFooterMsg ?? "",
          isVerified: true,
        },
      });
    }, 5000);
  };

  return (
    <Grid container spacing={3} className={classes.paymentRegCont}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid
          item
          xs
          sm={9}
          md={10}
          lg={10}
          xl={10}
          className={classes.paymentMethodHeader}
        >
          <Typography gutterBottom variant="h1">
            {t("paymentRegistration.alternatePayment.heading")}
          </Typography>
        </Grid>
        <Grid item xs={2} lg={2} xl={2} sm={3} md={2}>
          <div className={classes.dataSecure}>
            <img
              src={DataSecure}
              className={classes.dataSecureImg}
              alt="Data Secure"
            />
            <span className={classes.dataSecureText}>
              {t("paymentRegistration.dataSecureText")}
            </span>
          </div>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item>
          <Typography className={classes.alternateSubHeading}>
            {t("paymentRegistration.alternatePayment.subHeading")}
          </Typography>
        </Grid>
      </Grid>
      {<Box mt={3} width={1}>
        {!selectedAlternatePaymentTypeCode ||
        (alternatePaymentMethods && alternatePaymentMethods.length === 1) ? (
          <OtherAlternatePaymentMethods {...props} />
        ) : (
          <AlternatePaymentTypes {...props} />
        )}
      </Box>}
      <Grid container>{handleSelectedAlternateMethod()}</Grid>

      {selectedAlternatePaymentTypeCode === null && (
        <Grid container item justifyContent="center" className={classes.actionBtn}>
          <Grid item xs={12} sm={props.i18n.language === 'fr'?5:4} md={3} lg={props.i18n.language === 'fr'?4:3} xl={3}>
              <Button
                variant="text"
                color="secondary"
                className={classes.linkBtn}
                fullWidth
                onClick={onSkipButton}
              >
                {t("paymentRegistration.alternatePayment.skip")}
              </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={3} lg={3} xl={2}>
              <Button color="primary" fullWidth variant="contained" disabled>
                {t("paymentRegistration.alternatePayment.save")}
              </Button>
          </Grid>
        </Grid>
      )}
      {alertMsg ? (
        <TimeoutDialog
          open={alertMsg}
          msgText={t("paymentRegistration.alternatePayment.msgText")}
        />
      ) : null}
    </Grid>
  );
};
export default withTranslation()(
  connect((state) => ({
    ...state.paymentRegistration,
    ...state.accounts,
  }))(withStyles(styles)(AlternatePaymentMethod))
);
