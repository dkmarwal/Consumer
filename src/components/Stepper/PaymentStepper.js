import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import StepCancelled from "~/assets/icons/step_cancelled.svg";
import StepFailed from "~/assets/icons/Step_failed.svg";
import StepCompleted from "~/assets/icons/Step_completed.svg";
import clsx from "clsx";
import { PAYMENT_STATUS } from "~/config/paymentMethods";

const stepLabelStyles = makeStyles({
  label: {
    height: "18px",
    fontSize: "16px",
    letterSpacing: 0,
    lineHeight: "16px",
    textAlign: "center",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& .MuiStepper-root": {
      padding: 0,
    },
    [theme.breakpoints.down("sm")]: {
      "& .MuiStepper-root": {
        padding: 0,
      },
    },
    "& .MuiStepLabel-root": {
      [theme.breakpoints.down("xs")]: {
        padding: 0,
      },
    },
  },
  exceptionConnector: {
    "& .MuiStep-completed, & .MuiStepConnector-active": {
      "& .MuiStepConnector-lineHorizontal": {
        borderColor: "#f44336 !important",
      },
    },
  },
  customStepperWrapper: {
    "& .MuiStep-completed, & .MuiStepConnector-active": {
      "& .MuiStepConnector-lineHorizontal": {
        borderColor: "#4C4C4C",
      },

      "& .MuiStepConnector-lineVertical": {
        borderColor: "#4C4C4C",
      },
    },
    "& .MuiStepConnector-line": {
      borderColor: "#4C4C4C",
    },
    "& .MuiStepLabel-label": {
      color: "#4c4c4c",
    },
    "& .MuiStepLabel-active ": {
      color: theme.palette.text.heading,
      fontWeight: 500,
    },
    "& .MuiStepLabel-completed": {
      color: "#27AE60",
    },

    "& .MuiStepIcon-root.MuiStepIcon-completed": {
      height: "24px",
      width: "24px",
      color: "#fff",
      border: `2px solid ${theme.palette.text.heading}`,
      borderRadius: "50%",
      // backgroundColor: theme.palette.secondary.main
    },
    "& .MuiStepIcon-root.MuiStepIcon-active": {
      border: `2px solid ${theme.palette.text.heading}`,
      "& .MuiStepIcon-text": {
        fill: theme.palette.text.heading,
      },
    },
    "& .MuiStepIcon-root": {
      height: "24px",
      width: "24px",
      color: "#fff",
      border: "2px solid #4c4c4c",
      borderRadius: "50%",
      "& .MuiStepIcon-text": {
        fill: "#4c4c4c",
      },
    },
    "& .MuiStepIcon-root.Mui-error": {
      color: "#f44336 !important",
      border: "2px solid #f44336",
      padding: "2px",
    },
    "& .MuiStepLabel-label.Mui-error": {
      color: "#f44336 !important",
    },
    "& .MuiStepConnector-alternativeLabel": {
      top: "16px",
      left: "calc(-50% + 17px)",
      right: "calc(50% + 17px)",
      position: "absolute",
      [theme.breakpoints.between("xs", "sm")]: {
        top: 0,
        left: 0,
        right: 0,
        position: "static",
      },
    },
    "& .MuiStepConnector-vertical": {
      [theme.breakpoints.between("xs", "sm")]: {
        marginLeft: "20px",
        paddingBottom: theme.spacing(0),
      },
    },
    "& .MuiStepLabel-root.MuiStepLabel-alternativeLabel": {
      [theme.breakpoints.between("xs", "sm")]: {
        flexDirection: "row",
      },
    },
    "& .MuiStepLabel-iconContainer.MuiStepLabel-alternativeLabel": {
      marginTop: "4px",
      [theme.breakpoints.between("xs", "sm")]: {
        marginTop: 0,
        marginLeft: "8px",
      },
    },
    "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
      [theme.breakpoints.between("xs", "sm")]: {
        marginTop: 0,
        marginLeft: "16px",
        textAlign: "left",
      },
    },
    "& .MuiStepConnector-lineHorizontal": {
      borderTopWidth: "1px",
    },
    "& span.MuiTypography-root.MuiTypography-caption": {
      display: "block",
    },
  },
}));

export default function PaymentStepper(props) {
  const { isPaymentCancelled = false, stepsList, activeStep } = props;
  const classes = useStyles();
  const stepLabelClasses = stepLabelStyles();

  const renderStepIcon = (imgSrc) => {
    if (imgSrc) {
      return <img src={imgSrc} alt="" />;
    }
    return null;
  };

  const getSrcIcon = (stepIndexVal, el) => {
    if (isPaymentCancelled) {
      if (stepIndexVal < activeStep) {
        return StepFailed;
      } else if (stepIndexVal === activeStep) {
        return StepCancelled;
      }
      return null;
    } else {
      if (
        stepIndexVal < activeStep ||
        (el.IsStatusUpdated && el.StatusID == PAYMENT_STATUS.COMPLETED)
      ) {
        return StepCompleted;
      }
      return null;
    }
  };

  return (
    <div className={classes.root}>
      <div
        className={clsx(
          classes.customStepperWrapper,
          isPaymentCancelled && classes.exceptionConnector
        )}
      >
        <Stepper
          alternativeLabel
          activeStep={null}
          orientation={window.innerWidth < 959 ? "vertical" : "horizontal"}
        >
          {stepsList.map((el, index) => (
            // if(index < stepsList.len)
            // const pos = stepsList.find(index+1)
            <Step key={el.StatusID}>
              <StepLabel
                classes={stepLabelClasses}
                active={activeStep == index ? true : false}
                completed={
                  (el.IsStatusUpdated &&
                    el.StatusID == PAYMENT_STATUS.COMPLETED) ||
                  activeStep > index
                    ? true
                    : false
                }
                error={
                  el.IsFailed || (isPaymentCancelled && index <= activeStep)
                    ? true
                    : false
                }
                icon={
                  renderStepIcon(getSrcIcon(index, el)) ??
                  (stepsList.indexOf(el) + 1).toString()
                }
              >
                {el.Description}
                {index <= activeStep && (
                  <Typography variant="caption">
                    {el.StatusUpdatedAt ? el.StatusUpdatedAt : ""}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
}
