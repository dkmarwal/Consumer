import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import i18n from '~/i18n';
const path = window?.location?.pathname ?? '';
const clientURL = path.split('/')[1];
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

export const getMXWidgetUrl = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.paymentService}/mx-pay/getMXWidgetUrl`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;

    return responseBody;
  } catch (error) {
    return error;
  }
};

export const getMXAccounts = async (userGuid, memberGuid, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.paymentService}/mx-pay/getAccounts/${userGuid}/${memberGuid}/${clientId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return error;
  }
};

export const saveMXAccount = async (userguid, userAccountId, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.paymentService}/mx-pay/saveAccount/${userguid}/${userAccountId}/${clientId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody
  } catch (error) {
    return error;
  }
};
