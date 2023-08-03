import React from 'react';
import { compose } from 'redux';
import { Grid, Typography } from '@material-ui/core';
import { styles } from './styles';
import { withStyles } from '@material-ui/styles';
import ACH_Consumer from '~/assets/icons/paymentMethods/ACH_Active.svg';
import ACH_disabled from '~/assets/icons/paymentMethods/ACH_disabled.svg';
import DDC_Consumer from '~/assets/icons/paymentMethods/DDC_Active.svg';
import DDC_disabled from '~/assets/icons/paymentMethods/DDC_disabled.svg';
import PPD_Consumer from '~/assets/icons/paymentMethods/PPD_Active.svg';
import PPD_disabled from '~/assets/icons/paymentMethods/PPD_disabled.svg';
import CXC_Consumer from '~/assets/icons/paymentMethods/Zelle_Active.svg';
import CXC_disabled from '~/assets/icons/paymentMethods/Zelle_disabled.svg';
import PPL_Consumer from '~/assets/icons/paymentMethods/PayPal_Active.svg';
import PPL_disabled from '~/assets/icons/paymentMethods/PayPal_disabled.svg';
import MSC_Consumer from '~/assets/icons/paymentMethods/PushToCard_Active.svg';
import MSC_disabled from '~/assets/icons/paymentMethods/PushToCard_disabled.svg';
import CHK_Consumer from '~/assets/icons/paymentMethods/Check_Active.svg';
import CHK_disabled from '~/assets/icons/paymentMethods/Check_disabled.svg';
import ZEL_Consumer from '~/assets/icons/paymentMethods/ZEL_Active.svg';
import ZEL_disabled from '~/assets/icons/paymentMethods/ZEL_disabled.svg';
import clsx from 'clsx';
import {
  selectedPaymentType,
  fetchConsumerPaymentTypesList,
  updateEnableDisableRemittance,
  updateSelectedRemittanceConfigData,
  updateSortedPaymentTypesList,
} from '~/redux/actions/paymentRegistration';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Notification from '~/components/Notification';
import { withTranslation } from 'react-i18next';
import {paymentMethods} from '~/config/paymentMethods';

const paymentModeIcons = {
  ACH_Consumer,
  ACH_disabled,
  PPD_Consumer,
  PPD_disabled,
  CXC_Consumer,
  CXC_disabled,
  PPL_Consumer,
  PPL_disabled,
  MSC_Consumer,
  MSC_disabled,
  CHK_Consumer,
  CHK_disabled,
  DDC_Consumer,
  DDC_disabled,
  ZEL_Consumer,
  ZEL_disabled,
};

const PaymentTypes = (props) => {
  const { classes, paymentRegistration, dispatch, t, user } = props;
  const { isPayeeChoicePortal } = user;
  const { selectedPaymentTypeCode, consumerPaymentTypesList } =
    paymentRegistration;

  React.useEffect(() => {
    async function fetchPaymentData() {
      await dispatch(fetchConsumerPaymentTypesList());
    }

    fetchPaymentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleClearSelection = () => {
    dispatch(selectedPaymentType(null));
    dispatch(updateEnableDisableRemittance(false));
    dispatch(updateSelectedRemittanceConfigData(null));
  };
  const selectedPaymentMethod =
    consumerPaymentTypesList?.data?.preferredPaymentList?.find(
      (item) => item.paymentCode === selectedPaymentTypeCode
    );
  const countOfPaymentMethods =
    consumerPaymentTypesList?.data?.preferredPaymentList?.length ?? 0;
  const isDDCdisabled =
    isPayeeChoicePortal &&
    props?.location?.state?.retryCount &&
    props.location.state.retryCount > 3;
  return (
    <Grid container direction='row' alignItems='flex-end'>
      <Grid
        item
        lg={3}
        md={3}
        sm={4}
        xs={12}
        key={selectedPaymentMethod?.paymentTypeId}
        style={{ zIndex: 1 }}
      >
        <Grid item xs={7} sm md lg={12}>
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
                alt={selectedPaymentMethod?.description ?? ''}
                className={classes.selectedPaymentMethodImg}
              />
            </Grid>
            <Grid
              container
              justifyContent='center'
              style={{ textAlign: 'center' }}
            >
              <Typography className={classes.paymentMethodDesc}>
                {selectedPaymentMethod?.description}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        sm={
          countOfPaymentMethods > 4
            ? true
            : countOfPaymentMethods === 4
            ? 9
            : countOfPaymentMethods === 3
            ? 4
            : countOfPaymentMethods === 2
            ? 2
            : 2
        }
        md={
          countOfPaymentMethods > 4
            ? true
            : countOfPaymentMethods === 4
            ? 9
            : countOfPaymentMethods === 3
            ? 4
            : countOfPaymentMethods === 2
            ? 2
            : 2
        }
        lg={
          countOfPaymentMethods > 4
            ? true
            : countOfPaymentMethods === 4
            ? 9
            : countOfPaymentMethods === 3
            ? 4
            : countOfPaymentMethods === 2
            ? 2
            : 2
        }
        xs={12}
        className={classes.mobMarginLeft}
      >
        <Grid
          container
          item
          justifyContent={countOfPaymentMethods > 1 ? 'flex-end' : 'center'}
        >
          <Typography
            onClick={() => handleClearSelection()}
            className={classes.clearSelectionText}
            style={{ marginBottom: countOfPaymentMethods > 1 && '16px' }}
          >
            {t('paymentRegistration.clearSelection')}
          </Typography>
        </Grid>
        {countOfPaymentMethods > 1 && (
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            className={classes.nonSelectedPaymentMethodsCont}
            style={{
              border: '1px solid #828282',
              position: 'relative',
              zIndex: 0,
              height: 'auto',
            }}
          >
            {consumerPaymentTypesList?.data?.preferredPaymentList ? (
              paymentRegistration.updatedPaymentTypesList
                ?.filter(
                  (item) =>
                    item.parentId === null 
                )
                .map((paymentMethod, index) => {
                  if(isDDCdisabled && paymentMethod.paymentCode === paymentMethods.USBankDepositToDebitcard){
                    return null
                  }
                  const isSelected =
                    selectedPaymentTypeCode &&
                    paymentMethod.paymentCode === selectedPaymentTypeCode;
                  if (!isSelected) {
                    return (
                      <Grid
                        item
                        lg
                        xs
                        container
                        alignItems='center'
                        justifyContent='center'
                        key={`${paymentMethod.paymentTypeId}_${index}`}
                        className={classes.boxHeightFix}
                        style={{
                          borderRight:
                            index + 1 !== countOfPaymentMethods &&
                            '1px dashed #828282',
                          cursor: 'pointer',
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
                          <Grid item className={classes.paymentItemInnerDiv}>
                            <Grid
                              container
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
                })
            ) : consumerPaymentTypesList?.error ? (
              <Notification
                variant={'error'}
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
  );
};

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.paymentAuthentication,
  ...state.user,
}))(compose(withTranslation('common'), withStyles(styles))(PaymentTypes));
