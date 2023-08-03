import React, { Component } from "react";
import { Grid, Box, Typography, Button } from "@material-ui/core";
import { styles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "~/components/Forms/TextField";
import PhoneIcon from "@material-ui/icons/Phone";
import MessageIcon from "@material-ui/icons/Message";

class VerifyOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getOTPPRef = () => {
    const { paymentsData, typeDFA, ctaDisabled, handleBtnClick, classes, t } =
      this.props;
    const pref = paymentsData && paymentsData[0].OTPPref;
    switch (pref) {
      case 1:
        return (
          <>
            <Button
              variant={typeDFA === "EMAIL" ? "contained" : "outlined"}
              className={
                typeDFA === "EMAIL" ? classes.btnSelected : classes.btn
              }
              id="EMAIL"
              color="primary"
              onClick={(e) => handleBtnClick(e)}
              disabled={ctaDisabled}
            >
              {" "}
              <MessageIcon /> {t("dfa.buttonLabel.email")}
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Button
              variant={typeDFA === "SMS" ? "contained" : "outlined"}
              className={typeDFA === "SMS" ? classes.btnSelected : classes.btn}
              id="SMS"
              color="primary"
              onClick={(e) => handleBtnClick(e)}
            // disabled={ctaDisabled}
            >
              <MessageIcon /> {t("dfa.buttonLabel.sms")}
            </Button>
            <Button
              variant={typeDFA === "PHONE" ? "contained" : "outlined"}
              className={
                typeDFA === "PHONE" ? classes.btnSelected : classes.btn
              }
              id="PHONE"
              color="primary"
              onClick={(e) => handleBtnClick(e)}
            // disabled={ctaDisabled}
            >
              <PhoneIcon /> {t("dfa.buttonLabel.call")}
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <Button
              variant={typeDFA === "SMS" ? "contained" : "outlined"}
              className={typeDFA === "SMS" ? classes.btnSelected : classes.btn}
              id="SMS"
              color="primary"
              onClick={(e) => handleBtnClick(e)}
            // disabled={ctaDisabled}
            >
              <MessageIcon /> {t("dfa.buttonLabel.sms")}
            </Button>
            <Button
              variant={typeDFA === "PHONE" ? "contained" : "outlined"}
              className={
                typeDFA === "PHONE" ? classes.btnSelected : classes.btn
              }
              id="PHONE"
              color="primary"
              onClick={(e) => handleBtnClick(e)}
            // disabled={ctaDisabled}
            >
              <PhoneIcon /> {t("dfa.buttonLabel.call")}
            </Button>
            <Button
              variant={typeDFA === "EMAIL" ? "contained" : "outlined"}
              className={
                typeDFA === "EMAIL" ? classes.btnSelected : classes.btn
              }
              id="EMAIL"
              color="primary"
              onClick={(e) => handleBtnClick(e)}
              disabled={ctaDisabled}
            >
              {" "}
              <MessageIcon /> {t("dfa.buttonLabel.email")}
            </Button>
          </>
        );
      default:
        break;
    }
  };
  render() {
    const {
      paymentsData,
      typeDFA,
      generateOTP,
      code,
      onCodeChange,
      progress,
      dfaSelectionScreen,
      hasTimeUp,
      resendCta,
      errCode,
      classes,
      t,
    } = this.props;
    return (
      <>
        {dfaSelectionScreen ? (
          <Box py={2}>{this.getOTPPRef()}</Box>
        ) : (
          <>
            <Box pt={0} pb={1} className={classes.codeBox}>
              {(typeDFA === "SMS" || typeDFA === "PHONE") && (
                <>
                  {t("paymentAuthentication.enterCode", {
                    contact: paymentsData && paymentsData[0].MobileNo,
                  })}
                </>
              )}
              {typeDFA === "EMAIL" && (
                <>
                  {t("paymentAuthentication.enterCode", {
                    contact: paymentsData && paymentsData[0].Email,
                  })}
                </>
              )}
            </Box>
            <Box pt={2}>
              <Grid container xs={12} className={classes.verifyBtnContainer}>
                <Grid item xs={12} sm={6} md={6} lg={5}>
                  <TextField
                    id="code"
                    label={t("paymentAuthentication.enterVerCode")}
                    variant="outlined"
                    color="primary"
                    value={code}
                    error={Boolean(errCode)}
                    helperText={errCode}
                    onChange={(e) => onCodeChange(e)}
                    inputProps={{
                      maxLength: 6,
                    }}
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
              <Box pt={2}>
                <Grid container xs={12} className={classes.verifyBtnContainer}>
                  {hasTimeUp === false ? (
                    <Grid item xs={1}>
                      <Box display="flex" alignItems="center">
                        <Grid container>
                          <Box className={classes.progressBar}>
                            <CircularProgress
                              variant="determinate"
                              value={progress * 0.66}
                            />
                            <Box
                              top={0}
                              left={0}
                              bottom={0}
                              right={0}
                              position="absolute"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Typography
                                variant="caption"
                                component="div"
                                color="textSecondary"
                              >
                                {progress}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Box>
                    </Grid>
                  ) : null}

                  {typeDFA !== null && (
                    <Box py={0.5}>
                      <Button
                        style={
                          hasTimeUp ? { marginLeft: 0 } : { marginLeft: 30 }
                        }
                        className={classes.resendBtn}
                        id="resend"
                        onClick={(e) => generateOTP(e)}
                        disabled={resendCta}
                      >
                        {t("paymentAuthentication.buttonLabel.resend")}
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Box>
            </Box>
          </>
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.paymentAuthentication,
  }))(withStyles(styles)(VerifyOTP))
);
