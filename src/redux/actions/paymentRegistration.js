import axios from 'axios';
import config from '~/config';
import i18n from '~/i18n';
import { getAccessToken } from '~/redux/helpers/user';
import moment from 'moment';

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

export const selectedPaymentType = (paymentType) => async (dispatch) => {
  dispatch({
    type: 'SELECTED_PAYMENT_TYPE',
    payload: paymentType,
  });
  return paymentType;
};

// For Alternate Payment Methods (Story 8011)
export const selectedAlternatePaymentType =
  (paymentType) => async (dispatch) => {
    dispatch({
      type: 'SELECTED_ALTERNATE_PAYMENT_TYPE',
      payload: paymentType,
    });
    return paymentType;
  };

/** Check Info API */
export const createConsumerCheckInfo = (checkDetail) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/addConsumerCheckInfo`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        addressLine1: (checkDetail && checkDetail.addressLine1) || null,
        addressLine2: (checkDetail && checkDetail.addressLine2) || null,
        country: (checkDetail && checkDetail.country) || null,
        state: (checkDetail && checkDetail.state) || null,
        city: (checkDetail && checkDetail.city) || null,
        postalCode: (checkDetail && checkDetail.postalCode) || null,
        remittanceDetails: checkDetail.remittanceDetails,
        preferenceType: checkDetail.preferenceType,
        otp: checkDetail.otp || null,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'CREATE_CONSUMER_CHECK_INFO_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'CREATE_CONSUMER_CHECK_INFO_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'CREATE_CONSUMER_CHECK_INFO_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

/*Paypal API */

export const createPaypal = (paypalDetail) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/addConsumerPaypalInfo`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },

      data: JSON.stringify({
        tokenType: paypalDetail ? paypalDetail.infoType : null,
        tokenValue:
          paypalDetail && paypalDetail.infoType === 'email'
            ? paypalDetail.email
              ? paypalDetail.email
              : null
            : paypalDetail.phone
            ? paypalDetail.phone
            : null,
        addressLine1: paypalDetail ? paypalDetail.address1 : null,
        addressLine2:
          paypalDetail && paypalDetail.address2.toString().length !== 0
            ? paypalDetail.address2
            : null,
        country: paypalDetail ? paypalDetail.country : null,
        state: paypalDetail ? paypalDetail.state : null,
        city: paypalDetail ? paypalDetail.city : null,
        postalCode: paypalDetail ? paypalDetail.postalCode : null,
        preferenceType: paypalDetail.preferenceType,
        remittanceDetails: paypalDetail ? paypalDetail.remittanceDetails : null,
        countryCode:
          paypalDetail && paypalDetail.infoType === 'phone' ? '+1' : null,
        otp: paypalDetail.otp || null,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'CREATE_CONSUMER_PAYPAL_INFO_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'CREATE_CONSUMER_PAYPAL_INFO_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'CREATE_CONSUMER_PAYPAL_INFO_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

/*Push to Card API */

export const createPushtoCard = (pushtoCardDetail) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/addConsumerCardInfo`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },

      data: JSON.stringify({
        nameOnCard: pushtoCardDetail ? pushtoCardDetail.name : null,
        cardNumber: pushtoCardDetail ? pushtoCardDetail.cardNo : null,
        expiryDate: pushtoCardDetail
          ? moment(pushtoCardDetail.expiryDate).format('YYYY-MM')
          : null,
        cvv: pushtoCardDetail ? pushtoCardDetail.cvv : null,
        addressLine1: pushtoCardDetail ? pushtoCardDetail.address1 : null,
        addressLine2:
          pushtoCardDetail && pushtoCardDetail.address2.toString().length !== 0
            ? pushtoCardDetail.address2
            : null,
        country: pushtoCardDetail ? pushtoCardDetail.country : null,
        state: pushtoCardDetail ? pushtoCardDetail.state : null,
        city: pushtoCardDetail ? pushtoCardDetail.city : null,
        postalCode: pushtoCardDetail ? pushtoCardDetail.postalCode : null,
        preferenceType: pushtoCardDetail.preferenceType,
        remittanceDetails: pushtoCardDetail
          ? pushtoCardDetail.remittanceDetails
          : null,
        otp: pushtoCardDetail.otp || null,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'CREATE_CONSUMER_PUSH_TO_CARD_INFO_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'CREATE_CONSUMER_PUSH_TO_CARD_INFO_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'CREATE_CONSUMER_PUSH_TO_CARD_INFO_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

/*Deposit to Debit Card API */

export const createDeposittoDebitCard =
  (deposittoDebitCardDetail,clientId,preferenceType) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.consumerService}/addConsumerDebitCardInfo`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },

        data: JSON.stringify({
          clientId: clientId || null,
          nameOnCard: deposittoDebitCardDetail
            ? deposittoDebitCardDetail.name
            : null,
          cardNumber: deposittoDebitCardDetail
            ? deposittoDebitCardDetail.cardNo
            : null,
          expiryDate: deposittoDebitCardDetail
            ? moment(deposittoDebitCardDetail.expiryDate).format('YYYY-MM')
            : null,
          preferenceType: preferenceType,
          remittanceDetails: deposittoDebitCardDetail
            ? deposittoDebitCardDetail.remittanceDetails
            : null,
          otp: deposittoDebitCardDetail.otp || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'CREATE_CONSUMER_DEPOSIT_TO_DEBIT_CARD_INFO_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'CREATE_CONSUMER_DEPOSIT_TO_DEBIT_CARD_INFO_FAILED',
        payload: responseBody || translatedData.somethingWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'CREATE_CONSUMER_DEPOSIT_TO_DEBIT_CARD_INFO_FAILED',
        payload:
          (error.response && error.response.data.message) ||
          translatedData.errorOccured,
      });
      return false;
    }
  };

export const createConsumerACHInfo = (achDetails) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/addConsumerBankAchInfo`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        accountNumber: (achDetails && achDetails.accountNumber) || null,
        routingNumber: (achDetails && achDetails.routingNumber) || null,
        accountType: (achDetails && achDetails.accountType) || null,
        bankName: (achDetails && achDetails.bankName) || null,
        remittanceDetails: achDetails.remittanceDetails,
        preferenceType: achDetails.preferenceType,
        otp: achDetails.otp || null,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'CREATE_CONSUMER_ACH_INFO_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    if(responseBody.error && responseBody.data.status == "Failed") {
      dispatch({
        type: 'CREATE_CONSUMER_ACH_INFO_FAILED',
        payload: responseBody.data.message || translatedData.somethingWrong,
      });
      return false;
    }
    dispatch({
      type: 'CREATE_CONSUMER_ACH_INFO_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'CREATE_CONSUMER_ACH_INFO_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const fetchConsumerPaymentTypesList = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/consumerPaymentType/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'FETCH_CONSUMER_PAYMENT_TYPES_LIST_SUCCESS',
        payload: responseBody.data || null,
      });
      //return true;
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_CONSUMER_PAYMENT_TYPES_LIST_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_CONSUMER_PAYMENT_TYPES_LIST_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const updateFetchConsumerPaymentTypesList =
  (paymentListData) => async (dispatch) => {
    dispatch({
      type: 'UPDATE_FETCH_CONSUMER_PAYMENT_TYPES_LIST_SUCCESS',
      payload: paymentListData,
    });
    return true;
  };

export const updateConsumerRemiitanceConfig =
  (remittanceData) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.consumerService}/remittance/configurations`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify(remittanceData),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'UPDATE_CONSUMER_REMITTANCE_CONFIG_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'UPDATE_CONSUMER_REMITTANCE_CONFIG_FAILED',
        payload: responseBody.message || translatedData.somethingWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'UPDATE_CONSUMER_REMITTANCE_CONFIG_FAILED',
        payload:
          (error.response && error.response.data.message) ||
          translatedData.errorOccured,
      });
      return false;
    }
  };

export const updateSelectedRemittanceConfigData =
  (remittanceConfigData) => async (dispatch) => {
    dispatch({
      type: 'SELECTED_REMITTANCE_CONFIG_DATA',
      payload: remittanceConfigData,
    });
    return remittanceConfigData;
  };

export const fetchRemittanceDetails = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/remittance/details`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'FETCH_REMITTANCE_DETAILS_SUCCESS',
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_REMITTANCE_DETAILS_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_REMITTANCE_DETAILS_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const updateEnableDisableRemittance =
  (isEnabled) => async (dispatch) => {
    dispatch({
      type: 'UPDATE_ENABLE_DISABLE_REMITTANCE',
      payload: isEnabled,
    });
    return isEnabled;
  };

export const createConsumerZelle =
  (
    type,
    value,
    code,
    preferenceTypeVal,
    remittance,
    otp,
    isPayeeChoicePortal = false,
    remittanceEmail
  ) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.consumerService}/addConsumerZelleInfo`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          tokenType: type || "email",
          tokenValue: value || remittanceEmail,
          countryCode: code || null,
          preferenceType: preferenceTypeVal || null,
          remittanceDetails:
            (Boolean(remittance) && remittance) ||
            (isPayeeChoicePortal ? null : []),
          otp: otp || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'ZELLE_INFO_SUCCESS',
          payload: responseBody.data,
          message: responseBody.message,
        });
        return true;
      }
      dispatch({
        type: 'ZELLE_INFO_FAILED',
        payload: responseBody.message || translatedData.somethingWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'ZELLE_INFO_FAILED',
        payload:
          (error.response && error.response.data.message) ||
          translatedData.errorOccured,
      });
      return false;
    }
  };

export const deleteAlternatePayment = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/alternatePaymentInfo`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'DELETE_ALTERNATE_PAYMENT_SUCCESS',
        payload: responseBody.data,
        message: responseBody.message,
      });
      return true;
    }
    dispatch({
      type: 'DELETE_ALTERNATE_PAYMENT_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'DELETE_ALTERNATE_PAYMENT_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const updateSortedPaymentTypesList =
  (paymentTypeList) => async (dispatch) => {
    dispatch({
      type: 'UPDATE_SORTED_PAYMENT_TYPE_LIST',
      payload: paymentTypeList,
    });
    return paymentTypeList;
  };

export const updateSortedAlternatePaymentTypesList =
  (paymentTypeList) => async (dispatch) => {
    dispatch({
      type: 'UPDATE_SORTED_ALTERNATE_PAYMENT_TYPE_LIST',
      payload: paymentTypeList,
    });
    return paymentTypeList;
  };