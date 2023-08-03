import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import {withTranslation} from 'react-i18next'


const stepLabelStyles = makeStyles({
  label: {
    height: "18px",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: "16px",
    textAlign: "center",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  customStepperWrapper: {
    "& .MuiStep-completed, & .MuiStepConnector-active": {
      "& .MuiStepConnector-lineHorizontal": {
        // borderColor :'#6094B1'
      },
    },
    "& .MuiStepLabel-completed": {
      color: "#6094B1",
    },
    "& .MuiStepLabel-active ": {
      // color: '#121212'
    },
    "& .MuiStepIcon-root.MuiStepIcon-completed": {
      height: "28px",
      width: "28px",
      color: "#fff",
      border: "3px solid #6094B1",
      borderRadius: "50%",
      backgroundColor: "#6094B1",
    },
    "& .MuiStepIcon-root.MuiStepIcon-active": {
      // height:'28px',
      // width:'28px',
      // color:'#fff',
      // border: '3px solid #121212',
      // borderRadius : "50%",
      // '& .MuiStepIcon-text' : {
      //     fill : '#121212'
      // }
    },
    "& .MuiStepIcon-root": {
      height: "28px",
      width: "28px",
      color: "#fff",
      border: "3px solid #CECECE",
      borderRadius: "50%",
      backgroundColor: "#7F7F7F",
      "& .MuiStepIcon-text": {
        fill: "#7F7F7F",
      },
    },
    "& .MuiStepConnector-alternativeLabel": {
      top: "16px",
      left: "calc(-50% + 17px)",
      right: "calc(50% + 17px)",
      position: "absolute",
    },
    "& .MuiStepConnector-lineHorizontal": {
      borderTopWidth: "2px",
    },
  },
}));

function CustomizedSteppers(props) {
  const classes = useStyles();
  const stepLabelClasses = stepLabelStyles();
  const steps = props.stepsList;
  const {t} = props;

  return (
    <div className={classes.root}>
      <div className={classes.customStepperWrapper}>
        <Stepper alternativeLabel activeStep={props.activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel classes={stepLabelClasses}>{t(`stepper.stepperInfo.${label}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
}

export default withTranslation('common')(CustomizedSteppers)
