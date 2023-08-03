export const styles = (theme) => ({
  paper: {
    position: 'absolute',
    width: 516,
    backgroundColor: '#FFFFFF',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    display: 'flex',
    alignItem: 'center',
    flexDirection: 'column',
    transform: 'translate(-50%, -50%)',
  },
  image: {
    display: 'flex',
    justifyContent: 'center',
  },
  heading: {
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'center',
    padding: '10px',
    headingText: {
      fontFamily: 'Interstate',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '16px',
      lineHeight: '20px',
      color: ' #272727',
    },
  },
  message: {
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'center',
    padding: '10px',
    messageText: {
      fontFamily: 'Interstate',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '16px',
      lineHeight: '24px',
      color: '#353535',
    },
  },
  closeButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
  },
  closeButtonText: {
    // padding: "10px 48px",
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.primary.main,
    },
  },
});
