export const styles = (theme) => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  filterText: {
    color: theme.palette.text.main,
    fontSize: '16px',
    letterSpacing: '0.25px',
  },
  itemSelected: {
    border: '2px solid ',
    margin: '0px 10px 5px 0px',
    fontSize: '14px',
    fontWeight: '500',
  },
  item: {
    margin: '0px 15px 5px 0px',
    fontSize: '14px',
    background: theme.palette.background.default,
    border: 'none',
    fontWeight: '500',
    color: theme.palette.text.black,
  },
  imgIcon: {
    width: '13px',
    height: '12px',
  },
  btnScpace: {
    fontSize: '14px !important',
  },

  gridBox: {
    height: '40px',
    marginBottom: '16px',
    width: '100%',
  },
  datePicker: {
    margin: 'auto 0',
    width: '90%',
    '& .MuiOutlinedInput-input': {
      padding: 10,
      paddingRight: 0,
      fontSize: '14px',
    },
    '& .MuiOutlinedInput-adornedEnd': {
      height: 48,
      paddingRight: '6px',
    },            
  },
  errorMessage: {
    fontSize: '12px',
    position: 'relative',
    top: '5px',
    color: 'red',
    marginTop: '0',
    height: '0',
  },
  amountTextField: {
    '& .MuiOutlinedInput-root': {
      height: 48,
    },
  },
  filterChips: {
    color: theme.palette.text.light,
    '&.MuiChip-root': {
      backgroundColor: '#F4F4F4',
    },
    '&.MuiChip-clickable:hover': {
      backgroundColor: '#F4F4F4',
    },
    '&.MuiChip-colorSecondary': {
      backgroundColor: theme.palette.text.heading,
      color:theme.palette.common.white
    },
    '&.MuiChip-clickableColorSecondary:hover':{
      backgroundColor: theme.palette.text.heading,
      color:theme.palette.common.white
    }
  },  
});
