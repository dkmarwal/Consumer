import React from "react";
import { connect } from "react-redux";
import {
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  CircularProgress,
  Grid,
  Box,
  Typography,
  Button,
  makeStyles,
  Radio,
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import nodataImage from "~/assets/icons/blankFile_No_data_new.svg";
import CheckedIcon from "~/assets/icons/radio_button_checked.svg";
import UnCheckedIcon from "~/assets/icons/radio_button_unchecked.svg";

const useStyles = makeStyles((theme) => ({
  bankSearchHeading: {
    color: theme.palette.text.dark,
    fontSize: "1.375rem",
  },
  bankSearchSubHeading: {
    color: theme.palette.text.light,
    fontSize: "1rem",
  },
  bankSearchTable: {
    "& .MuiTableCell-head": {
      fontSize: "0.875rem",
      color: theme.palette.text.dark,
      fontWeight: 700,
      [theme.breakpoints.down("sm")]: { fontSize: "12px" },
    },
  },
  actionButtons: {
    margin: "8px 0 0 0px",
    display: "flex",
    justifyContent: "center",
  },
  bankSearchCol: {
    [theme.breakpoints.down("sm")]: { minWidth: "620px" },
    "& th": {
      [theme.breakpoints.down("sm")]: { padding: "0px 8px" },
    },
    "& td": {
      [theme.breakpoints.down("sm")]: { padding: "0px 8px", fontSize: "12px" },
    },
  },
}));

const RoutingCodeSearchResults = (props) => {
  const {
    t,
    isLoading,
    payment,
    handlePageChange,
    page,
    rowsPerPage,
    closeRoutingCodeResult,
  } = props;
  const { routingCodes, totalCount } = payment;
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = React.useState(null);

  const onSelectBank = (row) => {
    props.onSelectBank(row);
  };

  const handleRowSelection = (_, row) => {
    setSelectedRow(row);
  };
  const truncate = (str) => {
    return str.length > 79 ? str.substring(0, 78) + "..." : str;
  };

  return (
    <>
      <Box pt={2} pb={2} textAlign={"center"}>
        <Typography className={classes.bankSearchHeading}>
          {t("routingCodeResults.heading.searchBank")}
        </Typography>
      </Box>
      {totalCount ? (
        <Box pb={2} textAlign={"center"}>
          <Typography className={classes.bankSearchSubHeading}>
            {t("routingCodeResults.text.bankResult", {
              totalCount,
            })}
          </Typography>
        </Box>
      ) : null}
      <TableContainer>
        <Table
          className={classes.bankSearchCol}
          style={{ borderTop: "1px solid #828282" }}
        >
          <TableHead>
            <TableRow className={classes.bankSearchTable}>
              <TableCell style={{ padding: "16px 8px" }}> </TableCell>
              <TableCell style={{ width: "300px" }}>
                {t("routingCodeResults.tableHeader.bankName")}
              </TableCell>
              <TableCell style={{ minWidth: "100px" }}>
                {t("routingCodeResults.tableHeader.routingNumber")}
              </TableCell>
              <TableCell style={{ width: "160px" }}>
                {t("routingCodeResults.tableHeader.city")}
              </TableCell>
              <TableCell style={{ width: "160px" }}>
                {t("routingCodeResults.tableHeader.state")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow
                style={{
                  height: 218,
                }}
              >
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <CircularProgress style={{ margin: "auto" }} />
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ) : routingCodes ? (
              routingCodes.map((row) => (
                <TableRow key={row.bankId}>
                  <TableCell
                    style={{ padding: "16px 8px" }}
                    component="th"
                    scope="row"
                  >
                    <Radio
                      style={{ padding: "0px" }}
                      checked={selectedRow && selectedRow.bankId === row.bankId}
                      onChange={(e) => handleRowSelection(e, row)}
                      value={row.bankId}
                      checkedIcon={<img src={CheckedIcon} alt="CheckedIcon" />}
                      icon={<img src={UnCheckedIcon} alt="UnCheckedIcon" />}
                    />
                  </TableCell>
                  <TableCell
                    title={row?.bankName?.length > 79 ? row.bankName : ""}
                    style={{ width: "300px" }}
                    align="left"
                  >
                    {row?.bankName?.length > 79
                      ? truncate(row.bankName)
                      : row.bankName}
                  </TableCell>
                  <TableCell align="left">{row.routingCode}</TableCell>
                  <TableCell
                    style={{ textTransform: "capitalize", width: "160px" }}
                    align="left"
                  >
                    {row.city?.toLowerCase() ?? "-"}
                  </TableCell>
                  <TableCell align="left" style={{ width: "160px" }}>
                    {row.stateName ?? "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} style={{ border: "none" }}>
                  <Box display="block" textAlign="center" py={3} width="100%">
                    <img src={nodataImage} alt={"no data found"} />
                    <Box py={2} style={{ color: "#9d9d9d", fontSize: "12px" }}>
                      {t("routingCodeResults.text.noDataFound")}
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid conatainer justifyContent="center">
        <Box
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "right",
            marginBottom: "5px",
          }}
        >
          <TablePagination
            style={{ borderBottom: "0px" }}
            rowsPerPageOptions={[5]}
            colSpan={6}
            count={totalCount || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true,
            }}
            onChangePage={handlePageChange}
            labelDisplayedRows={({ from, to, count }) =>
              t("routingCodeResults.text.labelDisplayedRows", {
                from: from,
                to: to,
                count: count,
              })
            }
          />
        </Box>
      </Grid>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        style={{ marginTop: "8px" }}
      >
        <Grid
          item
          xs={6}
          lg={3}
          sm={3}
          md={3}
          className={classes.actionButtons}
        >
          <Button
            variant="outlined"
            color="primary"
            // style={{ width: '100%' }}
            fullWidth
            onClick={() => closeRoutingCodeResult()}
          >
            {t("routingCodeResults.button.back")}
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          lg={3}
          sm={3}
          md={3}
          className={classes.actionButtons}
        >
          <Button
            variant="contained"
            color="primary"
            // style={{ width: '100%' }}
            fullWidth
            onClick={() => {
              onSelectBank(selectedRow);
              props.onClose();
            }}
          >
            {t("routingCodeResults.button.select")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default connect((state) => ({ ...state.user, ...state.payment }))(
  compose(withTranslation("common"))(RoutingCodeSearchResults)
);
