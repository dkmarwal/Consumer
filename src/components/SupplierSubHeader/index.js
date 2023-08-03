import React, { Component } from "react";
import {
  Typography,
  Paper,
  Box,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import "./styles.scss";
import GlobalStyled from "~/globalStyled.js";

class SupplierSubHeader extends Component {

  render() {
    const { classes, title } = this.props;

    return (
      <Paper square className={classes.root}>
        <Box display="flex" flexDirection="column">
          <Box pb="48px">
            <Typography
              variant="h2"
              className={classes.headingTop}
              style={{ paddingTop: "20px" }}
            >
              {title}
            </Typography>
          </Box>
          <Box>{/* <NavBar {...this.props} /> */}</Box>
        </Box>
      </Paper>
    );
  }
}

export default withStyles(GlobalStyled)(SupplierSubHeader);
