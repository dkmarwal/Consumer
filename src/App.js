import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  withRouter,
} from 'react-router-dom';
import ThemeWrapperComponent from '~/ThemeWrapperComponent';
import { Box, Backdrop, CircularProgress } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import './App.css';
import ThankYouPage from '~/module/PaymentAuthentication/thankyouPage';
import Header from '~/components/Header';
import Footer from '~/components/Footer';

import {
  userInfo,
  logout,
  keepSessionLive,
  fetchSupportedLanguageList,
  fetchIsPayeeChoicePortal,
} from '~/redux/actions/user';

import { consumerDetails } from '~/redux/actions/DFA';

import Login from '~/views/Login';
import ResetPassword from '~/views/Login/ResetPassword/';
import Dashboard from '~/views/Dashboard';

import ConsumerPaymentRegistration from '~/views/ConsumerPaymentRegistration';
import ConsumerPaymentAuthentication from '~/views/ConsumerPaymentAuthentication';
import config from '~/config';

import UserProfile from './views/UserProfile';
import PayeeVerification from '~/views/PayeeVerification/';
import SignUp from '~/views/SignUp/';
import NoPageFound from '~/module/NoPageFound/';

import { IdleTimeOutModal } from '~/components/Dialogs';
import IdleTimer from 'react-idle-timer';
import favicon from '~/assets/images/favicon.ico';
import usBankFav from '~/assets/images/usbank-favicon.ico';

import { I18nextProvider, withTranslation } from 'react-i18next';
import i18n from './i18n/';
import DFA from '~/views/DFA';
import MFA from '~/views/Login/MFA/';
import { fetchBrandingDetail } from '~/redux/actions/consumerRegistration';
import RegisterUserAlert from '~/module/RegisterUserAlert';
import GuestUserAlert from '~/module/GuestUserAlert';
import SnackbarComponent from '~/components/Snackbar';

class AuthRoute extends Component {
  constructor(props) {
    super(props);
    this.state = { supportContactInfo: null };
  }
  componentDidMount() {
    const { info } = this.props.user;
    if (info && info.portalProfileId) {
      config.willTranslate && i18n.changeLanguage(info.locale || 'en');

      /*this.props
        .dispatch(
          fetchSupportContact({ portalProfileId: info.portalProfileId})
        )
        .then((response) => {
          if (!response) {
            return false;
          }
          const supportContactInfo = this.props.enrollment.supportContactInfo;
          this.setState({
            supportContactInfo: {
              email: supportContactInfo && supportContactInfo.supportEmail,
              phone: supportContactInfo && supportContactInfo.supportPhone,
            },
          });
        });*/
    }

    config.willTranslate && this.getLanguageList();
    this.getConsumerDetails();
  }

  getLanguageList = () => {
    const { info } = this.props.user;
    const appType = (info && info.appType) || 2;
    this.props
      .dispatch(fetchSupportedLanguageList({ appType: appType }))
      .then((response) => {
        if (!response) {
        }
      });
  };

  getConsumerDetails = () => {
    this.props.dispatch(consumerDetails()).then((response) => {
      if (!response) {
        return false;
      }
    });
  };

  render() {
    const {
      component: Component,
      isLoggedIn,
      title,
      hideSideBar,
      user,
      ...rest
    } = this.props;
    const { info, slList } = this.props.user;
    const { supportContactInfo } = this.state;
    const path = window?.location?.pathname ?? '';
    const clientURL = path.split('/')[1];

    return (
      <I18nextProvider i18n={i18n}>
        <Route
          {...rest}
          render={(props) =>
            user?.isLoggedIn ? (
              <Fragment>
                <Header {...props} info={info} slList={slList} />
                <Box
                  bgcolor='background.main'
                  pt={7}
                  minHeight={{
                    xs: 'calc(100vh - 74px)',
                    sm: 'calc(100vh - 74px)',
                    md: 'calc(100vh - 56px)',
                    lg: 'calc(100vh - 56px)',
                  }}
                >
                  <Component {...props} info={info} />
                </Box>
                <Box className={!hideSideBar && `has-sidebar`}>
                  <Footer {...props} supportInfo={supportContactInfo} />
                </Box>
              </Fragment>
            ) : (
              <Redirect to={`${config.baseName}/${clientURL}`} />
            )
          }
        />
      </I18nextProvider>
    );
  }
}

const ProtectedRoutes = connect((state) => ({
  ...state.user,
  ...state.permissions,
  ...state.enrollment,
}))(AuthRoute);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      timeout: config.sessionTimeout - config.showPopupTime - 180000, //less 2 in milli seconds
      isTimedOut: false,
      logout: false,
      showModal: false,
    };
    this.idleTimer = null;
    this.onIdle = this._onIdle.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    this.props.dispatch(fetchIsPayeeChoicePortal());
    if (config.disableContextMenu) {
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });

      document.onkeydown = function (e) {
        // disable F12 key
        if (e.keyCode == 123) {
          return false;
        }

        // disable I key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
          return false;
        }

        // disable J key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
          return false;
        }

        // disable U key
        if (e.ctrlKey && e.keyCode == 85) {
          return false;
        }
      };
    }

    history.listen((newLocation, action) => {
      if (action === 'PUSH') {
        /*if (
          newLocation.pathname !== this.currentPathname ||
          newLocation.search !== this.currentSearch
        ) {
          // Save new location
          this.currentPathname = newLocation.pathname;
          this.currentSearch = newLocation.search;

          // Clone location object and push it to history
          history.push({
            pathname: newLocation.pathname,
            search: newLocation.search
          });
        }*/
        history.push({
          pathname: newLocation.pathname,
          search: newLocation.search,
          state: newLocation.state,
        });
      } else {
        // Send user back if they try to navigate back
        history.go(1);
      }
    });

    config.willTranslate && this.getLanguageList();
    let routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    if (!routeParam && this.props.location.pathname) {
      const pathName = this.props.location.pathname.split('/');
      if (pathName?.length > 1) {
        routeParam = pathName[1];
      }
    }
    if (routeParam) {
      this.props.dispatch(fetchBrandingDetail(routeParam));
    }
    this.props.dispatch(userInfo()).then(() => {
      this.setState({
        isLoading: false,
      });

      //set user selected language
      //const lang = cookies.get(`@consumerLocaleLang_${routeParam}`);
      const lang = sessionStorage.getItem(`@consumerLocaleLang_${routeParam}`);
      const { info } = this.props.user;
      config.willTranslate && i18n.changeLanguage(info.locale || lang || 'en');

      this.checkSession();
      setInterval(() => {
        this.checkSession();
      }, 60000); //Check in every one minutes
    });
  }

  checkSession = () => {
    if (
      !this.state.showModal &&
      this.props.user &&
      this.props.user.isLoggedIn
    ) {
      const tokenExpiryTime = this.props.user.info.exp; //in seconds
      const currentTime = Math.floor(Date.now() / 1000); //convert to seconds
      //console.log("tokenExpiryTime", moment(tokenExpiryTime * 1000).format("DD-MM-YYYY h:mm:ss") );
      //console.log("current time", moment(currentTime * 1000).format("DD-MM-YYYY h:mm:ss") );
      if (
        tokenExpiryTime > currentTime &&
        currentTime >= tokenExpiryTime - 120
      ) {
        //refresh token
        this.updateSession();
      }
    }
  };

  componentDidUpdate() {
    if (!this.props.user.slList) config.willTranslate && this.getLanguageList();
  }

  getLanguageList = () => {
    const { info } = this.props.user;
    const appType = (info && info.appType) || 2;
    this.props
      .dispatch(fetchSupportedLanguageList({ appType: appType }))
      .then((response) => {
        if (!response) {
        }
      });
  };

  _onActive(e) {
    //console.log("On active");
    const totalIdleTime = this.idleTimer && this.idleTimer.getTotalIdleTime();
    //console.log('total idle time', this.idleTimer.getTotalIdleTime());
    if (totalIdleTime >= config.sessionTimeout) {
      if (this.props.user && this.props.user.isLoggedIn) {
        this.idleTimer.reset();
        //this.setState({ logout: true, isTimedOut: true, showModal: false });
        console.log('in _onActive logout');
        //this.props.dispatch(logout());
      } else {
        this.idleTimer.reset();
      }
    } else {
      if (
        !this.state.showModal &&
        this.props.user &&
        this.props.user.isLoggedIn
      ) {
        const tokenExpiryTime = this.props.user.info.exp; //in seconds
        const currentTime = Math.floor(Date.now() / 1000); //convert to seconds

        if (
          tokenExpiryTime > currentTime &&
          currentTime >= tokenExpiryTime - 120
        ) {
          //refresh token
          this.updateSession();
        }
      }
      this.idleTimer.reset();
      this.setState({ isTimedOut: false });
    }
  }

  _onIdle(e) {
    if (this.props.user && this.props.user.isLoggedIn) {
      this.setState({ showModal: true });
      setTimeout(() => {
        if (
          this.state.showModal &&
          this.props.user &&
          this.props.user.isLoggedIn
        ) {
          this.idleTimer.reset();
          this.setState({ logout: true, isTimedOut: true, showModal: false });
          //console.log("in _onIdle logout");
          this.props.dispatch(logout());
        }
      }, config.showPopupTime);
    }
  }

  updateSession = () => {
    try {
      this.props.dispatch(keepSessionLive()).then((response) => {
        //console.log("updateSession keepSessionLive response", response);
        if (!response) {
        }
        this.idleTimer.reset(); //reset timer
      });
    } catch (ex) {
      //this.idleTimer.reset(); //reset timer
    }
  };

  keepUpdateSession = () => {
    try {
      this.props.dispatch(keepSessionLive()).then((response) => {
        //console.log("updateSession keepSessionLive response", response);
        if (!response) {
          this.setState({ showModal: false });
        }
        this.idleTimer.reset(); //reset timer
        this.setState({ showModal: false });
      });
    } catch (ex) {
      //console.log("updateSession logout:Exception keepSessionLive");
      this.setState({ showModal: false });
      this.idleTimer.reset(); //reset timer
    }
  };

  render() {
    const { isLoggedIn, info, slList, brandInfo, error, isPayeeChoicePortal } =
      this.props.user;
    const { isLoading, showModal } = this.state;

    let routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';
    if (!routeParam && this.props.location.pathname) {
      const pathName = this.props.location.pathname.split('/');
      if (pathName?.length > 1) {
        routeParam = pathName[1];
      }
    }

    const { t } = this.props;
    if (isLoading) {
      return null;
    } else if (
      routeParam &&
      (!brandInfo || !Object.keys(brandInfo).length) &&
      !error
    ) {
      return (
        <Backdrop open={true}>
          <CircularProgress color='inherit' />
        </Backdrop>
      );
    }

    return (
      <I18nextProvider i18n={i18n}>
        <div className='App'>
          <ThemeWrapperComponent>
            <BrowserRouter baseName={`${config.baseName}/:clientSlug`}>
              <Helmet>
                <title>
                  {isPayeeChoicePortal ? t('app.USBank') : t('app.Citibank')}
                </title>
                <meta
                  name='title'
                  content={`Consumer | ${
                    isPayeeChoicePortal ? t('app.USBank') : t('app.Citibank')
                  }`}
                />
                <meta
                  name='description'
                  content={
                    isPayeeChoicePortal ? t('app.USBank') : t('app.Citibank')
                  }
                />
                <meta
                  name='keywords'
                  content={
                    isPayeeChoicePortal ? t('app.USBank') : t('app.Citibank')
                  }
                />
                <link
                  rel='shortcut icon'
                  type='image/x-icon'
                  href={isPayeeChoicePortal ? usBankFav : favicon}
                  sizes='16x16'
                  data-react-helmet='true'
                />
              </Helmet>
              <IdleTimer
                ref={(ref) => {
                  this.idleTimer = ref;
                }}
                startOnMount={true}
                element={document}
                onIdle={this.onIdle}
                debounce={250}
                timeout={this.state.timeout}
              />
              <React.Fragment>
                <I18nextProvider i18n={i18n}>
                  <Switch>
                    <Route
                      exact
                      path={`${config.baseName}/:clientSlug`}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header {...props} info={info} slList={slList} />
                            <Login {...props} forgotPasswordView={false} />
                          </Box>
                        </Fragment>
                      )}
                    />
                    <Route
                      exact
                      path={`${config.baseName}/:clientSlug/forgot-password`}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header {...props} info={info} slList={slList} />
                            <Login {...props} forgotPasswordView={true} />
                          </Box>
                        </Fragment>
                      )}
                    />

                    <Route
                      exact
                      path={`${config.baseName}/:clientSlug/recover-username`}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header {...props} info={info} slList={slList} />
                            <Login {...props} recoverUsernameView={true} />
                          </Box>
                        </Fragment>
                      )}
                    />
                    <Route
                      exact
                      path={`${config.baseName}/:clientSlug/reset-password`}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header {...props} info={info} slList={slList} />
                            <ResetPassword {...props} />
                          </Box>
                        </Fragment>
                      )}
                    />
                    <Route
                      exact
                      path={`${config.baseName}/:clientSlug/mfa`}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header {...props} info={info} slList={slList} />
                            <MFA {...props} />
                          </Box>
                        </Fragment>
                      )}
                    />
                    <Route
                      exact
                      path={`${config.baseName}/:clientSlug/dfa`}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header {...props} info={info} slList={slList} />
                            <DFA {...props} />
                          </Box>
                        </Fragment>
                      )}
                    />

                    {/* <ProtectedRoutes
                      isLoggedIn={isLoggedIn}
                      path={`${config.baseName}/:clientSlug/dfa`}
                      component={DFA}
                      title={t("app.Home")}
                    />*/}
                    <ProtectedRoutes
                      isLoggedIn={isLoggedIn}
                      path={`${config.baseName}/:clientSlug/dashboard`}
                      component={Dashboard}
                      title={t('app.Home')}
                      hideSideBar={true}
                    />
                    <ProtectedRoutes
                      isLoggedIn={isLoggedIn}
                      path={`${config.baseName}/:clientSlug/myprofile`}
                      component={UserProfile}
                      title={t('app.Profile')}
                      hideSideBar={true}
                    />
                    <Route
                      isLoggedIn={isLoggedIn}
                      path={`${config.baseName}/:clientSlug/consumerverification/:token`}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header {...props} info={info} slList={slList} />
                            <PayeeVerification {...props} />
                          </Box>
                        </Fragment>
                      )}
                    />
                    <Route
                      exact
                      isLoggedIn={isLoggedIn}
                      path={`${config.baseName}/:clientSlug/signup`}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header
                              {...props}
                              info={info}
                              slList={slList}
                              hideGuestUser={true}
                            />
                            <SignUp {...props} />
                          </Box>
                        </Fragment>
                      )}
                    />
                    <Route
                      isLoggedIn={isLoggedIn}
                      path={`${config.baseName}/:clientSlug/paymentRegistration`}
                      component={ConsumerPaymentRegistration}
                    />
                    <Route
                      isLoggedIn={isLoggedIn}
                      path={`${config.baseName}/:clientSlug/paymentAuth/:token`}
                      component={ConsumerPaymentAuthentication}
                    />
                    <Route
                      isLoggedIn={isLoggedIn}
                      path={`${config.baseName}/:clientSlug/paymentAuthComplete`}
                      component={ThankYouPage}
                    />
                    <Route
                      exact
                      path={`${config.baseName}/:clientSlug/registereduseralert`}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header
                              {...props}
                              info={info}
                              slList={slList}
                              hideUserDetails={true}
                            />
                            <RegisterUserAlert {...props} />

                            <Footer {...props} />
                          </Box>
                        </Fragment>
                      )}
                    />

                    <Route
                      exact
                      path={`${config.baseName}/:clientSlug/guestuseralert`}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header
                              {...props}
                              info={info}
                              slList={slList}
                              hideUserDetails={true}
                            />
                            <GuestUserAlert {...props} />

                            <Footer {...props} />
                          </Box>
                        </Fragment>
                      )}
                    />

                    <Route
                      isLoggedIn={isLoggedIn}
                      path={`${config.baseName}/:clientSlug/nopagefound`}
                      //component={NoPageFound}
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header
                              {...props}
                              info={info}
                              slList={slList}
                              hideGuestUser={true}
                              disableBranding={true}
                            />
                            <NoPageFound {...props} />
                          </Box>
                        </Fragment>
                      )}
                    />

                    <Route
                      render={(props) => (
                        <Fragment>
                          <Box>
                            <Header
                              {...props}
                              info={info}
                              slList={slList}
                              disableBranding={true}
                              hideGuestUser={true}
                            />
                            <NoPageFound {...props} />
                          </Box>
                        </Fragment>
                      )}
                    />
                  </Switch>
                </I18nextProvider>
              </React.Fragment>
            </BrowserRouter>
          </ThemeWrapperComponent>
          {showModal &&
            this.renderAlertMessage(
              t('app.You Have Been Idle!'),
              t('app.You will get sign out Do you want to stay signin?'),
              showModal
            )}
          <SnackbarComponent />
        </div>
      </I18nextProvider>
    );
  }

  renderAlertMessage = (title, message, showModal) => {
    return (
      <IdleTimeOutModal
        open={showModal}
        title={title}
        message={message}
        onConfirm={() => this.keepUpdateSession()}
      />
    );
  };
}

const ShowTheLocationWithRouter = withTranslation('common')(withRouter(App));
export default connect((state) => ({
  ...state.user,
  ...state.permissions,
  ...state.DFA,
}))(ShowTheLocationWithRouter);
