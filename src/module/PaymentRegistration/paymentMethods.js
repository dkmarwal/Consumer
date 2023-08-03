import React, { Component } from 'react';
import { compose } from 'redux';
import { Grid, Typography, Box, Tooltip } from '@material-ui/core';
import {
  selectedPaymentType,
  fetchConsumerPaymentTypesList,
  updateEnableDisableRemittance,
  updateSelectedRemittanceConfigData,
  updateSortedPaymentTypesList,
} from '~/redux/actions/paymentRegistration';
import nodataImage from '~/assets/icons/blankFile_No_data_new.svg';
import ACH_Consumer from '~/assets/icons/paymentMethods/ACH_Consumer.png';
import USBankACH_Consumer from '~/assets/icons/paymentMethods/USBankACH_Consumer.svg';
import DDC_Consumer from '~/assets/icons/paymentMethods/DDC_Consumer.svg';
import PPD_Consumer from '~/assets/icons/paymentMethods/PPD_Consumer.svg';
import CXC_Consumer from '~/assets/icons/paymentMethods/Zelle_Consumer.svg';
import ZEL_Consumer from '~/assets/icons/paymentMethods/ZEL_Consumer.svg';
import PPL_Consumer from '~/assets/icons/paymentMethods/PayPal_Consumer.svg';
import MSC_Consumer from '~/assets/icons/paymentMethods/PushToCard_Consumer.svg';
import CHK_Consumer from '~/assets/icons/paymentMethods/Check_Consumer.svg';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Notification from '~/components/Notification';
import StarIcon from '@material-ui/icons/Star';
import clsx from 'clsx';
import InfoIcon from '@material-ui/icons/Info';
import { paymentMethods } from '~/config/paymentMethods';

const paymentModeIcons = {
  ACH_Consumer,
  DDC_Consumer,
  PPD_Consumer,
  CXC_Consumer,
  PPL_Consumer,
  MSC_Consumer,
  CHK_Consumer,
  USBankACH_Consumer,
  ZEL_Consumer,
};

const styles = (theme) => ({
  paymentItemOuterDiv: {
    cursor: 'pointer',
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.14)',
    borderRadius: 8,
    height: '85%',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: theme.spacing(5),
    backgroundColor: '#fff',
    marginTop: -8,

    [theme.breakpoints.down('sm')]: {
      height: 'auto',
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
    minHeight: '100px',
    [theme.breakpoints.down('sm')]: {
      minHeight: 0,
    },
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
  constructor(props) {
    super(props);
    this.state = {
      achConnection: false,
      parentId: null,
    };
  }
  componentDidMount = () => {
    this.props.dispatch(fetchConsumerPaymentTypesList());
  };

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
    const paymentListRender =
      ((this.props.user.isLoggedIn &&
        this.props.paymentRegistration.consumerPaymentTypesList?.data
          ?.allPaymentMethods) ||
        uniquePaymentMethodList) ??
      null;
    if (
      paymentListRender &&
      paymentListRender.length === 1 &&
      !this.props.paymentRegistration.selectedPaymentTypeCode
    ) {
      this.props.dispatch(
        selectedPaymentType(paymentListRender[0].paymentCode)
      );
    }
  };

  componentDidUpdate = (prevProps) => {
    const { paymentRegistration } = prevProps;
    if (
      !paymentRegistration?.consumerPaymentTypesList?.data
        ?.preferredPaymentList &&
      this.props.paymentRegistration?.consumerPaymentTypesList?.data
        ?.preferredPaymentList &&
      !paymentRegistration.updatedPaymentTypesList
    ) {
      if (
        JSON.stringify(
          this.props.paymentRegistration.consumerPaymentTypesList.data
            .preferredPaymentList
        ) !== JSON.stringify(paymentRegistration.updatedPaymentTypesList)
      ) {
        return this.updatePaymentList();
      }
    }
  };

  handlePaymentMethodClick = (paymentMethod) => {
    const { dispatch, paymentRegistration } = this.props;
    const { isPayeeChoicePortal } = this.props.user;
    if (paymentMethod.isInactive) return false;
    // new condition addded for payee choice portal
    // if DDC retryCount exceeeds 3
    if (
      !paymentMethod.isDisabled &&
      paymentRegistration.selectedPaymentTypeCode !==
        paymentMethod.paymentCode &&
      (!isPayeeChoicePortal ||
        (isPayeeChoicePortal &&
          ((this.props?.location?.state?.retryCount &&
            this.props.location.state.retryCount < 4 &&
            paymentMethod.paymentCode ===
              paymentMethods.USBankDepositToDebitcard) ||
            !this.props?.location?.state?.retryCount)) ||
        paymentMethod.paymentCode !== paymentMethods.USBankDepositToDebitcard)
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
      const selectedPaymentMethodIndex = paymentMethodsList.findIndex(
        (item) => item.paymentCode === paymentMethod.paymentCode
      );
      paymentMethodsList[0] = paymentMethodsList[selectedPaymentMethodIndex];
      paymentMethodsList[selectedPaymentMethodIndex] = firstIndexPaymentMethod;
      let uniquePaymentMethodList = [
        ...new Map(
          paymentMethodsList
            .filter((item) => {
              return !!(isPayeeChoicePortal && !item?.parentId);
            })
            .map((item) => [item['paymentTypeId'], item])
        ).values(),
      ];
      dispatch(updateSortedPaymentTypesList(uniquePaymentMethodList));
    }
  };

  /**
   * payment methods that are rendered
   * covering a box/grid
   */
  renderPaymentBox = (paymentMethod, isSelectable) => {
    const { classes, paymentRegistration, t } = this.props;
    const { isPayeeChoicePortal } = this.props.user;
    const thresholds =
      paymentRegistration.consumerPaymentTypesList?.data?.thresholds ?? {};
    const isDDCdisabled =
      paymentMethod.paymentCode === paymentMethods.USBankDepositToDebitcard &&
      this.props?.location?.state?.retryCount > 3;
    const isZelle = paymentMethod.paymentCode === paymentMethods['USBankZelle'];
    return (
      <Grid
        item
        xs={12}
        md={4}
        lg={4}
        key={paymentMethod.paymentTypeId}
        alignItems='stretch'
      >
        <Box
          className={clsx(
            classes.paymentBoxLabel,
            (paymentMethod.isInactive || isDDCdisabled) && classes.disabledClass
          )}
        >
          <Typography>
            {paymentMethod?.paymentInfoKey?.[0]}
            {isPayeeChoicePortal && isZelle && (
            <span>
              <Tooltip arrow title={t('paymentRegistration.ifEnrolled')} placement="top" >
                <InfoIcon
                  fontSize='small'
                  style={{ height: '16px', marginBottom: '-3px' }}
                />
              </Tooltip>
            </span>
            )}
          </Typography>
        </Box>
        <Grid
          item
          alignItems='stretch'
          className={clsx(
            classes.paymentItemOuterDiv,
            classes.parentHoverClass
          )}
          style={{
            cursor:
              (paymentMethod.isInactive || !isSelectable || isDDCdisabled) &&
              'default',
          }}
          onClick={() => {
            if (isSelectable) {
              this.handlePaymentMethodClick(paymentMethod);
            }
          }}
        >
          <Grid item className={classes.paymentItemInnerDiv}>
            <Grid container className={classes.paymentMethodImgCont}>
              {isPayeeChoicePortal ? (
                <>
                  <Grid
                    style={{ display: 'flex' }}
                    item
                    xs={1}
                    sm={1}
                    md={3}
                    lg={3}
                  >
                    <img
                      src={
                        paymentModeIcons[
                          `${paymentMethod.paymentCode}_Consumer`
                        ]
                      }
                      alt={paymentMethod.description}
                      className={classes.paymentMethodImg}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={11}
                    sm={11}
                    md={9}
                    lg={9}
                    style={{ display: 'flex' }}
                  >
                    <Typography
                      className={clsx(
                        classes.paymentMethodName,
                        isDDCdisabled && classes.disabledDescClass
                      )}
                    >
                      {paymentMethod.description}
                    </Typography>
                  </Grid>
                </>
              ) : (
                <>
                  <img
                    src={
                      paymentModeIcons[`${paymentMethod.paymentCode}_Consumer`]
                    }
                    alt={paymentMethod.description}
                    className={classes.paymentMethodImg}
                  />
                  <Typography className={classes.paymentMethodName}>
                    {paymentMethod.description}
                  </Typography>
                </>
              )}
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
                  <Typography
                    variant='body2'
                    style={{ color: isDDCdisabled && '#9e9e9e' }}
                  >
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
                  (paymentMethod.isInactive || isDDCdisabled) &&
                    classes.disabledDescClass
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
          onClick={() => this.handlePaymentMethodClick(paymentMethod)}
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
        justifyContent='flex-start'
        spacing={3}
        alignItems='stretch'
      >
        {paymentListRender ? (
          !paymentListRender.length ? (
            <Box display='block' textAlign='center' py={3} width='100%'>
              <img src={nodataImage} alt={''} />
              <Box py={2} style={{ color: '#9d9d9d', fontSize: '12px' }}>
                {t('paymentRegistration.noPaymentMethodFound')}
              </Box>
            </Box>
          ) : (
            paymentListRender.map((paymentMethod, index) => {
              if (paymentMethod.parentId === null) {
                if (index < 3) {
                  return this.renderPaymentBox(paymentMethod, isSelectable);
                } else {
                  return this.renderPaymentRow(paymentMethod, index);
                }
              }
            })
          )
        ) : paymentRegistration?.consumerPaymentTypesList?.error ? (
          <Notification
            variant={'error'}
            message={paymentRegistration.consumerPaymentTypesList.error}
            handleClose={() => {}}
          />
        ) : (
          <Box
            display={'flex'}
            alignItems='center'
            minHeight={'100px'}
            justifyContent={'center'}
            width='100%'
          >
            <CircularProgress />
          </Box>
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