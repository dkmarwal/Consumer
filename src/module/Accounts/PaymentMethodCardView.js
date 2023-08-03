import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  IconButton,
  Grid,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import AlternatePMDialog from '~/module/UpdateAccounts/AlternatePMDialog';
import UpdateAccounts from '~/module/UpdateAccounts';
import ACH_Consumer from '~/assets/icons/paymentMethods/ACH_dashboard.svg';
import CXC_Consumer from '~/assets/icons/paymentMethods/Zelle_dashboard.svg';
import PPL_Consumer from '~/assets/icons/paymentMethods/PayPal_dashboard.svg';
import MSC_Consumer from '~/assets/icons/paymentMethods/PushToCard_dashboard.svg';
import CHK_Consumer from '~/assets/icons/paymentMethods/Check_dashboard.svg';
import DDC_Consumer from '~/assets/icons/paymentMethods/DDC_dashboard.svg';
import ZEL_Consumer from '~/assets/icons/paymentMethods/USBankZelle_main.svg';
import RTP_Consumer from '~/assets/icons/paymentMethods/RTP.svg';
import PFB_Consumer from '~/assets/icons/Prepaidcard.svg';
import PRC_Consumer from '~/assets/icons/Prepaidcard.svg';
import CRP_Consumer from '~/assets/icons/Prepaidcard.svg';
import CRD_Consumer from '~/assets/icons/Prepaidcard.svg';
import { connect } from 'react-redux';
import StepDoneIcon from '~/assets/icons/Step_Done_main.svg';
import { consumerStatus } from '~/config/entityTypes';
import StarIcon from '@material-ui/icons/Star';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import SuccessDialog from '~/components/Dialogs/successDialog';
import { fetchConsumerPaymentTypesList } from '~/redux/actions/paymentRegistration';
import { USBankPaymentMethodIds } from '~/config/paymentMethods';

const customStyle = makeStyles((theme) => ({
  flagcontainer: {
    alignContent: 'center',
    display: 'flex',
  },
  flag: {
    height: '2em !important',
    width: '2em !important',
    borderRadius: '50%',
  },
  header: {
    padding: '10px 16px',
  },
  headerPadding: {
    padding: '0px 16px',
  },
  headerLabel: {
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  headerInput: {
    width: '95%',
    border: 'none',
    fontSize: '12px',
    padding: '5px',
    borderRadius: '4px 4px 0 0',
    fontFamily: '"Interstate", Arial, Helvetica, sans-serif',
  },
  headerInputNew: {
    width: '50px',
    border: 'none',
    fontSize: '12px',
    padding: '5px',
    borderRadius: '4px 4px 0 0',
    fontFamily: '"Interstate", Arial, Helvetica, sans-serif',
  },

  headerInputShort: {
    border: 'none',
    fontSize: '12px',
    padding: '5px',
    maxWidth: '20%',
    marginRight: '10px',
    borderRadius: '4px 4px 0 0',
  },
  headerInputLong: {
    border: 'none',
    fontSize: '12px',
    padding: '5px',
    width: '90%',
    marginLeft: 8,
    borderRadius: '4px 4px 0 0',
  },
  paymentMethodImgCont: {
    position: 'relative',
    minHeight: '163px',
  },
  paymentMethodImg: {
    width: '100%',
    height: '50%',
    position: 'absolute',
    bottom: '0%',
    right: '0%',
    background: '#FFFFFF',
    borderRadius: '4px',
    padding: '8px 0px',
  },
  mainContainer: {
    padding: '40px',
    // maxWidth: "750px !important"
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 400,
    lineHeight: '28px',
  },
  ContentText: {
    color: '#4C4C4C',
    fontSize: 16,
  },
  backButton: {
    width: 140,
    cursor: 'pointer',
    border: '1px solid #2B2D30',
    color: '#2B2D30',
  },
  shareButton: {
    color: '#FFFFFF',
    padding: '5px 15px',
    cursor: 'pointer',
    width: 140,
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
  pxSpace: {
    margin: theme.spacing(0, 1, 0, 0),
  },
  ptSpace: {
    paddingTop: theme.spacing(2),
    wordBreak: 'break-all',
  },
  addAlternateContainer: {
    textAlign: 'justify',
    padding: theme.spacing(1.5, 1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  addAlternateButton: {
    marginTop: theme.spacing(2),
    fontSize: theme.spacing(1.5),
  },
  addAlternateText: {
    color: theme.palette.text.dark,
    fontSize: '0.875rem',
  },
  cardContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    wordBreak: 'break-word',
  },
}));

function PaymentMethodCardView(props) {
  const { details, editType, type, t, loadData, methodName, user, accounts } =
    props;
  const { isPayeeChoicePortal } = user;
  const customClasses = customStyle();
  const [openDialog, setOpenDialog] = useState(false);
  const [notificationMessage, setnotificationMessage] = useState(null);
  const primaryPaymentMethodId =
    accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId;

  const openPaymentMethodsDialog = () => {
    props.dispatch(fetchConsumerPaymentTypesList());
    setOpenDialog(true);
  };

  const closePaymentMethodsDialog = () => {
    setOpenDialog(false);
  };
  const paymentModeIcons = {
    ACH_Consumer,
    CXC_Consumer,
    PPL_Consumer,
    MSC_Consumer,
    CHK_Consumer,
  };

  const usbankPaymentModeIcons = {
    ACH_Consumer,
    ZEL_Consumer,
    PPL_Consumer,
    DDC_Consumer,
    CHK_Consumer,
    RTP_Consumer,
    PFB_Consumer,
    PRC_Consumer,
    CRP_Consumer,
    CRD_Consumer
  };

  const renderCardView = () => {
    const isBankAccount =
      primaryPaymentMethodId === USBankPaymentMethodIds.ACH ||
      primaryPaymentMethodId === USBankPaymentMethodIds.RTP;
    return (
      <>
        {isPayeeChoicePortal ? (
          <Grid
            container
            className={customClasses.cardContainer}
            direction='row'
            xs={12}
            sm={12}
            lg={12}
            justifyContent='flex-start'
          >
            <Grid
              container
              xs={12}
              sm={isBankAccount ? 8 : 12}
              lg={isBankAccount ? 8 : 12}
              spacing={2}
              className={customClasses.ptSpace}
            >
              {details.map((item) => {
                return (
                  <>
                    <Grid
                      container
                      className={customClasses.cardContainer}
                      direction='row'
                      xs={12}
                      sm={6}
                      lg={6}
                      justifyContent='flex-start'
                    >
                      <Grid item xs={12} lg={11}>
                        <Typography
                          style={{ fontWeight: 'bold' }}
                          color='textSecondary'
                        >
                          {item.label}
                        </Typography>
                        <Typography color='textPrimary'>
                          {item.value}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                );
              })}
            </Grid>
            {isBankAccount && (
              <Grid
                container
                direction='column'
                xs={12}
                sm={4}
                lg={4}
                spacing={2}
                style={{ paddingTop: '17px' }}
              >
                <Typography
                  style={{ fontWeight: 'bold' }}
                  color='textSecondary'
                >
                  {t('accounts.paymentMethod')}
                </Typography>
                {primaryPaymentMethodId === USBankPaymentMethodIds.ACH && (
                  <Typography color='textPrimary'>
                    {t('accounts.ach.methodNameACH')}
                  </Typography>
                )}
                {primaryPaymentMethodId === USBankPaymentMethodIds.RTP && (
                  <Typography color='textPrimary'>
                    {t('accounts.ach.methodNameRTP')}
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        ) : (
          <Grid container spacing={2} className={customClasses.ptSpace}>
            {details.map((item) => {
              return (
                <>
                  <Grid
                    container
                    className={customClasses.cardContainer}
                    direction='row'
                    xs={12}
                    sm={6}
                    lg={6}
                    justifyContent='flex-start'
                  >
                    {item.value !== null ? (
                      <Grid item xs={12} lg={11}>
                        <Typography
                          style={{ fontWeight: 'bold' }}
                          color='textSecondary'
                        >
                          {item.label}
                        </Typography>
                        <Typography color='textPrimary'>
                          {item.value}
                        </Typography>
                      </Grid>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </>
              );
            })}
          </Grid>
        )}
      </>
    );
  };

  const renderZelleCardView = () => {
    return (
      <Grid container spacing={2} className={customClasses.ptSpace}>
        {details && details.length ? (
          details.map((item) => {
            return (
              <>
                <Grid
                  container
                  className={customClasses.cardContainer}
                  direction='row'
                  xs={12}
                  sm={12}
                  lg={12}
                >
                  <Grid item xs={11} lg={11}>
                    <Typography
                      style={{ fontWeight: 'bold' }}
                      color='textSecondary'
                    >
                      {item.label}
                    </Typography>
                    <Typography color='textPrimary'>{item.value}</Typography>
                  </Grid>
                </Grid>
              </>
            );
          })
        ) : (
          <CircularProgress color='inherit' />
        )}
      </Grid>
    );
  };

  const renderAddAlternateCardView = () => {
    return (
      <Grid
        container
        spacing={2}
        className={customClasses.addAlternateContainer}
      >
        <Typography className={customClasses.addAlternateText}>
          {t('updatedAccounts.message.addNewAlternatePaymentMethod')}
        </Typography>
        <Button
          onClick={() => openPaymentMethodsDialog()}
          className={customClasses.addAlternateButton}
          variant='outlined'
          color='primary'
        >
          {t('accounts.addAlternatePaymentMethod')}
        </Button>
      </Grid>
    );
  };

  const consumerStatusId = props.DFA?.hasPymentTaken?.consumerStatusId || 0;
  return (
    <>
      <Box>
        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            justifyContent='space-between'
            alignItems='center'
          >
            <Grid item xs={11} lg={11}>
              <Box display='flex' alignItems='center'>
                {type && (
                  <>
                    <Box
                      border='1px solid #ccc'
                      borderRadius={4}
                      bgcolor='white'
                      textAlign='center'
                      p={0.5}
                      alignItems='center'
                      flexDirection='column'
                      justifyContent='center'
                      display='flex'
                      fontSize='9px'
                      color='text.dark'
                      width={{ xs: 100, md: 82, lg: 82 }}
                      height={{ xs: 'auto', md: 48, lg: 48 }}
                      mr={1}
                    >
                      <Box>
                        <img
                          src={
                            isPayeeChoicePortal
                              ? usbankPaymentModeIcons[`${type}_Consumer`]
                              : paymentModeIcons[`${type}_Consumer`]
                          }
                          height={20}
                          alt={`${type}_Consumer`}
                        />
                      </Box>

                      {methodName}
                    </Box>
                  </>
                )}
                {editType && (
                  <Box
                    color='text.main'
                    display='flex'
                    height={{ xs: 'auto', md: 48, lg: 48 }}
                    alignItems='center'
                    fontSize={{ xs: 18, md: 16, lg: 24 }}
                  >
                    {editType === 'primary' ? (
                      <>
                        <StarIcon
                          fontSize='small'
                          className={customClasses.pxSpace}
                        />
                        {t('dashboard.heading.preferredMethod')}{' '}
                      </>
                    ) : (
                      <>
                        <StarHalfIcon
                          fontSize='small'
                          className={customClasses.pxSpace}
                        />
                        {t('dashboard.heading.alternateMethod')}
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={1} lg={1}>
              {editType &&
                type &&
                consumerStatusId !== consumerStatus.REVOKED && (
                  <Box display='flex' justifyContent='flex-end'>
                    <IconButton
                      size='small'
                      onClick={() => openPaymentMethodsDialog()}
                    >
                      <EditIcon size='small' />
                    </IconButton>
                  </Box>
                )}
            </Grid>
          </Grid>
          {!type && editType === 'secondary'
            ? renderAddAlternateCardView()
            : type === 'CXC' || type === 'ZEL'
            ? renderZelleCardView()
            : renderCardView()}
        </Grid>
      </Box>
      {editType === 'primary' ? (
        <UpdateAccounts
          openDialog={openDialog}
          closePaymentMethodsDialog={closePaymentMethodsDialog}
        />
      ) : (
        <AlternatePMDialog
          openDialog={openDialog}
          closePaymentMethodsDialog={closePaymentMethodsDialog}
          setnotificationMessage={setnotificationMessage}
          loadData={loadData}
        />
      )}
      {notificationMessage && (
        <SuccessDialog
          open={Boolean(notificationMessage)}
          dialogText={notificationMessage}
          dialogIcon={StepDoneIcon}
          dialogTitle={t('updatedAccounts.heading.updateDetails')}
          buttonName={t('updatedAccounts.buttonLabel.okay')}
          handleDialogClose={() => {
            setnotificationMessage(null);
          }}
        />
      )}
    </>
  );
}

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.DFA,
  ...state.user,
  ...state.accounts,
}))(withTranslation('common')(PaymentMethodCardView));
