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

export const getClientPaymentTypes = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.payeeService}/account-types`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_PAYMENT_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_PAYMENT_TYPE_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PAYMENT_TYPE_FAILED",
      payload: error.message || translatedData.errorOccured,
    });
    return false;
  }
};

export const fetchRoutingCodes =
  ({ routingCode, rowsPerPage, page, bankName, bankCity, bankState }) =>
  async (dispatch) => {
    try {
      const offset = rowsPerPage * page;
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.payeeService}/banks?${
          routingCode !== ""
            ? `&routingCode=${routingCode}`
            : bankName
            ? `&bankName=${bankName}&state=${bankState}&city=${bankCity}`
            : ``
        }&limit=${rowsPerPage}&offset=${offset}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
        },
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: "FETCH_ROUTING_CODE_SUCCESS",
          payload: responseBody.data && responseBody.data.rows,
          totalCount: (responseBody.data && responseBody.data.count) || 0,
        });
        return true;
      }
      dispatch({
        type: "FETCH_ROUTING_CODE_FAILED",
        payload: responseBody.message || translatedData.somethingWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: "FETCH_ROUTING_CODE_FAILED",
        payload: error.message || translatedData.errorOccured,
      });
      return false;
    }
  };