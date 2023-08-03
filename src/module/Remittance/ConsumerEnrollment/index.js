import React from "react";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { compose } from "redux";
import { Grid, Box, Hidden } from "@material-ui/core";
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
import { withTranslation } from "react-i18next";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";

const ConsumerEnrollmentRemittance = (props) => {
  const {
    classes,
    dispatch,
    paymentRegistration,
    remittanceEmailError,
    handleRemittanceEmailError,
  } = props;
  const {
    remittanceDetails,
    isRemittanceEnabled,
    selectedRemittanceConfigData,
    consumerPaymentTypesList,
  } = paymentRegistration;
  const [remittanceEmailId, setRemittanceEmailValue] =
    React.useState(undefined);

  React.useEffect(() => {
    dispatch(fetchRemittanceDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isEmailEnabled = remittanceDetails?.data?.filter((item) => {
    return item.rmtDeliveryOptionId === EmailDeliveryModeId;
  });
  const handleRemittanceSelection = () => {
    const isRemittanceEnabledVal = !isRemittanceEnabled;
    dispatch(updateEnableDisableRemittance(isRemittanceEnabledVal));
    setRemittanceEmailValue(consumerPaymentTypesList?.data?.remittanceEmail);
    handleRemittanceEmailError();
    if (isRemittanceEnabledVal) {
      setRemittanceEmailValue(consumerPaymentTypesList?.data?.remittanceEmail);
      getFinalRemittanceDataSet(
        EmailDeliveryModeId,
        consumerPaymentTypesList?.data?.remittanceEmail
      );
    } else {
      dispatch(updateSelectedRemittanceConfigData(null));
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

  const remittanceLabel = props.t("remittance.chooseRemittanceMode");
  return (
    <>
      {isEmailEnabled?.length ? (
        <Grid container>
          {remittanceDetails?.data?.length ? (
            <Grid container className={classes.remittanceContainer}>
              <Grid item xs={12} sm md lg>
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
                          {props.t("remittance.optional")}
                        </Box>
                        </Hidden>
                  <Box display="flex" pl={0.5}>
                    <LightTooltip
                      title={props.t("remittance.tooltipText")}
                    ></LightTooltip>
                  </Box>
                </Box>
                <Hidden only={["sm", "md", "lg", "xl"]}><Box style={{ color: "#CCCCCC", paddingLeft: 28, fontSize: "14px" }}>
                    {props.t("remittance.optional")}
                      </Box>
                      </Hidden>
              </Grid>
            </Grid>
          ) : null}
          {selectedRemittanceConfigData &&
            selectedRemittanceConfigData.remittanceDetails?.find(
              (item) => item.deliveryModeId === EmailDeliveryModeId
            ) && (
              <Grid container item xl={12} lg={12}>
                <Grid item xs={12} lg={12} className={classes.emailTextField}>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    color="secondary"
                    label={props.t("remittance.EmailId")}
                    fullWidth
                    name="remittanceEmailId"
                    value={remittanceEmailId}
                    onChange={(e) => handleEmailChange(e)}
                    error={Boolean(remittanceEmailError)}
                    helperText={remittanceEmailError}
                    required
                  />
                </Grid>
              </Grid>
            )}
        </Grid>
      ) : null}
    </>
  );
};

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.user,
}))(
  compose(
    withTranslation("common"),
    withStyles(styles)
  )(ConsumerEnrollmentRemittance)
);
