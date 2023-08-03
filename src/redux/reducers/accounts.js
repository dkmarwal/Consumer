const initialState = {
  accounts: {
    consumerPaymentDetails: null,
    checkInfo: null,
    depositToDebitCardInfoData:null,
    focusInfo:null,
    ACHInfo: null,
    payPalInfo: null,
    pushToCardInfo: null,
    zelleInfo: null,
    statusIdList: null,
    payeePaymentFilters: {
      paymentTypeIDs: '',
      FromDate: null,
      ToDate: null,
      MinAmount: null,
      MaxAmount: null,
      statusIDs: '',
    },
    secondaryPaymentMethodList: null,
    remittanceStatus: null,
  },
};

export default function accounts(state = initialState, action = {}) {
  switch (action.type) {
    case 'FETCH_CONSUMER_PAYMENT_DETAILS_SUCCESS':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          consumerPaymentDetails: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_CONSUMER_PAYMENT_DETAILS_FAILED':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          consumerPaymentDetails: {
            ...state.accounts.consumerPaymentDetails,
            error: action.payload,
          },
        },
      };
    case 'FETCH_STATUS_ID_SUCCESS':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          statusIdList: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_STATUS_ID_FAILED':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          statusIdList: {
            ...state.accounts.statusIdList,
            error: action.payload,
          },
        },
      };
    case 'UPDATE_CONSUMER_CHECK_INFO_SUCCESS':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          checkInfo: { data: action.payload, error: null },
        },
      };
    case 'UPDATE_CONSUMER_CHECK_INFO_FAILED': {
      return {
        ...state,
        accounts: {
          ...state.accounts,
          checkInfo: {
            ...state.accounts.checkInfo,
            error: action.payload,
          },
        },
      };
    }
    case 'UPDATE_CONSUMER_ACH_INFO_SUCCESS':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          ACHInfo: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'UPDATE_CONSUMER_ACH_INFO_FAILED':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          ACHInfo: {
            ...state.accounts.ACHInfo,
            error: action.payload,
          },
        },
      };
    case 'UPDATE_CONSUMER_PAYPAL_INFO_SUCCESS':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          payPalInfo: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'UPDATE_CONSUMER_PAYPAL_INFO_FAILED':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          payPalInfo: {
            ...state.accounts.payPalInfo,
            error: action.payload,
          },
        },
      };
      case 'UPDATE_CONSUMER_DEPOSIT_INFO_SUCCESS':
        return {
          ...state,
          accounts: {
            ...state.accounts,
            depositToDebitCardInfoData: {
              data: action.payload,
              error: null,
            },
          },
        };
      case 'UPDATE_CONSUMER_DEPOSIT_INFO_FAILED':
        return {
          ...state,
          accounts: {
            ...state.accounts,
            depositToDebitCardInfoData: {
              ...state.accounts.depositToDebitCardInfoData,
              error: action.payload,
            },
          },
        };
        case 'UPDATE_CONSUMER_FOCUS_INFO_SUCCESS':
          return {
            ...state,
            accounts: {
              ...state.accounts,
              focusInfo: {
                data: action.payload,
                error: null,
              },
            },
          };
        case 'UPDATE_CONSUMER_FOCUS_INFO_FAILED':
          return {
            ...state,
            accounts: {
              ...state.accounts,
              focusInfo: {
                ...state.accounts.depositToDebitCardInfoData,
                error: action.payload,
              },
            },
          };
    case 'UPDATE_CONSUMER_PUSHTOCARD_INFO_SUCCESS':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          pushToCardInfo: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'UPDATE_CONSUMER_PUSHTOCARD_INFO_FAILED':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          pushToCardInfo: {
            ...state.accounts.pushToCardInfo,
            error: action.payload,
          },
        },
      };
    case 'UPDATE_CONSUMER_ZELLE_INFO_SUCCESS':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          zelleInfo: {
            data: action.payload,
            message: action.message,
            error: null,
          },
        },
      };
    case 'UPDATE_CONSUMER_ZELLE_INFO_FAILED':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          zelleInfo: {
            error: action.payload,
          },
        },
      };
    case 'UPDATE_PAYEE_PAYMENT_FILTERS':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          payeePaymentFilters: action.payload,
        },
      };
    case 'FETCH_SECONDARY_PAYMENT_METHODS_LIST_SUCCESS':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          secondaryPaymentMethodList: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_SECONDARY_PAYMENT_METHODS_LIST_FAILED':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          secondaryPaymentMethodList: {
            ...state.accounts.secondaryPaymentMethodList,
            error: action.payload,
          },
        },
      };
    case 'FETCH_REMITTANCE_STATUS_SUCCESS':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          remittanceStatus: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_REMITTANCE_STATUS_FAILED':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          remittanceStatus: {
            ...state.accounts.remittanceStatus,
            error: action.payload,
          },
        },
      };
    default:
      return { ...state };
  }
}
