const initialState = {
    csc: {
        countryList: [],
        stateList: [],
        cityList: [],
        error:null,
    },
}

export default function csc(state = initialState, action = {}) {
    switch (action.type) {
        case 'COUNTRY_LIST_FETCH_SUCCESS':
            return {
                ...state,
                csc: {
                    ...state.csc,
                    countryList: action.payload,
                    error: null,
                }
            }
        case 'COUNTRY_LIST_FETCH_FAILED':
            return {
                ...csc,
                csc: {
                    ...state.csc,
                    error: action.payload
                }
            }
        case 'STATE_LIST_FETCH_SUCCESS':
            return {
                ...state,
                csc: {
                    ...state.csc,
                    stateList: action.payload,
                    error: null,
                }
            }
        case 'STATE_LIST_FETCH_FAILED':
            return {
                ...csc,
                csc: {
                    ...state.csc,
                    error: action.payload
                }
            }
        case 'CITY_LIST_FETCH_SUCCESS':
            return {
                ...state,
                csc: {
                    ...state.csc,
                    cityList: action.payload,
                    error: null,
                }
            }
        case 'CITY_LIST_FETCH_FAILED':
            return {
                ...csc,
                csc: {
                    ...state.csc,
                    error: action.payload
                }
            }
        default:
            return {
                ...state
            }
    }
}