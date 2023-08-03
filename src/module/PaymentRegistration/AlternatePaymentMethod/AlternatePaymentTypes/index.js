import React, { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { withTranslation } from "react-i18next";
import { Grid, Typography } from "@material-ui/core";
import clsx from "clsx";
import {
  selectedAlternatePaymentType,
  fetchConsumerPaymentTypesList,
} from "~/redux/actions/paymentRegistration";
import { fetchPaymentsToAuthenticate } from "~/redux/actions/paymentAuthentication";
import ACH_Consumer from "~/assets/icons/paymentMethods/ACH_Active.svg";
import ACH_disabled from "~/assets/icons/paymentMethods/ACH_disabled.svg";
import CHK_Consumer from "~/assets/icons/paymentMethods/Check_Active.svg";
import CHK_disabled from "~/assets/icons/paymentMethods/Check_disabled.svg";

const paymentModeIcons = {
  ACH_Consumer,
  ACH_disabled,
  CHK_Consumer,
  CHK_disabled,
};

const AlternatePaymentTypes = (props) => {
  const { classes, paymentRegistration, dispatch, t, accounts } = props;
  const { selectedAlternatePaymentTypeCode } = paymentRegistration;
  const { secondaryPaymentMethodList } = accounts;

  useEffect(() => {
    async function fetchPaymentData() {
      await dispatch(fetchConsumerPaymentTypesList()).then((response) => {
        if (response) {
          const enrollmentLinkId = response?.enrollmentLinkId || null;
          if (enrollmentLinkId) {
            dispatch(
              fetchPaymentsToAuthenticate({ token: enrollmentLinkId }, false)
            );
          }
        }
      });
    }

    fetchPaymentData();
  }, []);

  const handlePaymentMethodClick = (paymentMethod) => {
    dispatch(selectedAlternatePaymentType(paymentMethod.paymentCode));
  };
  const handleClearSelection = () => {
    dispatch(selectedAlternatePaymentType(null));
  };

  const selectedPaymentMethod =
    secondaryPaymentMethodList?.data?.alternatePaymentMethods?.find(
      (item) => item.paymentCode === selectedAlternatePaymentTypeCode
    );
  const countOfPaymentMethods =
    secondaryPaymentMethodList?.data?.alternatePaymentMethods?.length ?? 0;

  return (
    <>
      {secondaryPaymentMethodList?.data?.alternatePaymentMethods && (
        <Grid container direction="row" style={{ marginBottom: "24px" }}>
          <Grid
            item
            lg={3}
            sm={4}
            md={3}
            xs={6}
            key={selectedAlternatePaymentTypeCode}
            style={{ zIndex: 1 }}
          >
            <Grid item xs={12} sm md lg={12}>
              <Grid
                className={clsx(
                  classes.paymentItemOuterDiv,
                  classes.selectedPaymentItemOuterDiv
                )}
              >
                <Grid container className={classes.paymentMethodImgCont}>
                  <img
                    src={
                      paymentModeIcons[
                        `${selectedPaymentMethod?.paymentCode}_Consumer`
                      ]
                    }
                    alt={selectedPaymentMethod?.description ?? ""}
                    className={classes.selectedPaymentMethodImg}
                  />
                </Grid>
                <Grid container justifyContent="center">
                  <Typography className={classes.paymentMethodDesc}>
                    {selectedPaymentMethod?.description}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={9} sm={7} md={6} xs={6} container>
            <Grid container item alignItems="flex-end">
              <Grid item 
                  lg={3} 
                  sm={5}
                  md={5}
                  xs={12}
                  className={classes.mobMarginLeft}
                  style={{ marginLeft: "-8px" }}>
                <Grid
                  container
                  item
                  justifyContent={
                    countOfPaymentMethods > 1 ? "flex-end" : "center"
                  }
                >
                  <Typography
                    onClick={() => handleClearSelection()}
                    className={classes.clearSelectionText}
                    style={{
                      marginBottom: countOfPaymentMethods > 1 && "16px",
                    }}
                  >
                    {t("paymentRegistration.clearSelection")}
                  </Typography>
                </Grid>
                {countOfPaymentMethods > 1 && (
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    className={classes.nonSelectedPaymentMethodsCont}
                    style={{
                      border: "1px solid #828282",
                      position: "relative",
                      zIndex: 0,
                      height: "auto",
                      borderRadius: "0px 10px 10px 0px",
                    }}
                  >
                    {secondaryPaymentMethodList?.data?.alternatePaymentMethods
                      ? paymentRegistration.updatedAlternatePaymentTypesList?.map(
                          (paymentMethod, index) => {
                            const isSelected =
                              selectedAlternatePaymentTypeCode &&
                              paymentMethod.paymentCode ===
                                selectedAlternatePaymentTypeCode;
                            if (!isSelected) {
                              return (
                                <Grid
                                  item
                                  lg
                                  xs
                                  container
                                  alignItems="center"
                                  justifyContent="center"
                                  key={paymentMethod.paymentTypeId}
                                  className={classes.boxHeightFix}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handlePaymentMethodClick(
                                      paymentMethod,
                                      index
                                    )
                                  }
                                >
                                  <Grid
                                    className={clsx(
                                      classes.paymentItemOuterDiv,
                                      classes.parentHoverClass
                                    )}
                                  >
                                    <Grid
                                      item
                                      className={classes.paymentItemInnerDiv}
                                    >
                                      <Grid
                                        container
                                        alignItems="center"
                                        className={classes.paymentMethodImgCont}
                                      >
                                        <img
                                          src={
                                            paymentModeIcons[
                                              `${paymentMethod.paymentCode}_disabled`
                                            ]
                                          }
                                          alt={paymentMethod.description}
                                          className={classes.paymentMethodImg}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              );
                            } else {
                              return null;
                            }
                          }
                        )
                      : null}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.accounts,
}))(
  compose(withTranslation("common"), withStyles(styles))(AlternatePaymentTypes)
);
