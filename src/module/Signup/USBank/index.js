import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  withStyles,
  Backdrop,
  Tabs,
  Tab,
  Divider,
} from '@material-ui/core';
import WhiteCard from '~/components/WhiteCard';
import { withTranslation } from 'react-i18next';
import AlertMessage from '~/components/AlertMessage';
import config from '~/config';
import styles from './styles';
import ContactInformation from './contactInfo';
import CompanyInformation from './companyInfo';

class USBankSignup extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      alertType: 'info', //info/success/error/loading
      alertMessage: '',
      isVerified: (state && state.isVerified) || false,
      selectedTab: 0,
    };
  }

  handleTabSwitch = (tabValue) => {
    this.setState({
      selectedTab: tabValue,
    });
  };

  handleNotification = (type, message) => {
    this.setState({
      alertType:type,
      alertMessage: message
    })
  }

  renderInfo = () => {
    const { alertType, alertMessage } = this.state;
    switch (alertType) {
      case 'error':
        return (
          <AlertMessage
            alertType='error'
            alertTitleMsg={`WARNING: ${alertMessage}`}
          />
        );
      case 'loading':
        return (
          <Backdrop className={this.props.classes.backdrop} open={true}>
            <CircularProgress color='inherit' />
          </Backdrop>
        );
      default:
        return (
          <Typography variant='body2'>
            {this.props.t('signUp.registerYourself')}
          </Typography>
        );
    }
  };

  render() {
    const { isVerified } = this.state;
    const { classes, t } = this.props;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || '';

    const payeeMesssage = this.renderInfo();

    if (!isVerified) {
      this.props.history.push(`${config.baseName}/${routeParam}/nopagefound`);
    }

    return (
      <Container maxWidth='lg'>
        <Box mt={{ xs: 2, md: 4, lg: 4, xl: 4 }} mb={{ md: 4, lg: 4, xl: 4 }}>
          <WhiteCard
            margin='2rem 0 1rem 0'
            padding='1.5rem 4rem 1.5rem 7rem'
            mobMar='1.5rem 0 1rem 0'
          >
            <Box display='flex' mt={{ xs: 0, lg: 1, xl: 1 }} mb={0}>
              <Typography variant='h1' className={classes.primaryTextColor}>
                {t('signUp.payeeRegistration')}
              </Typography>
            </Box>
            <Box
              display='flex'
              mt={2}
              mb={{ xs: 2, lg: 4, xl: 3 }}
              mr={{ xs: 2, lg: 0, xl: 0 }}
              alignItems='center'
            >
              {payeeMesssage}
            </Box>
            <Box display='flex' mt={{ xs: 0, lg: 1, xl: 1 }} mb={0}>
              <Tabs
                indicatorColor='primary'
                textColor='primary'
                value={this.state.selectedTab}
                // onChange={this.handleTabs}
              >
                <Tab
                  label={this.props.t('signUp.contactInformation')}
                  style={{ paddingLeft: '0px', cursor: 'default' }}
                />
                <Divider
                  orientation='vertical'
                  flexItem
                  style={{
                    marginTop: '16px',
                    marginBottom: '16px',
                    background: '#2B2D30',
                  }}
                />
                <Tab
                  label={this.props.t('signUp.companyInformation')}
                  style={{ cursor: 'default' }}
                />
              </Tabs>
            </Box>
            <Box
              display='flex'
              mt={2}
              mb={{ xs: 2, lg: 4, xl: 3 }}
              mr={{ xs: 2, lg: 0, xl: 0 }}
              alignItems='center'
            >
              {this.props.t('signUp.contactInfoTitle')}
            </Box>
            {/*content starts here*/}
            {this.state.selectedTab === 0 ? (
              <ContactInformation
                handleTabSwitch={this.handleTabSwitch}
                handleNotification={this.handleNotification}
                {...this.props}
              />
            ) : (
              <CompanyInformation
                handleTabSwitch={this.handleTabSwitch}
                handleNotification={this.handleNotification}
                {...this.props}
              />
            )}
          </WhiteCard>
        </Box>
        {/*content ends here*/}
      </Container>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.DFA,
  ...state.paymentRegistration,
}))(compose(withTranslation('common'), withStyles(styles))(USBankSignup));
