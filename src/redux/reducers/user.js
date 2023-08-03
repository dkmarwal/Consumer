const initialState = {
  user: {
    isLoggedIn: false,
    error: null,
    message: null,
    info: {},
    userRoles: [],
    securityQuestionList: [],
    totalCount: 0,
    slList: [],
    brandInfo: {},
    securityInfo: {},
    dfaDetails: {},
    passwordChangeInfo: {},
	  securityQuestionId: null,
    isPayeeChoicePortal:false,
  },
};

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    // After Login DFA Details
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          info: {
            ...state.user.info,
            ...action.payload,
          },
          dfaDetails: {},
          userRoles: [...action.payload.userRoles],
          error: null,
          isLoggedIn: true,
        },
      };
    case "LOGIN_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload && action.payload.message,
          data: action.payload && action.payload.data,
          info: {},
          userRoles: [],
          isLoggedIn: false,
        },
      };
    // Before Login DFA Details
    case "VERIFY_USER_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          dfaDetails: action.payload,
          error: null,
        },
      };
    case "VERIFY_USER_FAILED":
    case "REGISTER_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
          data: action.data,
        },
      };
    case "UPDATE_PASSWORD_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
        },
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          info: {},
          userRoles: [],
          error: action.payload,
          isPayeeChoicePortal:state.user.isPayeeChoicePortal ?? false,
        },
      };
    case "LOGOUT_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
        },
      };
    case "FORGOT_PASSWORD_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          passwordChangeInfo: action.payload,
        },
      };
    case "FORGOT_PASSWORD_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
          isPayeeChoicePortal:state.user.isPayeeChoicePortal ?? false,
        },
      };
    case "SQ_LIST_FETCH_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          securityQuestionList: action.payload,
          error: null,
        },
      };
    case "SQ_LIST_FETCH_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
        },
      };
      case 'IS_PAYEE_CHOICE_PORTAL':
        return {
          ...state,
          user:{
            ...state.user,
            isPayeeChoicePortal:action.payload
          }
        }
	case 'SQ_ID_FETCH_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          securityQuestionId: action.payload,
          error: null,
        }
      }
    case 'SQ_ID_FETCH_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      }
    case "UPDATE_TOKEN_TIME_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          info: {
            ...state.user.info,
            ...action.payload,
          },
          error: null,
        },
      };

    case "SLL_LIST_FETCH_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          slList: action.payload,
          error: null,
        },
      };
    case "SLL_LIST_FETCH_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
        },
      };
    case "UPDATE_USER_LANG_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          info: {
            ...state.user.info,
            ...action.payload,
          },
          error: null,
        },
      };
    case "UPDATE_USER_LANG_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
        },
      };
    case "BRAND_INFO_FETCH_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          brandInfo: action.payload,
          // brandInfo: {...action.payload,themeColorPrimary:"#0b3341",themeColorAccent :"#4be600",themeColorBackground:"#9a9fad"},
          error: null,
        },
      };
    case "BRAND_INFO_FETCH_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
        },
      };

    case "RECOVER_CUSTOMER_ID_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          message: action.payload,
          error: null,
        },
      };
    case "RECOVER_CUSTOMER_ID_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
          message: null,
        },
      };
    case "FETCH_SECURITY_DETAILS_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          securityInfo: action.payload,
          error: null,
        },
      };
    case "FETCH_SECURITY_DETAILS_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
          message: null,
        },
      };
      case 'IS_PAYEE_CHOICE_PORTAL':
        return {
          ...state,
          user:{
            ...state.user,
            isPayeeChoicePortal:action.payload
          }
        }
    default:
      return {
        ...state,
      };
  }
}
