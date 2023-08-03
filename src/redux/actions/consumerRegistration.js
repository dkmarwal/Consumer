import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import i18n from '~/i18n';
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

/*
Get Consumer campaign config details
*/
export const fetchConsumerCampaignDetails =
  (token, clientURL) => async (dispatch) => {
    // dispatch({
    //     type: "FETCH_CONSUMER_CAMPAIGN_DETAIL_SUCCESS",
    //     payload:  {
    //     "consumerVerificationParamters": [{
    //             "fieldId": 1,
    //             "displayName": "Payee ID",
    //             "isRequired": 1,
    //             "displayOrder": 1,
    //             "fieldName": "consumerIdentifier"
    //         },
    //         {
    //             "fieldId": 2,
    //             "displayName": "First Name",
    //             "isRequired": 1,
    //             "displayOrder": 1,
    //             "fieldName": "firstName"
    //         },
    //         {
    //             "fieldId": 3,
    //             "displayName": "Last Name",
    //             "isRequired": 1,
    //             "displayOrder": 1,
    //             "fieldName": "lastName"
    //         },
    //         {
    //             "fieldId": 4,
    //             "displayName": "Phone Number",
    //             "isRequired": 1,
    //             "displayOrder": 1,
    //             "fieldName": "phoneNumber",
    //             "value": "9818777506",
    //         },
    //         {
    //             "fieldId": 5,
    //             "displayName": "Email Address",
    //             "isRequired": 1,
    //             "displayOrder": 1,
    //             "fieldName": "emailAddress"
    //         },
    //         {
    //             "fieldId": 6,
    //             "displayName": "Address Line1",
    //             "isRequired": 1,
    //             "displayOrder": 1,
    //             "fieldName": "addressLine1"
    //         },{
    //             "fieldId": 7,
    //             "displayName": "Address Line2",
    //             "isRequired": 0,
    //             "displayOrder": 1,
    //             "fieldName": "addressLine2"
    //         },
    //         {
    //             "fieldId": 5,
    //             "displayName": "Enter OTP Here",
    //             "isRequired": 0,
    //             "displayOrder": 1,
    //             "fieldName": "phoneOTP"
    //         }
    //     ],
    //     "isOneTimePayment": 1,
    //     "isSsnMandatory": 1,
    //     "paymentAmount": "1.00",
    //     "takePhoneDuringEnrollment": 'true',
    // }
    //   });
    //   return true;
    try {
      const response = await axios({
        url: `${config.consumerService}/verification/params/${token}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_CONSUMER_CAMPAIGN_DETAIL_SUCCESS',
          payload: responseBody.data,
        });
        const path = window?.location?.pathname ?? "";
        const clientURL = path.split("/")[1];

        const { accessToken, refreshToken } = responseBody.data;
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

      if (response.status === 400) {
        dispatch({
          type: 'FETCH_CONSUMER_CAMPAIGN_DETAIL_FAILED',
          payload: responseBody.message || translatedData.somethingWrong,
        });
        // if (response?.data?.data?.isEnrolled === 1) {
        //   window.location.href = `${config.baseName}/${clientURL}/registereduseralert`;  
        //   return false;        
        // }
        // else if (response?.data?.data?.isGuest === 1) {
        //   window.location.href = `${config.baseName}/${clientURL}/guestuseralert`; 
        //   return false;            
        // }
        // else {
        //   window.location.href = `${config.baseName}/${clientURL}`;
        // }

        const newRes = {
          ...responseBody,
          status: response.status
        }
        return newRes;
      }

      dispatch({
        type: 'FETCH_CONSUMER_CAMPAIGN_DETAIL_FAILED',
        payload: responseBody.message || translatedData.somethingWrong,
      });
      return responseBody;
    } catch (error) {
      dispatch({
        type: 'FETCH_CONSUMER_CAMPAIGN_DETAIL_FAILED',
        payload:
          (error.response && error.response.data.message) ||
          translatedData.errorOccured,
      });
      return error;
    }
  };

/*
Verify consumer details
*/
export const verifyConsumer =
  ({ user, token }) =>
    async (dispatch) => {
      try {
        const accessToken = await getAccessToken();
        const response = await axios({
          url: `${config.consumerService}/authenticate`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            pragma: 'no-cache',
          },
          data: JSON.stringify({
            token: token || null,
            consumerIdentifier: user.consumerIdentifier || undefined,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            //phoneCountryCode: user.phoneCountryCode || "+1",
            phoneNumber: user.phone || undefined,
            emailAddress: user.emailAddress || undefined,
            addressLine1: user.addressLine1 || undefined,
            addressLine2: user.addressLine2 || undefined,
            //country: user.country || null,
            //state: user.state || null,
            //city: user.city || null,
            postalCode: user.postalCode || undefined,
            customField1: user.customField1 || undefined,
            customField2: user.customField2 || undefined,
            customField3: user.customField3 || undefined,
            customField4: user.customField4 || undefined,
            customField5: user.customField5 || undefined,
          }),
        });

        const responseBody = await response.data;
        if (responseBody.error == false) {
          dispatch({
            type: 'CONSUMER_VERIFICATION_SUCCESS',
            payload: { user, ...responseBody.data },
          });

          const path = window?.location?.pathname ?? "";
          const clientURL = path.split("/")[1];
          const { accessToken, refreshToken } = responseBody.data;
          /*
          cookies.set(`@consumerAccessToken_${clientURL}`, accessToken, {
            path: `${config.baseName}/`,
          });
          cookies.set(`@consumerRefreshToken_${clientURL}`, refreshToken, {
            path: `${config.baseName}/`,
          });
          */
          sessionStorage.setItem(`@consumerAccessToken_${clientURL}`, accessToken);
          sessionStorage.setItem(`@consumerRefreshToken_${clientURL}`, refreshToken);
          return true;
        }
        dispatch({
          type: 'CONSUMER_VERIFICATION_FAILED',
          payload: {data:responseBody?.data?.errorFields || [], message:responseBody.message} || translatedData.somethingWrong,
        });
        return false;
      } catch (error) {
        dispatch({
          type: 'CONSUMER_VERIFICATION_FAILED',
          payload:
            (error.response && error.response.data.message) ||
            translatedData.errorOccured,
        });
        return false;
      }
    };

    export const verifyConsumerUSbank =
    ({ user, token, phoneAuthentication, phoneOTP }) =>
      async (dispatch) => {
        try {
          const accessToken = await getAccessToken();
          const response = await axios({
            url: `${config.consumerService}/authenticate`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
              pragma: 'no-cache',
            },
            data: JSON.stringify({
              token: token || null,
              consumerIdentifier: phoneAuthentication === "payeeId" ? (user.consumerIdentifier || undefined) : undefined,
              otp: phoneAuthentication === "txtMe" ? (phoneOTP || undefined) : undefined,
              firstName: user.firstName || undefined,
              lastName: user.lastName || undefined,
              //phoneCountryCode: user.phoneCountryCode || "+1",
              phoneNumber: phoneAuthentication === "payeeId" ? (user.phone || undefined) : undefined,
              emailAddress: user.emailAddress || undefined,
              addressLine1: user.addressLine1 || undefined,
              addressLine2: user.addressLine2 || undefined,
              //country: user.country || null,
              //state: user.state || null,
              //city: user.city || null,
              postalCode: user.postalCode || undefined,
              customField1: user.customField1 || undefined,
              customField2: user.customField2 || undefined,
              customField3: user.customField3 || undefined,
              customField4: user.customField4 || undefined,
              customField5: user.customField5 || undefined,
            }),
          });
  
          const responseBody = await response.data;
          if (responseBody.error === false) {
            dispatch({
              type: 'CONSUMER_VERIFICATION_SUCCESS',
              payload: { user, ...responseBody.data },
            });
  
            const path = window?.location?.pathname ?? "";
            const clientURL = path.split("/")[1];
            const { accessToken, refreshToken } = responseBody.data;
            /*
            cookies.set(`@consumerAccessToken_${clientURL}`, accessToken, {
              path: `${config.baseName}/`,
            });
            cookies.set(`@consumerRefreshToken_${clientURL}`, refreshToken, {
              path: `${config.baseName}/`,
            });
            */
            sessionStorage.setItem(`@consumerAccessToken_${clientURL}`, accessToken);
            sessionStorage.setItem(`@consumerRefreshToken_${clientURL}`, refreshToken);
            return true;
          }
          dispatch({
            type: 'CONSUMER_VERIFICATION_FAILED',
            payload: {data:responseBody?.data?.errorFields || [], message:responseBody.message} || translatedData.somethingWrong,
          });
          return false;
        } catch (error) {
          dispatch({
            type: 'CONSUMER_VERIFICATION_FAILED',
            payload:
              (error.response && error.response.data.message) ||
              translatedData.errorOccured,
          });
          return false;
        }
      };

/*
Get Brand info
*/
export const fetchBrandingDetail = (clientURL) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase}/consumer-service/v1/consumer/branding`,
      url: `${config.clientConfigService}/branding/privacy/policy?appType=2&slugUrl=${clientURL}`,
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
        type: 'BRAND_INFO_FETCH_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }

    if (response.status === 401) {
      dispatch({
        type: 'BRAND_INFO_FETCH_FAILED',
        payload: responseBody.message || translatedData.somethingWrong,
      });
      return false;
    }
    //Redirect to no page found
    if (response.status === 404 || responseBody.status === 400) {
      dispatch({
        type: 'BRAND_INFO_FETCH_FAILED',
        payload: responseBody.message || translatedData.somethingWrong,
      });
      //window.location.href = `${config.baseName}/${clientURL}/nopagefound`;
      window.location.href = `${config.baseName}/`;
      return false;
    }
    dispatch({
      type: 'BRAND_INFO_FETCH_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'BRAND_INFO_FETCH_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

/*
Get Client logo
*/
export const fetchClientLogo =
  ({ clientId }) =>
    async (dispatch) => {
      try {
        const response = await axios({
          //url: "https://apib2b.incedopay.com:30010/api/client-config-service/v1/branding/microsite?clientId=413976688",
          url: `${config.clientConfigService}/branding/enrollment/site?clientId=${clientId}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            pragma: 'no-cache',
          },
        });
        const responseBody = await response.data;
        if (responseBody.error === false) {
          return responseBody;
        }
        return false;
      } catch (error) {
        dispatch({
          type: 'BRAND_INFO_FETCH_FAILED',
          payload:
            (error.response && error.response.data.message) ||
            translatedData.errorOccured,
        });
        return false;
      }
    };

/*
Register consumer, password with security answer
*/
export const registerUser =
  ({ token, user, consumerSlugUrl, otp }) =>
    async (dispatch) => {
      try {
        const accessToken = await getAccessToken();
        const response = await axios({
          url: `${config.consumerService}/register`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            pragma: 'no-cache',
          },
          data: JSON.stringify({
            userName: user?.userName || null,
            password: user?.newPassword || null,
            securityQuestionId: user?.securityQuestionId || null,
            securityAnswer: user?.securityAnswer || null,
            ssnNumber: user?.ssnNumber || undefined,
            consumerSlugUrl: consumerSlugUrl || null,
            phone: user?.phone || undefined,
            phoneCountryCode: user?.phone ? "+1" : undefined,
            otp: otp || null,
          }),
        });
        const responseBody = await response.data;
        if (responseBody.error === false) {
          // const { accessToken, refreshToken, isFirstLogin, userData, userAccessIdList } = responseBody.data;
          // cookies.set("@consumerAccessToken", accessToken, { path: `${config.baseName}/`,});
          // cookies.set("@consumerRefreshToken", refreshToken, {path: `${config.baseName}/`,});
          // cookies.set("@consumerUserId", userData.userId, { path: `${config.baseName}/` });

          dispatch({
            type: 'REGISTER_SUCCESS',
            payload: responseBody.data,
          });
          return true;
        }
        dispatch({
          type: 'REGISTER_FAILED',
          payload: responseBody.message || translatedData.somethingWrong,
        });
        return false;
      } catch (error) {
        dispatch({
          type: 'REGISTER_FAILED',
          payload:
            (error.response && error.response.data.message) ||
            translatedData.errorOccured,
        });
        return false;
      }
    };

export const updateSnackbar = (data) => async (dispatch) => {
  dispatch({
    type: 'UPDATE_SNACKBAR_DATA',
    payload: data,
  });
  return data;
};

export const verifyUsername = (userName) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/b2c/user/user-name`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        userName,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'VERIFY_USERNAME_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'VERIFY_USERNAME_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'VERIFY_USERNAME_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};


export const updatePhoneNumber = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/info`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        "phoneNumber": data?.phone || null,
        "phoneCountryCode": data?.phoneCountryCode || null,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'UPDATE_PHONE_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'UPDATE_PHONE_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'UPDATE_PHONE_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};