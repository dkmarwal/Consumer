import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import i18n from '~/i18n';
const cookies = new Cookies();
const path = window?.location?.pathname ?? "";
const clientURL = path.split("/")[1];
//const language = cookies.get(`@consumerLocaleLang_${clientURL}`) || 'en';
const language = sessionStorage.getItem(`@consumerLocaleLang_${clientURL}`) || 'en';
const translatedData = i18n.logger.options.resources[language].common.app.reduxData;

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

export const verifyDFA = (data) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.userService}/b2c/user/dfa`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                userName: data.userName || null,
                password: data.password || null,
                portalTypeId: data.portalTypeId || 5,
                dfaType: data.dfaType || null
            })
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'DFA_DATA_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'DFA_DATA_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'DFA_DATA_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}

/** Guest DFA Verify */
export const guestDFAVerify = (data) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.consumerService}/consumer/dfa/verify`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                otp: data.otp,
                enrollmentLinkId: data.token,
            }),
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'GUEST_DFA_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'GUEST_DFA_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'GUEST_DFA_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}

export const forgotPassDFA = (data) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.userService}/consumer/reset-password/dfa?passwordResetCode=${data?.resetCode || ""}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                dfaType: data?.dfaType || null,
                portalTypeId: 5
            })
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'FORGOTPASS_DFA_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'FORGOTPASS_DFA_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FORGOTPASS_DFA_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}
//forgot username DFA
export const forgotUsernameDFA = (data) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.userService}/consumer/reset-password/dfa?customerId=${data?.customerId || ""}&consumerSlugUrl=${data?.consumerslugUrl || ""}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                dfaType: data?.dfaType || null,
                portalTypeId: 5
            })
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'FORGOTUSERNAME_DFA_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'FORGOTUSERNAME_DFA_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'FORGOTUSERNAME_DFA_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}
export const postLoginDFA = (data, isProfileUpdate) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.userService}/b2c/user/post-login/dfa`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                dfaType: data.dfaType || null,
                isProfileUpdate: isProfileUpdate || undefined
            })
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'POSTLOGIN_DFA_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'POSTLOGIN_DFA_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'POSTLOGIN_DFA_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}

export const preLoginDFA = (data) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.consumerService}/consumer/dfa`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                dfaType: data?.dfaType || null,
                portalTypeId: data?.portalTypeId || 5,
                enrollmentLinkId: data?.token || null,
                phone: data?.phone || undefined,
                phoneCountryCode: data?.phone ? data?.phoneCountryCode ?? "+1" : undefined,
            })
        })
        const responseBody = await response.data;
        if (!responseBody.error) {
            dispatch({
                type: 'PRELOGIN_DFA_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'PRELOGIN_DFA_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'PRELOGIN_DFA_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}

export const verifyOTP = (userOTP) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.userService}/b2c/user/verify-dfa`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                otp: userOTP || null
            })
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'OTP_VERIFICATION_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'OTP_VERIFICATION_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'OTP_VERIFICATION_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}

export const consumerDetails = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.consumerService}/consumer/detail`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'CONSUMER_DETAIL_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'CONSUMER_DETAIL_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CONSUMER_DETAIL_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}

export const verifyForgotPassword = (userName, userOTP, routeParam) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.userService}/verify-forgot-password`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                login: userName || null,
                otp: userOTP || null,
                consumerslugUrl: routeParam
            })
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'OTP_VERIFICATION_SUCCESS',
                payload: responseBody.message || "",
            })
            return true;
        }
        dispatch({
            type: 'OTP_VERIFICATION_FAILED',
            payload: responseBody.message || translatedData.somethingWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'OTP_VERIFICATION_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.errorOccured
        })
        return false;
    }
}