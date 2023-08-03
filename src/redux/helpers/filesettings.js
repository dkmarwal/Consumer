import axios from 'axios'
import config from '~/config'
import { getAccessToken } from '~/redux/helpers/user';
import i18n from '~/i18n';

axios.interceptors.request.use(
    request => {
        request.headers['accept-language'] = i18n.language;
        return request;
    },
    error => {
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

export const downloadRemittanceFile = async (paymentId, clientId, flag, isRRD, businessType) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: flag === true ?
                `${config.clientConfigService}/remittance/file/download?paymentId=${paymentId}&clientId=${clientId}&IsRRD=${isRRD}&BusinessType=2` :
                `${config.clientConfigService}/remittance/file/download?paymentId=${paymentId}&clientId=${clientId}&BusinessType=2`,
            method: "GET",
            responseType: 'blob',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        return response;
    } catch (error) {
        return { ...error.response.data };
    }
};