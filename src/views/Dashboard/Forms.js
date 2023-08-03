import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  withStyles,
  Modal,
  Box,
  Container,
  Button as MUIButton,
} from "@material-ui/core";
import Accounts from "~/module/Accounts";
import Notification from "~/components/Notification";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { AlertDialog } from "~/components/Dialogs";
import { Consumer_Status } from "~/config/paymentMethods";
import { fetchPaymentsToAuthenticate } from "~/redux/actions/paymentAuthentication";
import VerifyRegisteredUser from "~/module/PaymentAuthentication/verifyRegisteredUser";
import SupplierPayment from "~/views/PaymentDetail/SupplierPayment";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: "50px 0",
    position: "absolute",
    top: 0,
  },
  card: {
    width: "90%",
    borderRadius: "10px",
    padding: "20px 30px",
    margin: "20px 5% 0",
    position: "relative",
  },

  accountsCard: {
    width: "100%",
    padding: "16px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },

    position: "relative",
  },

  redLine: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "1%",
    height: "100%",
    background: "#ff0001",
  },

  spanTxt: {
    display: "inline-block",
    paddingLeft: "15px",
  },

  contentInfo: {
    color: "#121212",
    fontSize: "16px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },
  container: {
    width: "70%",
    margin: "auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    border: 0,
    transform: "translate(-50%,-50%)",
    backgroundColor: theme.palette.background.paper,
  },
  verifyBtn: {
    padding: "0px",
    height: "32px",
    minWidth: "110px",
    background: theme.palette.common.white,
    color: theme.palette.text.dark,
    "&:hover": {
      background: theme.palette.common.white,
    },
  },
  spanClass: {
    color: theme.palette.primary.contrastText, //008CE6
  },
  accountsBg: {
    background: theme.palette.background.main,
    zIndex: "0",
  },
  paymentText: {
    color: theme.palette.primary.contrastText,
  },
  backgroundDashboard: {
    background: theme.palette.background.main,
    zIndex: 1,
  },
});

class Forms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      alertMessage: null,
      alertType: null,
      validation: {},
      updateProgress: false,
      alertMessageCallbackType: null,
      actionMessage: "",
      openAuthModal: true,
      isVerifyBtnClicked: false,
      hasStalePoupShownBefore: false,
      paymentsRender: true,
    };
  }

  componentDidMount() {
    this.callPaymentsToAuthenticate();
    const routeParam = (this.props.match.params && this.props.match.params.clientSlug) || "";
    this.setState({
      hasStalePoupShownBefore: eval(sessionStorage.getItem(`@staleValue_${routeParam}`)) || false,
      isVerifyBtnClicked: sessionStorage.getItem(`@showLoginDFA_${routeParam}`) || false,
    });
  }
  setPaymentsRenderFalse = () => {
    this.setState({
      paymentsRender: false
    })
  }
  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  goBack = () => {
    this.setState({
      actionMessage: null,
      alertMessageCallbackType: null,
    });
  };
  callPaymentsToAuthenticate = () => {
    const { info } = this.props.user;
    const data = {
      payeeId: info.portalProfileId,
    };
    this.props.dispatch(fetchPaymentsToAuthenticate(data, true));
  };

  closeStalePopup = () => {
    this.setState(
      {
        hasStalePoupShownBefore: true,
      },
      () => {
        const path = window?.location?.pathname ?? "";
        const clientURL = path.split("/")[1];
        sessionStorage.setItem(`@staleValue_${clientURL}`, true);
      }
    );
  };
  deleteCookie(name) {
    const path = window?.location?.pathname ?? "";
    const clientURL = path.split("/")[1];
    sessionStorage.removeItem(`${name}_${clientURL}`);
  }
  render() {
    const { classes, paymentAuthentication, t } = this.props;
    const {
      alertType,
      alertMessage,
      alertMessageCallbackType,
      actionMessage,
      hasStalePoupShownBefore,
      isVerifyBtnClicked,
      openAuthModal,
      paymentsRender,
    } = this.state;
    const { paymentsData } = paymentAuthentication;

    const getConsumerStatusId =
      this.props?.DFA?.hasPymentTaken?.consumerStatusId ?? null;

    return (
      <Grid container xs={12}>
        {
          <Grid className={classes.backgroundDashboard} container xs={12}>
            {paymentsData && paymentsData.length > 0 && (
              <Box bgcolor="primary.main" width={1}>
                <Container maxWidth="lg">
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid xs={8} lg={true} style={{alignSelf:'center'}}>
                        <Box
                          p={1}
                          height={1}
                          display={{ xs: "", lg: "flex" }}
                          alignItems="center"
                        >
                          <span className={classes.spanClass}>
                            {paymentsData.length}{" "}
                            {t("dashboard.paymentAuth.payments")}
                            {paymentsData.length > 1 ? "s" : ""}
                          </span>
                          <Box
                            component="span"
                            className={classes.paymentText}
                            pl={0.5}
                          >
                            {paymentsData.length > 1 ? t("dashboard.paymentAuth.paymentText") : t("dashboard.paymentAuth.paymentsText")}
                            {" "}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid xs={4} style={{ textAlign: "right" }}>
                        <Box my={1}>
                          <MUIButton
                            variant="outlined"
                            className={classes.verifyBtn}
                            color="secondary"
                            onClick={() =>
                              this.setState({
                                isVerifyBtnClicked: true,
                                // paymentsRender: false
                              })
                            }
                          >
                            {t("dashboard.paymentAuth.verify")}
                          </MUIButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Container>
                <Modal
                  open={isVerifyBtnClicked}
                  onClose={() => {
                    this.setState({
                      isVerifyBtnClicked: false,
                      openAuthModal: false,
                    });
                    this.deleteCookie("@showLoginDFA");
                  }}
                >
                  <VerifyRegisteredUser
                    {...this.props}
                    onBtnClick={() => {
                      this.setState({
                        isVerifyBtnClicked: false,
                        openAuthModal: false,
                        paymentsRender: true,
                      });
                      this.deleteCookie("@showLoginDFA");
                      this.callPaymentsToAuthenticate();
                    }}
                    onCancelClick={() => {
                      this.setState({
                        isVerifyBtnClicked: false,
                        openAuthModal: false,
                      });
                      this.deleteCookie("@showLoginDFA");
                    }}
                    openAuthModal={openAuthModal}
                    setPaymentsRenderFalse={this.setPaymentsRenderFalse}
                  />
                </Modal>
              </Box>
            )}

            <Container
              maxWidth="lg"
              style={
                paymentsData && paymentsData.length > 0
                  ? { marginTop: 24 }
                  : { marginTop: 0 }
              }
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Accounts {...this.props} />
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{marginBottom:"16px"}}>
                <Grid item xs={12}>
                  <SupplierPayment {...this.props} paymentsRender={paymentsRender} />
                </Grid>
              </Grid>
            </Container>
          </Grid>
        }

        {alertMessage && this.renderSnackbar(alertType, alertMessage)}
        {actionMessage &&
          this.renderAlertMessage("", actionMessage, alertMessageCallbackType)}

        {Boolean(getConsumerStatusId) &&
        getConsumerStatusId === Consumer_Status.INACTIVE &&
        !Boolean(hasStalePoupShownBefore)
          ? this.renderProfileActiveMessage()
          : null}
      </Grid>
    );
  }

  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.hideAlertMessage}
      />
    );
  };

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          callbackType === "REDIRECT" ? this.goBack() : this.hideAlertMessage();
        }}
      />
    );
  };

  renderProfileActiveMessage = () => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title=""
        message={this.props.t("dashboard.paymentAuth.stalePopup")}
        onConfirm={() => {
          this.closeStalePopup();
        }}
      />
    );
  };
}

export default connect((state) => ({
  ...state.user,
  ...state.uploadValidation,
  ...state.paymentAuthentication,
  ...state.DFA,
}))(compose(withTranslation("common"), withStyles(styles))(Forms));
