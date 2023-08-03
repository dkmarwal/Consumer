const initialState = {
  paymentAuthentication: {
    paymentsData: [],
    error: null
  },
};

export default function paymentAuthentication(state = initialState, action = {}) {
  switch (action.type) {
    case 'PAYMENTS_TO_AUTHENTICATE_SUCCESS':
      return {
        ...state,
        paymentAuthentication: {
          ...state.paymentAuthentication,
          paymentsData: action?.payload,
          error: null,
        }
      }
    case 'PAYMENTS_TO_AUTHENTICATE_FAILED':
      return {
        ...state,
        paymentAuthentication: {
          ...state.paymentAuthentication,
          error: action.payload
        }
      }

    case 'GENERATE_OTP_SUCCESS':
      return {
        ...state,
        paymentAuthentication: {
          ...state.paymentAuthentication,
          error: null
        }
      };
    case 'GENERATE_OTP_FAILED':
      return {
        ...state,
        paymentAuthentication: {
          ...state.paymentAuthentication,
          error: action.payload,
        }
      };
    case 'GENERATE_NONCDM_OTP_SUCCESS':
      return {
        ...state,
        paymentAuthentication: {
          ...state.paymentAuthentication,
          error: null
        }
      };
    case 'GENERATE_NONCDM_OTP_FAILED':
      return {
        ...state,
        paymentAuthentication: {
          ...state.paymentAuthentication,
          error: action.payload,
        }
      };
    case 'VERIFY_OTP_SUCCESS':
      return {
        ...state,
        paymentAuthentication: {
          ...state.paymentAuthentication,
          error: null,
        }
      };
    case 'VERIFY_OTP_FAILED':
      return {
        ...state,
        paymentAuthentication: {
          ...state.paymentAuthentication,
          error: action.payload,
        }
      };
    case 'VERIFY_NONCDM_OTP_SUCCESS':
      return {
        ...state,
        paymentAuthentication: {
          ...state.paymentAuthentication,
          error: null,
        }
      };
    case 'VERIFY_NONCDM_OTP_FAILED':
      return {
        ...state,
        paymentAuthentication: {
          ...state.paymentAuthentication,
          error: action.payload,
        }
      };

    default:
      return { ...state };
  }
}
