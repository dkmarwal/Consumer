import axios from 'axios';
import config from '~/config';
import i18n from '~/i18n';
import { getAccessToken } from '~/redux/helpers/user';
import moment from "moment";

const path = window?.location?.pathname ?? "";
const clientURL = path.split("/")[1];
//const language = cookies.get(`@consumerLocaleLang_${clientURL}`) || 'en';
const language = sessionStorage.getItem(`@consumerLocaleLang_${clientURL}`) || 'en';
const translatedData =
  i18n.logger.options.resources[language].common.app.reduxData;

axios.interceptors.request.use(
  (request) => {
    request.headers['accept-language'] = i18n.language;
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




    export const createFocusreliaZelle = (focusDetails) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.consumerService}/consumer/prepaid-card-accounts`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          paymentTypeId: (focusDetails && focusDetails.paymentTypeId) || null,
          transId: (focusDetails && (focusDetails.transactionId).toString())|| null,
          firstName: (focusDetails && focusDetails.firstName) || null,
          lastName: (focusDetails && focusDetails.lastName) || null,
          emailId: (focusDetails && focusDetails.email) || null,
          address1: (focusDetails && focusDetails.address1) || null,
          address2: (focusDetails && focusDetails.address2) || null,
          city:(focusDetails && focusDetails.city) || null,
          state: (focusDetails && focusDetails.state) || null,
          country: (focusDetails && focusDetails.country) || null,
          postalCode: (focusDetails && focusDetails.postalCode) || null,
          // dateOfBirth: (focusDetails &&  moment(focusDetails.startDate).format('MM/DD/YYYY')) || null,
          dateOfBirth: (focusDetails &&  focusDetails.startDate && moment(focusDetails.startDate).format('MM/DD/YYYY')) || null,
          uniqueId: (focusDetails && focusDetails.uniqueId) || null,
  ssn: (focusDetails && focusDetails.SSN) || null,
  homePhone: (focusDetails && focusDetails.phone) || null,
  mobilePhone: (focusDetails && focusDetails.mobilePhone) || null,
employerState: (focusDetails && focusDetails.employerState) || null,
govLocation: (focusDetails && focusDetails.govLocation) || null,
govExpiredDate: (focusDetails &&focusDetails.govExpiredDate&&  moment(focusDetails.govExpiredDate).format('MM/DD/YYYY')) || null,
govIdValue:(focusDetails && focusDetails.govIdValue) || null,
  govIdType:(focusDetails && focusDetails.govIdType) || null,
  preferenceType: (focusDetails && focusDetails.preferenceType) || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'FOCUS_INFO_SUCCESS',
          payload: responseBody.data,
          message: responseBody.message,
        });
        return true;
      }
      dispatch({
        type: 'FOCUS_INFO_FAILED',
        payload: responseBody.message || translatedData.somethingWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FOCUS_INFO_FAILED',
        payload:
          (error.response && error.response.data.message) ||
          translatedData.errorOccured,
      });
      return false;
    }
  };
  export const createCorporatZelle = (focusDetails) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/consumer/prepaid-card-accounts`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        paymentTypeId: (focusDetails && focusDetails.paymentTypeId) || null,
        transId: (focusDetails && (focusDetails.transactionId).toString())|| null,
        firstName: (focusDetails && focusDetails.firstName) || null,
        lastName: (focusDetails && focusDetails.lastName) || null,
        emailId: (focusDetails && focusDetails.email) || null,
        address1: (focusDetails && focusDetails.address1) || null,
        address2: (focusDetails && focusDetails.address2) || null,
        city:(focusDetails && focusDetails.city) || null,
        state: (focusDetails && focusDetails.state) || null,
        country: (focusDetails && focusDetails.country) || null,
        postalCode: (focusDetails && focusDetails.postalCode) || null,
preferenceType: (focusDetails && focusDetails.preferenceType) || null,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'FOCUS_INFO_SUCCESS',
        payload: responseBody.data,
        message: responseBody.message,
      });
      return true;
    }
    dispatch({
      type: 'FOCUS_INFO_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FOCUS_INFO_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
 




