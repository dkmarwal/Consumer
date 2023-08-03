import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Button,
  Box,
  IconButton,
} from '@material-ui/core';
import ExpandIcon from '~/assets/icons/arrow_down.svg';
import StarIcon from '@material-ui/icons/Star';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import ACH_Consumer from '~/assets/icons/paymentMethods/ACH_dashboard.svg';
import ACH_Active from '~/assets/icons/paymentMethods/ACH_Active.svg';
import CXC_Consumer from '~/assets/icons/paymentMethods/Zelle_dashboard.svg';
import ZEL_Consumer from '~/assets/icons/paymentMethods/Zelle_dashboard.svg';
import CXC_Active from '~/assets/icons/paymentMethods/Zelle_Active.svg';
import PPL_Active from '~/assets/icons/paymentMethods/PayPal_Active.svg';
import PPL_Consumer from '~/assets/icons/paymentMethods/PayPal_dashboard.svg';
import MSC_Consumer from '~/assets/icons/paymentMethods/PushToCard_dashboard.svg';
import MSC_Active from '~/assets/icons/paymentMethods/PushToCard_Active.svg';
import CHK_Consumer from '~/assets/icons/paymentMethods/Check_dashboard.svg';
import CHK_Active from '~/assets/icons/paymentMethods/Check_Active.svg';
import DDC_Consumer from '~/assets/icons/paymentMethods/DDC_Active.svg';
import RTP_Consumer from '~/assets/icons/paymentMethods/RTP_Active.svg';
import AlternatePMDialog from '~/module/UpdateAccounts/AlternatePMDialog';
import UpdateAccounts from '~/module/UpdateAccounts';
import { consumerStatus } from '~/config/entityTypes';
import SuccessDialog from '~/components/Dialogs/successDialog';
import StepDoneIcon from '~/assets/icons/Step_Done_main.svg';
import EditIcon from '~/assets/icons/edit.svg';
import { fetchConsumerPaymentTypesList } from '~/redux/actions/paymentRegistration';
import { USBankPaymentMethodIds } from '~/config/paymentMethods';

const customStyle = makeStyles((theme) => ({
  summaryHeading: {
    color: theme.palette.text.dark,
    fontSize: '1rem',
    margin: '0 4px',
  },
  ptSpace: {
    wordBreak: 'break-all',
    marginTop: -theme.spacing(2),
  },
  cardContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
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
  methodNameClass: {
    color: theme.palette.text.dark,
    paddingTop: theme.spacing(1),
  },
  accordionSummary: {
    padding: '0 8px',
    '& .MuiAccordionSummary-content': {
      alignItems: 'center',
    },
  },
  accordion: {
    boxShadow: 'none',
    borderRadius: '10px !important',
  },
}));

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
};

const paymentModeActiveIcons = {
  ACH_Active,
  CXC_Active,
  PPL_Active,
  MSC_Active,
  CHK_Active,
  // PFB_Active,
  // PRC_Active,
};

function PaymentMethodAccordionView(props) {
  const customClasses = customStyle();
  const {
    details,
    editType,
    type,
    t,
    loadData,
    methodName,
    handleExpansion,
    expansionState,
    user,
    accounts,
  } = props;
  const { isPayeeChoicePortal } = user;
  const [openDialog, setOpenDialog] = useState(false);
  const [notificationMessage, setnotificationMessage] = useState(null);
  const primaryPaymentMethodId =
    accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId;
  const consumerStatusId = props.DFA?.hasPymentTaken?.consumerStatusId || 0;

  const openPaymentMethodsDialog = () => {
    props.dispatch(fetchConsumerPaymentTypesList());
    setOpenDialog(true);
  };

  const closePaymentMethodsDialog = () => {
    setOpenDialog(false);
  };

  const renderCardView = () => {
    return (
      <Grid container spacing={2} className={customClasses.ptSpace}>
        {type && (
          <Grid container style={{ marginBottom: '16px' }}>
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
              width={149}
              height={90}
              mr={1}
            >
              <Box>
                <img
                  //src={paymentModeActiveIcons[`${type}_Active`]}
                  src={
                    isPayeeChoicePortal
                      ? usbankPaymentModeIcons[`${type}_Consumer`]
                      : paymentModeActiveIcons[`${type}_Consumer`]
                  }
                  height={40}
                  alt={`${type}_Consumer`}
                />
              </Box>

              <Typography className={customClasses.methodNameClass}>
                {methodName}
              </Typography>
            </Box>
          </Grid>
        )}
        {details?.map((item) => {
          return (
            <>
              <Grid
                container
                className={customClasses.cardContainer}
                direction='row'
                xs={type === 'CXC' || type === 'ZEL' ? 12 : 6}
                sm={type === 'CXC' || type === 'ZEL' ? 12 : 6}
                lg={type === 'CXC' || type === 'ZEL' ? 12 : 6}
              >
                <Grid item xs={12} lg={11}>
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
        })}
        {isPayeeChoicePortal &&
          (primaryPaymentMethodId === USBankPaymentMethodIds.ACH ||
            primaryPaymentMethodId === USBankPaymentMethodIds.RTP) && (
            <Grid item xs={12} lg={11}>
              <Typography style={{ fontWeight: 'bold' }} color='textSecondary'>
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
    );
  };

  const renderAddAlternateCardView = () => {
    return (
      <Grid container spacing={2}>
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

  return (
    <>
      <Accordion
        className={customClasses.accordion}
        expanded={expansionState[editType]}
        onChange={() => handleExpansion(editType)}
      >
        <AccordionSummary
          className={customClasses.accordionSummary}
          expandIcon={<img src={ExpandIcon} alt='Expand' />}
        >
          <Box display='flex'>
            {type && editType && !expansionState[editType] && (
              <img
                src={
                  isPayeeChoicePortal
                    ? usbankPaymentModeIcons[`${type}_Consumer`]
                    : paymentModeIcons[`${type}_Consumer`]
                }
                height={20}
                alt={`${type}_Consumer`}
                style={{ paddingRight: '4px' }}
              />
            )}
            {editType ? (
              editType === 'primary' ? (
                <>
                  <StarIcon fontSize='small' />
                  <Typography className={customClasses.summaryHeading}>
                    {t('dashboard.heading.preferredMethod')}
                  </Typography>
                </>
              ) : (
                <>
                  <StarHalfIcon fontSize='small' />
                  <Typography className={customClasses.summaryHeading}>
                    {t('dashboard.heading.alternateMethod')}
                  </Typography>
                </>
              )
            ) : null}
            {editType &&
              expansionState[editType] &&
              type &&
              consumerStatusId !== consumerStatus.REVOKED && (
                <Box display='flex' justifyContent='flex-end' ml={1}>
                  <IconButton
                    size='small'
                    onClick={(event) => {
                      event.stopPropagation();
                      openPaymentMethodsDialog();
                    }}
                  >
                    <img src={EditIcon} alt='Edit' />
                  </IconButton>
                </Box>
              )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {!type && editType === 'secondary'
            ? renderAddAlternateCardView()
            : renderCardView()}
        </AccordionDetails>
      </Accordion>
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
}))(withTranslation('common')(PaymentMethodAccordionView));
