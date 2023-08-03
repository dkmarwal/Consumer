import React from "react";
import { withStyles } from "@material-ui/styles";
import { styles } from "./styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";

const ConsumerRegistrationSubHeader = (props) => {
  const { classes, subHeaderText } = props;
  // const subHeaderText =
  //   paymentRegistration?.consumerPaymentTypesList?.data?.description;
  return (
    <Grid container className={classes.subHeaderContainer}>
      <Grid item className={classes.subHeaderItem}>
        <Typography className={classes.stepDetailText}>
          {subHeaderText}
        </Typography>
      </Grid>
    </Grid>
  );
};
export default connect((state) => ({ ...state.paymentRegistration }))(
  withStyles(styles)(ConsumerRegistrationSubHeader)
);
