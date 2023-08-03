import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  Button,
  Typography,
  DialogContent,
  DialogActions,
  DialogTitle,
  Box
} from '@material-ui/core';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogModel: {
    '& .MuiDialog-paperScrollPaper': {
      display: 'block',
      padding: theme.spacing(4, 0),
      maxWidth: '700px',
      borderRadius: '6px',
      boxShadow:
        '0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px -1px rgba(0, 0, 0, 0.12), 0px 2px 4px -1px rgba(0, 0, 0, 0.2)',
    },
  },
  dialogTitleHeading: {
    color: '#000000',
    paddingTop: theme.spacing(0),
  },
  dialogActions: {
    justifyContent: 'center',
  },
  contentBox:{
    "& ul":{
      paddingLeft: 40,
      margin: "1em 0"
    },
    "& ol":{
      paddingLeft: 40,
      margin: "1em 0"
    }
  }
});


const FormViewer = (props) => {
  const {
    open,
    handleClose,
    handleConfirm,
    dataUrl,
    dialogTitle,
    classes,
    formId
  } = props;
  return (
      <Dialog
      fullWidth={true}
              maxWidth="md"
        onClose={handleClose}
        className={classes.dialogModel}
        aria-labelledby='simple-dialog-title'
        open={open}
      >
        <DialogTitle
          className={classes.dialogTitleHeading}
          onClose={handleClose}
        >
            {/* <Box display="flex" width="100%" position="relative">
            <Box p={1} pl={3} display="flex" alignItems="center"> */}
          <Typography variant='h3'>{dialogTitle}</Typography>
          {/* </Box>
          </Box> */}
        </DialogTitle>
        <DialogContent dividers>
        <Box
              // display="flex"
              // justifyContent="center"
              // width="100%"
              // height="600px"   
              // className={classes.contentBox}           
            >
        <iframe
                  id="faq"
                  title={dialogTitle}
                  // name={t("pdfViewer.label.faq")}
                  src={dataUrl}
                  // onLoad={this.hideLoader}
                  width="100%"
                  height="100%"
                ></iframe>
                </Box>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button variant='contained' color='primary' onClick={handleClose}>
            {"CANCEL"}
          </Button>
          <Button variant='contained' color='primary' onClick={handleConfirm}>
            {"OKAY"}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default withStyles(styles)(FormViewer);

