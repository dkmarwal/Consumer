import React from 'react';
import { styles } from './styles';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import {
  Button,
  Dialog,
  CircularProgress,
  Backdrop,
  IconButton,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
  Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { getMXWidgetUrl, getMXAccounts } from '~/redux/helpers/USBank/payments';
import { withTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';

const InstantBanking = (props) => {
  const { t, classes, handleNotification, user, handleInstantBanking } = props;
  const { brandInfo } = user;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(false);
  const [showWidget, setShowWidget] = React.useState(false);
  const [showCircularProgress, setShowCircularProgress] = React.useState(false);
  const [showAccountList, setShowAccountsList] = React.useState(false);
  const [mxAccountsData, setMxAccountsData] = React.useState(null);
  const [bankIcon, setBankIcon] = React.useState(null);
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  let payloadData = null;

  const getAccountDetails = () => {
    if (payloadData?.user_guid) {
      getMXAccounts(
        payloadData.user_guid,
        payloadData.member_guid,
        brandInfo?.clientId
      )
        .then((res) => {
          setShowCircularProgress(false);
          if (res) {
            if (!res.error) {
              setMxAccountsData(res);
              handleShowAccountsList(res);
            } else {
              handleNotification(res.message, 'error');
            }
          }
        })
        .catch((error) => {
          setShowCircularProgress(false);
        });
    }
  };

  const handleShowAccountsList = (mxAccountData) => {
    const bankIcon = mxAccountData?.data?.accounts?.[0]?.InstitutionUrl;
    setBankIcon(bankIcon);
    if (mxAccountData?.data?.accounts?.length > 1) {
      setShowAccountsList(true);
    } else {
      handleInstantBanking(mxAccountData?.data?.accounts?.[0]);
    }
  };

  const getMXWidgetUrlData = () => {
    setShowLoader(true);
    getMXWidgetUrl()
      .then((res) => {
        if (!res.error) {
          const connectURL = res.data.widget_url.url;
          if (connectURL) {
            setShowWidget(true);
            setOpenDialog(true);
            setShowLoader(false);
            let mxConnect = new window.MXConnect({
              id: 'widget',
              iframeTitle: 'Connect',
              onEvent: function (type, payload) {
                if (type === 'mx/connect/memberConnected') {
                  if (!mxAccountsData) {
                    payloadData = payload;
                  }
                }
                if (type === 'mx/connect/connected/primaryAction') {
                  getAccountDetails();
                  setShowWidget(false);
                  setShowCircularProgress(true);
                }
              },
              onLoad: function (event) {
                console.log('onLoad', event);
              },
              config: { ui_message_version: 4 },
              targetOrigin: '*',
            });
            mxConnect.load(connectURL);
          } else {
            setShowLoader(false);
            handleNotification(t('updatedAccounts.message.somethingWentWrong'), 'error');
          }
        } else {
          setShowLoader(false);
          handleNotification(t('updatedAccounts.message.invalidReq'), 'error');
        }
      })
      .catch((err) => {
        setShowLoader(false);
        console.log('error', err);
      });
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    payloadData = null;
    setSelectedAccount(null);
    if (showAccountList) {
      setShowAccountsList(false);
    }
  };

  const handleAccountSelection = ({ target }) => {
    setSelectedAccount(target.value);
  };

  const renderAccountsList = () => {
    return (
      <>
        <RadioGroup value={selectedAccount} onChange={handleAccountSelection}>
          {mxAccountsData?.data?.accounts?.map((item) => {
            return (
              <FormControlLabel
                key={item.AccountGuid}
                value={item.AccountGuid}
                control={<Radio />}
                label={`${item.Type} (${item.AccountNumberMasked})`}
              />
            );
          })}
        </RadioGroup>
      </>
    );
  };

  const getAccountData = () => {
    const selectedData = mxAccountsData?.data?.accounts?.filter((item) => {
      return item.AccountGuid === selectedAccount;
    });
    if (selectedData?.length) {
      handleInstantBanking(selectedData[0]);
      setOpenDialog(false);
    }
  };

  const handleSaveData = () => {
    if (!selectedAccount) {
      handleNotification(t('updatedAccounts.selectAnAccount'), 'error');
    } else {
      getAccountData();
    }
  };
  return (
    <>
      <Button
        variant='contained'
        id='openConnect'
        color='primary'
        onClick={() => {
          getMXWidgetUrlData();
        }}
        className={classes.connectionButton}
      >
        {t('paymentRegistration.button.loginBank')}
      </Button>
      {showLoader ? (
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress />
        </Backdrop>
      ) : (
        <Dialog
          open={openDialog}
          fullWidth
          className={clsx(
            classes.dialogMX,
            showCircularProgress && classes.dialogMXLoading
          )}
        >
          <DialogTitle
            disableTypography
            classes={{
              root: showAccountList
                ? classes.dialogTitleAccountList
                : classes.dialogTitleRoot,
            }}
          >
            {showAccountList ? (
              <>
                <img src={bankIcon} alt='Bank_Logo' width={60} />
                <Typography
                  variant='h3'
                  style={{ margin: '0px 16px' }}
                >{`${t('updatedAccounts.shareAccount')} ${brandInfo.clientName}`}</Typography>
              </>
            ) : (
              <></>
            )}
            <IconButton
              color='inherit'
              onClick={handleDialogClose}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            classes={{
              root: showCircularProgress
                ? classes.dialogContentRoot
                : showAccountList && classes.dialogContentAccountList,
            }}
          >
            {showWidget && <div id='widget'></div>}
            {showCircularProgress ? (
              <CircularProgress
                disableShrink
                className={classes.circularProgressClass}
              />
            ) : (
              showAccountList && renderAccountsList()
            )}
          </DialogContent>
          {showAccountList && (
            <DialogActions className={classes.dialogActionsButton}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleSaveData}
                disabled={!selectedAccount}
              >
                {t('updatedAccounts.buttonLabel.continue')}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      )}
    </>
  );
};

export default connect((state) => ({
  ...state.paymentRegistration,
  ...state.payment,
  ...state.paymentAuthentication,
  ...state.accounts,
  ...state.user,
}))(compose(withTranslation('common'), withStyles(styles))(InstantBanking));
