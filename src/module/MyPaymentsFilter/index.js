import React from "react";
import {
  Typography,
  Grid,
  Box,
  Button,
  InputAdornment,
  Chip,
  TextField,
} from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import DatePicker, {registerLocale} from "react-datepicker";
import { getFormattedDate } from "~/module/utils";
import moment from "moment";
import CurrencyInput from "~/components/CurrencyInput";
import en from "date-fns/locale/es";
import fr from "date-fns/locale/es";
import es from "date-fns/locale/es";
registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("es", es);

class PaymentFileFilters extends React.Component {
  state = {
    dateRangeError: false,
    invalidDateError: false,
    dateEmptyMark: null,
    maxAmountError: false,
  };

  handleDateValidation = (fromDate, toDate) => {
    if (
      fromDate &&
      toDate &&
      this.isValidDate(fromDate) &&
      this.isValidDate(toDate)
    ) {
      if (getFormattedDate(fromDate) > getFormattedDate(toDate)) {
        return true;
      } else {
        return false;
      }
    }
  };

  isDateEmpty = (fromDate, toDate) => {
    if ((fromDate && toDate) || (!fromDate && !toDate)) {
      return true;
    } else {
      return false;
    }
  };

  isDateEmptyMark = (fromDate, toDate) => {
    if (!fromDate && toDate) {
      return true;
    }
    if (fromDate && !toDate) {
      return false;
    }
  };

  isValidDate = (dateString) => {
    const date = dateString ? moment(dateString).format("MM/DD/YYYY") : "";
    let valid = true;
    // First check for the pattern
    if (date && !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) {
      valid = false;
    }

    return valid;
  };

  handleSubmit = () => {
    const { startDate, endDate, applyFilter, minMaxAmount, t } = this.props;
    const { MinAmount, MaxAmount } = minMaxAmount;
    const isValid = this.handleDateValidation(startDate, endDate);
    const isValidDates =
      this.isValidDate(startDate) && this.isValidDate(endDate);
    const dateEmpty = this.isDateEmpty(startDate, endDate);
    let dateEmptyMark = null;
    if (!dateEmpty) {
      dateEmptyMark = this.isDateEmptyMark(startDate, endDate);
    }
    let dateError = false;
    if (parseFloat(MaxAmount) === 0) {
      this.setState({
        maxAmountError: t("myPaymentFilter.error.maxAmountInvalid"),
      });
      dateError = true;
    } else if (MinAmount && MaxAmount) {
      if (parseFloat(MinAmount) > parseFloat(MaxAmount)) {
        this.setState({
          maxAmountError: t("myPaymentFilter.error.maxAmtErr"),
        });
        dateError = true;
      }
    }
    if (!dateError) {
      this.setState({
        maxAmountError: null,
      });
    }
    this.setState(
      {
        dateRangeError: isValid,
        invalidDateError: !isValidDates,
        dateEmptyMark: dateEmptyMark,
      },
      () => {
        if (
          !this.state.dateRangeError &&
          !this.state.invalidDateError &&
          dateEmptyMark === null &&
          !dateError
        ) {
          applyFilter();
        }
      }
    );
  };

  resetFilter = () => {
    this.setState(
      {
        dateRangeError: false,
        invalidDateError: false,
        dateEmptyMark: null,
        maxAmountError: false,
      },
      () => {
        this.props.resetFilter();
      }
    );
  };

  render() {
    const {
      paymentTypeList,
      checkedStatus,
      checkedPayment,
      startDate,
      endDate,
      handleStartDateChange,
      handleEndDateChange,
      handleCheckedStatus,
      handleCheckedPayment,
      t,
      classes,
      statusItem,
      minMaxAmount,
      handleAmountChange,
    } = this.props;
    const { dateRangeError, maxAmountError } = this.state;
    const { MinAmount, MaxAmount } = minMaxAmount;

    return (
      <>
        <Grid container>
          <Box xs={12} sm={12} md xl lg mb={3}>
            <Typography variant="h4" className={classes.filterText}>
              {t("myPaymentFilter.label.byDate")}
            </Typography>
          </Box>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="top"
            spacing={2}
          >
            <Grid
              container
              xs={6}
              sm={6}
              md
              lg
              style={{ paddingLeft: "0.5rem" }}
            >
              <DatePicker
                width="100%"
                id="starDate"
                selected={startDate}
                onChange={handleStartDateChange}
                name="startDate"
                placeholderText={t("myPaymentFilter.label.StartDate")}
                dateFormat="MM/dd/yyyy"
                className={classes.datePicker}
                locale={this.props.i18n.language}
                customInput={
                  <TextField
                    variant="outlined"
                    className="full-width"
                    color="secondary"
                    error={
                      !this.isValidDate(startDate) ||
                      this.state.dateEmptyMark === true
                    }
                    helperText={
                      !this.isValidDate(startDate)
                        ? t("myPaymentFilter.error.validDate")
                        : this.state.dateEmptyMark === true
                        ? t("myPaymentFilter.error.startDate")
                        : null
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" style={{marginLeft: '3px'}}>
                          <EventIcon
                            fontSize="small"
                            style={{ cursor: "pointer" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                }
              />
            </Grid>

            <Grid container xs={6} sm={6} md lg xl>
              <DatePicker
                popperPlacement="bottom-end"
                selected={endDate}
                onChange={handleEndDateChange}
                name="endDate"
                placeholderText={t("myPaymentFilter.label.EndDate")}
                dateFormat="MM/dd/yyyy"
                className={classes.datePicker}
                locale={this.props.i18n.language}
                customInput={
                  <TextField
                    variant="outlined"
                    className="full-width"
                    color="secondary"
                    error={
                      !this.isValidDate(endDate) ||
                      dateRangeError ||
                      this.state.dateEmptyMark === false
                    }
                    helperText={
                      !this.isValidDate(endDate) || dateRangeError
                        ? dateRangeError
                          ? t("myPaymentFilter.error.rangeDate")
                          : t("myPaymentFilter.error.validDate")
                        : this.state.dateEmptyMark === false
                        ? t("myPaymentFilter.error.endDate")
                        : null
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" style={{marginLeft: '3px'}}>
                          <EventIcon
                            fontSize="small"
                            style={{ cursor: "pointer" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Box mt={4} mb={3}>
          <hr />
        </Box>

        <Grid container>
          <Box xs={12} sm={12} md xl lg mb={3}>
            <Typography variant="h4" className={classes.filterText}>
              {t("myPaymentFilter.label.byAmount")}
            </Typography>
          </Box>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="top"
            spacing={2}
          >
            <Grid item xs={6} sm={6} md lg xl>
              <CurrencyInput
                fullWidth={true}
                className={classes.amountTextField}
                placeholder={t("myPaymentFilter.label.minAmount")}
                color="secondary"
                variant="outlined"
                value={MinAmount ?? null}
                name="MinAmount"
                onChange={(e) => handleAmountChange(e)}
                inputProps={{ maxLength: 11 }}
              />
            </Grid>
            <Grid item xs={6} sm={6} md lg xl>
              <CurrencyInput
                fullWidth={true}
                className={classes.amountTextField}
                placeholder={t("myPaymentFilter.label.maxAmount")}
                color="secondary"
                variant="outlined"
                value={MaxAmount ?? null}
                name="MaxAmount"
                onChange={handleAmountChange}
                inputProps={{ maxLength: 11 }}
                error={Boolean(maxAmountError)}
                helperText={maxAmountError}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box my={3}>
          <hr />
        </Box>
        {statusItem?.length ? (
          <>
            <Grid container>
              <Box xs={12} sm={12} md xl lg mb={3}>
                <Typography variant="h4" className={classes.filterText}>
                  {t("myPaymentFilter.label.byStatus")}
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {statusItem?.map((item) => {
                  return (
                    <Grid item key={item.StatusID}>
                      <Chip
                        color={
                          !checkedStatus?.includes(item.StatusID)
                            ? "default"
                            : "secondary"
                        }
                        label={item.Description}
                        onClick={() => handleCheckedStatus(item.StatusID)}
                        value={item.StatusID}
                        className={classes.filterChips}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Box my={3}>
              <hr />
            </Box>
          </>
        ) : null}
        {paymentTypeList?.length ? (
          <>
            <Grid container>
              <Box xs={12} sm={12} md xl lg mb={3}>
                <Typography variant="h4" className={classes.filterText}>
                  {t("myPaymentFilter.label.byPaymentMethod")}
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {paymentTypeList?.map((paymentTypeItem) => (
                  <Grid item>
                    <Chip
                      id={paymentTypeItem.paymentTypeId}
                      key={paymentTypeItem.paymentTypeId}
                      value={paymentTypeItem.paymentTypeId}
                      label={paymentTypeItem.description}
                      onClick={() =>
                        handleCheckedPayment(paymentTypeItem.paymentTypeId)
                      }
                      color={
                        !checkedPayment?.includes(paymentTypeItem.paymentTypeId)
                          ? "default"
                          : "secondary"
                      }
                      className={classes.filterChips}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Box my={3}>
              <hr />
            </Box>
          </>
        ) : null}
        <Grid container justifyContent="center">
          <Grid
            container
            item
            justifyContent="center"
            spacing={2}
            style={{marginBottom:'8px'}}
          >
            <Grid item xs={6} sm={6} md={6} lg={5} xl={4}>
              <Button
                type="submit"
                variant="outlined"
                onClick={this.resetFilter}
                fullWidth
              >
                {t("myPaymentFilter.label.resetFilter")}
              </Button>
            </Grid>
            <Grid item xs={5} sm={5} md={5} lg={5} xl={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
                fullWidth
              >
                {t("myPaymentFilter.label.applyFilter")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default compose(
  withTranslation("common"),
  withStyles(styles)
)(PaymentFileFilters);
