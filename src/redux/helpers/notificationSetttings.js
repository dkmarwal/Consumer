import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';

import Cookies from 'universal-cookie'
const cookies = new Cookies();
const path = window?.location?.pathname ?? "";
const clientURL = path.split("/")[1];
//const language = cookies.get(`@consumerLocaleLang_${clientURL}`) || 'en';
const language = sessionStorage.getItem(`@consumerLocaleLang_${clientURL}`) || 'en';
const translatedData = i18n.logger.options.resources[language].common.app.reduxData;

axios.interceptors.request.use(
  request =>{
    request.headers['accept-language'] = i18n.language;    
    return request;
  },
  error =>{
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
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
  }
);


export const getNotifications = async (userId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.notificationService}/notification/user?userId=${userId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            // data: JSON.stringify(data),
        });
        //console.log("++++++++++++++getNotifications +++++++++++++", response);
        if (response && response.data) {
            return response.data
        }
        return {
            error: true,
            message: translatedData.resFormat
        };
    } catch (error) {
        return {
            error: true,
            message: translatedData.serverExep
        };
    }
};

export const processNotificationsAction = async (userId, NotificationId, action) => {

    try {
        const data = {
            "userId": userId,
            "notificationId": NotificationId,
            "action": action
        }
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.notificationService}/notification/user/action`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(data),
        })
        //console.log("+++++++++client post successfully++++", response);
        if (response) {
            return true
        }
        return false;
    } catch (error) {
        return false;
    }
}
