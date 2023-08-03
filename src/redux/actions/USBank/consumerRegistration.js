import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import i18n from '~/i18n';
const path = window?.location?.pathname ?? '';
const clientURL = path.split('/')[1];
//const language = cookies.get(`@consumerLocaleLang_${clientURL}`) || 'en';
const language =
  sessionStorage.getItem(`@consumerLocaleLang_${clientURL}`) || 'en';
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
      const path = window?.location?.pathname ?? '';
      const clientURL = path.split('/')[1];
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
      window.location.href = `${config.baseName}/${clientURL}`;
    }
    return error.response;
  }
);

export const updateBusinessUserInfo = (consumerData) => async (dispatch) => {
  dispatch({
    type: 'UPDATE_BUSINESS_USER_INFO',
    payload: consumerData,
  });
  return consumerData;
};

export const fetchBusinessUserRoles = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase}/consumer-service/v2/business-user/roles`,
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
        type: 'FETCH_BUSINESS_USER_ROLES_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_BUSINESS_USER_ROLES_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_BUSINESS_USER_ROLES_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const registerBusinessTypePayee = ({userData,roleIdMask,takePhoneDuringEnrollment}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/business-user/register`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        title: userData?.title || null,
        userName: userData?.userName || null,
        firstName: userData?.firstName || null,
        lastName: userData?.lastName || null,
        workEmail: userData?.workEmail || null,
        cphoneCountryCode: !takePhoneDuringEnrollment ? null : (userData?.cphoneCountryCode || '+1'),
        cphoneNumber: userData?.cphoneNumber || null,
        cphoneExtNumber: userData?.cphoneExtNumber || null,
        roleIdMask: roleIdMask || 0,
        isCertify: userData?.isCertify ? 1 : 0,
        password: userData?.password || null,
        securityQuestionId: userData?.securityQuestionId || null,
        securityAnswer: userData?.securityAnswer || null,
        otp: userData?.otp || null,
        companyName: userData?.companyName || null,
        address: userData?.address || null,
        city: userData?.city || null,
        state: userData?.state || null,
        country: userData?.country || null,
        zipCode: userData?.zipCode || null,
        phoneNumber: userData?.phoneNumber || null,
        phoneCountryCode: userData?.phoneCountryCode || '+1',
        phoneExtNumber: userData?.phoneExtNumber || null,
        fax: userData?.fax || null,
        website: userData?.website || null,
        fedtaxId: userData?.fedtaxId || undefined,
        ssnNumber: userData?.ssnNumber || undefined,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'REGISTER_BUSINESS_USER_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'REGISTER_BUSINESS_USER_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'REGISTER_BUSINESS_USER_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
