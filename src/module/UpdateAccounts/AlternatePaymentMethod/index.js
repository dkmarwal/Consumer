import React, { useEffect, useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect, useDispatch, useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import AlternatePaymentTypes from "./AlternatePaymentTypes";
import {
  selectedAlternatePaymentType,
  updateSelectedRemittanceConfigData,
  deleteAlternatePayment,
} from "~/redux/actions/paymentRegistration";
import Check from "~/module/UpdateAccounts/PaymentTypes/Check";
import ACH from "~/module/UpdateAccounts/PaymentTypes/ACH";
import { paymentMethodIds, paymentMethods } from "~/config/paymentMethods";
import OtherAlternatePaymentMethods from "./otherAlternatePaymentMethods";
import DeleteAlternatePaymentDialog from "./AlternatePaymentTypes/deleteAlternatePaymentDialog";

const AlternatePaymentMethod = (props) => {
  const { accounts } = useSelector((state) => state.accounts);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const dispatch = useDispatch();
  const {
    classes,
    paymentRegistration,
    isSecondaryMethodAvailable,
    t,
    loadData,
    setnotificationMessage,
    ...otherProps
  } = props;
  const { selectedAlternatePaymentTypeCode } = paymentRegistration;
  const secondaryPaymentMethodId =
    accounts.consumerPaymentDetails?.data?.secondaryPaymentMethodId;
  const alternatePaymentMethods =
    accounts?.secondaryPaymentMethodList?.data?.alternatePaymentMethods;

  let isSelectedPaymentMethodAvailable = false;
  if (alternatePaymentMethods?.length && selectedAlternatePaymentTypeCode) {
    const selectedPaymentData = alternatePaymentMethods.find(
      (item) => item.paymentCode === selectedAlternatePaymentTypeCode
    );
    if (selectedPaymentData) {
      isSelectedPaymentMethodAvailable = true;
    }
  }

  useEffect(() => {
    if (secondaryPaymentMethodId) {
      if (
        !isSecondaryMethodAvailable?.length &&
        alternatePaymentMethods?.length === 1
      ) {
        dispatch(
          selectedAlternatePaymentType(alternatePaymentMethods[0].paymentCode)
        );
      } else if (isSecondaryMethodAvailable?.length) {
        const selectedPayMethod = Object.keys(paymentMethodIds).find(
          (key) => paymentMethodIds[key] === secondaryPaymentMethodId
        );
        dispatch(selectedAlternatePaymentType(selectedPayMethod));
      } else dispatch(selectedAlternatePaymentType(null));
    } else {
      dispatch(selectedAlternatePaymentType(null))
    }
    dispatch(updateSelectedRemittanceConfigData(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeAlternatePayment = () => {
    dispatch(deleteAlternatePayment()).then((response) => {
      handleResponse(response);
    });
  };

  const handleResponse = (response) => {
    if (!response) {
      return false;
    } else {
      dispatch(selectedAlternatePaymentType(null));
      loadData();
      setnotificationMessage(
        t("dashboard.notification.alternatePaymentDelete")
      );
      setOpenDeleteDialog(false);
      props.closePaymentMethodsDialog();
    }
  };

  const handleDialogClose = () => {
    setOpenDeleteDialog(false);
    props.closePaymentMethodsDialog();
  };

  const handleSelectedAlternateMethod = () => {
    switch (selectedAlternatePaymentTypeCode) {
      case "CHK":
        return <Check alternateMethod={true} {...props} />;
      case "ACH":
        return <ACH alternateMethod={true} {...props} />;
      default:
        return <></>;
    }
  };

  const handleOpenDeleteDialog = (dialogState) => {
    const primaryPaymentMethodId =
      accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId;
    const isAchOrCheck =
      paymentMethodIds["CHK"] === primaryPaymentMethodId ||
      paymentMethodIds["ACH"] === primaryPaymentMethodId;
    if (!isAchOrCheck && primaryPaymentMethodId) {
      const thresholds =
        paymentRegistration?.consumerPaymentTypesList?.data?.thresholds ?? {};
      const paymentMethodCode = Object.keys(paymentMethodIds).find(
        (key) => paymentMethodIds[key] === primaryPaymentMethodId
      );
      const paymentMethodName = Object.keys(paymentMethods).find(
        (key) => paymentMethods[key] === paymentMethodCode
      );
      setDeleteConfirmationText(
        t("dashboard.heading.thresholdRemoveAlternateText", {
          paymentMethodName,
          paymentMethodCode: thresholds[paymentMethodCode],
        })
      );
    } else {
      setDeleteConfirmationText(t("dashboard.heading.removeAlternateText"));
    }
    setOpenDeleteDialog(dialogState);
  };

  return (
    <>
      <Grid container item className={classes.alternatePMContent}>
        <Grid item lg={12}>
          {((isSecondaryMethodAvailable?.length && secondaryPaymentMethodId) ||
            selectedAlternatePaymentTypeCode) &&
          alternatePaymentMethods?.length > 1 ? (
            <AlternatePaymentTypes
              setOpenDeleteDialog={handleOpenDeleteDialog}
              {...otherProps}
            />
          ) : null}
          {(!selectedAlternatePaymentTypeCode ||
            alternatePaymentMethods?.length === 1) && (
            <OtherAlternatePaymentMethods
              setOpenDeleteDialog={handleOpenDeleteDialog}
            />
          )}
          {isSelectedPaymentMethodAvailable && handleSelectedAlternateMethod()}
          {!isSelectedPaymentMethodAvailable && (
            <Grid container className={classes.actionButtonCont}>
              <Grid lg={12} xs={12} item className={classes.buttonGridItems}>
                <Grid container item spacing={2} justifyContent="center">
                  <Grid item xs={5} sm={3} md={3} lg={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={(e) => {
                        props.closePaymentMethodsDialog();
                      }}
                    >
                      {t("updatedAccounts.buttonLabel.cancel")}
                    </Button>
                  </Grid>
                  <Grid item xs={5} sm={3} md={3} lg={3}>
                    <Button variant="contained" fullWidth disabled={true}>
                      {t("updatedAccounts.buttonLabel.add")}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          {openDeleteDialog && (
            <DeleteAlternatePaymentDialog
              open={openDeleteDialog}
              handleDialogClose={handleDialogClose}
              handleDelete={removeAlternatePayment}
              handleCancel={() => setOpenDeleteDialog(false)}
              deleteConfirmationText={deleteConfirmationText}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default withTranslation()(
  connect((state) => ({
    ...state.paymentRegistration,
  }))(withStyles(styles)(AlternatePaymentMethod))
);
