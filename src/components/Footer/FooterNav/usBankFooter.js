import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  Box,
  withStyles,
  Link,
  Divider,
  Hidden,
} from '@material-ui/core';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import FAQViewer from '~/components/FAQ/';
import PrivacyPolicyViewer from '~/components/PrivacyPolicy';
import TCViewer from '~/components/TCViewer';
import { getFormattedPhoneNumber } from '~/utils/common';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import USBankLogo from '~/assets/images/usBank_logo.png';

const styles = (theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
    },
  },

  link: {
    fontWeight: '400',
    margin: '0 8px',
    fontSize: '10px',
    color: '#2F80ED',
    [theme.breakpoints.down('sm')]: {
      marginRight: '0px',
      marginLeft: 0,
    },
  },
  copyRight: {
    whiteSpace: 'nowrap',
    lineHeight: '20px',
    textAlign: 'right',
    fontWeight: '400',
    fontSize: '10px',
    color: theme.palette.secondary.main,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  img: {
    verticalAlign: 'middle',
    height: '25px',
    [theme.breakpoints.between('xs', 'sm')]: {
      marginTop: '0',
      justifyContent: 'center',
      maxWidth: '100%',
    },
  },

  fontSizeSmall: {
    fontSize: 18,
    verticalAlign: 'middle',
    paddingRight: 5,
  },
  privacyLink: {
    display: 'inline-Block',
    whiteSpace: 'nowrap',
    fontSize: '10px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
    },
    color: theme.palette.secondary.main,
    paddingRight: '8px',
    cursor: 'pointer',
    borderRight: '1px solid #cccccc',
    marginRight: '8px',
    '&:last-child': {
      paddingRight: '0px',
      borderRight: '0px',
      marginRight: '0px',
    },
  },
  phoneNumber: {
    fontSize: 10,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      justifyContent: 'center',
    },
  },
  phoneNumberIcon: {
    fontSize: 14,
    margin: '0 4px 0 4px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  poweredBy: {
    fontSize: 10,
    display: 'flex',
    alignItems: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      alignItems: 'flex-end',
    },
  },
});

class USBankFooterNav extends Component {
  state = {
    privacyPopup: false,
    privacyPolicyData: null,
    showFAQ: false,
    showPrivacyPolicy: false,
    showTC: false,
  };

  showLink(navItem) {
    return true;
  }

  handleCloseFaq = () => {
    this.setState({ showFAQ: false });
  };

  handleClosePrivacyPolicy = () => {
    this.setState({ showPrivacyPolicy: false });
  };
  handleCloseTC = () => {
    this.setState({ showTC: false });
  };

  openPolicyPopup = () => {
    let { privacyPopup } = this.state;
    this.setState({ privacyPopup: !privacyPopup }, () => {
      if (!privacyPopup) {
        const { user } = this.props;
        //if (user?.brandInfo?.privacyPolicy) {
        this.setState({
          privacyPolicyData: user?.brandInfo?.privacyPolicy ?? '',
        });
        //}
      }
    });
  };

  render() {
    const { classes, t, user } = this.props;
    const { showFAQ, showPrivacyPolicy, showTC } = this.state;

    return (
      <>
        <Box
          display='flex'
          width={'100%'}
          py={{ xs: 0.5, lg: 0 }}
          pt={{ xs: 0.5, lg: 2 }}
        >
          <Box>
            <Typography className={classes.poweredBy}>
              <>
                Powered by U.S. Bank and Corporation. Your payment choice data
                is secured by U.S. Bank.
              </>
            </Typography>
          </Box>
        </Box>
        <Box
          display='flex'
          justifyContent={{
            xs: 'center',
            md: 'space-between',
            lg: 'space-between',
          }}
          flexDirection={{
            xs: 'column',
            sm: 'column',
            md: 'row',
            lg: 'row',
            xl: 'row',
          }}
          flexGrow={1}
          alignItems='center'
          py={{ xs: 0.5, lg: 1 }}
        >
          <Box
            display={{ xs: 'column', md: 'flex', lg: 'flex' }}
            justifyContent={{
              xs: 'center',
              md: 'flex-start',
              lg: 'flex-start',
            }}
            alignItems={{ xs: 'center', md: 'center', lg: 'center' }}
            width={{ xs: '100%', md: 'auto', lg: 'auto' }}
            height={1}
            pt={{ xs: 0.5 }}
          >
            <img src={USBankLogo} alt='US Bank Logo' className={classes.img} />
            <img
              src={user.brandInfo.logo}
              alt='Client Logo'
              className={classes.img}
              style={{ marginLeft: '16px' }}
            />
          </Box>
          <Box
            display={{ xs: 'flex', md: 'flex', lg: 'flex' }}
            justifyContent={{ xs: 'flex-end', md: 'flex-end', lg: 'flex-end' }}
            alignItems={{ xs: 'center', md: 'center', lg: 'center' }}
            width={{ xs: '100%', md: 'auto', lg: 'auto' }}
            height={1}
            pt={{ xs: 0.5 }}
          >
            {user?.brandInfo?.isShowEmail === 1 ? (
              <>
                <Typography noWrap className={classes.phoneNumber}>
                  <Hidden only={['xs', 'sm']}>
                    <EmailIcon className={classes.phoneNumberIcon} />{' '}
                  </Hidden>
                  {user?.brandInfo?.SupportEmail}
                </Typography>
                <Divider
                  style={{ margin: '0 4px' }}
                  orientation='vertical'
                  flexItem
                />
              </>
            ) : null}
            {user?.brandInfo?.showPhoneNumber === 1 ? (
              <>
                <Typography noWrap className={classes.phoneNumber}>
                  <Hidden only={['xs', 'sm']}>
                    <PhoneIcon className={classes.phoneNumberIcon} />
                  </Hidden>
                  {user?.brandInfo?.countryCode || '+1'}
                  {'-'}
                  {getFormattedPhoneNumber(user?.brandInfo?.SupportPhone || '')}
                  <Box pl={1}>
                    {user?.brandInfo?.phoneExt
                      ? `${t('footer.label.phoneExtesion')}`
                      : ''}{' '}
                    {user?.brandInfo?.phoneExt || ''}{' '}
                  </Box>
                </Typography>
                <Divider
                  style={{ margin: '0 4px' }}
                  orientation='vertical'
                  flexItem
                />
              </>
            ) : null}

            <Box
              display={{ xs: 'flex' }}
              mt={{ xs: 0.5, md: '-4px', lg: '-4px' }}
              justifyContent={{ xs: 'center' }}
            >
              <Typography noWrap className={classes.link}>
                <Link
                  component='button'
                  onClick={() => {
                    this.setState({ showTC: true });
                  }}
                  className={classes.link}
                  key={5}
                  rel='noopener'
                >
                  {t('footer.label.TC')}
                </Link>
              </Typography>
              <Divider
                style={{ margin: '0 4px' }}
                orientation='vertical'
                flexItem
              />
              <Typography noWrap className={classes.link}>
                <Link
                  component='button'
                  onClick={() => {
                    this.setState({ showPrivacyPolicy: true });
                  }}
                  className={classes.link}
                  key={5}
                  rel='noopener'
                >
                  {t('footer.label.PrivacyPolicy')}{' '}
                </Link>
              </Typography>
              <Divider
                style={{ margin: '0 4px' }}
                orientation='vertical'
                flexItem
              />
              <Typography noWrap className={classes.link}>
                <Link
                  component='button'
                  onClick={() => {
                    this.setState({ showFAQ: true });
                  }}
                  className={classes.link}
                  key={5}
                  rel='noopener'
                >
                  {t('footer.label.FAQs')}{' '}
                </Link>
              </Typography>
            </Box>
          </Box>
          {showTC && this.showTC(showTC)}
          {showPrivacyPolicy && this.showPrivacyPolicy(showPrivacyPolicy)}
          {showFAQ && this.showFAQ(showFAQ)}
        </Box>
      </>
    );
  }

  showFAQ = (showFAQ) => {
    return (
      <FAQViewer
        open={showFAQ}
        handleClose={this.handleCloseFaq}
        {...this.props}
      />
    );
  };

  showPrivacyPolicy = (showPrivacyPolicy) => {
    return (
      <PrivacyPolicyViewer
        open={showPrivacyPolicy}
        handleClose={this.handleClosePrivacyPolicy}
        {...this.props}
      />
    );
  };
  showTC = (showTC) => {
    return (
      <TCViewer
        open={showTC}
        handleClose={this.handleCloseTC}
        {...this.props}
      />
    );
  };
}

export default connect((state) => ({ ...state.user }))(
  compose(withTranslation('common'), withStyles(styles))(USBankFooterNav)
);
