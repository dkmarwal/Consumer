import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Divider,
  Button,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import Notification from '~/components/Notification';
import { compose } from 'redux';
import RadioButtonChecked from '~/assets/icons/radio_button_checked.svg';
import { fetchRoutingCodes } from '~/redux/actions/payments';
import RadioButtonUnchecked from '~/assets/icons/radio_button_unchecked.svg';
import RoutingCodeSearchResults from './routingCodeResult';
import { getCitiesOfStateByISO } from '~/redux/actions/csc';
import { StatesIso } from '~/components/CSC';

const styles = (theme) => ({
  searchBankCol: {
    padding: "0px 72px",
    [theme.breakpoints.down('sm')]: { padding: '16px 0px 0px 0px', }
  },
  searchBankTitle: {
    color: theme.palette.text.dark,
    fontSize: '22px',
  },
  routingLabel: {
    color: theme.palette.text.light,
    fontSize: '1rem',
  },
  routingNumberTextField: {
    width: '100%',
    marginTop: theme.spacing(2),
    '& .MuiFormLabel-root.Mui-disabled': {
      color: `${theme.palette.text.disabledDark}!important`,
    },
    '& .MuiFormLabel-root.Mui-error': {
      color: '#f44336 !important',
    },
  },
  routingNumberTextFieldMob: {
    marginTop: '0px',
    [theme.breakpoints.down('sm')]: { marginTop: '-16px', }
  },
  autoCompleteOption: {
    color: '#000000',
    fontSize: '1rem',
  },
  dividerLine: {
    border: '1px dashed #9E9E9E',
  },
  orText: {
    textAlign: 'center',
    color:theme.palette.text.light,
  },
  textFieldItem: {
    width: '100%',
  },
});

class RoutingCodeSearch extends Component {
  state = {
    routingSearchMode: 1,
    routingSearchVal: null,
    page: 0,
    rowsPerPage: 5,
    isLoading: false,
    routingCodeResults: false,
    bankName: null,
    bankState: null,
    bankCity: null,
    cityList: [],
    error: {
      routingSearchVal: false,
      bankName: false,
      bankState: false,
      bankCity: false,
    },
    alertMessage:null,
    alertType:null
  };

  handleRoutingSearchMode = ({ target }) => {
    const { value } = target;
    if (parseInt(value) === 1) {
      this.setState({
        bankName: null,
        bankState: null,
        bankCity: null,
        routingSearchMode: parseInt(value),
        error: {},
      });
    } else {
      this.setState({
        routingSearchVal: null,
        routingSearchMode: parseInt(value),
        error: {},
      });
    }
  };

  handleRoutingCodeChange = ({ target }) => {
    const { value } = target;
    if (!isNaN(value)) {
      this.setState({
        routingSearchVal: value,
      });
    }
  };

  handleBankChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'bankState') {
      this.setState({
        isLoading: true,
      });
      this.props.dispatch(getCitiesOfStateByISO(value)).then((res) => {
        if (res) {
          const { csc } = this.props;
          this.setState({ cityList: csc && csc['cityList'], isLoading: false });
        }
      });
      this.setState({
        bankCity: null,
      });
    }
    this.setState({
      [name]: value,
    });
  };

  handlePageChange = (event, page) => {
    this.setState(
      {
        page,
      },
      () => this.handleRoutingCodeSearch()
    );
  };

  handleRoutingCodeSearch = () => {
    const { routingSearchVal, page, rowsPerPage, bankCity, bankName, bankState } =
      this.state;
    this.setState(
      {
        isLoading: true,
        routingCodeResults: true,
      },
      () => {
        this.props
          .dispatch(
            fetchRoutingCodes({
              routingCode: routingSearchVal ?? '',
              page,
              rowsPerPage,
              bankName: bankName?.trim() ?? undefined,
              bankCity: bankCity?.name ?? '',
              bankState:bankState??""
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: 'error',
                alertMessage: this.props.payment.error,
                isLoading: false,
              });
              return false;
            }
            this.setState({
              isLoading: false,
            });
          });
      }
    );
  };

  handleValidation = () => {
    const {
      routingSearchMode,
      bankName,
      routingSearchVal,
      bankCity,
      bankState,
    } = this.state;
    const { t } = this.props;
    let error = {},
      isValid = true;
    if (routingSearchMode === 1) {
      if (!routingSearchVal || isNaN(routingSearchVal)) {
        error.routingSearchVal = t('routingCodeResults.error.routingNumber');
        isValid = false;
      }
    } else {
      if (!bankName || !bankName?.trim().length) {
        error.bankName = t('routingCodeResults.error.bankName');
        isValid = false;
      }
      if (!bankState || !bankState?.trim().length) {
        error.bankState = t('routingCodeResults.error.bankState');
        isValid = false;
      }
      if (!bankCity || !bankCity?.name?.trim().length) {
        error.bankCity = t('routingCodeResults.error.bankCity');
        isValid = false;
      } else if (bankCity?.name?.trim().length > 30) {
        error.bankCity = t('routingCodeResults.error.bankCityLength');
        isValid = false;
      }
    }
    this.setState({
      error,
    });
    return isValid;
  };

  handleSearch = () => {
    const isValid = this.handleValidation();
    if (isValid) {
      this.handleRoutingCodeSearch();
    }
  };

  closeRoutingCodeResult = () => {
    this.setState({
      routingCodeResults: false,
      page: 0,
    });
  };

  render() {
    const { classes, onClose, t } = this.props;
    const {
      routingSearchMode,
      routingSearchVal,
      routingCodeResults,
      isLoading,
      page,
      rowsPerPage,
      bankName,
      bankState,
      bankCity,
      cityList,
      error,
      alertMessage,
      alertType
    } = this.state;
    return (
      <>
        {!routingCodeResults ? (
          <Box
            display="flex"
            width={1}
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            className={classes.searchBankCol}
          >
            <Grid item>
              <Typography className={classes.searchBankTitle}>
                {t('routingCodeResults.heading.searchBank')}
              </Typography>
            </Grid>
            <Grid item>
              <RadioGroup
                name="routingSearchMode"
                value={routingSearchMode}
                onChange={this.handleRoutingSearchMode}
              >
                <FormControlLabel
                  value={1}
                  control={
                    <Radio
                      checkedIcon={
                        <img src={RadioButtonChecked} alt="CheckedIcon" />
                      }
                      icon={
                        <img src={RadioButtonUnchecked} alt="UncheckedIcon" />
                      }
                    />
                  }
                  classes={{ label: classes.routingLabel }}
                  label={t('routingCodeResults.heading.byRoutingNumber')}
                />
              </RadioGroup>
            </Grid>
            <Grid item className={classes.textFieldItem}>
              <TextField
                className={classes.routingNumberTextField}
                label={t('routingCodeResults.label.routingNumber')}
                required
                value={routingSearchVal ?? ''}
                disabled={routingSearchMode === 2}
                variant="outlined"
                name="routingCode"
                color="secondary"
                onChange={(e) => this.handleRoutingCodeChange(e)}
                error={Boolean(error.routingSearchVal)}
                helperText={error.routingSearchVal}
                inputProps={{
                  maxLength: 9,
                  autoComplete: 'new-password',
                }}
              />
            </Grid>
            <Grid
              container
              xs={12}
              lg={12}
              item
              display="flex"
              alignItems="center"
              style={{ margin: '24px 0px 12px 0px' }}
            >
              <Grid item xs={5} lg={5}>
                <Divider className={classes.dividerLine} />
              </Grid>
              <Grid item xs={2} lg={2} className={classes.orText}>
                {t('routingCodeResults.label.or')}
              </Grid>
              <Grid item xs={5} lg={5}>
                <Divider className={classes.dividerLine} />
              </Grid>
            </Grid>
            <Grid item>
              <RadioGroup
                name="routingSearchMode"
                value={routingSearchMode}
                onChange={this.handleRoutingSearchMode}
              >
                <FormControlLabel
                  value={2}
                  control={
                    <Radio
                      checkedIcon={
                        <img src={RadioButtonChecked} alt="CheckedIcon" />
                      }
                      icon={
                        <img src={RadioButtonUnchecked} alt="UncheckedIcon" />
                      }
                    />
                  }
                  classes={{ label: classes.routingLabel }}
                  label={t('routingCodeResults.heading.byBankName')}
                />
              </RadioGroup>
            </Grid>
            <Grid item className={classes.textFieldItem}>
              <TextField
                className={classes.routingNumberTextField}
                label={t('routingCodeResults.label.bankName')}
                required
                value={bankName ?? ''}
                variant="outlined"
                name="bankName"
                color="secondary"
                disabled={routingSearchMode === 1}
                onChange={(e) => this.handleBankChange(e)}
                error={Boolean(error.bankName)}
                helperText={error.bankName}
                inputProps={{
                  maxLength: 50,
                  autoComplete: 'new-password',
                }}
              />
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={12} lg={6}>
                <StatesIso
                  name="bankState"
                  label={t('routingCodeResults.label.bankState')}
                  error={Boolean(error.bankState)}
                  helperText={error.bankState}
                  selectedState={bankState ?? ''}
                  selectedCountry={'US'}
                  onChange={(e) => this.handleBankChange(e)}
                  disabled={routingSearchMode === 1}
                  required
                  className={classes.routingNumberTextField}
                />
              </Grid>
              <Grid item xs={12} lg={6} className={classes.routingNumberTextFieldMob}>
                <Autocomplete
                  closeIcon={null}
                  classes={{
                    option: classes.autoCompleteOption,
                  }}
                  popupIcon={null}
                  options={cityList ?? []}
                  loading={isLoading}
                  getOptionLabel={(option) => option?.name ?? ''}
                  onChange={(e, value) => {
                    this.setState({
                      bankCity: value,
                    });
                  }}
                  disabled={routingSearchMode === 1}
                  value={bankCity ?? ''}
                  noOptionsText={t('routingCodeResults.text.noOptions')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                        maxLength: 30,
                      }}
                      label={t('routingCodeResults.label.bankCity')}
                      variant="outlined"
                      name="bankCity"
                      color="secondary"
                      error={Boolean(error.bankCity)}
                      helperText={error.bankCity}
                      required
                      className={classes.routingNumberTextField}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid
              container spacing={2}
              style={{ marginBottom: '0px', marginTop: '16px' }}
              justifyContent="center"
            >
              <Grid item xs={5} sm={4} md={4} lg={5}>
                <Button
                  variant="outlined"
                  onClick={() => onClose()}
                  color="primary"
                  fullWidth
                >
                  {t('routingCodeResults.button.cancel')}
                </Button>
              </Grid>
              <Grid item xs={5} sm={4} md={4} lg={5}>
                <Button
                  variant="contained"
                  onClick={() => this.handleSearch()}
                  color="primary"
                  fullWidth
                >
                  {t('routingCodeResults.button.search')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <RoutingCodeSearchResults
            isLoading={isLoading}
            page={page}
            rowsPerPage={rowsPerPage}
            handlePageChange={this.handlePageChange}
            onSelectBank={this.props.onSelectBank}
            closeRoutingCodeResult={this.closeRoutingCodeResult}
            onClose={onClose}
          />
        )}
        {alertMessage && alertMessage.length > 0 && (
        <Notification
          variant={alertType}
          message={alertMessage}
          handleClose={() => {
            this.setState({
              alertMessage:null,
              alertType:null
            })
          }}
        />
      )}
      </>
    );
  }
}
export default connect((state) => ({ ...state.payment, ...state.csc }))(
  compose(withTranslation('common'), withStyles(styles))(RoutingCodeSearch)
);
