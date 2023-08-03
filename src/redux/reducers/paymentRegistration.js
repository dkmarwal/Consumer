const initialState = {
  paymentRegistration: {
    selectedPaymentTypeCode: null,
    checkInfo: null,
    ACHInfo: null,
    payPalInfo: null,
    pushToCardInfo: null,
    depositToDebitCardInfoData: null,
    consumerPaymentTypesList: null,
    remittanceConfigInfo: null,
    selectedRemittanceConfigData: null,
    remittanceDetails: null,
    isRemittanceEnabled: false,
    zelleInfo: null,
    selectedAlternatePaymentTypeCode: null,
    deleteAlternatepayment: null,
    updatedPaymentTypesList: null,
    updatedAlternatePaymentTypesList: null,
    isUsernameValid: null,
    phoneNumber: null
  },
};

export default function paymentRegistration(state = initialState, action = {}) {
  switch (action.type) {
    case 'SELECTED_PAYMENT_TYPE':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          selectedPaymentTypeCode: action.payload,
        },
      };
    case 'CREATE_CONSUMER_CHECK_INFO_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          checkInfo: { data: action.payload, error: null },
        },
      };
    case 'CREATE_CONSUMER_CHECK_INFO_FAILED': {
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          checkInfo: {
            ...state.paymentRegistration.checkInfo,
            error: action.payload,
          },
        },
      };
    }
    case 'CREATE_CONSUMER_PAYPAL_INFO_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          payPalInfo: { data: action.payload, error: null },
        },
      };
    case 'CREATE_CONSUMER_PAYPAL_INFO_FAILED':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          payPalInfo: {
            ...state.paymentRegistration.payPalInfo,
            error: action.payload,
          },
        },
      };
    case 'CREATE_CONSUMER_PUSH_TO_CARD_INFO_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          pushToCardInfo: { data: action.payload, error: null },
        },
      };
    case 'CREATE_CONSUMER_PUSH_TO_CARD_INFO_FAILED':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          pushToCardInfo: {
            ...state.paymentRegistration.pushToCardInfo,
            error: action.payload,
          },
        },
      };
      case 'CREATE_CONSUMER_DEPOSIT_TO_DEBIT_CARD_INFO_SUCCESS':
        return {
          ...state,
          paymentRegistration: {
            ...state.paymentRegistration,
            depositToDebitCardInfoData: { data: action.payload, error: null },
          },
        };
      case 'CREATE_CONSUMER_DEPOSIT_TO_DEBIT_CARD_INFO_FAILED':
        return {
          ...state,
          paymentRegistration: {
            ...state.paymentRegistration,
            depositToDebitCardInfoData: {
              ...state.paymentRegistration.depositToDebitCardInfoData,
              error: action.payload,
            },
          },
        };
    case 'CREATE_CONSUMER_ACH_INFO_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          ACHInfo: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'CREATE_CONSUMER_ACH_INFO_FAILED': {
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          ACHInfo: {
            ...state.paymentRegistration.ACHInfo,
            error: action.payload,
          },
        },
      };
    }
    case 'FETCH_CONSUMER_PAYMENT_TYPES_LIST_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          consumerPaymentTypesList: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_CONSUMER_PAYMENT_TYPES_LIST_FAILED':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          consumerPaymentTypesList: {
            ...state.paymentRegistration.consumerPaymentTypesList,
            error: action.payload,
          },
        },
      };
    case 'UPDATE_FETCH_CONSUMER_PAYMENT_TYPES_LIST_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          consumerPaymentTypesList: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'UPDATE_CONSUMER_REMITTANCE_CONFIG_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          remittanceConfigInfo: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'UPDATE_CONSUMER_REMITTANCE_CONFIG_FAILED':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          remittanceConfigInfo: {
            ...state.paymentRegistration.remittanceConfigInfo,
            error: action.payload,
          },
        },
      };
    case 'SELECTED_REMITTANCE_CONFIG_DATA':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          selectedRemittanceConfigData: action.payload,
        },
      };
    case 'FETCH_REMITTANCE_DETAILS_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          remittanceDetails: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_REMITTANCE_DETAILS_FAILED':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          remittanceDetails: {
            ...state.paymentRegistration.remittanceDetails,
            error: action.payload,
          },
        },
      };
    case 'UPDATE_ENABLE_DISABLE_REMITTANCE': {
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          isRemittanceEnabled: action.payload,
        },
      };
    }
    case 'ZELLE_INFO_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          zelleInfo: {
            data: action.payload,
            message: action.message,
            error: null,
          },
        },
      };
    case 'ZELLE_INFO_FAILED':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          zelleInfo: {
            error: action.payload,
          },
        },
      };
      case 'FOCUS_INFO_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          focusInfo: { data: action.payload, error: null },
        },
      };
    case 'FOCUS_INFO_FAILED': {
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          focusInfo: {
            ...state.paymentRegistration.checkInfo,
            error: action.payload,
          },
        },
      };
    }

    case 'SELECTED_ALTERNATE_PAYMENT_TYPE':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          selectedAlternatePaymentTypeCode: action.payload,
        },
      };
    case 'DELETE_ALTERNATE_PAYMENT_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          deleteAlternatepayment: {
            data: action.payload,
            message: action.message,
            error: null,
          },
        },
      };

    case 'DELETE_ALTERNATE_PAYMENT_FAILED':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          deleteAlternatepayment: {
            error: action.payload,
          },
        },
      };
    case 'UPDATE_SORTED_PAYMENT_TYPE_LIST':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          updatedPaymentTypesList: action.payload,
        },
      };
    case 'UPDATE_SORTED_ALTERNATE_PAYMENT_TYPE_LIST':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          updatedAlternatePaymentTypesList: action.payload,
        },
      };
    case 'VERIFY_USERNAME_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          isUsernameValid: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'VERIFY_USERNAME_FAILED':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          isUsernameValid: {
            ...state.paymentRegistration.isUsernameValid,
            error: action.payload,
          },
        },
      };
    case 'UPDATE_PHONE_SUCCESS':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          phoneNumber: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'UPDATE_PHONE_FAILED':
      return {
        ...state,
        paymentRegistration: {
          ...state.paymentRegistration,
          phoneNumber: {
            ...state.paymentRegistration.phoneNumber,
            error: action.payload,
          },
        },
      };
    case 'RESET_CONSUMER_PAYMENT_TYPES_LIST_DATA':
      return {
        ...state,
        paymentRegistration: {
          selectedPaymentTypeCode: null,
          checkInfo: null,
          ACHInfo: null,
          payPalInfo: null,
          pushToCardInfo: null,
          depositToDebitCardInfoData: null,
          consumerPaymentTypesList: null,
          remittanceConfigInfo: null,
          selectedRemittanceConfigData: null,
          remittanceDetails: null,
          isRemittanceEnabled: false,
          zelleInfo: null,
          selectedAlternatePaymentTypeCode: null,
          deleteAlternatepayment: null,
          updatedPaymentTypesList: null,
          updatedAlternatePaymentTypesList: null,
          isUsernameValid: null,
          phoneNumber: null
        },
      };
    default:
      return { ...state };
  }
}