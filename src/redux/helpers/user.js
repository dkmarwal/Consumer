import axios from 'axios';
import config from '~/config';
import i18n from '~/i18n';

const path = window?.location?.pathname ?? '';
const clientURL = path.split('/')[1];
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
      window.location.href = `${config.baseName}/${clientURL}`
    }
    return error.response;
  }
);
export const getAccessToken = async (clientSlugURL = null) => {
  const path = window?.location?.pathname ?? '';
  const clientURL = clientSlugURL ?? path.split('/')[1];
  //const refreshToken = cookies.get(`@consumerRefreshToken_${clientURL}`);
  //const accessToken = cookies.get(`@consumerAccessToken_${clientURL}`);
  const refreshToken = sessionStorage.getItem(`@consumerRefreshToken_${clientURL}`);
  const accessToken = sessionStorage.getItem(`@consumerAccessToken_${clientURL}`);

  if (accessToken) {
    return accessToken;
  }
  if (refreshToken) {
    try {
      const response = await axios({
        url: `${config.apiBase}/oauth/token?refreshToken=${refreshToken}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      const path = window?.location?.pathname ?? '';
      const clientURL = path.split('/')[1];
      /*cookies.set(
        `@consumerAccessToken_${clientURL}`,
        responseBody.accessToken,
        {
          path: `${config.baseName}/`,
        }
      );*/
      sessionStorage.setItem(`@consumerAccessToken_${clientURL}`, responseBody.accessToken);
      return responseBody.accessToken;
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const fetchUserProfileDetails = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/user-profile/${clientId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
      data: {},
      error: true,
    };
  }
};

export const fetchSecurityQuestion = async (userName, portalTypeId, routeParam) => {
  try {
    const response = await axios({
      url: `${config.userService}/user/security-question`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        userName: userName,
        portalTypeId: portalTypeId,
        consumerSlugUrl: routeParam
      }),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
      data: {},
      error: true,
    };
  }
};

export const fetchSecurityQuestions = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/securityQuestions?portalTypeId=5`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
      data: {},
      error: true,
    };
  }
};

//Update token/session time
export const keepSessionLive = async () => {
  const path = window?.location?.pathname ?? '';
  const clientURL = path.split('/')[1];
  //const refreshToken = cookies.get(`@consumerRefreshToken_${clientURL}`);
  const refreshToken = sessionStorage.getItem(`@consumerRefreshToken_${clientURL}`);

  if (refreshToken) {
    try {
      const response = await axios({
        url: `${config.userService}/access/token`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          refreshToken: `${refreshToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        const { accessToken, refreshToken } = responseBody.data;
        const path = window?.location?.pathname ?? '';
        const clientURL = path.split('/')[1];
        /*cookies.set(`@consumerAccessToken_${clientURL}`, accessToken, {
          path: `${config.baseName}/`,
        });
        cookies.set(`@consumerRefreshToken_${clientURL}`, refreshToken, {
          path: `${config.baseName}/`,
        });*/
        sessionStorage.setItem(`@consumerAccessToken_${clientURL}`, accessToken);
        sessionStorage.setItem(`@consumerRefreshToken_${clientURL}`, refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
};

export const updateB2CUserProfileDetails = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/b2c/user-profile`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        userName: payload.userName || null,
        password: payload.password || null,
        oldPassword: payload.oldPassword || null,
        otp: payload.otp || null,
        securityAnswer:payload.securityAnswer || null,
        securityQuestionId: payload.securityQuestionId || null,
        phoneCountryCode: payload.phoneCountryCode || '+1',
        phone:payload.phone || null
      }),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
      data: {},
      error: true,
    };
  }
};

export const deleteB2CUserProfile = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/consumer`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
      data: {},
      error: true,
    };
  }
};

export const fetchTCFile = async (routeParam) => {
  try {
    const response1 = await axios({
      url: `${config.clientConfigService}/b2c/terms-and-conditions?consumerSlugUrl=${routeParam}`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        pragma: 'no-cache',
      },
    });
    const response2 = await axios({
      url: `${config.clientConfigService}/b2c/terms-and-conditions?consumerSlugUrl=${routeParam}`,
      method: 'GET',
      //responseType: "blob",
      headers: {
        'Content-Type': 'application/json',
        pragma: 'no-cache',
      },
    });
    if (response1.status === 404) {
      return false;
    }

    if (!/json/gi.test(response1.headers['content-type'])) {
      return response1;
    }
    return response2.data;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
      data: {},
      error: true,
    };
  }
};

export const fetchFAQFile = async (routeParam) => {
  try {
    const response1 = await axios({
      url: `${config.clientConfigService}/b2c/faq?consumerSlugUrl=${routeParam}`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        pragma: 'no-cache',
      },
    });

    const response2 = await axios({
      url: `${config.clientConfigService}/b2c/faq?consumerSlugUrl=${routeParam}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        pragma: 'no-cache',
      },
    });
    if (response1.status === 404) {
      return false;
    }

    if (!/json/gi.test(response1.headers['content-type'])) {
      return response1;
    }
    return response2.data;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
      data: {},
      error: true,
    };
  }
};

export const fetchPrivacyPolicyFile = async (routeParam) => {
  try {
    const response1 = await axios({
      url: `${config.clientConfigService}/b2c/privacy-policy?consumerSlugUrl=${routeParam}`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        pragma: 'no-cache',
      },
    });

    const response2 = await axios({
      url: `${config.clientConfigService}/b2c/privacy-policy?consumerSlugUrl=${routeParam}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        pragma: 'no-cache',
      },
    });

    //const responseBody = await response.data;
    if (response1.status === 404) {
      return false;
    }
    if (!/json/gi.test(response1.headers['content-type'])) {
      return response1;
    }

    return response2.data;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
      data: {},
      error: true,
    };
  }
};

/** GET MFA STATUS */

export const getMFAStatus = async (type) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/getMfaStatus?type=${type}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
      data: {},
      error: true,
    };
  }
};
