import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  Button,
  Typography,
  DialogContent,
  DialogActions,
  DialogTitle,
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
});


const PreivewModal = (props) => {
  const {
    open,
    handleClose,
    imageName,
    dialogTitle,
    confirmButton,
    imageLocation,
    classes,
  } = props;
  return (
      <Dialog
        onClose={handleClose}
        className={classes.dialogModel}
        aria-labelledby='simple-dialog-title'
        open={open}
      >
        <DialogTitle
          className={classes.dialogTitleHeading}
          onClose={handleClose}
        >
          <Typography variant='h3'>{dialogTitle}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <img src={imageLocation} alt={imageName} style={{maxWidth:'635px'}} />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button variant='contained' color='primary' onClick={handleClose}>
            {confirmButton}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default withStyles(styles)(PreivewModal);

