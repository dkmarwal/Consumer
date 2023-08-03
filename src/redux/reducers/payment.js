const initialState = {
  payment: {
    types: [],
    routingCodes: [],
    totalCount: 0,
    error: null,
  },
};

export default function payment(state = initialState, action = {}) {
  switch (action.type) {
    case "FETCH_ROUTING_CODE_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          routingCodes: action.payload,
          totalCount: action.totalCount,
          error: null,
        },
      };
    case "FETCH_ROUTING_CODE_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "FETCH_PAYMENT_TYPE_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          types: action.payload,
          error: null,
        },
      };
    case "FETCH_PAYMENT_TYPE_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    default:
      return {
        ...state,
      };
  }
}
