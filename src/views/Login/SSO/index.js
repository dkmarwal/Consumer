import React, { Component } from "react";
import { Grid, Box, Typography } from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { compose } from "redux";

class SSOLogout extends Component {
  render() {
    const { t, user, classes } = this.props;
    const brandInfo = user?.brandInfo ?? {};
    const clientLogo = brandInfo.logo || null;

    return (
      <Grid
        container
        className={"fixedHeaderGutter"}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={10}
          className={classes.payeePaymentMethodSelection}
        >
          <Box width={{ xs: "90%", lg: "77%", xl: "60%" }} mx="auto">
            <Grid container className={classes.paymentRegCont}>
              <Grid item xs={12} md={12} lg={12}>
                {clientLogo && (
                  <Box>
                    <img
                      src={clientLogo}
                      height="auto"
                      width="150"
                      alt="client logo"
                    />
                  </Box>
                )}
              </Grid>

              <Box textAlign="center">
                <Box p={3} textAlign="center">
                  <Typography variant="body1" className={classes.thankYouText}>
                    {t("login.view.label.logoutMsg", {
                      clientName: brandInfo?.clientName || "",
                    })}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    );
  }
}
export default connect((state) => ({ ...state.user }))(
  compose(withTranslation("common"), withStyles(styles))(SSOLogout)
);
