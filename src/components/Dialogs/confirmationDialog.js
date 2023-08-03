import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  dialogTitle: {
    color: theme.palette.text.main,
    textAlign: 'center',
    '& .MuiTypography-root': {
      fontSize: '24px',
    },
  },
  dialogContent: {
    textAlign: 'center',
    '& .MuiDialogContentText-root': {
      color: '#0B1941',
      fontSize: '16px',
    },
    '&.MuiDialogContent-root': {
      padding: 0,
    },
  },
  confirmationDialog: {
    '& .MuiDialog-paperScrollPaper': {
      maxWidth: '485px !important',
      padding: theme.spacing(4, 7),
    },
  },
  dialogActions: {
    '&.MuiDialogActions-root': {
      justifyContent: 'space-around',
    },
  },
  deleteButton: {
    width: 140,
    cursor: 'pointer',
  },
  cancelButton: {
    width: 140,
    cursor: 'pointer',
  },
});

const ConfirmationDialog = (props) => {
  const {
    open,
    handleClose,
    classes,
    handleConfirmation,
    dialogTitle,
    dialogContentText,
    confrimationButtonName,
    cancelButtonName,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      className={classes.confirmationDialog}
    >
      <DialogTitle className={classes.dialogTitle} id='alert-dialog-title'>
        {dialogTitle}
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText id='alert-dialog-description'>
          {dialogContentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        {confrimationButtonName && (
          <Button
            className={classes.deleteButton}
            onClick={handleConfirmation}
            color='primary'
            variant='outlined'
          >
            {confrimationButtonName}
          </Button>
        )}
        {cancelButtonName && (
          <Button
            className={classes.cancelButton}
            onClick={handleClose}
            variant='contained'
            color='primary'
          >
            {cancelButtonName}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(ConfirmationDialog);
