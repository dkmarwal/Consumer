import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  makeStyles,
  Grid,
  Paper,
  Button,
  withStyles,
  Hidden,
} from '@material-ui/core';
import DetailView from '~/components/DetailView';
import Filter from '~/assets/icons/filter.svg';
import FilterApplied from '~/assets/icons/filter_applied.svg';
import {
  getPayeePaymentTransactions,
  getPaymentTypelist,
} from '~/redux/helpers/clientPaymentTransactions';
import PaymentDetails from '~/module/PaymentDetails';
import USBankPaymentDetails from '~/module/PaymentDetails/USBank';
import { connect } from 'react-redux';
import PaymentTable from '~/module/PaymentTable';
import USBankPaymentTable from '~/module/PaymentTable/USBank'
import { CustomSideDialog } from '~/components/Dialogs';
import 'react-datepicker/dist/react-datepicker.css';
import { styles } from './styles';
import './styles.css';
import PDFDownload from '~/components/PDFDownload';
import generatePDF from '~/module/GeneratePDF/';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import PaymentFileFilters from '~/module/MyPaymentsFilter';
import {
  fetchConsumerPaymentDetails,
  fetchStatusId,
  getPayeePaymentFilters,
} from '~/redux/actions/accounts';
import Notification from '~/components/Notification';
import AppliedFilter from './appliedFilter';
import { getFormattedDate } from '~/utils/common';

const customStyle = makeStyles((theme) => ({
  toolBox: {
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: '8px',
    borderRadius: '4px 4px 0px 0px',
  },
  toolLabel: {
    color: '#071B58',
    fontFamily: 'Interstate',
    fontSize: 12,
    marginLeft: '10px',
  },
  filterCard: {
    display: 'flex',
    flexDirection: 'row',
    padding: '10px 0px',
    flexWrap: 'wrap',
  },
  borderClass: {
    borderBottom: '0.5px solid #828282',
  },
}));

let FromDate = new Date();
FromDate.setDate(new Date().getDate());
const SupplierPayment = ({
  user,
  classes,
  t,
  accounts,
  paymentsRender,
  ...props
}) => {
  const customClasses = customStyle();
  const [paymentTypeList, setPaymentTypeList] = useState([]);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentIdDetail, setPaymentIdDetail] = useState({
    paymentId: '',
    clientId: '',
    paymentPriority: '',
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [notificationVariant, setnotificationVariant] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [paymentData, setPaymentData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [checkedStatus, setCheckedStatus] = useState([]);
  const [checkedPayment, setCheckedPayment] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [minMaxAmount, setMinMaxAmount] = useState({
    MinAmount: null,
    MaxAmount: null,
  });
  const [isFilterApplied, setIsFilterApplied] = React.useState(false);
  const { dispatch } = props;

  useEffect(() => {
    if (paymentsRender) {
      dispatch(fetchConsumerPaymentDetails());
      fetchClientPaymentList();
      dispatch(fetchStatusId());
      getPaymentTypelist().then((response) => {
        if (response && !response.error && response.data) {
          setPaymentTypeList(response.data);
        }
      });
    }
  }, [paymentsRender]);

  // useEffect(() => {
  //   if (resetFilters && isFilterApplied) {
  //     applyFilter();
  //   }
  // }, [resetFilters]);

  const checkIsFilterApplied = (filterParams) => {
    const {
      FromDate,
      ToDate,
      MinAmount,
      MaxAmount,
      paymentTypeIDs,
      statusIDs,
    } = filterParams;
    if (
      paymentTypeIDs?.length ||
      FromDate ||
      ToDate ||
      statusIDs?.length ||
      MinAmount ||
      MaxAmount
    ) {
      setIsFilterApplied(true);
    } else setIsFilterApplied(false);
  };

  const getPayeePayments = async (filterParams) => {
    dispatch(getPayeePaymentFilters(filterParams)).then((response) => {
      checkIsFilterApplied(filterParams);
    });
    setIsLoading(true);
    const response = await getPayeePaymentTransactions(filterParams);
    if (response && response.data) {
      const { data, error, message } = response.data;
      if (error) {
        setnotificationVariant('error');
        setNotificationMessage(
          message ? message : t('app.reduxData.errorOccured')
        );
        setIsLoading(false);
        return false;
      }
      if (data && data.lstPaymentDetailsByPayeeId) {
        const newPaymentRecord = data.lstPaymentDetailsByPayeeId.map((data) => {
          const {
            PaymentID,
            ReturnStatusID,
            PaymentStatus,
            PaymentStatusInfo,
            PaymentPriority,
            PaymentTypeID,
            ClientID,
            ClientName,
            CreatedAt,
            PaymentNotes,
            CurrencyCode,
            StatusColor,
            Amount,
            ValueDate,
            PaymentType,
            PaymentRef,
            PaymentTypeDesc,
          } = data;
          return {
            PaymentID,
            ReturnStatusID,
            PaymentTypeID,
            PaymentStatus,
            PaymentStatusInfo,
            PaymentPriority,
            ClientID,
            ClientName,
            CreatedAt,
            PaymentNotes,
            CurrencyCode,
            StatusColor,
            Amount,
            ValueDate,
            PaymentType,
            PaymentRef,
            PaymentTypeDesc,
            showPaymentDetails: false,
          };
        });

        setPaymentData(newPaymentRecord);
        setTotalRecords(data.TotalRecords);
      }
    }
    setIsLoading(false);
  };

  const fetchClientPaymentList = (r = page, currentPage = rowsPerPage) => {
    const params = {
      // Client_PaymentID: paymentIDSearch,
      paymentTypeIDs: checkedPayment.join(','),
      FromDate: getFormattedDate(startDate),
      ToDate: getFormattedDate(endDate),
      rowCount: currentPage,
      pageNumber: r + 1,
      // AmountFilterBy: "=",
      MinAmount: minMaxAmount.MinAmount ? Number(minMaxAmount.MinAmount) : null,
      MaxAmount: minMaxAmount.MaxAmount ? Number(minMaxAmount.MaxAmount) : null,
      payeeID: user.info.portalProfileId,
      statusIDs: checkedStatus.join(','),
    };
    getPayeePayments(params);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
    fetchClientPaymentList(newPage);
  };

  const handleAmountChange = ({ target }) => {
    const { name, value } = target;
    setMinMaxAmount({
      ...minMaxAmount,
      [name]: value,
    });
  };
  const onClickPaymentTrxs = (paymentId, clientId, paymentPriority) => {
    setPaymentIdDetail({
      paymentId,
      clientId,
      paymentPriority,
    });
    setShowPaymentDetails(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    fetchClientPaymentList(0, +event.target.value);
  };

  const resetMoreFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setPage(0);
    setCheckedStatus([]);
    setCheckedPayment([]);
    setMinMaxAmount({
      MinAmount: '',
      MaxAmount: '',
    });
    setIsFilterApplied(false);
    if (isFilterApplied) {
      getPayeePayments({
        paymentTypeIDs: '',
        FromDate: null,
        ToDate: null,
        MinAmount: null,
        MaxAmount: null,
        statusIDs: '',
        rowCount: rowsPerPage,
        pageNumber: 1,
        payeeID: user.info.portalProfileId,
      });
    }
  };

  const resetLastAppliedFilter = () => {
    const {
      FromDate,
      ToDate,
      MinAmount,
      MaxAmount,
      paymentTypeIDs,
      statusIDs,
    } = accounts.payeePaymentFilters;
    setStartDate(FromDate ? new Date(FromDate) : null);
    setEndDate(ToDate ? new Date(ToDate) : null);
    setMinMaxAmount({
      MinAmount: MinAmount,
      MaxAmount: MaxAmount,
    });
    setCheckedStatus(statusIDs?.length ? statusIDs.split(',').map(Number) : []);
    setCheckedPayment(
      paymentTypeIDs?.length ? paymentTypeIDs.split(',').map(Number) : []
    );
  };

  const applyFilter = () => {
    setPage(0);
    fetchClientPaymentList(0);
  };

  const applyChipsFilter = (filterParams) => {
    setPage(0);
    getPayeePayments({
      ...filterParams,
      payeeID: user.info.portalProfileId,
      rowCount: rowsPerPage,
      pageNumber: 1,
    });
    dispatch(getPayeePaymentFilters(filterParams));
  };

  const handleDownloadPDF = async () => {
    if (paymentData.length > 0) {
      const tableColumn = [
        t('paymentDetail.tableColumn.Payment Reference'),
        t('paymentDetail.tableColumn.Payer Name'),
        t('paymentDetail.tableColumn.Payment Date'),
        t('paymentDetail.tableColumn.Payment Method'),
        t('paymentDetail.tableColumn.Payment Amount'),
        t('paymentDetail.tableColumn.Status'),
      ];
      // define an empty array of rows
      const tableRows = [];
      // for each account pass all its data into an array
      paymentData.forEach((field) => {
        const data = [
          field.PaymentRef,
          field.ClientName,
          field.ValueDate,
          field.PaymentTypeDesc,
          '$' + field.Amount,
          field.PaymentStatus,
        ];
        //push each data info into a row
        tableRows.push(data);
      });
      const title = t('paymentDetail.tableColumn.Payment List');
      const date = Date().split(' ');
      // we use a date string to generate our filename.
      const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
      // const fileName = `payment_list_${dateStr}.pdf`;
      const fileName = t('paymentDetail.fileName', { dateStr: dateStr });
      generatePDF(title, fileName, tableColumn, tableRows);
    } else {
      setNotificationMessage(
        t('paymentDetail.alert.No Data available to Download')
      );
      setnotificationVariant('error');
    }
  };

  const resetNotification = () => {
    setNotificationMessage('');
    setnotificationVariant('');
  };

  const renderSnackbar = () => {
    return (
      <Notification
        variant={notificationVariant}
        message={notificationMessage}
        handleClose={resetNotification}
      />
    );
  };

  const handleCheckedPayment = (paymentTypeId) => {
    if (!checkedPayment?.includes(paymentTypeId)) {
      setCheckedPayment([...checkedPayment, paymentTypeId]);
    } else {
      let updatedCheckState = checkedPayment?.filter(
        (item) => item !== paymentTypeId
      );
      setCheckedPayment(updatedCheckState);
    }
  };

  const handleCheckedStatus = (statusId) => {
    if (!checkedStatus?.includes(statusId)) {
      setCheckedStatus([...checkedStatus, statusId]);
    } else {
      let updatedCheckState = checkedStatus?.filter(
        (item) => item !== statusId
      );
      setCheckedStatus(updatedCheckState);
    }
  };
  
  return (
    <Box
      my={{ xs: 2, lg: 1 }}
      width={1}
      style={{
        borderRadius: '10px',
        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.14)',
      }}
    >
      <Grid container>
        <Grid item xs={12} lg={12}>
          <Box
            className={customClasses.borderClass}
            px={{ xs: 1, lg: 0 }}
            py={{ xs: 1, lg: 1 }}
            display='flex'
            width={1}
            alignItems='center'
            justifyContent='space-between'
            style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
          >
            <Box
              pl={{ xs: 0, lg: 2 }}
              fontSize={{ xs: '14px', lg: '18px' }}
              fontWeight='700'
              component='Typography'
              variant='h2'
            >
              {t('paymentDetail.heading')}
            </Box>

            <Box display='inline-flex' alignItems='center' pr={{ xs: 0 }}>
              {paymentData && paymentData.length > 0 && (
                <>
                  <Box px={{ xs: 0, lg: 1 }} display='flex'>
                    <PDFDownload
                      fontSize={12}
                      onClick={() => handleDownloadPDF()}
                      btnName='PDF'
                      color='#2B2D30'
                    />
                  </Box>

                  <Box
                    borderLeft='1px solid #828282'
                    pl={{ xs: 0.3, sm: 0.5, md: 1, lg: 1 }}
                    height='20px'
                  ></Box>
                </>
              )}
              <Button onClick={() => setShowFilter(true)} size='small'>
                {isFilterApplied ? (
                  <img
                    src={FilterApplied}
                    alt='Filter'
                    width={20}
                    height={20}
                  />
                ) : (
                  <img src={Filter} alt='Filter' />
                )}
                <span
                  className={customClasses.toolLabel}
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    paddingRight: '8px',
                    color: '#2B2D30',
                  }}
                >
                  {t('paymentDetail.filters')}
                </span>
              </Button>
            </Box>
          </Box>
        </Grid>
        {/* visible only in Desktop View */}
        <Hidden only={['xs', 'sm', 'md']}>
          {isFilterApplied && (
            <Grid item xs={12} lg={12}>
              <AppliedFilter
                statusItem={accounts.statusIdList?.data}
                paymentTypeList={paymentTypeList}
                resetFilter={resetMoreFilter}
                handleCheckedStatus={handleCheckedStatus}
                handleCheckedPayment={handleCheckedPayment}
                setMinMaxAmount={setMinMaxAmount}
                handleStartDateChange={(date) => setStartDate(date)}
                handleEndDateChange={(date) => setEndDate(date)}
                applyChipsFilter={applyChipsFilter}
                payeePaymentFilters={accounts.payeePaymentFilters}
              />
            </Grid>
          )}
        </Hidden>
        <Grid
          item
          xs={12}
          component={Paper}
          square
          elevation={0}
          style={{
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
          }}
        >
          {user.isPayeeChoicePortal ? (
            <USBankPaymentTable
              rows={paymentData}
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              onClickRow={onClickPaymentTrxs}
              handleChangePage={handleChangePage}
              totalRecords={totalRecords}
              isLoading={isLoading}
            />
          ) : (
            <PaymentTable
              rows={paymentData}
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              onClickRow={onClickPaymentTrxs}
              handleChangePage={handleChangePage}
              totalRecords={totalRecords}
              isLoading={isLoading}
            />
          )}
        </Grid>
        {showPaymentDetails && (
          <DetailView
            open={true}
            handleClose={() => setShowPaymentDetails(false)}
          >
            {typeof paymentDetails.Amount !== 'undefined' && (
              <Typography
                style={{ textAlign: 'center', fontWeight: '400' }}
                variant='h1'
              >
                <sup>$</sup>
                {t('paymentDetail.paymentDetailHeading', {
                  amount: paymentDetails?.Amount ?? ' ',
                  clientName: paymentDetails?.ClientName ?? ' ',
                })}
              </Typography>
            )}
            <Box margin={1}>
              <Typography variant='h6' gutterBottom component='div'>
              {user.isPayeeChoicePortal ? (
                <USBankPaymentDetails
                  clientId={paymentIdDetail.clientId}
                  paymentId={paymentIdDetail.paymentId}
                  paymentPriority={paymentIdDetail.paymentPriority}
                  setPaymentDetails={setPaymentDetails}
                  paymentData={paymentData}
                  paymentTypeList={props.consumerPaymentDetails}
                />
              ) : (
                <PaymentDetails
                  clientId={paymentIdDetail.clientId}
                  paymentId={paymentIdDetail.paymentId}
                  paymentPriority={paymentIdDetail.paymentPriority}
                  setPaymentDetails={setPaymentDetails}
                  paymentData={paymentData}
                  paymentTypeList={props.consumerPaymentDetails}
                />
              )}
              </Typography>
            </Box>
          </DetailView>
        )}

        {showFilter && (
          <CustomSideDialog
            showButton={false}
            alignSide={true}
            icon='filter'
            onConfirm={() => {
              setShowFilter(false);
            }}
            onClose={() => {
              setShowFilter(false);
              resetLastAppliedFilter();
            }}
            title={t('paymentDetail.label.moreFilters')}
          >
            <PaymentFileFilters
              startDate={startDate}
              endDate={endDate}
              handleStartDateChange={(date) => setStartDate(date)}
              handleEndDateChange={(date) => setEndDate(date)}
              applyFilter={() => {
                setShowFilter(false);
                applyFilter();
              }}
              handleCheckedStatus={handleCheckedStatus}
              handleCheckedPayment={handleCheckedPayment}
              statusItem={accounts.statusIdList?.data}
              checkedStatus={checkedStatus}
              checkedPayment={checkedPayment}
              paymentTypeList={paymentTypeList}
              resetFilter={resetMoreFilter}
              handleAmountChange={handleAmountChange}
              minMaxAmount={minMaxAmount}
            />
          </CustomSideDialog>
        )}

        {notificationMessage && renderSnackbar()}
      </Grid>
    </Box>
  );
};

export default connect((state) => ({
  ...state.user,
  ...state.accounts,
}))(compose(withTranslation('common'), withStyles(styles))(SupplierPayment));
