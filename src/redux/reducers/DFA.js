const initialState = {
    DFA: {
        DFAData: null,
        verificationData: null,
        error: null,
        hasPymentTaken: null,
    },
}

export default function DFA(state = initialState, action = {}) {
    switch (action.type) {
        case 'DFA_DATA_SUCCESS':
            return {
                DFA: {
                    ...state.DFA,
                    DFAData: action.payload,
                    error: null,
                }
            }
        case 'DFA_DATA_FAILED':
            return {
                DFA: {
                    ...state.DFA,
                    error: action.payload
                }
            }
        case 'GUEST_DFA_SUCCESS':
            return {
                DFA: {
                    ...state.DFA,
                    DFAData: action.payload,
                    error: null,
                }
            }
        case 'GUEST_DFA_FAILED':
            return {
                DFA: {
                    ...state.DFA,
                    error: action.payload
                }
            }
        case 'POSTLOGIN_DFA_SUCCESS':
            return {
                DFA: {
                    ...state.DFA,
                    DFAData: action.payload,
                    error: null,
                }
            }
        case 'POSTLOGIN_DFA_FAILED':
            return {
                DFA: {
                    ...state.DFA,
                    error: action.payload
                }
            }
        case 'FORGOTPASS_DFA_SUCCESS':
            return {
                DFA: {
                    ...state.DFA,
                    DFAData: action.payload,
                    error: null,
                }
            }
        case 'FORGOTPASS_DFA_FAILED':
            return {
                DFA: {
                    ...state.DFA,
                    error: action.payload
                }
            }
        case 'FORGOTUSERNAME_DFA_SUCCESS':
            return {
                DFA: {
                    ...state.DFA,
                    DFAData: action.payload,
                    error: null,
                }
            }
        case 'FORGOTUSERNAME_DFA_FAILED':
            return {
                DFA: {
                    ...state.DFA,
                    error: action.payload
                }
            }
        case 'PRELOGIN_DFA_SUCCESS':
            return {
                DFA: {
                    ...state.DFA,
                    DFAData: action.payload,
                    error: null,
                }
            }
        case 'PRELOGIN_DFA_FAILED':
            return {
                DFA: {
                    ...state.DFA,
                    error: action.payload
                }
            }

        case 'OTP_VERIFICATION_SUCCESS':
            return {
                DFA: {
                    ...state.DFA,
                    verificationData: action.payload,
                    error: null,
                }
            }
        case 'OTP_VERIFICATION_FAILED':
            return {
                DFA: {
                    ...state.DFA,
                    error: action.payload
                }
            }

        case 'CONSUMER_DETAIL_SUCCESS':
            return {
                DFA: {
                    ...state.DFA,
                    hasPymentTaken: action.payload,
                    error: null,
                }
            }
        case 'CONSUMER_DETAIL_FAILED':
            return {
                DFA: {
                    ...state.DFA,
                    error: action.payload
                }
            }
        case 'RESET_DFA_DATA':
            return {
                DFA: {
                    DFAData: null,
                    verificationData: null,
                    error: null,
                    hasPymentTaken: null,
                }
            }

        default:
            return {
                ...state
            }
    }
}