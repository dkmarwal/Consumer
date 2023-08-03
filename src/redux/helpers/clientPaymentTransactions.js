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

export const getPayeePaymentTransactions = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.paymentService}/GetPayeePayments`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({...data, businessType: 2}),
    });

    return response;
  } catch (error) {
    return { data: {
        error: true,
        message: (error.response && error.response.data.message) ||
        translatedData.exceptionOccur,
        data:[]
      }
    };
  }
};

export const getPaymentTrackingDetails = async (clientId, paymentId) => {
  try {
      const reqData = {
          clientId, paymentId, portalFlag: 5 ,BusinessType: 2
      }
      
      const accessToken = await getAccessToken();
      const response = await axios({
          url: `${config.paymentService}/GetPaymentTracking?PortalFlag=5`,
          method: "POST",
          data: JSON.stringify(reqData),
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              'pragma': 'no-cache',
          },
      });
      return response.data;
  } catch (error) {
      return error;
  }
};

export const getPaymentDetails = async (clientId, paymentId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.paymentService}/GetTransactionDetailsByPaymentID?paymentID=${paymentId}&clientID=${clientId}&BusinessType=2`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
    
  } catch (error) {
    return error;
  }
};

export const downloadRemittanceAdvice = async (clientId, paymentId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      // url: `${config.apiBase}client-config-service/v1/remittance/file/download?paymentId=${paymentId}&clientId=${clientId}`,
      url: `${config.clientConfigService}/remittance/file/download?paymentId=456&clientId=956579174`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    // .then(response => response.blob()).then(response => ...*your code for download*... )
    return true;
  } catch (error) {
    return false;
  }
};

export const sendRemittanceAdviceOnEmail = async (clientId, paymentId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.paymentService}/GetTransactionDetailsByPaymentID?paymentID=${paymentId}&clientID=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const getStatusTypelist = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.paymentService}/GetPaymentStatusForPortal?portalFlag=5`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });

    if (response && response.data) {
      return response.data;
    }
    return {
      data: [],
      error: true,
      message: translatedData.responseFormat,
    };
  } catch (error) {
    return {
      data: [],
      error: true,
      message: translatedData.exceptionOccur,
    };
  }
};

export const getPaymentTypelist = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/selectedPaymentTypes/list`,
      // url: `${config.apiBase}/client-config-service/v1/b2c/payment-type/list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    return {
      data: [],
      error: true,
      message: translatedData.exceptionOccur,
    };
  }
};

