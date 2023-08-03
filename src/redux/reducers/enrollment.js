const initialState = {
	enrollment: {
		activationCode: "",
        email:null,
        taxData: {},
        companyInfo: {},
        isCompanyExist: false,
        payeeEnrollmentId: null,
        contactInfo: {},
        supportContactInfo: {},
        brandInfo: {},
        clientInfo: {},
        tokenMsg:"",
		error: null,
	},
}

export default function enrollment(state = initialState, action = {}) {
	switch (action.type) {
        case 'VERIFY_ACTIVATION_CODE_SUCCESS':
			return {
                ...state,
                enrollment: {
                    ...state.enrollment,
                    activationCode: action.payload,
                    error: null,
                }
            }
        case 'VERIFY_ACTIVATION_CODE_FAILED':
			return {
                ...enrollment,
                enrollment: {
                    ...state.enrollment,
                    error: action.payload
                }
            }
        case 'ENROLLMENT_CONTACT_INFO_FETCH_SUCCESS':
			return {
                ...state,
                enrollment: {
                    ...state.enrollment,
                    taxId: action.payload.taxId,
                    taxData: action.payload.taxData,
                    error: null,
                }
            }
        case 'ENROLLMENT_CONTACT_INFO_FETCH_FAILED':
			return {
                ...enrollment,
                enrollment: {
                    ...state.enrollment,
                    error: action.payload
                }
            }
        case "ENROLLMENT_UPDATE_CONTACT_INFO_SUCCESS":
            return {
                ...state,
                enrollment: {
                  ...state.enrollment,
                  contactInfo: action.payload,
                  error: null
                }
            };
        case "ENROLLMENT_UPDATE_CONTACT_INFO_FAILED":
            return {
            ...state,
                enrollment: {
                    ...state.enrollment,
                    error: action.payload
                }
            };
        case "ENROLLMENT_UPDATE_COMPANY_INFO_SUCCESS":
            return {
            ...state,
                enrollment: {
                    ...state.enrollment,
                    companyInfo: action.payload,
                    isCompanyExist:action.isCompanyExist,
                    isLinkedWithNewClient:action.isLinkedWithNewClient,
                    payeeEnrollmentId:action.payeeEnrollmentId,
                    error: null
                }
            };

        case "ENROLLMENT_UPDATE_COMPANY_INFO_FAILED":
            return {
            ...state,
                enrollment: {
                    ...state.enrollment,
                    error: action.payload
                }
            };
        case "CREATE_SIGNUP_USER_SUCCESS":
          return {
            ...state,
            enrollment: {
                ...state.enrollment,
                companyInfo: action.payload,
                error: null
            }
          };
        case "CREATE_SIGNUP_USER_FAILED":
          return {
            ...state,
            enrollment: {
              ...state.enrollment,
              error: action.payload
            }
          };
        case 'MICROSITE_CLIENT_INFO_FETCH_SUCCESS':
			return {
                ...state,
                enrollment: {
                    ...state.enrollment,
                    clientInfo: action.payload,
                    error: null,
                }
            }
        case 'MICROSITE_CLIENT_INFO_FETCH_FAILED':
			return {
                ...enrollment,
                enrollment: {
                    ...state.enrollment,
                    error: action.payload
                }
            }
        case 'VERIFY_EMAIL_LINK_SUCCESS':
			return {
                ...state,
                enrollment: {
                    ...state.enrollment,
                    tokenMsg: action.payload,
                    error: null,
                }
            }
        case 'VERIFY_EMAIL_LINK_FAILED':
			return {
                ...enrollment,
                enrollment: {
                    ...state.enrollment,
                    tokenMsg: action.payload
                }
            }
        case 'FOOTER_CONTACT_INFO_FETCH_SUCCESS':
			return {
                ...state,
                enrollment: {
                    ...state.enrollment,
                    supportContactInfo: action.payload,
                    error: null,
                }
            }
        case 'FOOTER_CONTACT_INFO_FETCH_FAILED':
			return {
                ...enrollment,
                enrollment: {
                    ...state.enrollment,
                    error: action.payload
                }
            }
		default:
            return {
                ...state
            }
    }
}