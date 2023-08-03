import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '~/assets/icons/white_checkCircle.svg';
import { connect } from 'react-redux';
import { updateSnackbar } from '~/redux/actions/consumerRegistration';

const useStyles = makeStyles(() => ({
  alertBox: {
    '& .MuiAlert-standardSuccess': {
      backgroundColor: `#2B2D30!important`,
      color: '#fff!important',
    },
    bottom: '56px',
  },
  checkIcon: {
    color: '#fff',
  },
}));

const SnackbarComponent = (props) => {
  const { consumer } = props;
  const classes = useStyles();

  const handleSnackbarClose = () => {
    props.dispatch(
      updateSnackbar({ message: '', severity: 'success', openSnackbar: false })
    );
  };

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      open={consumer.updatedSnackbarData?.openSnackbar}
      className={classes.alertBox}
      autoHideDuration={5000}
      key={consumer.updatedSnackbarData?.message}
      onClose={() => handleSnackbarClose()}
    >
      <Alert
        icon={<img src={CheckCircleIcon} alt="Success" />}
        onClose={() => handleSnackbarClose()}
      >
        {consumer.updatedSnackbarData?.message}
      </Alert>
    </Snackbar>
  );
};

export default connect((state) => ({
  ...state.consumerVerification,
}))(SnackbarComponent);
