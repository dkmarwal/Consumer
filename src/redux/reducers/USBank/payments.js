const initialState = {
    usBankpayment: {     
      storedPrepaidCardData: null,
    },
  };
  
  export default function USbankpayment(state = initialState, action = {}) {
    switch (action.type) {


case 'FETCH_USBANK_PREPAID_CARD_DATA_SUCCESS': {
    return {
      ...state,
      usBankpayment: {
        ...state.usBankpayment,
        storedPrepaidCardData: {
          data: action.payload,
          error: null,
        },
      },
    };
  }
  case 'FETCH_USBANK_PREPAID_CARD_DATA_FAILED': {
    return {
      ...state,
      usBankpayment: {
        ...state.usBankpayment,
        storedPrepaidCardData: {
          ...state.usBankpayment.storedPrepaidCardData,
          error: action.payload,
        },
      },
    };
  }
  default:
    return {
      ...state,
    };
}
}
