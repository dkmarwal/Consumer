const initialState = {
  usbankpaymentRegistration: {
    focusInfo: null, 
    consumerPaymentTypesList: null,
  },
};

export default function usbankpaymentRegistration(state = initialState, action = {}) {
  switch (action.type) {
   
    case 'FOCUS_INFO_SUCCESS':
      return {
        ...state,
        usbankpaymentRegistration: {
          ...state.usbankpaymentRegistration,
          focusInfo: { data: action.payload, error: null },
        },
      };
    case 'FOCUS_INFO_FAILED': {
      return {
        ...state,
        usbankpaymentRegistration: {
          ...state.usbankpaymentRegistration,
          focusInfo: {
            ...state.usbankpaymentRegistration.checkInfo,
            error: action.payload,
          },
        },
      };
    }
    case 'FETCH_CONSUMER_PAYMENT_TYPES_LIST_SUCCESS':
      return {
        ...state,
        usbankpaymentRegistration: {
          ...state.usbankpaymentRegistration,
          consumerPaymentTypesList: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_CONSUMER_PAYMENT_TYPES_LIST_FAILED':
      return {
        ...state,
        usbankpaymentRegistration: {
          ...state.usbankpaymentRegistration,
          consumerPaymentTypesList: {
            ...state.paymentRegistration.consumerPaymentTypesList,
            error: action.payload,
          },
        },
      };
   
    default:
      return { ...state };
  }
}