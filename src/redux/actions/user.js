import Cookies from "universal-cookie";
import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import { BankType } from '~/config/bankTypes';
import i18n from "~/i18n";

const path = window?.location?.pathname ?? "";
const clientURL = path.split("/")[1];
//const language = cookies.get(`@consumerLocaleLang_${clientURL}`) || 'en';
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
Get Loggin user information
*/
export const userInfo = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const path = window?.location?.pathname ?? '';
    const clientURL = path.split('/')[1];
    //const clientId = cookies.get(`@consumerUserId_${clientURL}`);
    const clientId = sessionStorage.getItem(`@consumerUserId_${clientURL}`);

    if (accessToken && clientId) {
      const response = await axios({
        url: `${config.userService}/user/${clientId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        const {
          isFirstLogin,
          userData,
          isOtpRequiredForPaymentVerification,
          userAccessIdList,
        } = responseBody.data;

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            ...userData,
            isFirstLogin,
            isOtpRequiredForPaymentVerification,
            userRoles: userAccessIdList || [],
            //userRoles: [74,75,76,77,78,79, 95, 96,97,98,99],
          },
        });
        return true;
      }

      dispatch({
        type: "LOGIN_FAILED",
        payload: {
          message: responseBody.message || translatedData.somethingWrong,
          data: null,
        },
      });
      //dispatch(logout());
      return false;
    }
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILED",
      payload: {
        message:
          (error.response && error.response.data.message) ||
          translatedData.errorOccured,
        data: null,
      },
    });
    //dispatch(logout());
    return false;
  }
};

/*
Login
*/
export const login = (credentials) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/login`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(credentials),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      const {
        accessToken,
        refreshToken,
        isFirstLogin,
        isOtpRequiredForPaymentVerification,
        userData,
        userAccessIdList,
      } = responseBody.data;
      const path = window?.location?.pathname ?? "";
      const clientURL = path.split("/")[1];
      /*
            cookies.set(`@consumerAccessToken_${clientURL}`, accessToken, {
              path: `${config.baseName}/`,
            });
            cookies.set(`@consumerRefreshToken_${clientURL}`, refreshToken, {
              path: `${config.baseName}/`,
            });
            cookies.set(`@consumerUserId_${clientURL}`, userData.userId, {
              path: `${config.baseName}/`,
            });
            cookies.set(`@showLoginDFA_${clientURL}`, true, {
              path: `${config.baseName}/`,
            });
            cookies.set(`@isOtpRequired_${clientURL}`, isOtpRequiredForPaymentVerification, {
              path: `${config.baseName}/`,
            });
            cookies.remove(`@consumerOfferFlag_${clientURL}`, { path: `${config.baseName}/` });
            */
      sessionStorage.setItem(`@consumerAccessToken_${clientURL}`, accessToken);
      sessionStorage.setItem(`@consumerRefreshToken_${clientURL}`, refreshToken);
      sessionStorage.setItem(`@consumerUserId_${clientURL}`, userData.userId);
      sessionStorage.setItem(`@showLoginDFA_${clientURL}`, true);
      sessionStorage.setItem(`@isOtpRequired_${clientURL}`, isOtpRequiredForPaymentVerification);
      sessionStorage.removeItem(`@consumerOfferFlag_${clientURL}`);

      //cookies.set('@refreshToken', refresh_token)
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          ...userData,
          isFirstLogin,
          isOtpRequiredForPaymentVerification,
          userRoles: userAccessIdList || [],
        },
      });
      return true;
    }

    dispatch({
      type: "LOGIN_FAILED",
      payload: {
        message:
          (responseBody && responseBody.message) ||
          translatedData.somethingWrong,
        data: responseBody && responseBody["data"],
      },
    });
    return false;
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const verifyUser = (credentials) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/verify-login`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(credentials),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "VERIFY_USER_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }

    dispatch({
      type: "VERIFY_USER_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
      data: responseBody && responseBody["data"],
    });
    return false;
  } catch (error) {
    dispatch({
      type: "VERIFY_USER_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

/*
first time login user update password with security answer
*/
export const setNewPassword = (credentials) => async (dispatch) => {
  try {
    let cookies = new Cookies(window.document.cookie);
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/first-time-login-info`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(credentials),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      const {
        accessToken,
        refreshToken,
        userData,
        isOtpRequiredForPaymentVerification,
        userAccessIdList,
      } = responseBody.data;

      const path = window?.location?.pathname ?? "";
      const clientURL = path.split("/")[1];

      /*cookies.set(`@consumerAccessToken_${clientURL}`, accessToken, {
        path: `${config.baseName}/`,
      });
      cookies.set(`@consumerRefreshToken_${clientURL}`, refreshToken, {
        path: `${config.baseName}/`,
      });
      cookies.set(`@consumerUserId_${clientURL}`, userData.userId, {
        path: `${config.baseName}/`,
      });
      cookies.set(`@showLoginDFA_${clientURL}`, true, {
        path: `${config.baseName}/`,
      });
      cookies.set("@isOtpRequired", isOtpRequiredForPaymentVerification, {
        path: `${config.baseName}/`,
      });*/

      sessionStorage.setItem(`@consumerAccessToken_${clientURL}`, accessToken);
      sessionStorage.setItem(`@consumerRefreshToken_${clientURL}`, refreshToken);
      sessionStorage.setItem(`@consumerUserId_${clientURL}`, userData.userId);
      sessionStorage.setItem(`@showLoginDFA_${clientURL}`, true);
      sessionStorage.setItem(`@isOtpRequired_${clientURL}`, isOtpRequiredForPaymentVerification);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          isFirstLogin: false,
          ...userData,
          isOtpRequiredForPaymentVerification,
          userRoles: userAccessIdList || [],
          //userRoles: [74,75,76,77,78,79, 95, 96,97,98,99],
        },
      });
      return true;
    }
    dispatch({
      type: "UPDATE_PASSWORD_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_PASSWORD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

/*
reset password
*/
export const resetPassword =
  ({ password, securityQuestionId, securityAnswer, token, otp }) =>
    async (dispatch) => {
      try {
        const accessToken = await getAccessToken();
        const response = await axios({
          url: `${config.userService}/reset-password?passwordResetCode=${token}`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            pragma: "no-cache",
          },
          data: JSON.stringify({
            updatedPassword: password || null,
            otp: otp || null,
            securityQuestionId: securityQuestionId || null,
            securityAnswer: securityAnswer || "",
          }),
        });
        const responseBody = await response.data;
        if (responseBody.error === false) {
          dispatch({
            type: "LOGIN_FAILED",
            payload: {
              message: responseBody && responseBody.message,
              data: null,
            },
          });
          if (responseBody?.data?.isMFAForgotPasswordRequired) {
            return { data: responseBody?.data, error: false };
          } else {
            return { error: false };
          }
        }
        if (response.status === 403) {
          return { error: true, message: responseBody.message, data: "redirect" };
        }
        dispatch({
          type: "LOGIN_FAILED",
          payload: {
            message:
              (responseBody && responseBody.message) ||
              translatedData.somethingWrong,
            data: null,
          },
        });
        return { error: true, message: responseBody.message, data: "" };
      } catch (error) {
        dispatch({
          type: "LOGIN_FAILED",
          payload: {
            message:
              (error.response && error.response.data.message) ||
              translatedData.errorOccured,
            data: null,
          },
        });
        return {
          error: true,
          message:
            (error.response && error.response.data.message) ||
            translatedData.errorOccured,
          data: "",
        };
      }
    };

/*
Forgot password
*/
export const forgotPassword =
  ({ loginId, dfaType, consumerSlugUrl }) =>
    async (dispatch) => {
      try {
        const accessToken = await getAccessToken();
        const response = await axios({
          url: `${config.userService}/b2c/forgot-password`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            pragma: "no-cache",
          },
          data: JSON.stringify({
            login: (loginId && loginId.trim()) || "",
            dfaType: dfaType || undefined,
            consumerSlugUrl: consumerSlugUrl || null
          }),
        });
        const responseBody = await response.data;
        if (responseBody.error === false) {
          dispatch({
            type: "FORGOT_PASSWORD_SUCCESS",
            payload: responseBody || {},
          });
          return true;
        }
        dispatch({
          type: "FORGOT_PASSWORD_FAILED",
          payload: responseBody.message || translatedData.somethingWrong,
        });
        return false;
      } catch (error) {
        dispatch({
          type: "FORGOT_PASSWORD_FAILED",
          payload:
            (error.response && error.response.data.message) ||
            translatedData.errorOccured,
        });
        return false;
      }
    };

export const resetExpiredPassword =
  ({
    userName,
    oldPassword,
    updatedPassword,
    securityQuestionId,
    securityAnswer, rParam
  }) =>
    async (dispatch) => {
      try {
        let cookies = new Cookies(window.document.cookie);
        const accessToken = await getAccessToken();
        const response = await axios({
          url: `${config.userService}/user/update-exp-pwd`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          data: JSON.stringify({
            userName: userName,
            portalTypeId: 5,
            oldPassword: oldPassword,
            updatedPassword: updatedPassword,
            securityQuestionId: securityQuestionId,
            securityAnswer: securityAnswer,
            consumerSlugUrl: rParam
          }),
        });
        const responseBody = await response.data;
        if (responseBody.error === false) {
          if (responseBody?.data?.isMFALoginRequired === 1) {
            dispatch({
              type: "VERIFY_USER_SUCCESS",
              payload: responseBody.data,
            });
            return true
          } else {
            const {
              accessToken,
              refreshToken,
              isFirstLogin,
              isOtpRequiredForPaymentVerification,
              userData,
              userAccessIdList,
            } = responseBody.data;
            const path = window?.location?.pathname ?? "";
            const clientURL = path.split("/")[1];
            sessionStorage.setItem(`@consumerAccessToken_${clientURL}`, accessToken);
            sessionStorage.setItem(`@consumerRefreshToken_${clientURL}`, refreshToken);
            sessionStorage.setItem(`@consumerUserId_${clientURL}`, userData.userId);
            sessionStorage.setItem(`@showLoginDFA_${clientURL}`, true);
            sessionStorage.setItem(`@isOtpRequired_${clientURL}`, isOtpRequiredForPaymentVerification);
            sessionStorage.removeItem(`@consumerOfferFlag_${clientURL}`);

            //cookies.set('@refreshToken', refresh_token)
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                ...userData,
                isFirstLogin,
                isOtpRequiredForPaymentVerification,
                userRoles: userAccessIdList || [],
              },
            });
            return true;
          }

        }
        dispatch({
          type: "VERIFY_USER_FAILED",
          payload:
            (responseBody && responseBody.message) ||
            translatedData.somethingWrong,
          data: responseBody && responseBody["data"],
        });
        return false;
      } catch (error) {
        dispatch({
          type: "VERIFY_USER_FAILED",
          payload:
            (error.response && error.response.data.message) ||
            translatedData.errorOccured,
        });
        return false;
      }
    };

/*
Logout
*/
/*
export const logout = () => {
    let cookies = new Cookies(window.document.cookie)
    cookies.remove('@consumerAccessToken', { path: `${config.baseName}/` })
    cookies.remove('@consumerRefreshToken', { path: `${config.baseName}/` })
    cookies.remove('@clientId', { path: `${config.baseName}/` })
    return {
        type: 'LOGOUT_SUCCESS',
        payload: {}
    }
}
*/
/*
Logout
*/
export const logout = (isSSO) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/logout`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    const path = window?.location?.pathname ?? "";
    const clientURL = path.split("/")[1];
    if (responseBody.error === false) {
      /*
      cookies.remove(`@consumerAccessToken_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerRefreshToken_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerUserId_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerOfferFlag_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@isOtpRequired_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@DFASkip_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@staleValue_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@showLoginDFA_${clientURL}`, { path: `${config.baseName}/` });
      */
      sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerUserId_${clientURL}`);
      sessionStorage.removeItem(`@consumerOfferFlag_${clientURL}`);
      sessionStorage.removeItem(`@isOtpRequired_${clientURL}`);
      sessionStorage.removeItem(`@DFASkip_${clientURL}`);
      sessionStorage.removeItem(`@staleValue_${clientURL}`);
      sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);
      if (isSSO) {
        sessionStorage.setItem(`isSSO_${clientURL}`, isSSO);
      }
      dispatch({
        type: "LOGOUT_SUCCESS",
        payload: {},
      });
      dispatch({
        type: "RESET_DFA_DATA",
        payload: {},
      });
      dispatch({
        type: "RESET_CONSUMER_PAYMENT_TYPES_LIST_DATA",
        payload: {},
      });
    } else {
      /*cookies.remove(`@consumerAccessToken_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerRefreshToken_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerUserId_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerOfferFlag_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@isOtpRequired_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@DFASkip_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@staleValue_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@showLoginDFA_${clientURL}`, { path: `${config.baseName}/` });
      */
      sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerUserId_${clientURL}`);
      sessionStorage.removeItem(`@consumerOfferFlag_${clientURL}`);
      sessionStorage.removeItem(`@isOtpRequired_${clientURL}`);
      sessionStorage.removeItem(`@DFASkip_${clientURL}`);
      sessionStorage.removeItem(`@staleValue_${clientURL}`);
      sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);
      if (isSSO) {
        sessionStorage.setItem(`isSSO_${clientURL}`, isSSO);
      }
      dispatch({
        type: "LOGOUT_SUCCESS",
        payload: {},
      });
      dispatch({
        type: "RESET_DFA_DATA",
        payload: {},
      });
      dispatch({
        type: "RESET_CONSUMER_PAYMENT_TYPES_LIST_DATA",
        payload: {},
      });
    }
  } catch (error) {
    const path = window?.location?.pathname ?? "";
    const clientURL = path.split("/")[1];
    /*
    cookies.remove(`@consumerAccessToken_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@consumerRefreshToken_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@consumerUserId_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@consumerOfferFlag_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@isOtpRequired_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@DFASkip_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@staleValue_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@showLoginDFA_${clientURL}`, { path: `${config.baseName}/` });
    */
    sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
    sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
    sessionStorage.removeItem(`@consumerUserId_${clientURL}`);
    sessionStorage.removeItem(`@consumerOfferFlag_${clientURL}`);
    sessionStorage.removeItem(`@isOtpRequired_${clientURL}`);
    sessionStorage.removeItem(`@DFASkip_${clientURL}`);
    sessionStorage.removeItem(`@staleValue_${clientURL}`);
    sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);
    if (isSSO) {
      sessionStorage.setItem(`isSSO_${clientURL}`, isSSO);
    }
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {},
    });
    dispatch({
      type: "RESET_DFA_DATA",
      payload: {},
    });
    dispatch({
      type: "RESET_CONSUMER_PAYMENT_TYPES_LIST_DATA",
      payload: {},
    });
  }
};



/*
Logout after profile delete with API call
*/
export const postProfileDelete = () => async (dispatch) => {
  let cookies = new Cookies(window.document.cookie);

  try {
    /*cookies.remove(`@consumerAccessToken_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@consumerRefreshToken_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@consumerUserId_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@consumerOfferFlag_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@isOtpRequired_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@DFASkip_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@staleValue_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@showLoginDFA_${clientURL}`, { path: `${config.baseName}/` });*/
    sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
    sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
    sessionStorage.removeItem(`@consumerUserId_${clientURL}`);
    sessionStorage.removeItem(`@consumerOfferFlag_${clientURL}`);
    sessionStorage.removeItem(`@isOtpRequired_${clientURL}`);
    sessionStorage.removeItem(`@DFASkip_${clientURL}`);
    sessionStorage.removeItem(`@staleValue_${clientURL}`);
    sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {},
    });
    dispatch({
      type: "RESET_DFA_DATA",
      payload: {},
    });
    dispatch({
      type: "RESET_CONSUMER_PAYMENT_TYPES_LIST_DATA",
      payload: {},
    });
  } catch (error) {
    const path = window?.location?.pathname ?? "";
    const clientURL = path.split("/")[1];
    /*
    cookies.remove(`@consumerAccessToken_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@consumerRefreshToken_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@consumerUserId_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@consumerOfferFlag_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@isOtpRequired_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@DFASkip_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@staleValue_${clientURL}`, { path: `${config.baseName}/` });
    cookies.remove(`@showLoginDFA_${clientURL}`, { path: `${config.baseName}/` });
    */
    sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
    sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
    sessionStorage.removeItem(`@consumerUserId_${clientURL}`);
    sessionStorage.removeItem(`@consumerOfferFlag_${clientURL}`);
    sessionStorage.removeItem(`@isOtpRequired_${clientURL}`);
    sessionStorage.removeItem(`@DFASkip_${clientURL}`);
    sessionStorage.removeItem(`@staleValue_${clientURL}`);
    sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {},
    });
    dispatch({
      type: "RESET_DFA_DATA",
      payload: {},
    });
    dispatch({
      type: "RESET_CONSUMER_PAYMENT_TYPES_LIST_DATA",
      payload: {},
    });
  }
};

/*
Get security question ID selected by user
*/
export const fetchSecurityQuestion = (resetCode) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/user/get-question`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
	  data: JSON.stringify({
        passwordResetCode: resetCode || null,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "SQ_ID_FETCH_SUCCESS",
        payload: responseBody?.data?.securityQuestionId || null,
      });
      return true;
    }
    dispatch({
      type: "SQ_ID_FETCH_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "SQ_ID_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

/*
Get security questions list
*/
export const fetchSecurityQuestions = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/securityQuestions?portalTypeId=5`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "SQ_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "SQ_LIST_FETCH_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "SQ_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

//Update token/session time
export const keepSessionLive = () => async (dispatch) => {
  let cookies = new Cookies(window.document.cookie);
  const path = window?.location?.pathname ?? "";
  const clientURL = path.split("/")[1];
  //const refreshToken = cookies.get(`@consumerRefreshToken_${clientURL}`);
  const refreshToken = sessionStorage.getItem(`@consumerRefreshToken_${clientURL}`);

  if (refreshToken) {
    try {
      const response = await axios({
        url: `${config.userService}/access/token`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          refreshToken: `${refreshToken}`,
          pragma: "no-cache",
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        const { accessToken, refreshToken, exp } = responseBody.data;
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
        dispatch({
          type: "UPDATE_TOKEN_TIME_SUCCESS",
          payload: { exp: exp },
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
};

/*
Get Language list
*/
export const fetchSupportedLanguageList = ({ appType }) => async (dispatch) => {
  try {
    const response = await axios({
      url: `${config.userService}/user/locales?appType=${appType}&portalTypeId=5`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "SLL_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "SLL_LIST_FETCH_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "SLL_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
export const fetchIsPayeeChoicePortal = ()=> async(dispatch) =>{
  dispatch({
     type:'IS_PAYEE_CHOICE_PORTAL',
     payload:config.bankTypeId === BankType.USBANK
   })
   return config.bankTypeId === BankType.USBANK
 }

/*
Update user selected language
*/
export const updateLanguage =
  ({ locale }) =>
    async (dispatch) => {
      try {
        const newLang = locale || "en";
        const accessToken = await getAccessToken();
        const response = await axios({
          url: `${config.userService}/user/update-locales?locale=${newLang}`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            pragma: "no-cache",
          },
        });

        const responseBody = await response.data;
        if (responseBody.error === false) {
          dispatch({
            type: "UPDATE_USER_LANG_SUCCESS",
            payload: { locale: locale },
          });
          return true;
        }
        dispatch({
          type: "UPDATE_USER_LANG_FAILED",
          payload: responseBody.message || translatedData.somethingWrong,
        });
        return false;
      } catch (error) {
        dispatch({
          type: "UPDATE_USER_LANG_FAILED",
          payload:
            (error.response && error.response.data.message) ||
            translatedData.errorOccured,
        });
        return false;
      }
    };

//recover username
export const recoverCustomerID = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/b2c/forgot-username`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "RECOVER_CUSTOMER_ID_SUCCESS",
        payload: responseBody.message,
      });
      if (responseBody?.data?.isMFAForgotUsernameRequired) {
        return { data: responseBody?.data, error: false };
      } else {
        return true;
      }
    }
    dispatch({
      type: "RECOVER_CUSTOMER_ID_FAILED",
      payload: responseBody.message,
    });
    return { error: true, message: responseBody.message, data: "" };
  } catch (error) {
    dispatch({
      type: "RECOVER_CUSTOMER_ID_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return {
      error: true,
      message:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
      data: "",
    };
  }
};


//fetch security details
export const fetchConsumerSecurityDetails = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.userService}/b2c/fetch/securitydetails`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_SECURITY_DETAILS_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_SECURITY_DETAILS_FAILED",
      payload: responseBody.message,
    });

    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_SECURITY_DETAILS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return error;
  }
};
