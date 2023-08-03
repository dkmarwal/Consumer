import React from "react";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { Grid, Box } from "@material-ui/core";
import CheckBoxBlank from "~/assets/icons/check_box_outline_blank.png";
import CheckBoxChecked from "~/assets/icons/check_box.png";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { connect } from "react-redux";
import {
  updateSelectedRemittanceConfigData,
  fetchRemittanceDetails,
  updateEnableDisableRemittance,
} from "~/redux/actions/paymentRegistration";
import { EmailDeliveryModeId } from "~/config/consumerEnrollmentConst";
import TextField from "@material-ui/core/TextField";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import Hidden from "@material-ui/core/Hidden";

const ConsumerEnrollmentRemittance = (props) => {
  const {
    classes,
    dispatch,
    paymentRegistration,
    remittanceEmailError,
    handleRemittanceEmailError,
    accounts,
    t,
  } = props;
  const {
    remittanceDetails,
    isRemittanceEnabled,
    selectedRemittanceConfigData,
    consumerPaymentTypesList,
  } = paymentRegistration;
  const { consumerPaymentDetails } = accounts;
  const consumerPaymentRemittanceDetail =
    consumerPaymentDetails?.data?.consumerPaymentRemittanceDetail;
  const [remittanceEmailId, setRemittanceEmailValue] = React.useState(
    consumerPaymentRemittanceDetail?.remittanceEmailId ?? undefined
  );

  const isEmailEnabled = remittanceDetails?.data?.filter((item) => {
    return item.rmtDeliveryOptionId === EmailDeliveryModeId;
  });
  React.useEffect(() => {
    dispatch(fetchRemittanceDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (consumerPaymentRemittanceDetail && remittanceDetails) {
      const isSelectedOptionAvailable = remittanceDetails.data?.filter(
        (item) => {
          return (
            item.rmtDeliveryOptionId ===
              consumerPaymentRemittanceDetail.remittanceDeliveryOptionId &&
            consumerPaymentRemittanceDetail.remittanceDeliveryOptionId ===
              EmailDeliveryModeId
          );
        }
      );
      if (isSelectedOptionAvailable?.length) {
        dispatch(updateEnableDisableRemittance(true));
        getFinalRemittanceDataSet(
          parseInt(consumerPaymentRemittanceDetail.remittanceDeliveryOptionId),
          consumerPaymentRemittanceDetail.remittanceEmailId
        );
      } else {
        dispatch(updateEnableDisableRemittance(false));
        dispatch(updateSelectedRemittanceConfigData(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remittanceDetails, consumerPaymentRemittanceDetail]);

  const handleRemittanceSelection = () => {
    const isRemittanceEnabledVal = !isRemittanceEnabled;
    dispatch(updateEnableDisableRemittance(isRemittanceEnabledVal));
    setRemittanceEmailValue(consumerPaymentTypesList?.data?.remittanceEmail);
    handleRemittanceEmailError();
    dispatch(updateSelectedRemittanceConfigData(null));
    if (isRemittanceEnabledVal) {
      getFinalRemittanceDataSet(
        EmailDeliveryModeId,
        consumerPaymentTypesList?.data?.remittanceEmail
      );
    }
  };

  const getFinalRemittanceDataSet = (deliveryModeId, newEmailVal) => {
    const selectedRemitData = remittanceDetails?.data?.filter(
      (elem) => elem.rmtDeliveryOptionId === parseInt(deliveryModeId)
    );
    const finalRemitData = [
      {
        deliveryModeId: selectedRemitData?.[0]?.rmtDeliveryOptionId,
        formatIds: selectedRemitData?.[0]?.deliveryOptionId.map(
          (item) => item.formatId
        ),
      },
    ];
    dispatch(
      updateSelectedRemittanceConfigData({
        remittanceDetails: finalRemitData,
        remittanceEmail: newEmailVal,
      })
    );
  };

  const handleEmailChange = (event) => {
    setRemittanceEmailValue(
      (event.target.value && event.target.value.trim()) || undefined
    );
    dispatch(
      updateSelectedRemittanceConfigData({
        ...selectedRemittanceConfigData,
        remittanceEmail:
          (event.target.value && event.target.value.trim()) || undefined,
      })
    );
  };

  const remittanceLabel = t("updatedAccounts.remittance.chooseDeliveryMode");

  return (
    <>
      {isEmailEnabled?.length ? (
        <Grid container spacing={2}>
          <Grid container item xs={12} alignItems="center">
            <Grid item xs={12} sm={10} md={10} lg={props.i18n.language === 'fr' ? 8 : 7}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      icon={
                        <img src={CheckBoxBlank} alt="Unchecked_Checkbox" />
                      }
                      checkedIcon={
                        <img src={CheckBoxChecked} alt="Checked_Checkbox" />
                      }
                      name="Remittance"
                      onChange={() => handleRemittanceSelection()}
                      checked={isRemittanceEnabled}
                    />
                  }
                  className={classes.remittanceCheckbox}
                  label={
                    <>
                      {remittanceLabel}
                     
                    </>
                  }
                />
                <Hidden only={["xs"]}><Box style={{ color: "#CCCCCC", paddingLeft: 4, fontSize: "14px" }}>
                        {t("updatedAccounts.remittance.optional")}
                      </Box>
                      </Hidden>
                <Box display="flex" pl={2} >
                  <LightTooltip 
                    title={t("remittance.tooltipText")}
                  ></LightTooltip>
                </Box>                
              </Box>
              <Hidden only={["sm", "md", "lg", "xl"]}>
                <Box style={{ color: "#CCCCCC", paddingLeft: 28, fontSize: "14px" }}>
                    {t("updatedAccounts.remittance.optional")}
                </Box>
              </Hidden>   
            </Grid>
          </Grid>

          {selectedRemittanceConfigData &&
          selectedRemittanceConfigData.remittanceDetails?.find(
            (item) => item.deliveryModeId === EmailDeliveryModeId
          ) &&
          isEmailEnabled?.length ? (
            <Grid container item xs={12} lg={12}>
              <Grid xs={12} lg={12} item className={classes.emailTextField}>
                <TextField
                  variant="outlined"
                  autoComplete="off"
                  color="secondary"
                  label={t("remittance.EmailId")}
                  name="remittanceEmailId"
                  value={remittanceEmailId ?? ""}
                  onChange={(e) => handleEmailChange(e)}
                  error={Boolean(remittanceEmailError)}
                  helperText={remittanceEmailError}
                  required
                />
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      ) : null}
    </>
  );
};

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.user,
  ...state.accounts,
}))(
  compose(
    withTranslation("common"),
    withStyles(styles)
  )(ConsumerEnrollmentRemittance)
);
