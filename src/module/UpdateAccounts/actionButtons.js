import React from "react";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withTranslation } from "react-i18next";
import { compose } from "redux";

const ActionButtons = (props) => {
  const { classes, closePaymentMethodsDialog, t } = props;

  return (
    <Grid container className={classes.actionButtonCont}>
        <Button
          className={classes.backButton}
          variant="outlined"
          color="primary"
          onClick={() => closePaymentMethodsDialog()}
        >
          {t("updatedAccounts.actionButtons.back")}
        </Button>
        <Button variant="contained" disabled className={classes.shareButton}>
          {t("updatedAccounts.actionButtons.continue")}
        </Button>
    </Grid>
  );
};

export default compose(
  withTranslation("common"),
  withStyles(styles)
)(ActionButtons);
