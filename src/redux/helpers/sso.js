
import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
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
      window.location.href = `${config.baseName}/unauthorized`
  }
  return error.response;
});

export const fetchSSODetails = async (accessToken) => {
  try {
    // const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/sso`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;

    if (response.status === 401) {
      window.location.href = `${config.baseName}/unauthorized`;
      return false;
    }

    return responseBody;
  } catch (error) {
    return {
      message: (error.response && error.response.data.message) || translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const consumerDetails = async (clientSlugURL="") => {
  try {
    const accessToken = await getAccessToken(clientSlugURL);
    const response = await axios({
      url: `${config.consumerService}/consumer/detail`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      }
    });
    const responseBody = await response.data;

    if (response.status === 401) {
      window.location.href = `${config.baseName}/unauthorized`;
      return false;
    }
    return responseBody;
  } catch (error) {
    return {
      message: (error.response && error.response.data.message) || translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
}