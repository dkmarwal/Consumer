import React from "react";
import {
  makeStyles,
  Grid,
  Paper,
  Typography,
  Divider,
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import VerifyYourselfActive from "~/assets/images/verifyYourself_active.svg";
import VerifyYourselfCompleted from "~/assets/images/verifyYourself_completed.svg";
import RegisterUpcoming from "~/assets/images/register_upcoming.svg";
import RegisterActive from "~/assets/images/register_active.svg";
import RegisterCompleted from "~/assets/images/register_completed.svg";
import SharePaymentUpcoming from "~/assets/images/sharePayment_upcoming.svg";
import SharePaymentActive from "~/assets/images/sharePayment_active.svg";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.dark,
    fontSize: theme.spacing(2),
    justifyContent: "center",
    padding: theme.spacing(2, 1),
    minHeight:"208px",
  },
  enrollmentStepperText: {
    color: theme.palette.text.dark,
    fontSize: `1.5rem`,
    fontWeight: 400,
    lineHeight: "28px",
    textAlign: "center",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.spacing(2),
      textAlign: "center",
    },
  },
  greenStepperText: {
    color: "#27AE60",
  },
  upcomingStepperText: {
    color: theme.palette.text.disabledDark,
  },
  connectingDivider: {
    width: "4.5rem",
    maxWidth: "100%",
    marginTop: "2.813rem",
    background: "#828282",
    height: "2px",
    display: "flex",
    justifyItems: "center",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(5),
      width: "1rem",
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(5),
      width: "2rem",
    },

    [theme.breakpoints.between("sm", "md")]: {
      marginTop: theme.spacing(5),
      width: "3.7rem",
    },
  },
  steperWrap: {
    "& img": {
      maxWidth: "100%",
      height: "auto",
    },
    marginTop: theme.spacing(1),
    textAlign: "center",
    "& p": {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: "1.2rem",
      [theme.breakpoints.down("xs")]: {
        fontSize: "0.75rem",
      },
    },

    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(1, 0, 0, 0),
      display: "flex",
      flexWrap: "wrap",
      maxHeight: "9rem",
      justifyContent: "space-between",
    },
    [theme.breakpoints.only("sm")]: {
      width: "65%",
    },
    [theme.breakpoints.between("lg", "xl")]: {
      width: "60%",
    },
    [theme.breakpoints.only("xl")]: {
      width: "70%",
    },
  },
  highlightedText: {
    fontWeight: 700,
    lineHeight: "28px",
    [theme.breakpoints.down("sm")]: {
      lineHeight: "24px",
    },
  },
}));

const EnrollmentStepper = (props) => {
  const classes = useStyles();
  const { step, t, paymentAmount, clientName, user } = props;
  const stepsRemaining = 4 - step;
  return (
    <>
      <Grid
        container
        component={Paper}
        square
        elevation={3}
        className={classes.root}
      >
        {paymentAmount ? (
          <Typography className={classes.enrollmentStepperText}>
            {t("enrollmentStepper.stepper1")}
            <span className={classes.highlightedText}>
              {`$${paymentAmount}`}
            </span>
            {t("enrollmentStepper.from")}
            <span className={classes.highlightedText}>{clientName}</span>
            {t("enrollmentStepper.isJust")}
            {props.i18n.language === "es" && stepsRemaining === 1
              ? null
              : stepsRemaining}
            {stepsRemaining > 1
              ? t("enrollmentStepper.stepsAway")
              : t("enrollmentStepper.stepAway")}
          </Typography>
        ) : clientName ? (
          <Typography className={classes.enrollmentStepperText}>
            {t("enrollmentStepper.campaignHeading")}
            <b>{clientName}</b>
            {t("enrollmentStepper.3EasySteps")}
          </Typography>
        ) : <Typography className={classes.enrollmentStepperText}>&nbsp;</Typography>}

        <Grid container className={classes.steperWrap} justifyContent="center">
          <Grid item xs sm md={2} lg={2} xl={2}>
            <img
              src={step === 1 ? VerifyYourselfActive : VerifyYourselfCompleted}
              alt={t("enrollmentStepper.verifyYourself")}
              width="76"
              height="76"
            />
            <Typography
              align="center"
              style={{ fontWeight: step === 1 && "bold" }}
              className={step > 1 && classes.greenStepperText}
            >
              {t("enrollmentStepper.verifyYourself")}
            </Typography>
          </Grid>
          <Grid item className={classes.connectingDivider}>
            <Divider />
          </Grid>
          <Grid item xs sm md={2} lg={2} xl={2}>
            <img
              src={
                step < 2
                  ? RegisterUpcoming
                  : step === 2
                  ? RegisterActive
                  : RegisterCompleted
              }
              alt={t("enrollmentStepper.register")}
              width="76"
              height="76"
            />
            <Typography
              align="center"
              style={{ fontWeight: step === 2 && "bold" }}
              className={
                step > 2
                  ? classes.greenStepperText
                  : step < 2 && classes.upcomingStepperText
              }
            >
              {step === 3 && !user.isLoggedIn
                ? t("enrollmentStepper.guest")
                : t("enrollmentStepper.register")}
            </Typography>
          </Grid>
          <Grid item className={classes.connectingDivider}>
            <Divider />
          </Grid>
          <Grid item xs sm md={2} lg={2} xl={2}>
            <img
              src={step < 3 ? SharePaymentUpcoming : SharePaymentActive}
              alt={t("enrollmentStepper.sharePayment")}
              width="76"
              height="76"
            />
            <Typography
              align="center"
              style={{ fontWeight: step === 3 && "bold" }}
              className={
                step > 3
                  ? classes.greenStepperText
                  : step < 3 && classes.upcomingStepperText
              }
            >
              {t("enrollmentStepper.sharePayment")}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default connect((state) => ({
  ...state.user,
}))(compose(withTranslation("common"))(EnrollmentStepper));
