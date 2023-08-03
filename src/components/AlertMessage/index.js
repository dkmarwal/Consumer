import React from "react";
import Grid from "@material-ui/core/Grid";
import WarningIcon from "~/assets/icons/warning.svg";
import CloseIcon from "~/assets/icons/close.svg";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  error: {
    background: "#FCE9E9",
    border: "1px solid #E02020",
  },
  closeIcon: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    [theme.breakpoints.down("sm")]: { position: "absolute", right: "5px" },
  },
  alertOuterCont: {
    display: "flex",
    width: "100%",
    borderRadius: "4px",
    padding: "9px",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      position: "relative",
      justifyContent: "flex-start",
    },
  },
  alertText: {
    color: "#E02020",
    fontSize: "14px",
    textAlign: "left",
    paddingLeft: theme.spacing(1),
  },
}));

const AlertMessage = (props) => {
  const { alertType, alertTitleMsg } = props;
  const classes = useStyles();
  return (
    <Grid
      container
      className={clsx(classes.alertOuterCont, classes[alertType])}
    >
      <Grid item xs={1} md={1} justifyContent="center">
        <img src={WarningIcon} alt="warning" />
      </Grid>
      <Grid item xs={10} md={10}>
        <Typography className={classes.alertText}>{alertTitleMsg}</Typography>
      </Grid>
      <Grid item className={classes.closeIcon} md={1}>
        <img src={CloseIcon} alt="close" />
      </Grid>
    </Grid>
  );
};

export default AlertMessage;
