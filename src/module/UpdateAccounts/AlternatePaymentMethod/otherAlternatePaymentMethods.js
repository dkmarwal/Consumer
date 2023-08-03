import React, { Component } from "react";
import { compose } from "redux";
import { Grid, Typography, Box, IconButton } from "@material-ui/core";
import {
  updateSortedAlternatePaymentTypesList,
  selectedAlternatePaymentType,
} from "~/redux/actions/paymentRegistration";
import ACH_Consumer from "~/assets/icons/paymentMethods/ACH_Consumer.png";
import CXC_Consumer from "~/assets/icons/paymentMethods/Zelle_Consumer.svg";
import PPL_Consumer from "~/assets/icons/paymentMethods/PayPal_Consumer.svg";
import MSC_Consumer from "~/assets/icons/paymentMethods/PushToCard_Consumer.svg";
import CHK_Consumer from "~/assets/icons/paymentMethods/Check_Consumer.svg";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import CircularProgress from "@material-ui/core/CircularProgress";
import Notification from "~/components/Notification";
import DeleteIcon from "@material-ui/icons/Delete";
import clsx from "clsx";

const paymentModeIcons = {
  ACH_Consumer,
  CXC_Consumer,
  PPL_Consumer,
  MSC_Consumer,
  CHK_Consumer,
};

const styles = (theme) => ({
  paymentItemOuterDiv: {
    cursor: "pointer",
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.14)",
    borderRadius: 8,
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(5),
    height: "90%",
    backgroundColor: "#fff",
    marginTop: -8,
    [theme.breakpoints.down("xs")]: { minHeight: "auto", height: "80%" },
  },
  otherPaymentItemOuterDiv: {
    cursor: "pointer",
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.14)",
    borderRadius: 8,
    backgroundColor: "#fff",
    minHeight: "7.5rem",
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(5),
    marginTop: -8,
  },
  paymentItemInnerDiv: {
    width: "100%",
  },
  paymentMethodImgCont: {
    height: "100%",
    marginTop: theme.spacing(-3),
  },
  paymentMethodImg: {
    maxWidth: "100%",
    maxHeight: "60px",
  },
  paymentMethodName: {
    fontSize: "1.375rem",
    color: theme.palette.primary.dark,
    alignSelf: "center",
  },
  paymentMethodDesc: {
    paddingLeft: theme.spacing(1),
    fontSize: "1rem",
    color: theme.palette.text.light,
  },
  paymentBoxLabel: {
    backgroundColor: theme.palette.highlight.main,
    color: theme.palette.getContrastText(theme.palette.highlight.main),
    padding: "5px 10px 10px 10px",
    width: "180px",
    position: "relative",
    "&::after": {
      content: '""',
      borderBottom: `30px solid ${theme.palette.highlight.main}`,
      borderRight: "15px solid transparent",
      position: "absolute",
      top: 0,
      right: "-15px",
    },
  },
});
class OtherAlternatePaymentMethods extends Component {
  updatePaymentList = () => {
    const alternatePaymentMethods =
      this.props.accounts.secondaryPaymentMethodList.data
        .alternatePaymentMethods;
    this.props.dispatch(
      updateSortedAlternatePaymentTypesList(alternatePaymentMethods)
    );
    if (alternatePaymentMethods && alternatePaymentMethods.length === 1) {
      this.props.dispatch(
        selectedAlternatePaymentType(alternatePaymentMethods[0].paymentCode)
      );
    }
  };

  componentDidUpdate = (prevProps) => {
    const { paymentRegistration, accounts } = prevProps;
    const { secondaryPaymentMethodList } = accounts;
    if (
      secondaryPaymentMethodList?.data?.alternatePaymentMethods &&
      !paymentRegistration.updatedAlternatePaymentTypesList
    ) {
      if (
        JSON.stringify(
          secondaryPaymentMethodList.data.alternatePaymentMethods
        ) !==
        JSON.stringify(paymentRegistration.updatedAlternatePaymentTypesList)
      ) {
        return this.updatePaymentList();
      }
    }
  };

  handlePaymentMethodClick = (paymentMethod, index) => {
    const { dispatch, paymentRegistration, accounts } = this.props;
    if (
      !paymentMethod.isDisabled &&
      paymentRegistration.selectedAlternatePaymentTypeCode !==
        paymentMethod.paymentCode
    ) {
      dispatch(selectedAlternatePaymentType(paymentMethod.paymentCode));
      const paymentMethodsList = [
        ...accounts.secondaryPaymentMethodList.data.alternatePaymentMethods,
      ];
      const firstIndexPaymentMethod =
        accounts.secondaryPaymentMethodList.data.alternatePaymentMethods[0];
      paymentMethodsList[0] = paymentMethodsList[index];
      paymentMethodsList[index] = firstIndexPaymentMethod;
      dispatch(updateSortedAlternatePaymentTypesList(paymentMethodsList));
    }
  };

  openDeleteMethodDialog = () => {
    this.props.setOpenDeleteDialog(true);
  };

  /**
   * payment methods that are rendered
   * covering a box/grid
   */
  renderPaymentBox = (paymentMethod, index, isSelectable) => {
    const { classes } = this.props;
    return (
      <Grid item xs={12} sm={6} md={6} lg={6} key={paymentMethod.paymentTypeId}>
        <Box className={classes.paymentBoxLabel}>
          <Typography>{paymentMethod?.paymentInfoKey?.[0]}</Typography>
        </Box>
        <Grid
          item
          className={clsx(
            classes.paymentItemOuterDiv,
            classes.parentHoverClass
          )}
          style={{
            cursor: !isSelectable && "default",
          }}
          onClick={() => this.handlePaymentMethodClick(paymentMethod, index)}
        >
          <Grid item className={classes.paymentItemInnerDiv}>
            <Grid container className={classes.paymentMethodImgCont}>
              <img
                src={paymentModeIcons[`${paymentMethod.paymentCode}_Consumer`]}
                alt={paymentMethod.description}
                className={classes.paymentMethodImg}
              />
              <Typography className={classes.paymentMethodName}>
                {paymentMethod.description}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.paymentMethodDesc}>
                {paymentMethod?.paymentInfoKey?.[1]}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { accounts } = this.props;
    const { secondaryPaymentMethodList } = accounts;
    const secondaryPaymentMethodId =
      accounts.consumerPaymentDetails?.data?.secondaryPaymentMethodId;
    const isSelectable =
      secondaryPaymentMethodList?.data?.alternatePaymentMethods?.length === 1
        ? false
        : true;
    return (
      <Grid container style={{marginBottom: !isSelectable && '32px'}}>
        {secondaryPaymentMethodList?.data?.alternatePaymentMethods ? (
          <>
            <Grid container spacing={2} item xs={12} sm={12} md={12} lg={10} xl={10}>
              {secondaryPaymentMethodList?.data?.alternatePaymentMethods.map(
                (paymentMethod, index) => {
                  return this.renderPaymentBox(
                    paymentMethod,
                    index,
                    isSelectable
                  );
                }
              )}
            </Grid>

            {secondaryPaymentMethodId && (
              <Grid
                item
                xs={2}
                container
                justifyContent="flex-end"
                alignItems="flex-start"
              >
                <IconButton
                  size="small"
                  onClick={() => this.openDeleteMethodDialog()}
                >
                  <DeleteIcon size="small" />
                </IconButton>
              </Grid>
            )}
          </>
        ) : secondaryPaymentMethodList?.error ? (
          <Notification
            variant={"error"}
            message={secondaryPaymentMethodList.error}
            handleClose={() => {}}
          />
        ) : (
          <CircularProgress />
        )}
      </Grid>
    );
  }
}
export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.paymentAuthentication,
  ...state.accounts,
}))(
  compose(
    withTranslation("common"),
    withStyles(styles)
  )(OtherAlternatePaymentMethods)
);
