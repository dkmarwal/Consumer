import React, { Component } from 'react';
import { styles } from './styles';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import Modal from '@material-ui/core/Modal';
import {Button} from '@material-ui/core'

class AlertBox extends Component {
  render() {
    const { open, handleClose, classes, heading, text, icon,t, buttonText } = this.props;
    const body = (
      <div className={classes.paper}>
        <div className={classes.image}>
          {icon === 'success' && (
            <img src={require(`~/assets/icons/tickIcons.png`)} alt={'Icon'} />
          )}

          {icon === 'error' && (
            <img src={require(`~/assets/icons/tickIcons.png`)} alt={'Icon'} />
          )}

          {icon === 'warning' && (
            <img src={require(`~/assets/icons/tickIcons.png`)} alt={'Icon'} />
          )}
        </div>
        <div className={classes.heading}>
          <h2 className={classes.headingText}>{heading && heading}</h2>
        </div>
        <div className={classes.message}>
          <p className={classes.messageText}>{text && text}</p>
        </div>
        <span className={classes.closeButton}>
          <Button
            className={classes.closeButtonText}
            onClick={handleClose}
            color="primary"
            variant="contained"
          >
            {buttonText ? buttonText : t('alerts.okay')}
          </Button>
        </span>
      </div>
    );

    return (
      <>
        <div>
          <Modal open={open} onClose={handleClose} disableBackdropClick={true}>
            {body}
          </Modal>
        </div>
      </>
    );
  }
}

export default withTranslation('common')(withStyles(styles)(AlertBox));
