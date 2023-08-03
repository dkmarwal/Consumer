import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  Button,
  Grow,
  Popper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Grid,
  Container,
  Paper,
  Box,
  Divider,
  Avatar,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import config from '~/config';
import { logout, updateLanguage } from '~/redux/actions/user';
import { fetchBrandingDetail } from '~/redux/actions/consumerRegistration';
import styles from './styles';
import PersonIcon from '@material-ui/icons/Person';
import Popover from '@material-ui/core/Popover';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { localeLanguageConst } from '~/config/entityTypes';
import { selectedPaymentType } from '~/redux/actions/paymentRegistration';
import ConfirmationDialog from '~/components/Dialogs/confirmationDialog';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      langMenuOpen: false,
      anchorEl: null,
      langAnchorEl: null,
      dialogActive: false,
      title: '',
      message: '',
      openConfirmationDialog: false,
    };
  }

  componentDidMount() {
    if (
      !this.props.disableBranding &&
      !Object.keys(this.props.user?.brandInfo).length
    ) {
      this.fetchBrandingDetails();
    }
  }

  fetchBrandingDetails = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    if (routeParam) {
      this.props.dispatch(fetchBrandingDetail(routeParam)).then((response) => {
        if (!response) {
          return false;
        }
      });
    }
  };

  handleToggle = (event) => {
    this.setState({
      menuOpen: !this.state.menuOpen,
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      menuOpen: false,
      anchorEl: null,
    });
  };

  handleLangToggle = (event) => {
    this.setState({
      langMenuOpen: !this.state.langMenuOpen,
      langAnchorEl: event.currentTarget,
    });
  };

  handleLangClose = () => {
    this.setState({
      langMenuOpen: false,
      langAnchorEl: null,
    });
  };

  handleLanguageChange = (event, langCode) => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    const { isLoggedIn } = this.props.user;
    if (isLoggedIn) {
      this.setState(
        {
          langMenuOpen: false,
        },
        () => {
          //API call to change user selected language
          this.props
            .dispatch(updateLanguage({ locale: langCode }))
            .then((response) => {
              if (!response) {
                return false;
              }
              this.props.i18n.changeLanguage(langCode);
              /*cookies.set(`@consumerLocaleLang_${routeParam}`, this.props.i18n.language, {
                path: `${config.baseName}/`,
              });*/
              sessionStorage.setItem(
                `@consumerLocaleLang_${routeParam}`,
                this.props.i18n.language
              );
              this.setState({
                langMenuOpen: false,
              });
              window.location.reload();
            });
        }
      );
    } else {
      this.props.i18n.changeLanguage(langCode);
      /*
      cookies.set(`@consumerLocaleLang_${routeParam}`, this.props.i18n.language, {
        path: `${config.baseName}/`,
      });
      */
      sessionStorage.setItem(
        `@consumerLocaleLang_${routeParam}`,
        this.props.i18n.language
      );
      this.setState({
        langMenuOpen: false,
      });
      window.location.reload();
    }
  };

  handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.setState({
        langMenuOpen: false,
      });
    }
  };

  validateDDC = () => {
    const { selectedPaymentTypeCode } = this.props.paymentRegistration;
    if (
      selectedPaymentTypeCode === 'DDC' &&
      this.props.paymentRegistration['depositToDebitCardInfoData']?.error?.data
        ?.retryCount &&
      this.props.paymentRegistration['depositToDebitCardInfoData'].error.data
        .retryCount >= 3
    ) {
      return true;
    }
    return false;
  };

  handleCloseDialogue = () => {
    this.handleLogout();
  };

  handleConfirmation = () => {
    this.props.dispatch(selectedPaymentType(null));
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    this.props.history.push({
      pathname: `${config.baseName}/${routeParam}/paymentRegistration`,
      state: {
        ...this.props?.location?.state,
        retryCount:
          this.props.paymentRegistration['depositToDebitCardInfoData'].error
            .data.retryCount,
      },
    });
    this.setState({
      openConfirmationDialog: false,
      menuOpen: false,
      anchorEl: null,
    });
  };

  handleLogout = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    const { isSSO } = this.props?.user?.info;

    this.props.dispatch(logout(isSSO)).then(() => {
      this.props.history.push(`${config.baseName}/${routeParam}`);
    });
  };

  logout = () => {
    const isDDC = this.validateDDC();
    if (isDDC) {
      this.setState({
        openConfirmationDialog: true,
      });
    } else {
      this.handleLogout();
    }
  };

  render() {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    const {
      menuOpen,
      anchorEl,
      langAnchorEl,
      langMenuOpen,
      openConfirmationDialog,
    } = this.state;
    const {
      classes,
      user,
      t,
      location,
      hideGuestUser = true,
      hideUserDetails = false,
    } = this.props;
    const { info, brandInfo, isPayeeChoicePortal } = user;
    const clientLogo = brandInfo.logo || null;

    return (
      <Fragment>
        <Paper square className={classes.headerContainer}>
          <Container maxWidth='1'>
            <Grid
              item
              container
              justifyContent='space-between'
              className={classes.nowrap}
            >
              <Box className={classes.logoContainer}>
                {clientLogo && (
                  <Box className={classes.citiLogo}>
                    <Box display='flex' justifyContent='center'>
                      <img
                        src={clientLogo}
                        alt=''
                        className={classes.clientLogo || ''}
                        height='45'
                      />{' '}
                    </Box>
                  </Box>
                )}
                {clientLogo && (
                  <Box
                    mx={{ lg: 1, xl: 1 }}
                    px={{ xs: 1, lg: 1, xl: 2 }}
                    height={{ xs: '1.8rem', lg: '1.9rem', xl: '2rem' }}
                  >
                    <Divider
                      orientation='vertical'
                      className={classes.headerDivider}
                    />
                  </Box>
                )}
                <Box className={classes.headerSmText}>
                  {/* {t('title')} */}
                  {isPayeeChoicePortal
                    ? brandInfo.clientName
                    : t('header.label.paymentExchange')}
                </Box>
              </Box>
              <Box className={classes.rightNavContainer}>
                {config.willTranslate && (
                  <Box className={classes.rightNavIconContainer}>
                    <Button
                      ref={langAnchorEl}
                      aria-controls={
                        langMenuOpen ? 'menu-list-grow' : undefined
                      }
                      aria-haspopup='true'
                      variant='text'
                      onClick={this.handleLangToggle}
                    >
                      <Box
                        display={{
                          xs: 'block',
                          sm: 'block',
                          md: 'none',
                          lg: 'none',
                          xl: 'none',
                        }}
                      >
                        {this.props.i18n.language &&
                          this.props.i18n.language.toUpperCase()}
                      </Box>

                      <Box
                        display={{
                          xs: 'none',
                          sm: 'none',
                          md: 'block',
                          lg: 'block',
                          xl: 'block',
                        }}
                      >
                        {this.props.i18n.language &&
                          localeLanguageConst[this.props.i18n.language]}
                      </Box>

                      <ArrowDropDownIcon />
                    </Button>
                    <Popper
                      open={langMenuOpen}
                      anchorEl={langAnchorEl}
                      role={undefined}
                      transition
                      disablePortal
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin:
                              placement === 'bottom'
                                ? 'center top'
                                : 'center bottom',
                          }}
                        >
                          <Paper>
                            <ClickAwayListener
                              onClickAway={this.handleLangClose}
                            >
                              <MenuList
                                autoFocusItem={langMenuOpen}
                                id='menu-list-grow'
                                onKeyDown={this.handleListKeyDown}
                              >
                                {user.slList &&
                                  user.slList.map((lang, index) => (
                                    <MenuItem
                                      value={lang.code}
                                      onClick={(event) =>
                                        this.handleLanguageChange(
                                          event,
                                          lang.code
                                        )
                                      }
                                    >
                                      {`${
                                        lang.description
                                      } (${lang.code.toUpperCase()})`}
                                    </MenuItem>
                                  ))}
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </Box>
                )}
                {!hideUserDetails ? (
                  user.isLoggedIn ? (
                    <>
                      <Box className={classes.rightNavIconContainer}>
                        {/*<Notifications />*/}
                      </Box>
                      <Box className={classes.rightNavDropdownContainer}>
                        <div className='LeftNav'>
                          <div className={classes.headerMenuList}>
                            <Button
                              underline='none'
                              size='small'
                              aria-controls='header-menu'
                              aria-haspopup='menu'
                              onClick={(event) => this.handleToggle(event)}
                            >
                              <span
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <span className={classes.userIconBg}>
                                  {' '}
                                  <PersonIcon fontSize='medium' />
                                </span>
                                <Box
                                  component='span'
                                  color='#4c4c4c'
                                  display={{ xs: 'none', lg: 'block' }}
                                >
                                  {info && info.displayName}

                                  <ArrowDropDownIcon
                                    style={{ color: '#4c4c4c' }}
                                  />
                                </Box>
                              </span>
                            </Button>

                            <Popover
                              className={classes.headerMenu}
                              anchorEl={anchorEl}
                              keepMounted
                              open={menuOpen}
                              onClose={() => this.handleClose()}
                            >
                              <Box
                                pt={2}
                                px={info?.isSSO ? 2 : 1}
                                pb={info?.isSSO && 2}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                }}
                              >
                                <Avatar
                                  alt='user pic'
                                  src='/static/images/avatar/1.jpg'
                                  className={classes.large}
                                >
                                  {info &&
                                    info.displayName &&
                                    info.displayName
                                      .match(/(\b\S)?/g)
                                      .join('')
                                      .match(/(^\S|\S$)?/g)
                                      .join('')
                                      .toUpperCase()}
                                </Avatar>
                                <Box pt={2}>
                                  <span className={classes.profileHeading}>
                                    {info && info.displayName}
                                  </span>
                                </Box>
                                <Box>
                                  <span className={classes.profileEmail}>
                                    {info && info.email}
                                  </span>
                                </Box>
                                {info?.isSSO ? null : (
                                  <>
                                    <Box
                                      mt={0.5}
                                      width='36px'
                                      height='1.5px'
                                      style={{ backgroundColor: '#999999' }}
                                    ></Box>
                                    <Box mt={2} mb={1}>
                                      <MenuItem
                                        onClick={() => {
                                          this.handleClose();
                                          this.props.history.push(
                                            `${config.baseName}/${routeParam}/myprofile`
                                          );
                                        }}
                                      >
                                        <span className={classes.profileManage}>
                                          {t('header.label.manageYourAccount')}
                                        </span>
                                      </MenuItem>
                                    </Box>
                                  </>
                                )}
                              </Box>

                              <Divider />
                              <MenuItem
                                onClick={() => {
                                  this.logout();
                                }}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                {t('header.label.logout')}
                              </MenuItem>
                            </Popover>
                          </div>
                        </div>
                      </Box>
                    </>
                  ) : hideGuestUser ? null : location?.state?.isVerified ? (
                    <Typography className={classes.ownerGreetingText}>
                      {t('header.label.hiGuestUser')}
                    </Typography>
                  ) : null
                ) : null}
              </Box>
            </Grid>
          </Container>
        </Paper>
        <ConfirmationDialog
          handleClose={() => {
            this.handleCloseDialogue();
          }}
          open={openConfirmationDialog}
          dialogContentText={t(
            'paymentRegistration.depositToDebit.message.logoutConfirmationText'
          )}
          cancelButtonName={t('paymentRegistration.button.NO')}
          confrimationButtonName={t('paymentRegistration.button.YES')}
          handleConfirmation={() => this.handleConfirmation()}
        />
      </Fragment>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.paymentRegistration,
}))(compose(withTranslation('common'), withStyles(styles))(Header));
