import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from "~/i18n";

const path = window?.location?.pathname ?? "";
const clientURL = path.split("/")[1];
//const language = cookies.get(`@consumerLocaleLang_${clientURL}`) || "en";
const language = sessionStorage.getItem(`@consumerLocaleLang_${clientURL}`) || 'en';
const translatedData =
  i18n.logger.options.resources[language].common.app.reduxData;

axios.interceptors.request.use(
  (request) => {
    request.headers["accept-language"] = i18n.language;
    return request;
  },
  (error) => {
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
      /*
      cookies.remove(`@consumerRefreshToken_${clientURL}`, {
        path: `${config.baseName}/`,
      });
      cookies.remove(`@consumerAccessToken_${clientURL}`, {
        path: `${config.baseName}/`,
      });
      cookies.remove(`@consumerUserId_${clientURL}`, {
        path: `${config.baseName}/`,
      });
      cookies.remove(`@isOtpRequired_${clientURL}`, {
        path: `${config.baseName}/`,
      });
      cookies.remove(`@consumerOfferFlag_${clientURL}`, {
        path: `${config.baseName}/`,
      });
      cookies.remove(`@showLoginDFA_${clientURL}`, { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/${clientURL}`;
      */
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

export const fetchUSBankPrepaidCardData = (clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL = `${config.clientConfigService}/b2c/clients/${clientId}/prepaid-card-accounts`;
      const response = await axios({
        url: accessURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_USBANK_PREPAID_CARD_DATA_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'FETCH_USBANK_PREPAID_CARD_DATA_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_USBANK_PREPAID_CARD_DATA_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  };