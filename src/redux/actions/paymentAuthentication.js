import axios from 'axios';
import config from '~/config';
import i18n from '~/i18n';
import { getAccessToken } from '~/redux/helpers/user';

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

/** Generate OTP */
export const genereatePaymentOTP = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/generate-payment-auth-otp`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        paymentIds: data.paymentIds,
        otpPreference: data.otpPreference,
        nonCdmToken: null  // null in case of user logged in or guest user
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'GENERATE_OTP_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'GENERATE_OTP_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'GENERATE_OTP_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
/** Generate Non CDM OTP */
export const genereateNonCDMPaymentOTP = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/generate-payment-auth`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        paymentIds: data.paymentIds,
        otpPreference: data.otpPreference,
        nonCdmToken: data.nonCdmToken  // null in case of user logged in or guest user
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'GENERATE_NONCDM_OTP_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'GENERATE_NONCDM_OTP_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'GENERATE_NONCDM_OTP_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
/*fetchPayments to authenticate API */

export const fetchPaymentsToAuthenticate = (data, flag) => async (dispatch) => {
  const payeeID = data?.payeeId || "";
  const uniquePaymentID = data?.token || "";// null in case of user logged in or guest user
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      // url: `${config.apiBase}/payment-service/GetPaymentsToAuthenticate?payeeID=${payeeID}&clientID=${clientID}&uniquePaymentID=${uniquePaymentID}`,
      url: flag ? `${config.paymentService}/GetPaymentsToAuthenticate?payeeID=${payeeID}` :
        `${config.paymentService}/GetPaymentsToAuthenticate?uniquePaymentID=${uniquePaymentID}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'PAYMENTS_TO_AUTHENTICATE_SUCCESS',
        payload: responseBody?.data || [],
      });
      return true;
    }
    dispatch({
      type: 'PAYMENTS_TO_AUTHENTICATE_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'PAYMENTS_TO_AUTHENTICATE_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

/*VERIFY OTP */

export const verifyPaymentOTP = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/verify-payment-auth-otp`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'VERIFY_OTP_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'VERIFY_OTP_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'VERIFY_OTP_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};


/*VERIFY NON CDM OTP */

export const verifyNonCDMPaymentOTP = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/verify-payment-auth`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        otp: data.otp,
        nonCdmToken: data.token
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'VERIFY_NONCDM_OTP_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'VERIFY_NONCDM_OTP_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'VERIFY_NONCDM_OTP_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
