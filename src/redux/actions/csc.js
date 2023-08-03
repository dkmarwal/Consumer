import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import i18n from '~/i18n';
const path = window?.location?.pathname ?? "";
const clientURL = path.split("/")[1];
//const language = cookies.get(`@consumerLocaleLang_${clientURL}`) || 'en';
const language = sessionStorage.getItem(`@consumerLocaleLang_${clientURL}`) || 'en';
const translatedData = i18n.logger.options.resources[language].common.app.reduxData;

axios.interceptors.request.use(
    request => {
        request.headers['accept-language'] = i18n.language;
        return request;
    },
    error => {
        return Promise.reject(error);
    }
);

export const getAllCountries = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.clientService}/countries-list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'COUNTRY_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'COUNTRY_LIST_FETCH_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'COUNTRY_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}

export const getStatesOfCountry = (isoCode) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.clientService}/states-list?countryISOCode=${isoCode}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'STATE_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'STATE_LIST_FETCH_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'STATE_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}

export const getCitiesOfStateByISO = (stateCode) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.clientService}/cities-list?stateCode=${stateCode}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'CITY_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}

export const getCitiesOfState = (stateName) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.clientService}/cities-list?stateName=${stateName}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'CITY_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}

// export const getStatesOfCountryByIso = (isoCode) => async (dispatch) => {
//     try {
//         const accessToken = await getAccessToken()
//         const response = await axios({
//             url: `${config.apiBase}/client-service/v1/states-list?countryISOCode=${isoCode}`,
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`,
//                 'pragma': 'no-cache',
//             }
//         })
//         const responseBody = await response.data;
//         if (responseBody.error == false) {
//             dispatch({
//                 type: 'STATE_LIST_FETCH_SUCCESS',
//                 payload: responseBody.data && responseBody.data.rows,
//             })
//             return true;
//         }
//         dispatch({
//             type: 'STATE_LIST_FETCH_FAILED',
//             payload: responseBody.message || translatedData.somethingWrong
//         })
//         return false;
//     } catch (error) {
//         dispatch({
//             type: 'STATE_LIST_FETCH_FAILED',
//             payload: error.response && error.response.data.message || translatedData.errorOccured
//         })
//         return false;
//     }
// }