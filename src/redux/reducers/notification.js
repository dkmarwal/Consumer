const initialState = {
    notification: {
        details: [],
        error:null,
    },
}

export default function notification(state = initialState, action = {}) {
    switch (action.type) {
        case 'NOTIFICATION_FETCH_SUCCESS':
            return {
                ...state,
                notification: {
                    ...state.notification,
                    details: action.payload,
                    error: null,
                }
            }
        case 'NOTIFICATION_FETCH_FAILED':
            return {
                ...notification,
                notification: {
                    ...state.notification,
                    error: action.payload
                }
            }
        case 'NOTIFICATION_SET_SUCCESS':
            return {
                ...state,
                notification: {
                    ...state.notification,
                    details: action.payload,
                    error: null,
                }
            }
        case 'NOTIFICATION_SET_FAILED':
            return {
                ...notification,
                notification: {
                    ...state.notification,
                    error: action.payload
                }
            }
        default:
            return {
                ...state
            }
    }
}