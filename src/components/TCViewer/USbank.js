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
//import { fetchBrandingDetail } from "~/redux/actions/consumerRegistration";

import { styles } from "./styles";
class USbankTCViewer extends Component {

  termServicesMessage = () => {
    const { message } = this.props;
    return (
      <Box py={5} px={3}>
        {message}
      </Box>
    )
  }

  render() {
    const { classes, handleClose, open = false, t, user, title } = this.props;
    const popupBGColor = user?.brandInfo?.themeColorAccent ?? null;
    const userInfo = this.props.user?.brandInfo;
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
              <Typography variant="h2" style={{fontWeight: 'bold'}}>
              {userInfo.clientName} {t("payeeVerification.termServicesTitle")}
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
          {this.termServicesMessage()}
        </DialogContent>
      </Dialog>
    );
  }
}

export default compose(withTranslation("common"), withStyles(styles))(USbankTCViewer);
