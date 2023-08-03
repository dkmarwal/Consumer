import React,{ useEffect,useState } from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  makeStyles,
  Divider,
  Typography,
  Link
} from '@material-ui/core';
import {
  getPaymentDetails,
  getPaymentTrackingDetails,
} from '~/redux/helpers/clientPaymentTransactions';
import { connect } from 'react-redux';
import PaymentStepper from '~/components/Stepper/PaymentStepper';
import { downloadRemittanceFile } from '~/redux/helpers/filesettings';
import Notification from '~/components/Notification';
import * as FileSaver from 'file-saver';
import GetAppIcon from '@material-ui/icons/GetApp';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import CHK from '~/assets/icons/Check_mini.svg';
import ACH from '~/assets/icons/BankDeposit_mini.svg';
import PayPal from '~/assets/icons/Paypal_mini.svg';
import DirectDeposit from '~/assets/icons/DirectDeposit_mini.svg';
import VCA from '~/assets/icons/VCA_main.svg';
import Zelle from '~/assets/icons/Zelle.svg';
import RTP from '~/assets/icons/paymentMethods/RTP.svg'
import { PaymentPriority } from '~/config/paymentMethods';
import { starredMaskCard } from '~/utils/common.js';

const customStyle = makeStyles((theme) => ({
  flagcontainer: {
    alignContent: 'center',
    display: 'flex',
  },
  textDisabled: {
    color: theme.palette.text.disabledDark,
    cursor: 'default',
  },
  textDark: {
    color: theme.palette.text.dark,
    cursor: 'pointer',
  },
  divider: {
    marginTop: '20px',
    border: '1px dashed #9E9E9E',
    width: '100%',
  },
  textSec: {
    color: '#008CE6',
    cursor: 'pointer',
  },
}));

const PaymentDetails = ({
  clientId,
  paymentId,
  canDownload = true,
  setDialogMessage,
  t,
  setPaymentDetails,
  paymentData,
  paymentPriority,
  paymentTypeList,
  user
}) => {
  const {isPayeeChoicePortal} = user
  const [paymentDetail, setPaymentDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentTrackingDetail, setPaymentTrackingDetail] = useState([]);
  const [activeTrackingStep, setActiveTrackingStep] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [snackbarMessageType, setSnackbarMessageType] = React.useState('');
  const customClasses = customStyle();
  useEffect(() => {
    setLoading(true);
    fetchPaymentDetails(paymentId, clientId);
  }, []);
  const fetchPaymentDetails = async (paymentId, clientId) => {
    const response = await getPaymentDetails(clientId, paymentId);
    const res = await getPaymentTrackingDetails(clientId, paymentId);

    if (response && response.data) {
      const { data } = response;
      setPaymentDetail(data);
    }
    if (res && res.data) {
      let stepIndex = [...res.data];
      stepIndex = stepIndex
        .sort((a, b) => {
          if (a.StatusID > b.StatusID) {
            return -1;
          }
          if (b.StatusID > a.StatusID) {
            return 1;
          }
          return 0;
        })
        .find((el) => el.IsStatusUpdated === 1)?.StatusID;
      stepIndex = res.data.findIndex((el) => el.StatusID === stepIndex);
      setPaymentTrackingDetail(res.data);
      setActiveTrackingStep(stepIndex);
    }
    setLoading(false);
  };

  setPaymentDetails(paymentDetail);

  const downLoadRemittanceFile = async (paymentId, clientId, flag, isRRD) => {
    downloadRemittanceFile(paymentId, clientId, flag, isRRD, 2)
      .then((response) => {
        if (response && response.status === 200) {
          const fileName = `${response.headers['x-file-name']}`;
          const type = response.headers['content-type'];
          const data = new Blob([response.data], {
            type: type,
            encoding: 'UTF-8',
          });
          FileSaver.saveAs(data, fileName);
          setSnackbarMessage(
            response.message ||
              t('paymentDetails.notification.Download Success!!')
          );
          setSnackbarMessageType('success');
        } else {
          setSnackbarMessage(
            (response && response.message) ||
              t('paymentDetails.notification.File does not exist!')
          );
          setSnackbarMessageType('error');
        }
      })
      .catch((error) => {
        setSnackbarMessage(
          t('paymentDetails.notification.File does not exist!')
        );
        setSnackbarMessageType('error');
      });
  };

  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case 'ACH':
        return ACH;

      case 'VCA':
        return VCA;

      case 'CHK':
        return CHK;

      case 'PPL':
        return PayPal;

      case 'MSC':
        return DirectDeposit;

      case 'CXC':
      case 'ZEL':
        return Zelle;

      case 'RTP':
        return RTP;

      default:
    }
  };

  const renderpaymentDetails = (type, priority) => {
    switch (type) {
      case 'ACH':
      case 'RTP':
        return (
          <Box
            display='flex'
            alignItems='center'
            className={customClasses.flagcontainer}
          >
            {priority === PaymentPriority.Primary ? (
              <img
                src={require(`~/assets/icons/FullStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            ) : priority === PaymentPriority.Alternate ? (
              <img
                src={require(`~/assets/icons/HalfStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            ) : (
              <img
                src={require(`~/assets/icons/BorderStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            )}
            <Box px={1} display='flex'>
              <img
                src={getPaymentTypeIcon(type)}
                alt={'Payments'}
                style={{ verticalAlign: 'middle' }}
              />
            </Box>
            <span>{paymentDetail.AccountNumber}</span>
          </Box>
        );

      case 'CHK':
        return (
          <span className={customClasses.flagcontainer}>
            {priority === PaymentPriority.Primary ? (
              <img
                src={require(`~/assets/icons/FullStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            ) : priority === PaymentPriority.Alternate ? (
              <img
                src={require(`~/assets/icons/HalfStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            ) : (
              <img
                src={require(`~/assets/icons/BorderStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            )}
            <Box px={1} display='flex'>
              <img
                src={getPaymentTypeIcon(type)}
                alt={'Payments'}
                style={{ verticalAlign: 'middle' }}
              />
            </Box>
            <span>{paymentDetail.CheckNumber}</span>
          </span>
        );

      case 'PPL':
        return (
          <span className={customClasses.flagcontainer}>
            {priority === PaymentPriority.Primary ? (
              <img
                src={require(`~/assets/icons/FullStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            ) : priority === PaymentPriority.Alternate ? (
              <img
                src={require(`~/assets/icons/HalfStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            ) : (
              <img
                src={require(`~/assets/icons/BorderStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            )}
            <Box px={1}>
              <img
                src={getPaymentTypeIcon(type)}
                alt={'Payments'}
                style={{ verticalAlign: 'middle' }}
              />
            </Box>
            <span>{paymentDetail.PPL_TokenValue}</span>
          </span>
        );

      case 'MSC':
        return (
          <span className={customClasses.flagcontainer}>
            {priority === PaymentPriority.Primary ? (
              <img
                src={require(`~/assets/icons/FullStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            ) : priority === PaymentPriority.Alternate ? (
              <img
                src={require(`~/assets/icons/HalfStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            ) : (
              <img
                src={require(`~/assets/icons/BorderStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            )}
            <Box px={1}>
              <img
                src={getPaymentTypeIcon(type)}
                alt={'Payments'}
                style={{ verticalAlign: 'middle' }}
              />
            </Box>
            <span>{starredMaskCard(paymentDetail.MSC_CardNumber)}</span>
          </span>
        );

      case 'CXC':
      case 'ZEL':
        return (
          <span className={customClasses.flagcontainer}>
            {priority === PaymentPriority.Primary ? (
              <img
                src={require(`~/assets/icons/FullStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            ) : priority === PaymentPriority.Alternate ? (
              <img
                src={require(`~/assets/icons/HalfStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            ) : (
              <img
                src={require(`~/assets/icons/BorderStar.svg`)}
                alt={'Payments'}
                width='21'
              />
            )}
            <Box px={1} display='flex'>
              <img
                src={getPaymentTypeIcon(type)}
                alt={'Payments'}
                style={{ verticalAlign: 'middle' }}
              />
            </Box>
            <span>{paymentDetail.ZEL_TokenValue}</span>
          </span>
        );

      default:
    }
  };

  return (
    <>
      {loading ? (
        <Box
          width='50%'
          display='flex'
          my='8px'
          mx='auto'
          justifyContent='center'
          alignItems='center'
        >
          <CircularProgress color='primary' />
        </Box>
      ) : (
        <Grid container item justifyContent='center' spacing={2}>
          <Grid container direction='row'>
            <Box my={3} width='100%'>
              {paymentTrackingDetail && paymentTrackingDetail.length ? (
                <PaymentStepper
                  stepsList={paymentTrackingDetail}
                  activeStep={activeTrackingStep}
                />
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Divider
              style={{
                width: '100%',
                borderBottom: '1px dashed #cccccc',
                backgroundColor: 'transparent',
              }}
            />
          </Grid>

          <Grid item container xs={12} sm={10} md={10} lg={10}>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Typography variant='h4' color='textSecondary' gutterBottom>
                {t('paymentDetails.paymentReference')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <Typography variant='h4' gutterBottom>
                {paymentDetail.PaymentRef}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container xs={12} sm={10} md={10} lg={10}>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Typography variant='h4' color='textSecondary' gutterBottom>
                {t('paymentDetails.paymentMethod')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <Typography variant='h4' gutterBottom>
                {renderpaymentDetails(
                  paymentDetail.PaymentType,
                  paymentPriority
                )}
              </Typography>
            </Grid>
          </Grid>
          {paymentDetail.PaymentType === 'CHK' && (
            <Grid item container xs={12} sm={10} md={10} lg={10}>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Typography variant='h4' color='textSecondary' gutterBottom>
                  {t('paymentDetails.deliveryAddress')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8} md={8} lg={8}>
                <Typography variant='h4' gutterBottom>
                  {paymentDetail.CheckAddress}
                </Typography>
              </Grid>
            </Grid>
          )}

          <Grid item container xs={12} sm={10} md={10} lg={10}>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Typography variant='h4' color='textSecondary' gutterBottom>
                {t('paymentDetails.notes')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <Typography variant='h4' gutterBottom>
                {paymentDetail.Notes}
              </Typography>
            </Grid>
          </Grid>

          {!isPayeeChoicePortal && <Grid item container xs={12} sm={10} md={10} lg={10}>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Typography variant='h4' color='textSecondary' gutterBottom>
                {t('paymentDetails.paymentReceipt')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <Typography variant='h4' color='textPrimary' gutterBottom>
                <Link
                  underline='none'
                  onClick={
                    paymentDetail.PaymentID &&
                    paymentDetail.DownloadRemittance !== 'No'
                      ? () =>
                          downLoadRemittanceFile(
                            paymentDetail.PaymentID,
                            paymentDetail.ClientID,
                            true,
                            paymentDetail.IsHippa
                          )
                      : null
                  }
                >
                  <GetAppIcon
                    className={
                      paymentDetail.PaymentID &&
                      paymentDetail.DownloadRemittance !== 'No'
                        ? customClasses.textSec
                        : customClasses.textDisabled
                    }
                  />
                  <span
                    className={
                      paymentDetail.PaymentID &&
                      paymentDetail.DownloadRemittance !== 'No'
                        ? customClasses.textSec
                        : customClasses.textDisabled
                    }
                    style={{
                      fontSize: '16px',
                      verticalAlign: 'top',
                      paddingLeft: '5px',
                    }}
                  >
                    {t('paymentDetails.downloadPaymentReciept')}
                  </span>
                </Link>
              </Typography>
            </Grid>
          </Grid>}
        </Grid>
      )}
      {snackbarMessage && snackbarMessage.length > 0 && (
        <Notification
          variant={snackbarMessageType}
          message={snackbarMessage}
          handleClose={() => {
            setSnackbarMessageType(null);
            setSnackbarMessage(null);
          }}
        />
      )}
    </>
  );
};

export default connect((state) => ({ ...state.accounts,...state.user }))(
  compose(withTranslation('common'))(PaymentDetails)
);
