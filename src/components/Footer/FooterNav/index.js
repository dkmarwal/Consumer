import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Box, withStyles, Link } from "@material-ui/core";
import PhoneIcon from "@material-ui/icons/Phone";
import FAQViewer from "~/components/FAQ/";
import PrivacyPolicyViewer from "~/components/PrivacyPolicy";
import TCViewer from "~/components/TCViewer";
import { getFormattedPhoneNumber } from "~/utils/common";
import { withTranslation } from "react-i18next";
import { compose } from "redux";

const styles = (theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      justifyContent: "center",
      width: "100%",
    },
  },

  link: {
    fontWeight: "400",
    marginLeft: "16px",
    marginRight: "0",
    fontSize: "10px",
    color: "#2F80ED",
    [theme.breakpoints.down("sm")]: {
      marginRight: "8px",
      marginLeft: 0,
    },
  },
  copyRight: {
    whiteSpace: "nowrap",
    lineHeight: "20px",
    textAlign: "right",
    fontWeight: "400",
    fontSize: "10px",
    color: theme.palette.secondary.main,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  img: {
    paddingLeft: "8px",
    verticalAlign: "middle",
    height: "25px",
    [theme.breakpoints.between("xs", "sm")]: {
      marginTop: "0",
      justifyContent: "center",
      maxWidth: "100%",
    },
  },

  fontSizeSmall: {
    fontSize: 18,
    verticalAlign: "middle",
    paddingRight: 5,
  },
  privacyLink: {
    display: "inline-Block",
    whiteSpace: "nowrap",
    fontSize: "10px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
    color: theme.palette.secondary.main,
    paddingRight: "8px",
    cursor: "pointer",
    borderRight: "1px solid #cccccc",
    marginRight: "8px",
    "&:last-child": {
      paddingRight: "0px",
      borderRight: "0px",
      marginRight: "0px",
    },
  },
  phoneNumber: {
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      justifyContent: "center",
    },
  },
  phoneNumberIcon: {
    fontSize: 14,
    margin: "0 4px 0 4px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  poweredBy: {
    fontSize: 10,
    display: "flex",
    alignItems: "flex-end",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      alignItems: "flex-end",
    },
  },
});

class FooterNav extends Component {
  state = {
    privacyPopup: false,
    privacyPolicyData: null,
    showFAQ: false,
    showPrivacyPolicy: false,
    showTC: false,
  };

  showLink(navItem) {
    return true;
  }

  handleCloseFaq = () => {
    this.setState({ showFAQ: false });
  };

  handleClosePrivacyPolicy = () => {
    this.setState({ showPrivacyPolicy: false });
  };
  handleCloseTC = () => {
    this.setState({ showTC: false });
  };

  openPolicyPopup = () => {
    let { privacyPopup } = this.state;
    this.setState({ privacyPopup: !privacyPopup }, () => {
      if (!privacyPopup) {
        const { user } = this.props;
        //if (user?.brandInfo?.privacyPolicy) {
        this.setState({
          privacyPolicyData: user?.brandInfo?.privacyPolicy ?? "",
        });
        //}
      }
    });
  };

  render() {
    const { classes, t, user } = this.props;
    const { showFAQ, showPrivacyPolicy, showTC } = this.state;

    return (
      <Box
        display="flex"
        justifyContent={{
          xs: "center",
          md: "space-between",
          lg: "space-between",
        }}
        flexDirection={{
          xs: "column",
          sm: "column",
          md: "row",
          lg: "row",
          xl: "row",
        }}
        flexGrow={1}
        alignItems="center"
        py={{ xs: 0.5, lg: 0 }}
      >
        <Box whiteSpace="nowrap">
          <Typography className={classes.poweredBy}>
            {user?.brandInfo?.checkStatus === 1 ? (
              <>
                Powered by
                <img
                  alt="Citi"
                  className={classes.img}
                  src={require("~/assets/images/citi-color-logo.svg")}
                  width="40"
                />
              </>
            ) : null}
          </Typography>
        </Box>

        {/*
          <Box
            width="30%"
            px={1}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            {supportInfo && supportInfo.email && (
              <Typography noWrap>
                {supportInfo && supportInfo.email && (
                  <MailOutlineIcon className={classes.fontSizeSmall} />
                )}
                <span className={classes.link}>
                  {(supportInfo && supportInfo.email) || ""}
                </span>
              </Typography>
            )}
            {supportInfo && supportInfo.phone && (
              <Typography>
                {supportInfo && supportInfo.phone && (
                  <PhoneIcon className={classes.fontSizeSmall} />
                )}
                <span className={classes.link}>
                  {(supportInfo && supportInfo.phone) || ""}
                </span>
              </Typography>
            )}
          </Box>
        */}

        {/* <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent={{ xs: "center", lg: "flex-start", xl: "flex-start" }}
          textAlign={{ xs: "center", lg: "right", xl: "right" }}
        > */}
        <Box
          display={{ xs: "column", md: "flex", lg: "flex" }}
          justifyContent={{ xs: "center", md: "flex-end", lg: "flex-end" }}
          alignItems={{ xs: "center", md: "center", lg: "center" }}
          width={{ xs: "100%", md: "auto", lg: "auto" }}
          height={1}
          pt={{ xs: 0.5 }}
        >
          {user?.brandInfo?.showPhoneNumber === 1 ? (
            <Typography noWrap className={classes.phoneNumber}>
              {t("footer.label.NeedHelp")}?
              <PhoneIcon className={classes.phoneNumberIcon} />{" "}
              {user?.brandInfo?.countryCode || "+1"}
              {"-"}
              {getFormattedPhoneNumber(user?.brandInfo?.SupportPhone || "")}
              <Box pl={1}>
                {user?.brandInfo?.phoneExt
                  ? `${t("footer.label.phoneExtesion")}`
                  : ""}{" "}
                {user?.brandInfo?.phoneExt || ""}{" "}
              </Box>
            </Typography>
          ) : null}

          <Box
            display={{ xs: "flex" }}
            mt={{ xs: 0.5, md: "-4px", lg: "-4px" }}
            justifyContent={{ xs: "center" }}
          >
            <Typography noWrap className={classes.link}>
              <Link
                component="button"
                onClick={() => {
                  this.setState({ showTC: true });
                }}
                className={classes.link}
                key={5}
                rel="noopener"
              >
                {/* {" "}
                <HelpOutlineIcon className={classes.fontSizeSmall} />{" "} */}
                {t("footer.label.TC")}{" "}
              </Link>
            </Typography>

            <Typography noWrap className={classes.link}>
              <Link
                component="button"
                onClick={() => {
                  this.setState({ showPrivacyPolicy: true });
                }}
                className={classes.link}
                key={5}
                rel="noopener"
              >
                {/* {" "}
                <LockIcon className={classes.fontSizeSmall} filled />{" "} */}
                {t("footer.label.PrivacyPolicy")}{" "}
              </Link>
            </Typography>

            <Typography noWrap className={classes.link}>
              <Link
                component="button"
                onClick={() => {
                  this.setState({ showFAQ: true });
                }}
                className={classes.link}
                key={5}
                rel="noopener"
              >
                {/* {" "}
                <HelpOutlineIcon className={classes.fontSizeSmall} />{" "} */}
                {t("footer.label.FAQs")}{" "}
              </Link>
            </Typography>
          </Box>
        </Box>
        {/* <Typography className={classes.copyRight}>
            {t("footer.label.allRightsReserved")}{" "}
          </Typography> */}
        {/* </Box> */}
        {showTC && this.showTC(showTC)}
        {showPrivacyPolicy && this.showPrivacyPolicy(showPrivacyPolicy)}
        {showFAQ && this.showFAQ(showFAQ)}
      </Box>
    );
  }

  showFAQ = (showFAQ) => {
    return (
      <FAQViewer
        open={showFAQ}
        handleClose={this.handleCloseFaq}
        {...this.props}
      />
    );
  };

  showPrivacyPolicy = (showPrivacyPolicy) => {
    return (
      <PrivacyPolicyViewer
        open={showPrivacyPolicy}
        handleClose={this.handleClosePrivacyPolicy}
        {...this.props}
      />
    );
  };
  showTC = (showTC) => {
    return (
      <TCViewer
        open={showTC}
        handleClose={this.handleCloseTC}
        {...this.props}
      />
    );
  };
}

export default connect((state) => ({ ...state.user }))(
  compose(withTranslation("common"), withStyles(styles))(FooterNav)
);
