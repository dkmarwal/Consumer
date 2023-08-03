const initialState = {
  consumer: {
    info: {},
    error: null,
    errorMsgs:[],
    config: {},
    updatedSnackbarData:{message:'',severity:'success',openSnackbar:false}
  },
};

export default function consumer(state = initialState, action = {}) {
  switch (action.type) {
    case 'CONSUMER_VERIFICATION_SUCCESS':
      return {
        ...state,
        consumer: {
          ...state.consumer,
          info: action.payload,
          error: null,
          errorMsgs:null
        },
      };
    case 'CONSUMER_VERIFICATION_FAILED':
      return {
        ...state,
        consumer: {
          ...state.consumer,
          error: action.payload.message,
          errorMsgs:action.payload.data
        },
      };
    case 'FETCH_CONSUMER_CAMPAIGN_DETAIL_SUCCESS':
      return {
        ...state,
        consumer: {
          ...state.consumer,
          config: action.payload,
          error: null,
        },
      };
    case 'FETCH_CONSUMER_CAMPAIGN_DETAIL_FAILED':
      return {
        ...state,
        consumer: {
          ...state.consumer,
          error: action.payload,
        },
      };
    case 'UPDATE_SNACKBAR_DATA': {
      return {
        ...state,
        consumer: {
          ...state.consumer,
          updatedSnackbarData: action.payload,
        },
      };
    }
    default:
      return {
        ...state,
      };
  }
}
