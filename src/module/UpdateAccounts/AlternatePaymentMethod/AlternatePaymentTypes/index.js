import React from "react";
import { connect, useDispatch } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { Grid, Typography, IconButton } from "@material-ui/core";
import clsx from "clsx";
import {
  selectedAlternatePaymentType,
  updateSortedAlternatePaymentTypesList,
} from "~/redux/actions/paymentRegistration";
import ACH_Consumer from "~/assets/icons/paymentMethods/ACH_Active.svg";
import ACH_disabled from "~/assets/icons/paymentMethods/ACH_disabled.svg";
import CHK_Consumer from "~/assets/icons/paymentMethods/Check_Active.svg";
import CHK_disabled from "~/assets/icons/paymentMethods/Check_disabled.svg";
import CircularProgress from "@material-ui/core/CircularProgress";
import Notification from "~/components/Notification";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import DeleteIcon from "@material-ui/icons/Delete";

const paymentModeIcons = {
  ACH_Consumer,
  ACH_disabled,
  CHK_Consumer,
  CHK_disabled,
};

const AlternatePaymentTypes = (props) => {
  const dispatch = useDispatch();
  // const [notificationMessage, setnotificationMessage] = useState(null);
  const { classes, paymentRegistration, accounts, setOpenDeleteDialog } = props;
  const { secondaryPaymentMethodList } = accounts;
  const { selectedAlternatePaymentTypeCode, updatedAlternatePaymentTypesList } =
    paymentRegistration;
  const secondaryPaymentMethodId =
    accounts.consumerPaymentDetails?.data?.secondaryPaymentMethodId;

  React.useEffect(() => {
    if (
      secondaryPaymentMethodList?.data?.alternatePaymentMethods &&
      !updatedAlternatePaymentTypesList
    ) {
      if (secondaryPaymentMethodList.data.alternatePaymentMethods.length <= 1) {
        dispatch(
          updateSortedAlternatePaymentTypesList(
            accounts?.secondaryPaymentMethodList.data.alternatePaymentMethods
          )
        );
      } else {
        const selectedPaymentMethodIndex =
          secondaryPaymentMethodList?.data?.alternatePaymentMethods?.findIndex(
            (item) => item.paymentCode === selectedAlternatePaymentTypeCode
          ) ?? 0;
        const paymentMethodsList = [
          ...secondaryPaymentMethodList.data.alternatePaymentMethods,
        ];
        const firstIndexPaymentMethod =
          secondaryPaymentMethodList.data.alternatePaymentMethods[0];
        paymentMethodsList[0] = paymentMethodsList[selectedPaymentMethodIndex];
        paymentMethodsList[selectedPaymentMethodIndex] =
          firstIndexPaymentMethod;
        dispatch(updateSortedAlternatePaymentTypesList(paymentMethodsList));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondaryPaymentMethodList, updatedAlternatePaymentTypesList]);

  const handlePaymentMethodClick = (paymentMethod) => {
    dispatch(selectedAlternatePaymentType(paymentMethod.paymentCode));
  };

  const openDeleteMethodDialog = () => {
    setOpenDeleteDialog(true);
  };

  const selectedPaymentMethod =
    secondaryPaymentMethodList?.data?.alternatePaymentMethods?.find(
      (item) => item.paymentCode === selectedAlternatePaymentTypeCode
    );

  const countOfPaymentMethods =
    (selectedPaymentMethod &&
      secondaryPaymentMethodList?.data?.alternatePaymentMethods?.length > 1) ||
    (!selectedPaymentMethod &&
      secondaryPaymentMethodList?.data?.alternatePaymentMethods?.length)
      ? true
      : false;
  return (
    <>
      {secondaryPaymentMethodList?.data?.alternatePaymentMethods && (
        <Grid
          container
          alignItems="flex-end"
          direction="row"
          style={{ marginBottom: "24px", position: 'relative' }}
        >
          {selectedPaymentMethod && (
            <Grid
              item
              lg={3}
              sm={4}
              md={3}
              xs={7}
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
          )}

          <Grid item sm={8} md={9} lg={9} xs={4} container>
            {secondaryPaymentMethodId && (
              <Grid style={{position: 'absolute', top: '0px', right: '0px'}}>
                <IconButton
                  size="small"
                  onClick={() => openDeleteMethodDialog()}
                >
                  <DeleteIcon size="small" />
                </IconButton>
              </Grid>
            )}
            <Grid container item alignItems="flex-end">
              <Grid
                item
                lg={3}
                md={3}
                sm={4}
                xs={12}
                className={classes.mobMarginLeft}
              >
                {countOfPaymentMethods && (
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
                    {secondaryPaymentMethodList?.data
                      ?.alternatePaymentMethods ? (
                      paymentRegistration.updatedAlternatePaymentTypesList?.map(
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
                                style={{
                                  cursor: "pointer",
                                  height: "96%",
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
                                      alignItems="center"
                                      className={classes.paymentMethodImgCont}
                                    >
                                      {secondaryPaymentMethodId ===
                                        paymentMethod.paymentTypeId && (
                                        <StarHalfIcon
                                          color="inherit"
                                          fontSize="inherit"
                                        />
                                      )}
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
  compose(withTranslation("common"))(withStyles(styles)(AlternatePaymentTypes))
);
