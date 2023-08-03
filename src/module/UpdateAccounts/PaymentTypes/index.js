import React from "react";
import { Grid, Tooltip, Typography } from "@material-ui/core";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import ACH_Consumer from "~/assets/icons/paymentMethods/ACH_Active.svg";
import ACH_disabled from "~/assets/icons/paymentMethods/ACH_disabled.svg";
import CXC_Consumer from "~/assets/icons/paymentMethods/Zelle_Active.svg";
import CXC_disabled from "~/assets/icons/paymentMethods/Zelle_disabled.svg";
import PPL_Consumer from "~/assets/icons/paymentMethods/PayPal_Active.svg";
import PPL_disabled from "~/assets/icons/paymentMethods/PayPal_disabled.svg";
import MSC_Consumer from "~/assets/icons/paymentMethods/PushToCard_Active.svg";
import MSC_disabled from "~/assets/icons/paymentMethods/PushToCard_disabled.svg";
import CHK_Consumer from "~/assets/icons/paymentMethods/Check_Active.svg";
import CHK_disabled from "~/assets/icons/paymentMethods/Check_disabled.svg";
import ZEL_Consumer from '~/assets/icons/paymentMethods/ZEL_Active.svg';
import ZEL_disabled from '~/assets/icons/paymentMethods/ZEL_disabled.svg';
import DDC_Consumer from '~/assets/icons/paymentMethods/DDC_Active.svg';
import DDC_disabled from '~/assets/icons/paymentMethods/DDC_disabled.svg';
import PPD_Consumer from '~/assets/icons/paymentMethods/PPD_Active.svg';
import PPD_disabled from '~/assets/icons/paymentMethods/PPD_disabled.svg';
import RTP_Consumer from '~/assets/icons/paymentMethods/ACH_Active.svg';
import RTP_disabled from '~/assets/icons/paymentMethods/ACH_disabled.svg';
import clsx from "clsx";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import {
  selectedPaymentType,
  updateEnableDisableRemittance,
  updateSelectedRemittanceConfigData,
  updateSortedPaymentTypesList,
} from "~/redux/actions/paymentRegistration";
import CircularProgress from "@material-ui/core/CircularProgress";
import Notification from "~/components/Notification";
import StarIcon from "~/assets/icons/star.svg";

const paymentModeIcons = {
  ACH_Consumer,
  ACH_disabled,
  CXC_Consumer,
  CXC_disabled,
  PPL_Consumer,
  PPL_disabled,
  MSC_Consumer,
  MSC_disabled,
  CHK_Consumer,
  CHK_disabled,
  ZEL_Consumer,
  ZEL_disabled,
  DDC_Consumer,
  DDC_disabled,
  PPD_Consumer,
  PPD_disabled,
  RTP_Consumer,
  RTP_disabled
};

const PaymentTypes = (props) => {
  const { classes, paymentRegistration, dispatch, accounts } = props;
  const {
    selectedPaymentTypeCode,
    consumerPaymentTypesList,
    updatedPaymentTypesList,
  } = paymentRegistration;
  const primaryPaymentMethodId =
    accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId;
  React.useEffect(() => {
    if (
      consumerPaymentTypesList?.data?.preferredPaymentList &&
      !updatedPaymentTypesList &&
      selectedPaymentTypeCode
    ) {
      const selectedPaymentMethodIndex =
        consumerPaymentTypesList?.data?.preferredPaymentList?.findIndex(
          (item) => item.paymentCode === selectedPaymentTypeCode
        ) ?? 0;
      const paymentMethodsList = [
        ...consumerPaymentTypesList.data.preferredPaymentList,
      ];
      const firstIndexPaymentMethod =
        consumerPaymentTypesList.data.preferredPaymentList[0];
      paymentMethodsList[0] = paymentMethodsList[selectedPaymentMethodIndex];
      paymentMethodsList[selectedPaymentMethodIndex] = firstIndexPaymentMethod;
      let uniquePaymentMethodList = [
        ...new Map(
          paymentMethodsList.map((item) => [item["paymentTypeId"], item])
        ).values(),
      ];
      dispatch(updateSortedPaymentTypesList(uniquePaymentMethodList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consumerPaymentTypesList, updatedPaymentTypesList]);

  const handlePaymentMethodClick = (paymentMethod, index) => {
    if (
      !paymentMethod.isDisabled &&
      selectedPaymentTypeCode !== paymentMethod.paymentCode
    ) {
      dispatch(selectedPaymentType(paymentMethod.paymentCode));
      dispatch(updateEnableDisableRemittance(false));
      dispatch(updateSelectedRemittanceConfigData(null));
      const paymentMethodsList = [
        ...paymentRegistration.updatedPaymentTypesList,
      ];
      const firstIndexPaymentMethod =
        paymentRegistration.updatedPaymentTypesList[0];
      paymentMethodsList[0] = paymentMethodsList[index];
      paymentMethodsList[index] = firstIndexPaymentMethod;
      dispatch(updateSortedPaymentTypesList(paymentMethodsList));
    }
  };

  const selectedPaymentMethod =
    consumerPaymentTypesList?.data?.preferredPaymentList?.find(
      (item) => item.paymentCode === selectedPaymentTypeCode
    );
  const countOfPaymentMethods =
    consumerPaymentTypesList?.data?.preferredPaymentList?.length ?? 0;

  return (
    <>
      {consumerPaymentTypesList?.data?.preferredPaymentList &&
      updatedPaymentTypesList ? (
        <Grid
          container
          direction="row"
          alignItems="flex-end"
          style={{ marginBottom: "24px" }}
        >
          <Grid
            item
            lg={3}
            md={3}
            sm={4}
            xs={12}
            key={selectedPaymentTypeCode}
            style={{ zIndex: 1 }}
          >
            <Grid item xs={7} sm={12} md={12} lg={12}>
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
                <Grid container justifyContent="center" style={{textAlign:"center"}}>
                  <Typography className={classes.paymentMethodDesc}>
                    {selectedPaymentMethod?.description}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            lg={
              countOfPaymentMethods > 4
                ? 8
                : countOfPaymentMethods === 4
                ? 6
                : countOfPaymentMethods === 3
                ? 4
                : countOfPaymentMethods === 2
                ? 2
                : 2
            }
            md={
              countOfPaymentMethods > 4
                ? 8
                : countOfPaymentMethods === 4
                ? 6
                : countOfPaymentMethods === 3
                ? 4
                : countOfPaymentMethods === 2
                ? 2
                : 2
            }
            sm={
              countOfPaymentMethods > 4
                ? 8
                : countOfPaymentMethods === 4
                ? 6
                : countOfPaymentMethods === 3
                ? 4
                : countOfPaymentMethods === 2
                ? 2
                : 2
            }
            xs={12}
            className={classes.mobMarginLeft}
          >
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
                {consumerPaymentTypesList?.data?.preferredPaymentList ? (
                  paymentRegistration.updatedPaymentTypesList?.map(
                    (paymentMethod, index) => {
                      const isSelected =
                        selectedPaymentTypeCode &&
                        paymentMethod?.paymentCode === selectedPaymentTypeCode;
                      if (!isSelected) {
                        return (
                          <Grid
                            item
                            lg
                            sm
                            md
                            xs
                            container
                            alignItems="center"
                            justifyContent="center"
                            key={`${paymentMethod?.paymentTypeId}_${index}`}
                            className={classes.boxHeightFix}
                            style={{
                              borderRight:
                                index + 1 !== countOfPaymentMethods &&
                                "1px dashed #828282",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handlePaymentMethodClick(paymentMethod, index)
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
                                  className={classes.paymentMethodImgCont}
                                >
                                  {primaryPaymentMethodId ===
                                    paymentMethod?.paymentTypeId && (
                                    <img src={StarIcon} alt="Selected" />
                                  )}
                                  <Tooltip arrow title={paymentMethod?.description ?? ""}>
                                  <img
                                    src={
                                      paymentModeIcons[
                                        `${paymentMethod?.paymentCode}_disabled`
                                      ]
                                    }
                                    alt={paymentMethod?.description ?? ""}
                                    className={classes.paymentMethodImg}
                                  />
                                  </Tooltip>
                                  
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
                ) : consumerPaymentTypesList?.error ? (
                  <Notification
                    variant={"error"}
                    message={consumerPaymentTypesList.error}
                    handleClose={() => {}}
                  />
                ) : (
                  <CircularProgress />
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      ) : consumerPaymentTypesList?.error ? (
        <Notification
          variant={"error"}
          message={consumerPaymentTypesList.error}
          handleClose={() => {}}
        />
      ) : (
        <CircularProgress color="inherit" />
      )}
    </>
  );
};

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.paymentAuthentication,
  ...state.accounts,
}))(compose(withTranslation("common"), withStyles(styles))(PaymentTypes));
