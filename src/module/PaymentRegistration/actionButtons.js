import React from 'react';
import { styles } from './styles';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import config from '~/config';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import {updateFetchConsumerPaymentTypesList} from '~/redux/actions/paymentRegistration'

const ActionButtons = (props) => {
  const { classes, location, match, t } = props;
  const routeParam = (match && match.params && match.params.clientSlug) || '';
  const routeToSignupScreen = () => {
    props.dispatch(updateFetchConsumerPaymentTypesList(null));
    props.history.push({
      pathname: `${config.baseName}/${routeParam}/signup`,
      state: {
        ...location.state,
      },
    });
  };
  return (
    <>
      {location?.state?.isVerified && (
        <Grid container className={classes.actionButtonCont}>
          <Grid item className={classes.buttonGridItems}>
            <Button
              className={classes.backButton}
              variant="outlined"
              color="primary"
              onClick={routeToSignupScreen}
            >
              {t('paymentRegistration.button.back')}
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default compose(
  withTranslation('common'),
  withStyles(styles)
)(ActionButtons);
