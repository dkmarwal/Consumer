import React, { Component } from "react";
import {
  Box,
  Dialog,
  withStyles,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withTranslation } from "react-i18next";
import { compose } from "redux";

import { styles } from "./styles";
class USbankPrivacyPolicyViewer extends Component {

  privacyPolicyMessage = () => {
    const { message } = this.props;
    return (
      <Box py={5} px={3}>
        {message}
      </Box>
    )
  }

  render() {
    const { classes, handleClose, open = false, t, user, title } = this.props;
    const popupBGColor = user?.brandInfo?.themeColorAccent ?? null 
    return (
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={() => {}}
        onScroll={this.trackScrolling}
      >
        <DialogTitle id="customized-dialog-title" style={{paddingTop: 0, paddingBottom: 0}}>
          <Box display="flex" justifyContent="space-between" width="100%" position="relative">
            <Box p={1} pl={3} display="flex" alignItems="center">
              <Typography variant="h1" style={{fontWeight: 'bold'}}>
                {title}
              </Typography>
            </Box>
            <Box
              p={1}
              display="flex"
              justifyContent="flex-end"
              className={classes.closeIcon}
            >
              <IconButton onClick={() => handleClose()}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent dividers 
          style={{
            paddingTop: 0, 
            background: Boolean(popupBGColor) ? popupBGColor : "#fff",
            color: Boolean(popupBGColor) ? "#fff" : "#333"
          }}> 
          {this.privacyPolicyMessage()}
        </DialogContent>
      </Dialog>
    );
  }
}
export default compose(
  withTranslation("common"),
  withStyles(styles)
)(USbankPrivacyPolicyViewer);
