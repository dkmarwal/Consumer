import React, { Component } from 'react';
import { styles } from './styles';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { PaymentMethodDialog } from '~/components/Dialogs';
import AlternatePaymentMethod from './AlternatePaymentMethod';
import StepDoneIcon from '~/assets/icons/Step_Done_main.svg';
import SuccessDialog from '~/components/Dialogs/successDialog';
import { selectedAlternatePaymentType,updateSortedAlternatePaymentTypesList } from '~/redux/actions/paymentRegistration';

class AlternatePMDialog extends Component {
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
    const secondaryPaymentMethodId =
      this.props.accounts.consumerPaymentDetails?.data?.secondaryPaymentMethodId;
    const alternatePaymentMethods =
    this.props.accounts?.secondaryPaymentMethodList?.data
      ?.alternatePaymentMethods;
    const isSecondaryMethodAvailable = alternatePaymentMethods?.filter(
      (item) => item.paymentTypeId === secondaryPaymentMethodId
    );
    if(isSecondaryMethodAvailable?.length){
      this.props.dispatch(
        selectedAlternatePaymentType(
          isSecondaryMethodAvailable[0].paymentCode
        )
      );
    } else {
      this.props.dispatch(
        selectedAlternatePaymentType(
          alternatePaymentMethods[0]
            ?.paymentCode
        )
      );
    }
    this.props.dispatch(
      updateSortedAlternatePaymentTypesList(null)
    );

    this.props.closePaymentMethodsDialog();
  };
  render() {
    const {
      classes,
      openDialog,
      closePaymentMethodsDialog,
      t,
      accounts,
      loadData,
      setnotificationMessage,
    } = this.props;
    const secondaryPaymentMethodId =
      accounts.consumerPaymentDetails?.data?.secondaryPaymentMethodId;
    const alternatePaymentMethods =
      accounts?.secondaryPaymentMethodList?.data
        ?.alternatePaymentMethods;
    const isSecondaryMethodAvailable = alternatePaymentMethods?.filter(
      (item) => item.paymentTypeId === secondaryPaymentMethodId
    );
    return (
      <>
        <PaymentMethodDialog
          open={openDialog}
          onConfirm={() => this.closeDialog()}
          onClose={() => closePaymentMethodsDialog()}
          dialogClassName={classes.paymentPopup}
          width={"896px"}
          title={
            secondaryPaymentMethodId === null
              ? t('updatedAccounts.heading.addAlternatePaymentMethod')
              : t('updatedAccounts.heading.updateAlternatePaymentMethod')
          }
          isDataSecure={true}
        >
          <AlternatePaymentMethod
            closePaymentMethodsDialog={closePaymentMethodsDialog}
            setNotificationMessage={this.setNotificationMessage}
            isSecondaryMethodAvailable={isSecondaryMethodAvailable}
            loadData={loadData}
            setnotificationMessage={setnotificationMessage}
            closeDialog={this.closeDialog}
          />
        </PaymentMethodDialog>
        {this.state.notificationMessage && (
          <SuccessDialog
            open={Boolean(this.state.notificationMessage)}
            dialogText={this.state.notificationMessage}
            dialogIcon={StepDoneIcon}
            dialogTitle={t(
              "updatedAccounts.heading.secondaryPaymentMethodAdded"
            )}
            buttonName={t("updatedAccounts.buttonLabel.okay")}
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
    ...state.accounts,
    ...state.paymentRegistration,
  }))(withStyles(styles)(AlternatePMDialog))
);
