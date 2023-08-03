import Cookies from 'universal-cookie'
import axios from 'axios'
import config from '~/config'
import { getAccessToken } from '~/redux/helpers/user'
import i18n from '~/i18n';

const cookies = new Cookies();
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
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    if (error.response.status === 401) {
        const path = window?.location?.pathname ?? "";
        const clientURL = path.split("/")[1];
        /*cookies.remove(`@consumerRefreshToken_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerAccessToken_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerUserId_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@isOtpRequired_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerOfferFlag_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@showLoginDFA_${clientURL}`, { path: `${config.baseName}/` });*/
        sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
        sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
        sessionStorage.removeItem(`@consumerUserId_${clientURL}`);
        sessionStorage.removeItem(`@isOtpRequired_${clientURL}`);
        sessionStorage.removeItem(`@consumerOfferFlag_${clientURL}`);
        sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);
        window.location.href = `${config.baseName}/${clientURL}`
    }
    return error.response;
});

/*
Get Payee Notification
*/
export const getNotifications = ({ userId, portalTypeId }) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.notificationService}/notification/type/user?userId=${userId}&portalTypeId=${portalTypeId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'NOTIFICATION_FETCH_SUCCESS',
                payload: responseBody.data
            })
            return true;
        }
        dispatch({
            type: 'NOTIFICATION_FETCH_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'NOTIFICATION_FETCH_FAILED',
            payload: error.response && error.response.data.message || translatedData.errorOccured
        })
        return false;
    }
}

/*
set payee notification
*/
export const setNotification = ({ userId, portalProfileId, portalTypeId, notificationData }) => async dispatch => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.notificationService}/notification/type`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                userId: userId,
                portalTypeId: portalTypeId,
                portalProfileId: portalProfileId,
                notificationData: notificationData
            })
        });

        const responseBody = await response.data;
        if (responseBody.error == false) {
            return true;
        }
        dispatch({
            type: 'NOTIFICATION_SET_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'NOTIFICATION_SET_FAILED',
            payload: error.response && error.response.data.message || translatedData.errorOccured
        })
        return false;
    }
};