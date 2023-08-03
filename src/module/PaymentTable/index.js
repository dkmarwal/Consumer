import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { Grid, TableHead, Box } from "@material-ui/core";
import nodataImage from "~/assets/icons/blankFile_No_data_new.svg";
import Link from "@material-ui/core/Link";
import { withTranslation } from "react-i18next";
import CHK from "~/assets/icons/Check_mini.svg";
import ACH from "~/assets/icons/BankDeposit_mini.svg";
import PayPal from "~/assets/icons/Paypal_mini.svg";
import DirectDeposit from "~/assets/icons/DirectDeposit_mini.svg";
import VCA from "~/assets/icons/VCA_main.svg";
import Zelle from "~/assets/icons/Zelle.svg";
import { PaymentPriority } from "~/config/paymentMethods";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import Hidden from "@material-ui/core/Hidden";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const customStyle = makeStyles((theme) => ({
  flag: {
    height: "2em !important",
    width: "2em !important",
    borderRadius: "50%",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  headerPadding: {
    padding: "0px 16px",
  },

  headerLabel: {
    fontWeight: "700",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
  },
  headerInput: {
    width: "95%",
    border: "none",
    fontSize: "12px",
    padding: "5px",
    borderRadius: "4px 4px 0 0",
    fontFamily: '"Interstate", Arial, Helvetica, sans-serif',
  },
  headerInputNew: {
    width: "50px",
    border: "none",
    fontSize: "12px",
    padding: "5px",
    borderRadius: "4px 4px 0 0",
    fontFamily: '"Interstate", Arial, Helvetica, sans-serif',
  },

  headerInputShort: {
    border: "none",
    fontSize: "12px",
    padding: "5px",
    maxWidth: "20%",
    marginRight: "10px",
    borderRadius: "4px 4px 0 0",
  },
  headerInputLong: {
    border: "none",
    fontSize: "12px",
    padding: "5px",
    width: "90%",
    marginLeft: 8,
    borderRadius: "4px 4px 0 0",
  },
  paymentTableMobPadd: {
    "& th": {
      [theme.breakpoints.down("sm")]: {
        padding: "8px",
        fontSize: "12px",
      },
      [theme.breakpoints.up("sm")]: {
        padding: 16,
        fontSize: "14px",
      },
    },
    "& p": {
      [theme.breakpoints.down("sm")]: {
        fontSize: "12px",
      },
    },
    "& .MuiToolbar-gutters": {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: "8px",
      },
    },
    "& .MuiTablePagination-selectRoot": {
      [theme.breakpoints.down("sm")]: {
        marginRight: "16px",
      },
    },
    "& .MuiTablePagination-select": {
      [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
      },
    },
  },
  imgMob: {
    [theme.breakpoints.down("sm")]: {
      marginLeft: "-10px",
    },
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

function PaymentTable({
  rows,
  totalRecords,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  t,
  onClickRow,
  isLoading,
  i18n
}) {
  const classes = useStyles2();
  const customClasses = customStyle();
  const onHandleClickRow = (paymentId, clientId, paymentPriority) => {
    onClickRow(paymentId, clientId, paymentPriority);
  };

  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case "ACH":
        return ACH;

      case "VCA":
        return VCA;

      case "CHK":
        return CHK;

      case "PPL":
        return PayPal;

      case "MSC":
        return DirectDeposit;

      case "CXC":
        return Zelle;

      default:
    }
  };
  const renderpaymentDetails = (type, priority) => {
    switch (type) {
      case "ACH":
        return (
          <Box display="flex" alignItems="center">
            <Box display="flex">
              {priority === PaymentPriority.Primary ? (
                <img
                  src={require(`~/assets/icons/FullStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              ) : priority === PaymentPriority.Alternate ? (
                <img
                  src={require(`~/assets/icons/HalfStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              ) : (
                <img
                  src={require(`~/assets/icons/BorderStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              )}
            </Box>
            <Box px={2} display="flex" alignItems="center">
              <img src={getPaymentTypeIcon(type)} alt={"Payments"} />
            </Box>
            <Hidden smDown>
              <span className={customClasses.flagLabel}>
                {t("paymentTable.label.bankDeposit")}
              </span>
            </Hidden>
          </Box>
        );

      case "CHK":
        return (
          <Box display="flex" alignItems="center">
            <Box display="flex">
              {priority === PaymentPriority.Primary ? (
                <img
                  src={require(`~/assets/icons/FullStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              ) : priority === PaymentPriority.Alternate ? (
                <img
                  src={require(`~/assets/icons/HalfStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              ) : (
                <img
                  src={require(`~/assets/icons/BorderStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              )}
            </Box>
            <Box px={2} display="flex" alignItems="center">
              <img src={getPaymentTypeIcon(type)} alt={"Payments"} />
            </Box>
            <Hidden smDown>
              <span className={customClasses.flagLabel}>
                {t("paymentTable.label.check")}
              </span>
            </Hidden>
          </Box>
        );

      case "PPL":
        return (
          <Box display="flex" alignItems="center">
            <Box display="flex">
              {priority === PaymentPriority.Primary ? (
                <img
                  src={require(`~/assets/icons/FullStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              ) : priority === PaymentPriority.Alternate ? (
                <img
                  src={require(`~/assets/icons/HalfStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              ) : (
                <img
                  src={require(`~/assets/icons/BorderStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              )}
            </Box>
            <Box px={2} display="flex" alignItems="center">
              <img src={getPaymentTypeIcon(type)} alt={"Payments"} />
            </Box>
            <span className={customClasses.flagLabel}>
              <Hidden smDown>{t("paymentTable.label.paypal")}</Hidden>
            </span>
          </Box>
        );

      case "MSC":
        return (
          <Box display="flex" alignItems="center">
            <Box display="flex">
              {priority === PaymentPriority.Primary ? (
                <img
                  src={require(`~/assets/icons/FullStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              ) : priority === PaymentPriority.Alternate ? (
                <img
                  src={require(`~/assets/icons/HalfStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              ) : (
                <img
                  src={require(`~/assets/icons/BorderStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              )}
            </Box>
            <Box px={2} display="flex" alignItems="center">
              <img src={getPaymentTypeIcon(type)} alt={"Payments"} />
            </Box>
            <Hidden smDown>
              <span className={customClasses.flagLabel}>
                {t("paymentTable.label.directDeposit")}
              </span>
            </Hidden>
          </Box>
        );

      case "CXC":
        return (
          <Box display="flex" alignItems="center">
            <Box display="flex">
              {priority === PaymentPriority.Primary ? (
                <img
                  src={require(`~/assets/icons/FullStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              ) : priority === PaymentPriority.Alternate ? (
                <img
                  src={require(`~/assets/icons/HalfStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              ) : (
                <img
                  src={require(`~/assets/icons/BorderStar.svg`)}
                  alt={"Payments"}
                  width="21"
                />
              )}
            </Box>
            <Box px={2} display="flex" alignItems="center">
              <img src={getPaymentTypeIcon(type)} alt={"Payments"} />
            </Box>
            <Hidden smDown>
              <span className={customClasses.flagLabel}>
                {t("paymentTable.label.zelle")}
              </span>
            </Hidden>
          </Box>
        );

      default:
    }
  };
  return (
    <TableContainer
      className={customClasses.paymentTableMobPadd}
      style={{ overflowX: "none" }}
    >
      <Table
        aria-label="custom pagination table"
        style={{ borderCollapse: "inherit", overflow: "hidden" }}
      >
        <TableHead>
          <TableRow>
            <Hidden smDown>
              <TableCell
                align="left"
                className={classes.headerPadding}
                style={{ paddingLeft: 20 }}
              >
                <span className={customClasses.header}>
                  <div className={customClasses.headerLabel}>
                    <div>{t("paymentTable.label.paymentReference")}</div>
                  </div>
                </span>
              </TableCell>
            </Hidden>

            <TableCell align="left" className={classes.headerPadding}>
              <span className={customClasses.header}>
                <span className={customClasses.headerLabel}>
                  {t("paymentTable.label.date")}
                </span>
              </span>
            </TableCell>
            <TableCell align="left" className={classes.headerPadding}>
              <span className={customClasses.header}>
                <span className={customClasses.headerLabel}>
                  {t("paymentTable.label.status")}
                </span>
              </span>
            </TableCell>
            <TableCell align="left" className={classes.headerPadding}>
              <span className={customClasses.header}>
                <span className={customClasses.headerLabel}>
                  {t("paymentTable.label.amount")}
                </span>
              </span>
            </TableCell>
            <Hidden only={["md", "lg", "xl"]}>
              <TableCell align="left" className={classes.headerPadding}>
                <span className={customClasses.header}>
                  <span className={customClasses.headerLabel}>
                    {" "}
                    {t("paymentTable.label.paymentMobMethod")}
                  </span>
                </span>
              </TableCell>
            </Hidden>
            <Hidden only={["xs", "sm"]}>
              <TableCell align="left" className={classes.headerPadding}>
                <span className={customClasses.header}>
                  <span className={customClasses.headerLabel}>
                    {t("paymentTable.label.paymentMethod")}
                  </span>
                </span>
              </TableCell>
            </Hidden>
            <Hidden smDown>
              <TableCell align="left" className={classes.headerPadding}>
                <span className={customClasses.header}>
                  <span className={customClasses.headerLabel}>
                    {t("paymentTable.label.notes")}
                  </span>
                </span>
              </TableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell component="th"></TableCell>
              <TableCell component="th"></TableCell>
              <TableCell component="th"></TableCell>
              <TableCell component="th"></TableCell>
              <TableCell component="th"></TableCell>
              <TableCell component="th"></TableCell>
            </TableRow>
          </TableBody>
        ) : rows && rows?.length > 0 ? (
          <>
            <TableBody>
              {rowsPerPage > 0 &&
                rows.map((row) => (
                  <>
                    <TableRow key={row.PaymentID}>
                      <Hidden smDown>
                        <TableCell
                          component="th"
                          align="left"
                          style={{
                            paddingLeft: 20,
                            fontWeight: "400",
                          }}
                        >
                          <Link
                            component="button"
                            underline="always"
                            style={{
                              fontWeight: "400",
                              color: "#008CE6",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              onHandleClickRow(
                                row.PaymentID,
                                row.ClientID,
                                row.PaymentPriority
                              )
                            }
                          >
                            {row.PaymentRef}
                          </Link>
                        </TableCell>
                      </Hidden>
                      <TableCell component="th" align="left">
                        <Hidden only={["xs", "sm"]}>{row.ValueDate}</Hidden>
                        <Hidden only={["md", "lg", "xl"]}>
                          {" "}
                          <Link
                            component="button"
                            underline="always"
                            style={{
                              fontWeight: "400",
                              color: "#008CE6",
                              textDecoration: "underline",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                            onClick={() =>
                              onHandleClickRow(
                                row.PaymentID,
                                row.ClientID,
                                row.PaymentPriority
                              )
                            }
                          >
                            {row.ValueDate}
                          </Link>
                        </Hidden>
                      </TableCell>

                      <TableCell component="th" align="left">
                        <Box display="inline-flex" alignItems="center">
                          <div
                            style={{
                              display: "flex",
                              color: `${row.StatusColor}`,
                              paddingRight: 8,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.PaymentStatus}
                          </div>
                          <div style={{ display: "flex" }}>
                            <span>
                              <LightTooltip
                                title={row.PaymentStatusInfo}
                                placement="right"
                              ></LightTooltip>
                            </span>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell component="th" align="left">
                        {` $${row.Amount}`}
                      </TableCell>
                      <TableCell component="th" align="left">
                        {row.PaymentType &&
                          row.PaymentType !== "CDM" &&
                          renderpaymentDetails(
                            row.PaymentType,
                            row.PaymentPriority
                          )}
                      </TableCell>
                      <Hidden smDown>
                        <TableCell component="th" align="left">
                          <div title={row.PaymentNotes}>
                            {row.PaymentNotes && row.PaymentNotes.length > 20
                              ? row.PaymentNotes.substring(0, 20) + "..."
                              : row.PaymentNotes}
                          </div>
                        </TableCell>
                      </Hidden>
                    </TableRow>
                  </>
                ))}
            </TableBody>
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={6} style={{ border: "none" }}>
              <Box display="block" textAlign="center" py={3} width="100%">
                <img src={nodataImage} alt={"no data found"} />
                <Box py={2} style={{ color: "#9d9d9d", fontSize: "12px" }}>
                  {" "}
                  {t("paymentTable.label.noDataFound")}
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        )}
      </Table>
      <Grid container>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Grid item container alignItems="center" sm md lg={12}>
            <Grid item xs sm={3} md={2} lg={2}>
              <LightTooltip
                title={t("paymentTable.tooltipText.primary")}
                placement="top-start"
              >
                <Box
                  my={{ xs: 1, sm: "12px", md: 2, lg: 2 }}
                  ml={2}
                  fontSize={10}
                  display="flex"
                  alignItems="center"
                  justifyContent={{ xs: "center" }}
                >
                  <img
                    className={customClasses.imgMob}
                    src={require(`~/assets/icons/FullStar.svg`)}
                    alt={"Payments"}
                    width="21"
                  />
                  <span
                    className={customClasses.flagLabel}
                    style={{ padding: "7px" }}
                  >
                    {t("paymentTable.label.primaryText")}
                  </span>
                </Box>
              </LightTooltip>
            </Grid>
            <Grid
              item
              xs
              sm={i18n.language === "es" ? 5 : 3}
              md={i18n.language === "es" ? 4 : 2}
              lg={i18n.language === "es" ? 4 : 2}
            >
              <LightTooltip
                title={t("paymentTable.tooltipText.secondary")}
                placement="top-start"
              >
                <Box
                  my={{ xs: 1, sm: "12px", md: 2, lg: 2 }}
                  ml={2}
                  fontSize={10}
                  display="flex"
                  alignItems="center"
                  justifyContent={{ xs: "center" }}
                >
                  <img
                    src={require(`~/assets/icons/HalfStar.svg`)}
                    alt={"Payments"}
                    width="21"
                  />
                  <span
                    className={customClasses.flagLabel}
                    style={{ padding: "7px" }}
                  >
                    {t("paymentTable.label.alternateText")}
                  </span>
                </Box>
              </LightTooltip>
            </Grid>
            <Grid
              item
              xs
              sm={i18n.language === "es" ? 4 : 3}
              md={i18n.language === "es" ? 4 : 2}
              lg={i18n.language === "es" ? 3 : 2}
            >
              <LightTooltip
                title={t("paymentTable.tooltipText.default")}
                placement="top-start"
              >
                <Box
                  my={{ xs: 1, sm: "12px", md: 2, lg: 2 }}
                  ml={2}
                  fontSize={10}
                  display="flex"
                  alignItems="center"
                  justifyContent={{ xs: "center" }}
                >
                  <img
                    src={require(`~/assets/icons/BorderStar.svg`)}
                    alt={"Payments"}
                    width="21"
                  />

                  <span
                    className={customClasses.flagLabel}
                    style={{ padding: "7px" }}
                  >
                    {t("paymentTable.label.defaultText")}
                  </span>
                </Box>
              </LightTooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <TablePagination
            component="Box"
            style={{ border: "none" }}
            rowsPerPageOptions={[5, 10, 25]}
            count={totalRecords}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true,
            }}
            labelRowsPerPage={t("paymentTable.label.rowsPerPage")}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            labelDisplayedRows={({ from, to, count }) =>
              t("paymentTable.label.labelDisplayedRows", {
                from: from,
                to: to,
                count: count,
              })
            }
          />
        </Grid>
      </Grid>
    </TableContainer>
  );
}
export default withTranslation("common")(PaymentTable);
