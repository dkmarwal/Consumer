import React from 'react';
import { withTranslation } from 'react-i18next';
import { Chip, makeStyles, Typography, Box } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { getFormattedDate, getFormattedCurrency } from '~/utils/common';

const useStyles = makeStyles((theme) => ({
  appliedFilterText: {
    color: '#828282',
    fontSize: '0.875rem',
    alignItems: 'center',
    display: 'flex',
    marginBottom: theme.spacing(1.5),
  },
  borderClass: {
    borderBottom: '0.5px solid #828282',
    paddingBottom: theme.spacing(0),
    paddingTop: theme.spacing(1.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1.5),
    backgroundColor: '#ffffff',
    flexWrap: 'wrap',
  },
  closeIcon: {
    color: theme.palette.common.black,
    width: '16px',
  },
  filterChips: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
    '& .MuiChip-label': {
      color: theme.palette.text.light,
      fontSize: '0.875rem',
      lineHeight: '16px',
    },
  },
  clearAllText: {
    color: '#008CE6',
    fontSize: '0.875rem',
    paddingLeft: theme.spacing(1.75),
    alignItems: 'center',
    display: 'flex',
    marginBottom: theme.spacing(1.5),
    cursor: 'pointer',
  },
}));

const AppliedFilter = (props) => {
  const {
    statusItem,
    paymentTypeList,
    resetFilter,
    handleCheckedPayment,
    handleCheckedStatus,
    handleStartDateChange,
    handleEndDateChange,
    setMinMaxAmount,
    applyChipsFilter,
    payeePaymentFilters,
    t,
  } = props;
  const { FromDate, ToDate, MinAmount, MaxAmount, paymentTypeIDs, statusIDs } =
    payeePaymentFilters;
  const classes = useStyles();
  const handleAmountChange = () => {
    setMinMaxAmount({
      MinAmount: null,
      MaxAmount: null,
    });
    applyChipsFilter({
      ...payeePaymentFilters,
      MinAmount: null,
      MaxAmount: null,
    });
  };
  const updatedPaymentList = paymentTypeIDs?.length ? [...paymentTypeIDs?.split(",").map(Number)] : [] ;
  const updatedStatusList = statusIDs?.length ? [...statusIDs?.split(",").map(Number)] : [];
  return (
    <Box className={classes.borderClass} display="flex" width={1}>
      <Typography className={classes.appliedFilterText}>
        {t('paymentDetail.appliedFiltersLabel.filters')}
      </Typography>
      {FromDate && ToDate && (
        <Chip
          onDelete={() => {
            handleEndDateChange(null);
            handleStartDateChange(null);
            applyChipsFilter({
              ...payeePaymentFilters,
              FromDate: null,
              ToDate: null,
            });
          }}
          className={classes.filterChips}
          label={`${getFormattedDate(FromDate)} - ${getFormattedDate(ToDate)}`}
          deleteIcon={
            <CloseIcon fontSize="small" className={classes.closeIcon} />
          }
        />
      )}
      {MinAmount && MaxAmount ? (
        <Chip
          onDelete={() => handleAmountChange()}
          className={classes.filterChips}
          label={`${getFormattedCurrency(MinAmount)} - ${getFormattedCurrency(
            MaxAmount
          )}`}
          deleteIcon={
            <CloseIcon fontSize="small" className={classes.closeIcon} />
          }
        />
      ) : MinAmount ? (
        <Chip
          onDelete={() => handleAmountChange()}
          className={classes.filterChips}
          label={`> ${getFormattedCurrency(MinAmount)}`}
          deleteIcon={
            <CloseIcon fontSize="small" className={classes.closeIcon} />
          }
        />
      ) : MaxAmount ? (
        <Chip
          onDelete={() => handleAmountChange()}
          className={classes.filterChips}
          label={`< ${getFormattedCurrency(MaxAmount)}`}
          deleteIcon={
            <CloseIcon fontSize="small" className={classes.closeIcon} />
          }
        />
      ) : null}
      {updatedStatusList?.length
        ? statusItem?.map((status) => {
            if (updatedStatusList.includes(status.StatusID)) {
              return (
                <Chip
                  onDelete={() => {
                    applyChipsFilter({
                      ...payeePaymentFilters,
                      statusIDs:
                      updatedStatusList?.length === 1
                          ? null
                          : updatedStatusList
                              .filter((item) => item !== status.StatusID)
                              .join(),
                    });
                    handleCheckedStatus(status.StatusID);
                  }}
                  className={classes.filterChips}
                  label={status.Description}
                  deleteIcon={
                    <CloseIcon fontSize="small" className={classes.closeIcon} />
                  }
                />
              );
            }
            return null;
          })
        : null}
      {paymentTypeIDs?.length
        ? paymentTypeList?.map((paymentType) => {
            if (updatedPaymentList.includes(paymentType.paymentTypeId)) {
              return (
                <Chip
                  onDelete={() => {
                    applyChipsFilter({
                      ...payeePaymentFilters,
                      paymentTypeIDs:
                      updatedPaymentList?.length === 1
                          ? null
                          : updatedPaymentList
                              .filter(
                                (item) => item !== paymentType.paymentTypeId
                              )
                              .join(),
                    });
                    handleCheckedPayment(paymentType.paymentTypeId);
                  }}
                  className={classes.filterChips}
                  label={paymentType.description}
                  deleteIcon={
                    <CloseIcon fontSize="small" className={classes.closeIcon} />
                  }
                />
              );
            }
            return null;
          })
        : null}
      <Typography
        className={classes.clearAllText}
        onClick={() => resetFilter()}
      >
        {t('paymentDetail.appliedFiltersLabel.clearAll')}
      </Typography>
    </Box>
  );
};

export default withTranslation('common')(AppliedFilter);
