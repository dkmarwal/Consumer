import React, { Component } from 'react';
import { compose } from 'redux';
import { Grid, Typography, Box, Tooltip } from '@material-ui/core';
import {
  selectedPaymentType,
  updateEnableDisableRemittance,
  updateSelectedRemittanceConfigData,
  updateSortedPaymentTypesList,
} from '~/redux/actions/paymentRegistration';
import ACH_Consumer from '~/assets/icons/paymentMethods/ACH_Consumer.png';
import CXC_Consumer from '~/assets/icons/paymentMethods/Zelle_Consumer.svg';
import PPD_Consumer from '~/assets/icons/paymentMethods/PPD_Consumer.svg';
import MSC_Consumer from '~/assets/icons/paymentMethods/PushToCard_Consumer.svg';
import CHK_Consumer from '~/assets/icons/paymentMethods/Check_Consumer.svg';
import DDC_Consumer from '~/assets/icons/paymentMethods/DDC_Consumer.svg';
import ZEL_Consumer from '~/assets/icons/paymentMethods/ZEL_Consumer.svg';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Notification from '~/components/Notification';
import clsx from 'clsx';
import StarIcon from '@material-ui/icons/Star';
import nodataImage from '~/assets/icons/blankFile_No_data_new.svg';
import InfoIcon from '@material-ui/icons/Info';
import { paymentMethods } from '~/config/paymentMethods';

const paymentModeIcons = {
  ACH_Consumer,
  CXC_Consumer,
  PPD_Consumer,
  MSC_Consumer,
  CHK_Consumer,
  ZEL_Consumer,
  DDC_Consumer,
};

const styles = (theme) => ({
  paymentItemOuterDiv: {
    cursor: 'pointer',
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.14)',
    borderRadius: 8,
    minHeight: '15rem',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(5),
    backgroundColor: '#fff',
    marginTop: -8,
    [theme.breakpoints.down('sm')]: {
      minHeight: 'auto',
    },
  },
  otherPaymentItemOuterDiv: {
    cursor: 'pointer',
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.14)',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: '7.5rem',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(5),
    marginTop: -8,
  },
  paymentItemInnerDiv: {
    width: '100%',
  },
  paymentMethodImgCont: {
    height: '100%',
    marginTop: theme.spacing(-3),
  },
  paymentMethodImg: {
    maxWidth: '100%',
    maxHeight: '60px',
  },
  paymentMethodName: {
    fontSize: '1.375rem',
    color: theme.palette.text.dark,
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  disabledDescClass: {
    color: `${theme.palette.text.disabledDark}!important`,
  },
  paymentMethodDesc: {
    paddingLeft: theme.spacing(1),
    fontSize: '1rem',
    color: theme.palette.text.dark,
  },
  paymentBoxLabel: {
    backgroundColor: theme.palette.highlight.main,
    color: theme.palette.getContrastText(theme.palette.highlight.main),
    padding: '5px 10px 10px 10px',
    width: '180px',
    position: 'relative',
    '&::after': {
      content: '""',
      borderBottom: `30px solid ${theme.palette.highlight.main}`,
      borderRight: '15px solid transparent',
      position: 'absolute',
      top: 0,
      right: '-15px',
    },
  },
  disabledClass: {
    backgroundColor: '#CCCCCC',
    '&::after': {
      borderBottom: `30px solid #CCCCCC`,
    },
  },
  thresholdClass: {
    color: '#A94442',
    fontSize: '12px',
    paddingLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
});
class PaymentMethods extends Component {
  updatePaymentList = () => {
    const preferredList =
      this.props.paymentRegistration.consumerPaymentTypesList.data
        .preferredPaymentList;
    let uniquePaymentMethodList = [
      ...new Map(
        preferredList.map((item) => [item['paymentTypeId'], item])
      ).values(),
    ];
    this.props.dispatch(updateSortedPaymentTypesList(uniquePaymentMethodList));
    if (uniquePaymentMethodList && uniquePaymentMethodList.length === 1) {
      this.props.dispatch(
        selectedPaymentType(uniquePaymentMethodList[0].paymentCode)
      );
    }
  };

  componentDidUpdate = (prevProps) => {
    const { paymentRegistration } = prevProps;
    if (
      paymentRegistration?.consumerPaymentTypesList?.data
        ?.preferredPaymentList &&
      !paymentRegistration.updatedPaymentTypesList
    ) {
      if (
        JSON.stringify(
          paymentRegistration.consumerPaymentTypesList.data.preferredPaymentList
        ) !== JSON.stringify(paymentRegistration.updatedPaymentTypesList)
      ) {
        return this.updatePaymentList();
      }
    }
  };

  handlePaymentMethodClick = (paymentMethod, index) => {
    const { dispatch, paymentRegistration } = this.props;
    if (paymentMethod.isInactive) return false;
    if (
      !paymentMethod.isDisabled &&
      paymentRegistration.selectedPaymentTypeCode !== paymentMethod.paymentCode
    ) {
      dispatch(selectedPaymentType(paymentMethod.paymentCode));
      dispatch(updateEnableDisableRemittance(false));
      dispatch(updateSelectedRemittanceConfigData(null));
      const paymentMethodsList = [
        ...paymentRegistration.consumerPaymentTypesList.data
          .preferredPaymentList,
      ];
      const firstIndexPaymentMethod =
        paymentRegistration.consumerPaymentTypesList.data
          .preferredPaymentList[0];
      paymentMethodsList[0] = paymentMethodsList[index];
      paymentMethodsList[index] = firstIndexPaymentMethod;
      let uniquePaymentMethodList = [
        ...new Map(
          paymentMethodsList.map((item) => [item['paymentTypeId'], item])
        ).values(),
      ];
      dispatch(updateSortedPaymentTypesList(uniquePaymentMethodList));
    }
  };

  /**
   * payment methods that are rendered
   * covering a box/grid
   */
  renderPaymentBox = (paymentMethod, index, isSelectable) => {
    const { classes, paymentRegistration, t, user } = this.props;
    const { isPayeeChoicePortal } = user;
    const thresholds =
      paymentRegistration.consumerPaymentTypesList?.data?.thresholds ?? {};
      const isZelle = paymentMethod.paymentCode === paymentMethods['USBankZelle'];
    return (
      <Grid item xs={12} lg={4} key={paymentMethod.paymentTypeId}>
        <Box
          className={clsx(
            classes.paymentBoxLabel,
            paymentMethod.isInactive && classes.disabledClass
          )}
        >
          <Typography>{paymentMethod?.paymentInfoKey?.[0]}
          {isPayeeChoicePortal && isZelle && (
            <span>
              <Tooltip arrow title={t('paymentRegistration.ifEnrolled')} placement="top" >
                <InfoIcon
                  fontSize='small'
                  style={{ height: '16px', marginBottom: '-3px' }}
                />
              </Tooltip>
            </span>
            )}</Typography>
        </Box>
        <Grid
          item
          className={clsx(
            classes.paymentItemOuterDiv,
            classes.parentHoverClass
          )}
          style={{
            cursor: (paymentMethod.isInactive || !isSelectable) && 'default',
          }}
          onClick={() => {
            if (isSelectable)
              this.handlePaymentMethodClick(paymentMethod, index);
          }}
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
            {Boolean(paymentMethod.isPreferred) && (
              <Grid item>
                <Box
                  bgcolor='#f2f2f2'
                  borderRadius={4}
                  px={0.5}
                  py={0.2}
                  m={1}
                  width='auto'
                  display='inline-flex'
                  alignItems='center'
                >
                  <StarIcon color='inherit' fontSize='inherit' />
                  <Typography variant='body2'>
                    {isPayeeChoicePortal
                      ? t('paymentRegistration.usBankPreferred')
                      : t('paymentRegistration.mostPreferred')}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item>
              <Typography
                className={clsx(
                  classes.paymentMethodDesc,
                  paymentMethod.isInactive && classes.disabledDescClass
                )}
              >
                {paymentMethod?.paymentInfoKey?.[1]}
              </Typography>
            </Grid>
            {paymentMethod.isInactive && (
              <Grid item>
                <Typography className={classes.thresholdClass}>
                  {`${t('paymentRegistration.maximumPayment')} $${
                    thresholds[paymentMethod.paymentCode]
                  }`}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  /**
   * payment methods that are rendered
   * covering the complete row on UI
   */
  renderPaymentRow = (paymentMethod, index) => {
    const { classes, t, paymentRegistration, user } = this.props;
    const { isPayeeChoicePortal } = user;
    const thresholds =
      paymentRegistration.consumerPaymentTypesList?.data?.thresholds ?? {};
    return (
      <Grid item xs={12} lg={12} key={paymentMethod.paymentTypeId}>
        <Box
          className={clsx(
            classes.paymentBoxLabel,
            paymentMethod.isInactive && classes.disabledClass
          )}
        >
          <Typography>{paymentMethod?.paymentInfoKey?.[0]}</Typography>
        </Box>
        <Grid
          item
          className={clsx(
            classes.otherPaymentItemOuterDiv,
            classes.parentHoverClass
          )}
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
            {Boolean(paymentMethod.isPreferred) && (
              <Grid item>
                <Box
                  bgcolor='#f2f2f2'
                  borderRadius={4}
                  px={0.5}
                  py={0.2}
                  m={1}
                  width='auto'
                  display='inline-flex'
                  alignItems='center'
                >
                  <StarIcon color='inherit' fontSize='inherit' />
                  <Typography variant='body2'>
                    {isPayeeChoicePortal
                      ? t('paymentRegistration.usBankPreferred')
                      : t('paymentRegistration.mostPreferred')}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item>
              <Typography
                className={clsx(
                  classes.paymentMethodDesc,
                  paymentMethod.isInactive && classes.disabledDescClass
                )}
              >
                {paymentMethod?.paymentInfoKey?.[1]}
              </Typography>
            </Grid>
            {paymentMethod.isInactive && (
              <Grid item>
                <Typography className={classes.thresholdClass}>
                  {`${t('paymentRegistration.maximumPayment')} $${
                    thresholds[paymentMethod.paymentCode]
                  }`}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { paymentRegistration, user, t } = this.props;
    const { consumerPaymentTypesList } = paymentRegistration;
    let paymentListRender =
      ((user.isLoggedIn && consumerPaymentTypesList?.data?.allPaymentMethods) ||
        consumerPaymentTypesList?.data?.preferredPaymentList) ??
      null;
    const isSelectable =
      paymentListRender && paymentListRender.length === 1 ? false : true;
    if (paymentListRender?.length > 1) {
      paymentListRender = [
        ...new Map(
          paymentListRender.map((item) => [item['paymentTypeId'], item])
        ).values(),
      ];
    }
    return (
      <Grid
        container
        spacing={3}
        alignItems='stretch'
        style={{ marginBottom: '16px' }}
      >
        {paymentListRender ? (
          !paymentListRender.length ? (
            <Box display='block' textAlign='center' py={3} width='100%'>
              <img src={nodataImage} alt={'No Data Found'} />
              <Box py={2} style={{ color: '#9d9d9d', fontSize: '12px' }}>
                {t('paymentRegistration.noPaymentMethodFound')}
              </Box>
            </Box>
          ) : (
            paymentListRender.map((paymentMethod, index) => {
              if (index < 3) {
                return this.renderPaymentBox(
                  paymentMethod,
                  index,
                  isSelectable
                );
              } else return this.renderPaymentRow(paymentMethod, index);
            })
          )
        ) : paymentRegistration?.consumerPaymentTypesList?.error ? (
          <Notification
            variant={'error'}
            message={paymentRegistration.consumerPaymentTypesList.error}
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
  ...state.user,
}))(compose(withTranslation('common'), withStyles(styles))(PaymentMethods));
