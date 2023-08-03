import React, { Component } from 'react';
import { styles } from './styles';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { PaymentMethodDialog } from '~/components/Dialogs';
import UpdateDialogContent from './updateDialogContent';
import StepDoneIcon from '~/assets/icons/Step_Done_main.svg';
import {
  updateEnableDisableRemittance,
  selectedPaymentType,
  updateSortedPaymentTypesList,
} from '~/redux/actions/paymentRegistration';
import SuccessDialog from '~/components/Dialogs/successDialog';
import { CircularProgress } from '@material-ui/core';
import { USBankPaymentMethodIds } from '../../config/paymentMethods';

class UpdateAccounts extends Component {
  state = {
    notificationMessage: null,
  };

  setNotificationMessage = (msg) => {
    this.setState({
      notificationMessage: msg,
    });
    this.props.closePaymentMethodsDialog();
  };
  closeDialog = () => {
    const { paymentRegistration, accounts } = this.props;
    if (
      paymentRegistration.consumerPaymentTypesList?.data?.preferredPaymentList
    ) {
      let primaryMethodId = accounts.consumerPaymentDetails?.data?.primaryPaymentMethodId
      if(primaryMethodId === USBankPaymentMethodIds['RTP']){
        primaryMethodId = USBankPaymentMethodIds['ACH']
      }
      const primaryMethodAvailable =
        paymentRegistration.consumerPaymentTypesList.data.preferredPaymentList?.filter(
          (item) =>
            item.paymentTypeId ===
            primaryMethodId
        );
      if (primaryMethodAvailable?.length) {
        const selectedPaymentMethodIndex =
          paymentRegistration.consumerPaymentTypesList?.data?.preferredPaymentList?.findIndex(
            (item) =>
              item.paymentCode === primaryMethodAvailable[0]?.paymentCode
          ) ?? 0;
        const paymentMethodsList = [
          ...paymentRegistration.consumerPaymentTypesList.data
            .preferredPaymentList,
        ];
        const firstIndexPaymentMethod =
          paymentRegistration.consumerPaymentTypesList.data
            .preferredPaymentList[0];
        paymentMethodsList[0] = paymentMethodsList[selectedPaymentMethodIndex];
        paymentMethodsList[selectedPaymentMethodIndex] =
          firstIndexPaymentMethod;
        this.props.dispatch(updateSortedPaymentTypesList(paymentMethodsList));
        this.props.dispatch(
          selectedPaymentType(primaryMethodAvailable[0].paymentCode)
        );
      } else {
        this.props.dispatch(selectedPaymentType(null));
        this.props.dispatch(updateSortedPaymentTypesList(null));
      }
    }
    this.props.closePaymentMethodsDialog();
  };
  handleCloseDialog = () => {
    this.props.closePaymentMethodsDialog();
    this.props.dispatch(updateEnableDisableRemittance(false));
  };
  render() {
    const { classes, openDialog, t } = this.props;

    return (
      <>
        <PaymentMethodDialog
          open={openDialog}
          dialogClassName={classes.paymentPopup}
          width={'896px'}
          height={'500px'}
          title={t('updatedAccounts.heading.updatePreferredPaymentMethod')}
          isDataSecure={true}
          onConfirm={this.closeDialog}
        >
          {this.props.paymentRegistration.consumerPaymentTypesList?.data ? (
            <UpdateDialogContent
              closePaymentMethodsDialog={this.handleCloseDialog}
              setNotificationMessage={this.setNotificationMessage}
              closeDialog={this.closeDialog}
            />
          ) : (
            <CircularProgress />
          )}
        </PaymentMethodDialog>
        {this.state.notificationMessage && (
          <SuccessDialog
            open={Boolean(this.state.notificationMessage)}
            dialogText={this.state.notificationMessage}
            dialogIcon={StepDoneIcon}
            dialogTitle={t('updatedAccounts.heading.updateDetails')}
            buttonName={t('updatedAccounts.buttonLabel.okay')}
            handleDialogClose={() => {
              this.setNotificationMessage(null);
            }}
          />
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.paymentRegistration,
    ...state.accounts,
  }))(withStyles(styles)(UpdateAccounts))
);
